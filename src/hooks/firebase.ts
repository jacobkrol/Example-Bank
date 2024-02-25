import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  DocumentReference,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  CollectionReference,
  where,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getCountFromServer,
  QueryConstraint
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  UserCredential,
  signOut
} from "firebase/auth";
import { Example, RedeemCode } from "../types";
import getId from "./getId";
import { fetchImage } from "./fetchImage";
// import { match } from "assert";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";

const app = initializeApp({
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID
});

export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInAnon: () => Promise<UserCredential> = () => {
  return signInAnonymously(auth);
};

export const signOutUser: () => Promise<boolean> = async () => {
  try {
    await signOut(auth);
    return true;
  } catch {
    return false;
  }
};

export const addExample: (
  uploadData: Example
) => Promise<DocumentReference> = async (uploadData) => {
  const exRef = collection(db, "examples");
  let { img } = uploadData;
  if (!img) {
    img = await fetchImage(uploadData.source);
  } else if (img === "none") {
    img = "";
  }
  return addDoc(exRef, {
    ...uploadData,
    img,
    id: getId(),
    used: false,
    meta: {
      created: serverTimestamp(),
      owner: auth.currentUser?.uid ?? ""
    }
  });
};

export const getExamples: (
  lastDoc?: QueryDocumentSnapshot<Example>,
  orderByProp?: string,
  orderByDir?: "asc" | "desc",
  hideUsed?: boolean,
  max?: number
) => Promise<QueryDocumentSnapshot<Example>[]> = async (
  lastDoc,
  orderByProp = "meta.created",
  orderByDir = "asc",
  hideUsed = true,
  max = 5
) => {
  const exRef = collection(db, "examples") as CollectionReference<Example>;
  const constraints: QueryConstraint[] = [
    orderBy(orderByProp, orderByDir),
    where("used", "in", hideUsed ? [false] : [true, false]),
    where("meta.owner", "==", auth.currentUser?.uid ?? ""),
    limit(max)
  ];
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  const docQuery = query(exRef, ...constraints);
  const docSnapshots = await getDocs(docQuery);
  return docSnapshots.docs;
};

export const addCode: (
  codeObj: RedeemCode
) => Promise<DocumentReference> = async (codeObj) => {
  const codeRef = collection(db, "codes");
  return addDoc(codeRef, {
    ...codeObj,
    id: getId(),
    used: false,
    meta: {
      created: serverTimestamp(),
      owner: auth.currentUser?.uid ?? ""
    }
  });
};

export const expirationWindow = 1000 * 60 * 60 * 24 * 7;

export const getCodeExpiration: (
  redeemCode: string,
  codeData?: QueryDocumentSnapshot<RedeemCode>
) => Promise<number> = async (redeemCode, codeData) => {
  // find matching redeem code document
  let matchedDoc = codeData;
  if (!codeData) {
    const codeRef = collection(db, "codes") as CollectionReference<RedeemCode>;
    const codeQuery = query(codeRef, where("code", "==", redeemCode));
    const codeSnapshots = await getDocs(codeQuery);
    matchedDoc = codeSnapshots.docs[0];
  }

  // parse matching document
  if (!matchedDoc?.data()?.meta?.created?.seconds) return 0;
  return matchedDoc.data().meta!.created.seconds * 1000 + expirationWindow;
};

export const getCodeExamples: (
  redeemCode: string,
  adminOnly?: boolean
) => Promise<QueryDocumentSnapshot<Example>[] | false> = async (
  redeemCode,
  adminOnly = false
) => {
  // find matching redeem code document
  const codeRef = collection(db, "codes") as CollectionReference<RedeemCode>;
  const codeQuery = query(codeRef, where("code", "==", redeemCode));
  const codeSnapshots = await getDocs(codeQuery);

  // parse matching document
  const matchedDoc = codeSnapshots.docs[0];
  if (!matchedDoc) return false;
  if (!matchedDoc.get("exampleIds")) return false;

  // check if expired for non-admin requests
  if (!adminOnly) {
    const expiry = await getCodeExpiration(redeemCode, matchedDoc);
    const isExpired = expiry < new Date().valueOf();
    if (isExpired) return false;
  }

  const exampleIds = matchedDoc.get("exampleIds");

  // fetch redeemed examples by id
  const exRef = collection(db, "examples") as CollectionReference<Example>;
  let batchedIds: string[] = [...exampleIds];
  let docs: QueryDocumentSnapshot<Example>[] = [];
  while (batchedIds.length) {
    const batch = batchedIds.splice(0, 10);
    const exQuery = query(exRef, where("id", "in", batch));
    const exSnapshots = await getDocs(exQuery);
    if (!exSnapshots.docs.length) return false;

    docs.push(...exSnapshots.docs);
  }

  // if successful and non-admin, mark the code as used
  if (!adminOnly) {
    const docRef = doc(codeRef, `/${matchedDoc.id}`);
    await updateDoc(docRef, { used: true, "meta.opened": serverTimestamp() });
  }

  // return the redeemed examples
  return docs;
};

export const setUsedValue: (
  exampleIds: string[],
  used: boolean
) => Promise<void[]> = async (exampleIds, used) => {
  // fetch examples to modify
  const exRef = collection(db, "examples");
  let batchedIds: string[] = [...exampleIds];
  let changes: Promise<void>[] = [];
  while (batchedIds.length) {
    const batch = batchedIds.splice(0, 10);
    const exQuery = query(exRef, where("id", "in", batch));
    const exSnapshots = await getDocs(exQuery);

    // modify used value for each
    exSnapshots.forEach((ex) => {
      const docRef = doc(exRef, `/${ex.id}`);
      changes.push(updateDoc(docRef, { used }));
    });
  }
  return Promise.all(changes);
};

export const deleteExamples: (exampleIds: string[]) => Promise<void[]> = async (
  exampleIds
) => {
  // fetch examples to delete
  const exRef = collection(db, "examples");
  let batchedIds: string[] = [...exampleIds];
  let deletions: Promise<void>[] = [];
  while (batchedIds.length) {
    const batch = batchedIds.splice(0, 10);
    const exQuery = query(exRef, where("id", "in", batch));
    const exSnapshots = await getDocs(exQuery);

    // schedule each delete
    exSnapshots.forEach((ex) => {
      const docRef = doc(exRef, `/${ex.id}`);
      if (ex.get("meta.owner") === auth.currentUser?.uid) {
        deletions.push(deleteDoc(docRef));
      }
    });
  }
  return Promise.all(deletions);
};

export const freeUnusedExpiredCodes: () => Promise<void> = async () => {
  // fetch codes that are unopened and expired
  const codeRef = collection(db, "codes");
  const expiredDate = new Date(new Date().valueOf() - expirationWindow);
  const codeQuery = query(
    codeRef,
    where("used", "==", false),
    where("meta.created", "<", expiredDate),
    where("meta.owner", "==", auth.currentUser?.uid ?? "")
  );
  const codeSnapshots = await getDocs(codeQuery);
  const unfreedCodes = codeSnapshots.docs.filter(
    (code) => code.get("meta.freed") !== true
  );

  // find all examples on those codes
  let allExampleIds: string[] = [];
  unfreedCodes.forEach(
    (code) =>
      (allExampleIds = allExampleIds.concat(code.get("exampleIds") ?? []))
  );
  if (!allExampleIds.length) return;

  // free examples on unused expired codes
  await setUsedValue(allExampleIds, false);

  // mark examples on code as freed
  let changes: Promise<void>[] = [];
  unfreedCodes.forEach((code) => {
    const docRef = doc(codeRef, `/${code.id}`);
    changes.push(updateDoc(docRef, { "meta.freed": true }));
  });
  Promise.all(changes);
};

export const isUserAdmin: (uid: string) => Promise<boolean> = async (
  uid: string
) => {
  const userRef = collection(db, "users");
  const users = await getDoc(doc(userRef, "/root"));
  const admins = users.get("admins");
  return admins.includes(uid);
};

export const isUserContributor: (uid: string) => Promise<boolean> = async (
  uid: string
) => {
  const userRef = collection(db, "users");
  const users = await getDoc(doc(userRef, "/root"));
  const contributors = users.get("contributors").concat(users.get("admins"));
  return contributors.includes(uid);
};

export const getCodes: (
  hideUsed: boolean,
  hideExpired: boolean
) => Promise<QueryDocumentSnapshot<RedeemCode>[]> = async (
  hideUsed = true,
  hideExpired = true
) => {
  const codeRef = collection(db, "codes") as CollectionReference<RedeemCode>;
  const expiredDate = new Date(new Date().valueOf() - expirationWindow);
  const codeQuery = query(
    codeRef,
    where("used", "in", hideUsed ? [false] : [false, true]),
    where("meta.created", ">", hideExpired ? expiredDate : new Date(0)),
    where("meta.owner", "==", auth.currentUser?.uid ?? "")
  );
  const codeSnapshots = await getDocs(codeQuery);
  return codeSnapshots.docs;
};

export const deleteCode: (codeId: string) => Promise<void[]> = async (
  codeId
) => {
  // fetch examples to delete
  const codeRef = collection(db, "codes");
  const codeQuery = query(codeRef, where("id", "==", codeId));
  const codeSnapshots = await getDocs(codeQuery);

  // schedule each delete
  // must iterate since Query Snapshots cannot be indexed, only iterated
  let deletions: Promise<void>[] = [];
  codeSnapshots.forEach((code) => {
    const docRef = doc(codeRef, `/${code.id}`);
    if (code.get("meta.owner") === auth.currentUser?.uid) {
      deletions.push(deleteDoc(docRef));
    }
  });
  return Promise.all(deletions);
};

export const countExamples: (unusedOnly?: boolean) => Promise<number> = async (
  unusedOnly: boolean = false
) => {
  if (!auth.currentUser?.uid) return -1;
  const exRef = collection(db, "examples");
  const exQuery = query(
    exRef,
    where("meta.owner", "==", auth.currentUser.uid),
    where("used", "in", unusedOnly ? [false] : [true, false])
  );
  const exSnapshot = await getCountFromServer(exQuery);
  return exSnapshot.data().count;
};

export const importExamples: (examples: Example[]) => Promise<void> = async (
  examples: Example[]
) => {
  if (!auth.currentUser?.uid) return;

  const importJobs = examples.map(addExample);
  await Promise.all(importJobs);
};

export const setCodeImported: (
  redeemCode: string,
  imported: boolean
) => Promise<void> = async (redeemCode: string, imported: boolean) => {
  // fetch code to modify
  const codeRef = collection(db, "codes");
  const codeQuery = query(codeRef, where("code", "==", redeemCode));
  const codeSnapshot = await getDocs(codeQuery);
  const docRef = doc(codeRef, `/${codeSnapshot.docs[0].id}`);
  await updateDoc(docRef, { "meta.imported": imported });
};

export const isCodeImported: (redeemCode: string) => Promise<boolean> = async (
  redeemCode
) => {
  // find matching redeem code document
  const codeRef = collection(db, "codes") as CollectionReference<RedeemCode>;
  const codeQuery = query(codeRef, where("code", "==", redeemCode));
  const codeSnapshots = await getDocs(codeQuery);
  const matchedDoc = codeSnapshots.docs[0];

  // parse matching document
  return !!matchedDoc?.data()?.meta?.imported;
};

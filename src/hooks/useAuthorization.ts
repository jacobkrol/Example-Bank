import { useEffect, useState } from "react";
import { auth, isUserAdmin, isUserContributor } from "./firebase";
import { User } from "firebase/auth";

export const useAuthorization = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isContributor, setIsContributor] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    async function trackAuthChange() {
      auth.onAuthStateChanged(async (user) => {
        setUid(user?.uid ?? "");
        setUser(user);
        if (!user?.uid) {
          setIsAdmin(false);
          setIsContributor(false);
        } else if (await isUserAdmin(user?.uid ?? "")) {
          setIsAdmin(true);
          setIsContributor(true);
        } else if (await isUserContributor(user?.uid ?? "")) {
          setIsContributor(true);
        } else {
          setIsAdmin(false);
          setIsContributor(false);
        }
      });
    }

    trackAuthChange();
  }, []);

  return { isAdmin, isContributor, uid, user };
};

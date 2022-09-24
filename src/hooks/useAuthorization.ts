import { useEffect, useState } from "react";
import { auth, isUserAdmin, isUserContributor } from "./firebase";

export const useAuthorization = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isContributor, setIsContributor] = useState<boolean>(false);

  useEffect(() => {
    async function trackAuthChange() {
      auth.onAuthStateChanged(async (user) => {
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

  return { isAdmin, isContributor };
};

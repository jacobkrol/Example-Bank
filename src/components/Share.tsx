import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../styles/styled";

export default function Share() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const isURL: (str: string) => boolean = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let title = searchParams.get("title"),
      text = searchParams.get("text"),
      url = searchParams.get("url");

    if (!url && isURL(text ?? "")) {
      url = text;
      text = "";
    }

    if (title || text || url) {
      console.log("navigating");
      navigate("/upload", { state: { title, text, url } });
    }
  }, [navigate, searchParams]);

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Upload via Share
      </Text>
      <Text fontSize="1.25rem">
        {!searchParams.get("title") &&
        !searchParams.get("text") &&
        !searchParams.get("url")
          ? "No share details provided. Please navigate back and try again, or enter the details manually on the Upload page."
          : "Redirecting now..."}
      </Text>
    </>
  );
}

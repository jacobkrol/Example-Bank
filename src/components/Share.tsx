import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../styles/styled";

export default function Share({ isContributor }: { isContributor: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const title = searchParams.get("title"),
      text = searchParams.get("text"),
      url = searchParams.get("url");

    if (title || text || url)
      navigate("/upload", { state: { title, text, url } });
  }, [navigate, isContributor, searchParams]);

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Upload via Share
      </Text>
      <Text fontSize="1.25rem">
        {!isContributor
          ? "You must authenticate as a contributor or admin to upload new examples."
          : !searchParams.get("title") &&
            !searchParams.get("text") &&
            !searchParams.get("url")
          ? "No share details provided. Please navigate back and try again, or enter the details manually on the Upload page."
          : "Redirecting now..."}
      </Text>
    </>
  );
}

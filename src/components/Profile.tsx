import {
  Text,
  ProfileRow,
  ProfileColumn,
  ProfileImage
} from "../styles/styled";
import { useAuthorization } from "../hooks/useAuthorization";
import ImageNotSupported from "../images/noimage";
import { useEffect, useState } from "react";
import { countExamples } from "../hooks/firebase";
import CircleRough from "../images/circle-rough";

export default function Profile(): JSX.Element {
  const { user } = useAuthorization();
  const [numExamples, setNumExamples] = useState<number>(-1);
  const [numUnusedExamples, setNumUnusedExamples] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadAsync = async () => {
      setIsLoading(true);
      try {
        setNumExamples(await countExamples());
      } catch (err) {
        console.error(err);
      }

      try {
        setNumUnusedExamples(await countExamples(true));
      } catch (err) {
        console.error(err);
      }

      setIsLoading(false);
    };

    loadAsync();
  }, [user]);

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        View Profile
      </Text>
      <ProfileRow>
        <ProfileImage style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "-4px",
              left: "-4px",
              zIndex: 10
            }}
          >
            <CircleRough size={104} />
          </div>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              style={{ width: "100%", borderRadius: "50%" }}
            />
          ) : (
            <span style={{ borderRadius: "50%" }}>
              <ImageNotSupported alt="no profile picture" size={50} />
            </span>
          )}
        </ProfileImage>
        <ProfileColumn>
          <Text as="p" fontSize="1.5rem">
            <strong>Name:</strong> {user?.displayName ?? "Not Found"}
          </Text>
          <Text as="p" fontSize="1rem">
            <strong>User&nbsp;ID:</strong> {user?.uid ?? "Not Found"}
          </Text>
          <Text as="p" fontSize="1rem">
            <strong>Created On:</strong>{" "}
            {user?.metadata.creationTime
              ? new Date(user.metadata.creationTime).toLocaleString()
              : "Not Found"}
          </Text>
          <Text as="p" fontSize="1rem">
            <strong>Last Sign In:</strong>{" "}
            {user?.metadata.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleString()
              : "Not Found"}
          </Text>
          <Text as="p" fontSize="1rem">
            <strong>Unused Examples:</strong>{" "}
            {isLoading
              ? "Counting..."
              : numUnusedExamples > -1
              ? numUnusedExamples
              : "Not Found"}
          </Text>
          <Text as="p" fontSize="1rem">
            <strong>Total Examples:</strong>{" "}
            {isLoading
              ? "Counting..."
              : numExamples > -1
              ? numExamples
              : "Not Found"}
          </Text>
        </ProfileColumn>
      </ProfileRow>
    </>
  );
}

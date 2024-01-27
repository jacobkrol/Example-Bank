import {
  useState,
  useEffect,
  FormEventHandler,
  useRef,
  useCallback
} from "react";
import { overwriteShadow } from "../hooks/overwriteShadow";
import yellowTheme from "../styles/yellowTheme.json";
import { Text, BrowseContainer, SpinnerArea } from "../styles/styled";
import ExampleCard from "./ExampleCard";
import {
  WiredButton,
  WiredCheckbox,
  WiredCombo,
  WiredDialog,
  WiredIconButton,
  WiredItem,
  WiredSearchInput,
  WiredSpinner,
  WiredToggle
} from "./WiredElements";
import "../styles/wiredstyles.css";
import { Example, RedeemCode } from "../types";
import {
  addCode,
  auth,
  deleteExamples,
  freeUnusedExpiredCodes,
  getExamples,
  isUserAdmin,
  setUsedValue
} from "../hooks/firebase";
import getId from "../hooks/getId";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CaretDown from "../images/caretdown";

// const data = [
//   {
//     id: "OtcqDrG0SFqm4txVXshI",
//     title: "Trash Pandas Merchandise",
//     source:
//       "https://www.al.com/news/2021/05/whats-in-a-name-for-the-trash-pandas-4-million-in-merchandise-sales-before-first-game.html?utm_source=pocket_mylist",
//     meta: {
//       used: false,
//       owner: "7DDCU263TdVaHxrKnixrHX3pgED3",
//       created: {
//         seconds: 1656630532,
//         nanoseconds: 792000000
//       }
//     },
//     img: "https://www.al.com/resizer/gWwA5TMyL1SkWPaCYY5XfDoB--w=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/KVARAIOUW5DYXD6FGEDNIYFQKU.jpg",
//     description:
//       "This MiLB team picked a unique team name which grossed an unheard of $4 million in merchandise sales and sold-out season tickets before their first game"
//   },
//   {
//     title: "The Fragility of Open Source",
//     img: "https://cms.qz.com/wp-content/uploads/2016/03/leftpad.jpg?quality=75&strip=all&w=1200&h=630&crop=1",
//     id: "AGqwSLYfHlOPJeFsTMO0",
//     description:
//       "When a silly copyright claim was forced upon a small developer, he pulled his code package which crumbled nearly the entire internet",
//     meta: {
//       created: {
//         seconds: 1656637913,
//         nanoseconds: 384000000
//       },
//       used: false,
//       owner: "7DDCU263TdVaHxrKnixrHX3pgED3"
//     },
//     source:
//       "https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code/?utm_source=pocket_mylist"
//   }
// ];

export default function Browse({ isAdmin }: { isAdmin: boolean }): JSX.Element {
  const [examples, setExamples] = useState<Example[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkedExs, setCheckedExs] = useState<string[]>([]);
  const [actionSelected, setActionSelected] = useState<string>("default");
  const [sortSelected, setSortSelected] = useState<string>("default");
  const [order, setOrder] = useState<
    ["meta.created" | "title", "asc" | "desc"]
  >(["meta.created", "asc"]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [hideUsed, setHideUsed] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>("");
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [lastEx, setLastEx] = useState<
    QueryDocumentSnapshot<Example> | undefined
  >();
  const checkedExsRef = useRef<string[]>([]);
  const observer = useRef<IntersectionObserver>();

  const lastExRef = useCallback(exNode => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && loadMore) {
        loadNext();
      }
    });
    if (exNode) observer.current.observe(exNode);
  }, [isLoading, loadMore]);

  const navigate = useNavigate();

  const loadExamples: (
    lastDoc?: QueryDocumentSnapshot<Example>,
    orderByProp?: string,
    orderByDir?: "asc" | "desc"
  ) => Promise<Example[]> = useCallback(
    async (lastDoc, orderByProp, orderByDir) => {
      setIsLoading(true);
      let data: Example[] = [];
      try {
        const docs: QueryDocumentSnapshot<Example>[] = await getExamples(
          lastDoc,
          orderByProp,
          orderByDir,
          hideUsed
        );
        data = docs.map((d) => d.data());
        // append new examples, removing duplicates from double API calls
        const uniqueData = data.filter(x => !examples.find(e => e.id === x.id));
        setExamples((prev) => prev.concat(...uniqueData));

        if (docs.length) setLastEx(docs[docs.length - 1]);
      } catch (err) {
        console.error(err);
        setDialogText(
          "An error occurred while attempting to find examples. " +
            "Please refresh your page, check your connection, and try again."
        );
        setDialogOpen(true);
      } finally {
        setIsLoading(false);
        return data;
      }
    },
    [hideUsed]
  );

  useEffect(() => {
    if (hideUsed) {
      setExamples((prev) => prev.filter((ex) => !ex.used));
    } else {
      // else, loadExamples called by default due to hideUsed dependency
    }
  }, [hideUsed, loadExamples, order]);

  useEffect(() => {
    async function asyncEffect() {
      // navigate home if unauthorized
      if (!(await isUserAdmin(auth.currentUser?.uid ?? ""))) navigate("/");

      // free examples on unused expired codes and load examples
      await freeUnusedExpiredCodes();
      await loadExamples();
    }

    asyncEffect();
  }, [navigate, loadExamples]);

  useEffect(() => {
    checkedExsRef.current = checkedExs;
  }, [checkedExs]);

  const handleBrowseAction: (
    value: "share" | "used" | "new" | "delete" | "default"
  ) => Promise<void> = useCallback(
    async (value) => {
      // perform action
      switch (value) {
        case "share":
          console.log("create shareable code");
          const code: RedeemCode = {
            id: "",
            code: getId(6).toLocaleUpperCase(),
            exampleIds: checkedExsRef.current
          };

          try {
            const docRef = await addCode(code);
            if (!docRef) throw new Error("Error fetching examples for Browse");
            setDialogText(
              "Submitted successfully!\n\n" +
                "The redemption code is: " +
                code.code
            );
            await setUsedValue(checkedExsRef.current, true);
            setDialogOpen(true);
            if (hideUsed) setExamples((prev) => prev.filter((ex) => !ex.used));
          } catch (err) {
            console.error(err);
            setDialogText(
              "An error occurred creating a shareable code. " +
                "Please reload the page, check your connection, and try again."
            );
            setDialogOpen(true);
          } finally {
            break;
          }

        case "used":
          console.log("mark as used");
          try {
            await setUsedValue(checkedExsRef.current, true);
            setDialogText("Examples are successfully marked as used.");
            setDialogOpen(true);
          } catch (err) {
            console.error(err);
            setDialogText(
              "An error occurred marking the examples as used. " +
                "Please reload the page, check your connection, and try again."
            );
            setDialogOpen(true);
          } finally {
            break;
          }
        case "new":
          console.log("mark as available");
          try {
            await setUsedValue(checkedExsRef.current, false);
            setDialogText("Examples are successfully marked as not used.");
            setDialogOpen(true);
          } catch (err) {
            console.error(err);
            setDialogText(
              "An error occurred marking the examples as not used. " +
                "Please reload the page, check your connection, and try again."
            );
            setDialogOpen(true);
          } finally {
            break;
          }
        case "delete":
          console.log("remove from db");
          console.log(checkedExsRef.current);
          const titles = checkedExsRef.current.map(
            (id) => examples.find((ex) => ex.id === id)?.title ?? ""
          );
          if (
            window.confirm(
              "Are you sure you would like to delete the following examples?\n\n\u2022 " +
                titles.join("\n\u2022") +
                "\n\nThis action cannot be undone."
            )
          ) {
            try {
              await deleteExamples(checkedExsRef.current);
              setDialogText("Successfully deleted!");
              setDialogOpen(true);
              setExamples((prev) =>
                prev.filter((ex) => !checkedExsRef.current.includes(ex.id))
              );
            } catch (err) {
              console.error(err);
              setDialogText(
                "An error occurred while deleting the selected examples. " +
                  "Please refresh the page, check your connection, and try again."
              );
              setDialogOpen(true);
            }
          }
          break;
        case "default":
          console.log("default action selected: no-op");
          return;
        default:
          console.error("Unrecognized action selected:", value);
          break;
      }

      // reset combine and checkboxes
      setCheckedExs([]);
      setActionSelected("default");
      const combineShadow =
        document.getElementById("browse-action")?.shadowRoot;
      const combineText = combineShadow?.getElementById("textPanel");
      if (combineText) combineText.innerText = "-- Actions --";
    },
    [examples, hideUsed]
  );

  const handleBrowseSort: (
    value: "new" | "old" | "a" | "z" | "default"
  ) => Promise<void> = useCallback(
    async (value) => {
      switch (value) {
        case "new":
          await loadExamples(undefined, "meta.created", "desc");
          setOrder(["meta.created", "desc"]);
          break;
        case "old":
          await loadExamples(undefined, "meta.created", "asc");
          setOrder(["meta.created", "asc"]);
          break;
        case "a":
          await loadExamples(undefined, "title", "asc");
          setOrder(["title", "asc"]);
          break;
        case "z":
          await loadExamples(undefined, "title", "desc");
          setOrder(["title", "desc"]);
          break;
        case "default":
          break;
        default:
          console.error("Unrecognized sort selection:", value);
          break;
      }

      setCheckedExs([]);
      setSortSelected("default");
      const combineShadow = document.getElementById("browse-sort")?.shadowRoot;
      const combineText = combineShadow?.getElementById("textPanel");
      if (combineText) combineText.innerText = "-- Sort By --";
    },
    [loadExamples]
  );

  const handleSelected = useCallback(
    async (evt: any) => {
      if (evt.target.id === "browse-action") {
        console.log("action", evt.target.value.value);
        await handleBrowseAction(evt.target.value.value);
        return;
      }

      if (evt.target.id === "browse-sort") {
        console.log("sort", evt.target.value.value);
        await handleBrowseSort(evt.target.value.value);
        return;
      }
    },
    [handleBrowseAction, handleBrowseSort]
  );

  useEffect(() => {
    overwriteShadow(
      "wired-search-input",
      "input",
      (el) => (el.style.backgroundColor = yellowTheme.colors["60"])
    );

    document.addEventListener("selected", handleSelected);

    return () => document.removeEventListener("selected", handleSelected);
  }, [handleSelected]);

  const toggleCheck = (id: string) => {
    setCheckedExs((prev) =>
      prev.includes(id) ? prev.filter((ex) => ex !== id) : [...prev, id]
    );
  };

  const searchChange: ((e: Event) => unknown) &
    FormEventHandler<HTMLInputElement> = (evt: any) => {
    const input = evt.currentTarget as HTMLInputElement;
    setSearchValue(input.value);
  };

  const handleHideUsedToggle: ((e: Event) => unknown) &
    FormEventHandler<HTMLElement> = (evt) => {
    const toggle = evt.target as any;
    setHideUsed(toggle?.checked);
  };

  const loadNext = async () => {
    const nextBatch = await loadExamples(lastEx, order[0], order[1]);
    if (!nextBatch?.length) {
      setLoadMore(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Browse Examples
      </Text>
      <WiredDialog open={dialogOpen}>
        <div className="dialog">
          <Text as="p" fontSize="1.25rem">
            {dialogText}
          </Text>
          <WiredButton onClick={() => setDialogOpen(false)}>Okay</WiredButton>
        </div>
      </WiredDialog>
      <BrowseContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <WiredSearchInput
            id="browse-search"
            value={searchValue}
            onChange={searchChange}
            className="width-100"
            placeholder="Search for examples..."
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem"
            }}
          >
            <WiredCombo
              id="browse-action"
              selected={actionSelected}
              disabled={!checkedExs.length}
            >
              <WiredItem id="browse-action-default" value="default">
                -- Actions --
              </WiredItem>
              <WiredItem value="share">Share</WiredItem>
              <WiredItem value="used">Mark as Used</WiredItem>
              <WiredItem value="new">Mark as New</WiredItem>
              <WiredItem value="delete">Delete</WiredItem>
            </WiredCombo>
            <WiredCombo id="browse-sort" selected={sortSelected}>
              <WiredItem id="browse-sort-default" value="default">
                -- Sort By --
              </WiredItem>
              <WiredItem value="new">New - Old</WiredItem>
              <WiredItem value="old">Old - New</WiredItem>
              <WiredItem value="a">A - Z</WiredItem>
              <WiredItem value="z">Z - A</WiredItem>
            </WiredCombo>
            <div
              style={{
                display: "flex",
                placeItems: "center",
                gap: "0.5rem"
              }}
            >
              <label htmlFor="browse-used-toggle">Hide Used Examples</label>
              <WiredToggle
                id="browse-used-toggle"
                checked={hideUsed}
                onChange={handleHideUsedToggle}
              />
            </div>
          </div>
        </div>

        {examples.length ? (
          <>
            <ul className="stripped-ul">
              {examples.map((ex: Example, index: number) => (
                <li key={ex.id} className="checkbox-li" ref={index === examples.length - 1 ? lastExRef : null}>
                  <WiredCheckbox
                    onChange={() => toggleCheck(ex.id || "no_id")}
                    checked={checkedExs.includes(ex.id)}
                  />
                  <ExampleCard
                    title={ex.title}
                    source={ex.source}
                    description={ex.description}
                    img={ex.img}
                  />
                </li>
              ))}
            </ul>
            { isLoading ? (
              <SpinnerArea>
                <Text fontSize="1.25rem">Loading examples...</Text>
                <WiredSpinner spinning />
              </SpinnerArea>
            ) : (
              <div className="flex-center-x width-100">
                {loadMore ? (
                  <WiredIconButton onClick={loadNext}>
                    <CaretDown alt="load more examples" />
                  </WiredIconButton>
                ) : (
                  <Text as="p" fontSize="1.25rem">
                    No more examples found.
                  </Text>
                )}
              </div>
            )}
          </>
        ) : isLoading ? (
          <SpinnerArea>
            <Text fontSize="1.25rem">Loading examples...</Text>
            <WiredSpinner spinning />
          </SpinnerArea>
        ) : (
          <Text fontSize="1.25rem" className="center-x">
            No examples found :/
          </Text>
        )}
      </BrowseContainer>
    </>
  );
}

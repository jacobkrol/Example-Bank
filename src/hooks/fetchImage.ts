export const fetchImage: (source: string) => Promise<string> = async (
  source
) => {
  const api = process.env.REACT_APP_METAREADER_API || "";
  console.log("Scanning:", source);
  if (!api) return Promise.resolve("");
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ arrayOfUrls: [source] })
  };
  const res = await fetch(api, options).then((res) => res.json());
  return res[0].image;
};

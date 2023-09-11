import { useState } from "preact/hooks";

import stringSimilarity from "string-similarity";

interface MergeRedirectsInput {
  oldUrlsCsv: string;
  newUrlsCsv: string;
  oldBaseUrl: string;
  newBaseUrl: string;
  similarityThreshhold?: number;
  turboMatch?: boolean;
}

function useMergeRedirects() {
  const [output, setOutput] = useState<string>("");

  function mutate({
    oldUrlsCsv,
    newUrlsCsv,
    oldBaseUrl,
    newBaseUrl,
    similarityThreshhold = 1,
    turboMatch,
  }: MergeRedirectsInput) {
    const redirectedUrls = [];

    const oldUrls = csvToArray(oldUrlsCsv);
    const newUrls = csvToArray(newUrlsCsv);

    for (let oldUrl of oldUrls) {
      console.log(
        "PROGRESS: " + (100 * oldUrls.indexOf(oldUrl)) / oldUrls.length
      );

      let newUrl = undefined;

      let bestMatch = stringSimilarity.findBestMatch(
        oldUrl.title,
        newUrls.map((newUrl) => newUrl.title)
      ).bestMatch;

      if (turboMatch) {
        bestMatch = stringSimilarity.findBestMatch(
          oldUrl.title + sanitiseUrl(oldUrl.url),
          newUrls.map((newUrl) => newUrl.title + sanitiseUrl(newUrl.url))
        ).bestMatch;

        if (bestMatch.rating >= similarityThreshhold) {
          newUrl = newUrls.find((newUrl) => {
            return newUrl.title + sanitiseUrl(newUrl.url) === bestMatch.target;
          });
        }
      } else {
        if (bestMatch.rating >= similarityThreshhold) {
          newUrl = newUrls.find((newUrl) => {
            return newUrl.title === bestMatch.target;
          });
        }
      }

      if (newUrl) {
        redirectedUrls.push({
          oldUrl: sanitiseCommas(oldUrl.url),
          newUrl: sanitiseCommas(newUrl.url),
        });
      }
    }

    const output = [
      ["Old URL", "New URL"],
      ...redirectedUrls.map((url) => [
        getRelativeUrl(url.oldUrl, oldBaseUrl),
        getRelativeUrl(url.newUrl, newBaseUrl),
      ]),
    ].join("\n");

    setOutput(output);
  }

  return { mutate, output };
}

export { useMergeRedirects };

function getRelativeUrl(url: string, baseUrl: string) {
  return url.replace(baseUrl, "");
}

function sanitiseCommas(url: string) {
  return url.replace(/,/g, "%2C");
}

function csvToArray(raw: string) {
  const rows = raw.split("\n").slice(1);

  let output = [];

  for (let row of rows) {
    const [title, url] = row.split(",");

    output.push({
      title,
      url,
    });
  }

  return output;
}

function sanitiseUrl(url: string) {
  return url.replace(/-/g, " ").replace(/_/g, " ").replace("///g", " ");
}

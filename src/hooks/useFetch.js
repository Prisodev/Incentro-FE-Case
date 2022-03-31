import { useState, useEffect, useRef } from "react";

export const useFetch = (url, _options) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const options = useRef(_options).current;

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setIsPending(true);
      try {
        if (url) {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          const json = await res.json();
          setData(json);
        }
        setIsPending(false);

        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch afgebroken");
        } else {
          setIsPending(false);
          setError("Kon Fetch data niet verkrijgen");
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, isPending, error };
};

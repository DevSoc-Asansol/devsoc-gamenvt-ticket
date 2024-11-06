"use client";
import React from "react";

export default function Page() {
  React.useEffect(() => {
    try {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/ArnabChatterjee20k/feedbackio-widget@latest/wall-of-fame-cdn/wall-bundle.js";
      script.type = "module";
      document.body.appendChild(script);

      // Load external stylesheet
      const link = document.createElement("link");
      link.href =
        "https://cdn.jsdelivr.net/gh/ArnabChatterjee20k/feedbackio-widget@master/wall-of-fame-cdn/wall-style.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      return () => {
        document.body.removeChild(script);
        document.head.removeChild(link);
      };
    } catch (error) {
      alert("some error occured");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <>
      <div
        id="feedbackio-wall-of-fame"
        data-spaceid="6720788b0025006c6d47"
      ></div>
    </>
  );
}

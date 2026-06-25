import { useEffect } from "react";

const SITE_NAME = "Data with Dylan";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

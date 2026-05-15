"use client";

import { useEffect, useState } from "react";

export function TopLink() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(document.body.scrollTop > 800 || document.documentElement.scrollTop > 800);
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#top" aria-label="go to top" title="Go to Top (Alt + G)" className={`top-link${visible ? " visible" : ""}`} id="top-link" accessKey="g">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6" fill="currentColor">
        <path d="M12 6H0l6-6z" />
      </svg>
    </a>
  );
}

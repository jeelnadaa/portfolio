"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/data/site";
import { useSound } from "@/hooks/useSound";

const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

export function EasterEggs() {
  const { playSlash } = useSound();
  const keyIndex = useRef(0);

  useEffect(() => {
    // Console log ASCII art greeting
    console.log(
      `%c
   _____ ____  __    ___    ____  ____  __  _____    ____  __ __
  / ___// __ \\/ /   /   |  / __ \\/ __ \\/ / / /   |  / __ \\/ //_/
  \\__ \\/ / / / /   / /| | / /_/ / / / / / / / /| | / / / / ,<   
 ___/ / /_/ / /___/ ___ |/ _, _/ /_/ / /_/ / ___ |/ /_/ / /| |  
/____/\\____/_____/_/  |_/_/ |_|\\___\\_\\____/_/  |_/\\___\\_\\_/ |_|  

>> READING THE SOURCE? SAY HI: ${siteConfig.email}
>> REPO: ${siteConfig.repoUrl}
`,
      "color: #E5381B; font-family: monospace; font-weight: bold;"
    );

    // Konami code listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_SEQUENCE[keyIndex.current]) {
        keyIndex.current++;
        if (keyIndex.current === KONAMI_SEQUENCE.length) {
          keyIndex.current = 0;
          playSlash();
          const current = document.documentElement.getAttribute("data-theme") || "dark";
          const next = current === "dark" ? "bone" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("theme", next);
          console.log("%c[KONAMI ACTIVATED] Inverted theme matrix.", "color: #C9A24B; font-weight: bold;");
        }
      } else {
        keyIndex.current = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playSlash]);

  return null;
}

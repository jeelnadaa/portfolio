"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/data/site";

const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

export function EasterEggs() {
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
          console.log("%c[KONAMI ACTIVATED] All systems nominal. Welcome, Architect.", "color: #C9A24B; font-weight: bold; font-size: 14px;");
        }
      } else {
        keyIndex.current = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}

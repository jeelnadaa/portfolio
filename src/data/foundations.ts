export interface FoundationSpec {
  label: string;
  value: string;
}

export interface FoundationPanel {
  id: "strength" | "intelligence";
  badgeNumeral: string;
  badgeLabel: string;
  greekWord: string;
  giantLetter: string;
  title: string;
  description: string;
  image: {
    src: string;
    hoverSrc: string;
    alt: string;
  };
  specs: FoundationSpec[];
}

export interface FoundationsData {
  sectionIndex: string;
  sectionTitle: string;
  panels: {
    left: FoundationPanel;
    right: FoundationPanel;
  };
}

export const foundationsData: FoundationsData = {
  sectionIndex: "01 - 02 //",
  sectionTitle: "FOUNDATIONS",
  panels: {
    left: {
      id: "strength",
      badgeNumeral: "01 //",
      badgeLabel: "STRENGTH",
      greekWord: "ΙΣΧΥΣ",
      giantLetter: "Ι",
      title: "Strength.",
      description:
        "High-concurrency systems programming, distributed event-driven architectures, thread-safe message protocols, and scalable asynchronous backend services.",
      image: {
        src: "/art/fist-sword.bone.png",
        hoverSrc: "/art/fist-sword.color.webp",
        alt: "Classical fist gripping sword sculpture",
      },
      specs: [
        { label: "SYSTEMS & CONCURRENCY", value: "Java / Multi-Threading / Event Loops" },
        { label: "STORAGE ENGINE", value: "Append-Only Commit Logs (O(1))" },
        { label: "BACKEND & APIS", value: "FastAPI / Async / MySQL 8" },
      ],
    },
    right: {
      id: "intelligence",
      badgeNumeral: "02 //",
      badgeLabel: "INTELLIGENCE",
      greekWord: "ΤΕΧΝΗ",
      giantLetter: "Τ",
      title: "Intelligence.",
      description:
        "Deep learning computer vision, production hybrid RAG retrieval pipelines, multimodal AI architectures, and conversational LLM integrations.",
      image: {
        src: "/art/hand-laurel.bone.png",
        hoverSrc: "/art/hand-laurel.color.webp",
        alt: "Classical hand holding laurel branch sculpture",
      },
      specs: [
        { label: "COMPUTER VISION", value: "ResNet-50 (96.4% Top-1)" },
        { label: "HYBRID RETRIEVAL", value: "Dense + BM25 + Cross-Encoder" },
        { label: "LLM ORCHESTRATION", value: "Gemini 2.5 Flash & Dialogflow" },
      ],
    },
  },
};

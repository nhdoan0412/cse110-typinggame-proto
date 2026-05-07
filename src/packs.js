export const packs = [
  {
    id: "html-css",
    name: "HTML + CSS",
    icon: "</>",
    description: "Build interface pieces by typing selectors, declarations, and tags.",
    theme: {
      sky: "#102033",
      floor: "#0f766e",
      avatar: "#facc15",
      hazard: "#ef4444",
      pickup: "#38bdf8"
    },
    levels: [
      {
        concept: "Create a header landmark",
        code: "<header class=\"hero\">Syntax Runner</header>",
        reward: "Hero banner unlocked"
      },
      {
        concept: "Style a primary call-to-action",
        code: ".hero button {\n  background: #0e7490;\n  color: white;\n}",
        reward: "Button boost earned"
      },
      {
        concept: "Create a responsive card grid",
        code: ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n}",
        reward: "Grid bridge constructed"
      },
      {
        concept: "Mark up an accessible form field",
        code: "<label for=\"email\">Email</label>\n<input id=\"email\" type=\"email\" />",
        reward: "Checkpoint saved"
      },
      {
        concept: "Use a media query for mobile",
        code: "@media (max-width: 700px) {\n  .layout { grid-template-columns: 1fr; }\n}",
        reward: "Mobile route opened"
      }
    ]
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "JS",
    description: "Practice functions, arrays, DOM events, and async syntax.",
    theme: {
      sky: "#1f2937",
      floor: "#2563eb",
      avatar: "#f59e0b",
      hazard: "#fb7185",
      pickup: "#a7f3d0"
    },
    levels: [
      {
        concept: "Declare a reusable function",
        code: "function scoreHit(combo) {\n  return combo * 100;\n}",
        reward: "Combo counter online"
      },
      {
        concept: "Filter an array",
        code: "const activeTasks = tasks.filter((task) => task.done === false);",
        reward: "Obstacle scanner improved"
      },
      {
        concept: "Listen for a click event",
        code: "button.addEventListener(\"click\", () => {\n  startRound();\n});",
        reward: "Dash input wired"
      },
      {
        concept: "Fetch JSON asynchronously",
        code: "const response = await fetch(\"./data/packs.json\");\nconst packs = await response.json();",
        reward: "Pack loader upgraded"
      },
      {
        concept: "Write to local storage",
        code: "localStorage.setItem(\"syntax-runner:best\", JSON.stringify(bestRun));",
        reward: "Best score preserved"
      }
    ]
  },
  {
    id: "unix",
    name: "UNIX Shell",
    icon: "$_",
    description: "Type commands for navigation, search, permissions, and pipelines.",
    theme: {
      sky: "#172554",
      floor: "#16a34a",
      avatar: "#e5e7eb",
      hazard: "#f97316",
      pickup: "#fef08a"
    },
    levels: [
      {
        concept: "List files with details",
        code: "ls -la",
        reward: "Directory map revealed"
      },
      {
        concept: "Find text recursively",
        code: "rg \"TODO\" src/",
        reward: "Search beacon charged"
      },
      {
        concept: "Create a directory",
        code: "mkdir -p docs/adrs",
        reward: "ADR vault opened"
      },
      {
        concept: "Pipe output into a count",
        code: "rg --files | wc -l",
        reward: "Telemetry line connected"
      },
      {
        concept: "Show recent commits",
        code: "git log --oneline -5",
        reward: "History lens activated"
      }
    ]
  }
];

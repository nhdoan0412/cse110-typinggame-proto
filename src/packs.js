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
        summary: "A header landmark marks the introductory area of a page or section, helping readers and assistive tech understand the layout.",
        tip: "Angle brackets wrap the tag name. The closing tag repeats the name with a slash.",
        reward: "Hero banner unlocked"
      },
      {
        concept: "Style a primary call-to-action",
        code: ".hero button {\n  background: #0e7490;\n  color: white;\n}",
        summary: "This selector targets buttons inside the hero area and makes the primary action visually stand out.",
        tip: "CSS declarations use property, colon, value, semicolon. Braces hold the rule body.",
        reward: "Button boost earned"
      },
      {
        concept: "Create a responsive card grid",
        code: ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n}",
        summary: "Grid can automatically fit cards into as many columns as the screen allows, then collapse cleanly on smaller screens.",
        tip: "The nested parentheses are the tricky part: repeat contains minmax.",
        reward: "Grid bridge constructed"
      },
      {
        concept: "Mark up an accessible form field",
        code: "<label for=\"email\">Email</label>\n<input id=\"email\" type=\"email\" />",
        summary: "Matching a label's for value to an input id gives the field a name and improves click and screen reader behavior.",
        tip: "The label closes with text inside; the input is a self-contained element.",
        reward: "Checkpoint saved"
      },
      {
        concept: "Use a media query for mobile",
        code: "@media (max-width: 700px) {\n  .layout { grid-template-columns: 1fr; }\n}",
        summary: "A media query applies CSS only when a condition is true, such as a viewport being narrow.",
        tip: "There are two brace pairs here: one for the media block and one for the nested rule.",
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
        summary: "A function packages logic so the same scoring formula can be reused whenever the player lands a hit.",
        tip: "Parameters live in parentheses. The return statement sends a value back to the caller.",
        reward: "Combo counter online"
      },
      {
        concept: "Filter an array",
        code: "const activeTasks = tasks.filter((task) => task.done === false);",
        summary: "filter creates a new array with only the items that pass the condition.",
        tip: "Watch the arrow function: parameter first, then =>, then the condition.",
        reward: "Obstacle scanner improved"
      },
      {
        concept: "Listen for a click event",
        code: "button.addEventListener(\"click\", () => {\n  startRound();\n});",
        summary: "An event listener connects a user action to code that should run when the action happens.",
        tip: "The event name is a string. The callback function is the second argument.",
        reward: "Dash input wired"
      },
      {
        concept: "Fetch JSON asynchronously",
        code: "const response = await fetch(\"./data/packs.json\");\nconst packs = await response.json();",
        summary: "fetch requests data, and await pauses this async code until the response is ready.",
        tip: "JSON parsing is a second awaited step: response first, data second.",
        reward: "Pack loader upgraded"
      },
      {
        concept: "Write to local storage",
        code: "localStorage.setItem(\"syntax-runner:best\", JSON.stringify(bestRun));",
        summary: "localStorage keeps small pieces of browser data after the page closes, which is useful for best scores.",
        tip: "Values must be strings, so objects need JSON.stringify before saving.",
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
        summary: "ls lists directory contents. The -l and -a flags show detailed rows and hidden files.",
        tip: "Short flags can be combined, so -la means -l plus -a.",
        reward: "Directory map revealed"
      },
      {
        concept: "Find text recursively",
        code: "rg \"TODO\" src/",
        summary: "ripgrep searches files quickly. This command looks for TODO inside the src directory.",
        tip: "Quote the search text when it should be treated as one pattern.",
        reward: "Search beacon charged"
      },
      {
        concept: "Create a directory",
        code: "mkdir -p docs/adrs",
        summary: "mkdir creates folders. The -p flag creates parent folders as needed and avoids errors if they already exist.",
        tip: "Use paths from broad to specific: docs first, then adrs.",
        reward: "ADR vault opened"
      },
      {
        concept: "Pipe output into a count",
        code: "rg --files | wc -l",
        summary: "A pipe sends the output of one command into the next command. Here, file paths become a line count.",
        tip: "The vertical bar is the connector; read the command left to right.",
        reward: "Telemetry line connected"
      },
      {
        concept: "Show recent commits",
        code: "git log --oneline -5",
        summary: "git log shows project history. --oneline compresses each commit, and -5 limits the output.",
        tip: "Options can describe format and amount in the same command.",
        reward: "History lens activated"
      }
    ]
  }
];

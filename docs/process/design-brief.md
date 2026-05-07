# Design Brief: Syntax Runner

## Motivation

Students often need repetition to recognize syntax, but flash cards make syntax feel detached from the reason it exists. Syntax Runner turns repetition into a short play loop where typing a code snippet creates visible progress.

## Audience

- CSE 110 students waiting between classes on phones or laptops.
- Beginners who know what code looks like but need practice recognizing and typing it.
- Future maintainers who want to add packs for HTML/CSS, JavaScript, UNIX commands, APIs, or course-specific syntax.

## Design Goals

- Game first: typing should feel like progress in a compact arcade loop.
- Educational by exposure: every prompt names the concept being practiced.
- Mobile friendly: all required actions must work on a phone viewport.
- Offline capable: replay should work without WiFi after the first load.
- Expandable: adding syntax should not require changing the core game loop.

## MVP Scope

- Three starter packs: HTML/CSS, JavaScript, UNIX Shell.
- One play mode: complete all prompts in a pack.
- Local best score.
- No accounts, multiplayer, leaderboard, or external services.

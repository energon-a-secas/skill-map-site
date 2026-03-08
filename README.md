<div align="center">

# Skill Roadmap Builder

Map skills, milestones, and learning paths as a visual grid with typed connections and dependency locking. No install, no build step, no dependencies.

[![Live][badge-site]][url-site]
[![HTML5][badge-html]][url-html]
[![CSS3][badge-css]][url-css]
[![JavaScript][badge-js]][url-js]
[![Claude Code][badge-claude]][url-claude]
[![License][badge-license]](LICENSE)

[badge-site]:    https://img.shields.io/badge/live_site-0063e5?style=for-the-badge&logo=googlechrome&logoColor=white
[badge-html]:    https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[badge-css]:     https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[badge-js]:      https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[badge-claude]:  https://img.shields.io/badge/Claude_Code-CC785C?style=for-the-badge&logo=anthropic&logoColor=white
[badge-license]: https://img.shields.io/badge/license-MIT-404040?style=for-the-badge

[url-site]:   https://skillmap.neorgon.com/
[url-html]:   #
[url-css]:    #
[url-js]:     #
[url-claude]: https://claude.ai/code

</div>

---

A web app for building visual skill trees and learning roadmaps the way you actually think about them. Stages as columns, skills as cards, relationships as typed arrows. No install, no build step, no dependencies.

## The idea

Most roadmap tools are either too rigid or too freeform. This one sits in the middle. You get structure (columns, lanes, ordered nodes) with enough flexibility to model anything from a learning path to a game skill tree. Connections between nodes carry meaning — whether something *requires*, *enables*, *relates to*, or *prepares* for something else — and the diagram updates visually when prerequisites aren't met.

## What you can do

**Columns and lanes** give you a grid to think in. Columns are stages or phases. Lanes inside a column let you run parallel tracks side by side without mixing them up.

**Nodes** are the skills, tasks, or milestones. Each one can have a color (to signal status), markers (to flag priority or state), a row span (if it needs more visual weight), and an icon for the game-style card layout.

**Connections** between nodes are typed. Requires, Relates, Enhances, Enables, Prepares — each has its own color and line style so you can read the diagram at a glance.

**Locking** works two ways. Nodes with unmet upstream requirements are automatically dimmed with a red border. You can also lock any node manually to mark it as blocked regardless of what's connected.

**Drag** to reorder nodes within a lane, or move them across lanes and columns entirely.

**Templates** to start from — a default skill roadmap or a game-style tiered skill tree with icon cards.

**Export** as JSON to save and reload, or as Markdown to share or document.

## Running it

```bash
python3 -m http.server 8777
```

Then open `http://localhost:8777`. Or just open `index.html` directly — no server required for basic use.

## Architecture

![Architecture](docs/architecture.svg)

```
index.html        markup shell
css/app.css       all styles
js/app.js         all logic (~2100 lines)
assets/icons/     skill icons for the game card layout
```

State saves automatically to `localStorage`.

## Live

→ [skillmap.neorgon.com](https://skillmap.neorgon.com/)

---

<div align="center">
  <sub>Part of <a href="https://neorgon.com">Neorgon</a></sub>
</div>

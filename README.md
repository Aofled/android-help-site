# Android Dev Knowledge Base & Content Generator

A custom-built, lightweight web platform for reading and creating educational content about Android, Kotlin, Java, and Android Studio.

The project consists of two main parts: a **Reader Interface** for users and an internal **JSON Content Generator** for authors. Built entirely with Vanilla Web Technologies (HTML, CSS, JS) and styled according to Google's **Material Design 3 (MD3)** guidelines.

## ✨ Features

### 📖 1. The Reader (Main Site)
*   **Material Design 3 UI:** Modern layout with seamless Dark/Light mode switching.
*   **Markdown Support:** Parses markdown on the fly, rendering styled text, lists, and links.
*   **IDE-Like Code Blocks:** Features `JetBrains Mono` font, syntax highlighting (via highlight.js), and a one-click "Copy Code" button.
*   **Responsive:** Native-like mobile experience with a swipeable side-drawer and backdrop shading.
*   **Hash Routing:** Simple and fast SPA-like navigation using URL hashes (e.g., `#kotlin/basics`).

### ⚙️ 2. JSON Content Generator (CMS)
*   **Visual Dashboard:** A dedicated tool to create content and menu structures without writing raw JSON by hand.
*   **Code Editor:** Built-in JSON editor with live line numbers, auto-formatting, and minification.
*   **Markdown Helpers:** Quick-insert toolbar for bold, italic, code, links, and headers.
*   **File Management:** Supports Drag & Drop file loading, local file saving, and size validation.

## 🛠️ Tech Stack

This project requires **no build steps** (no Webpack, Vite, or Node.js required).

*   **HTML5 & CSS3:** Heavy use of CSS Variables, Flexbox, Grid, and Mobile-First media queries.
*   **Vanilla JavaScript (ES6):** Modular architecture (`import`/`export`).
*   **[marked.js](https://marked.js.org/):** For rendering markdown strings into HTML.
*   **[highlight.js](https://highlightjs.org/):** For Android Studio-themed syntax highlighting.



## 📂 Project Structure

```text
├── index.html                   # Main Reader interface
├── generator/
│   └── json-generator.html      # Content Generator interface
├── content/                     # JSON files containing the articles and menus
│   ├── android/
│   ├── kotlin/
│   └── java/
├── css/                         # Modular CSS (base, layout, components, mobile)
└── js/                          # ES6 JavaScript modules
```


## 🎨 Theme & Styling
The project features a highly maintainable CSS architecture. To modify the color scheme, simply update the CSS variables located in `css/base.css` within the `:root` (Dark Theme) and `[data-theme="light"]` selectors.
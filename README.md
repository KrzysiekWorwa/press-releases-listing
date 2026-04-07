# 📄 Press Releases Listing

A responsive News / Press Releases listing built with Vanilla JavaScript (ES6+).


## 🔗 Live Demo

### 🚀 Mid-level version (main)
👉 https://krzysiekworwa.github.io/press-releases-listing/

### 🟢 Junior version
👉 https://press-releases-listing-junior-scope.netlify.app/

📁 Junior version is available on the `junior-scope` branch.


## 📦 Repository

👉 https://github.com/KrzysiekWorwa/press-releases-listing


# 🧠 Overview

The goal of this project was to build a **dynamic news listing** based on provided requirements, without using any frameworks (React, Vue, Angular).

The project was developed in **two stages**:

- 🟢 **Junior scope** – basic filtering and "Load more"
- 🚀 **Mid scope** – extended filtering and improved UX

The implementation focuses on:

- clean structure
- separation of concerns
- scalable architecture
- user interaction (filtering + pagination)

# ⚙️ Features

## 🏷️ Filtering

### Category filtering:  
- **All news**  
- **Regulatory**  
- **Non Regulatory**  
- Active state management  
- Filtering resets pagination  
  
### Multi-select filtering  

The base requirement included single-select filters for type and year. In addition, I implemented an extended version using custom multi-select dropdowns:
  
- **Type** – custom dropdown with checkboxes  
- **Year** – custom dropdown with checkboxes
  
Filtering logic:  
  
- OR within a single filter (e.g. multiple types)  
- AND between filters (category + type + year)
  
## 🎛️ Custom Dropdowns  
  
- Fully custom dropdown implementation  
- Checkbox-based multi-select  
- Click outside to close  
- Only one dropdown open at a time  
- Animated arrow icon rotation  
 
## 📄 Pagination  
  
The app supports two pagination strategies:  
  
- `"pagination"` – classic pagination (default in Mid)  
- `"load-more"` – progressive loading (Junior behavior)  
  
```js  
const PAGINATION_MODE = "pagination";
```
  
### 1. Classic Pagination (default)  
-   Initial render:  **8 items**
- Page navigation  
- Previous / Next buttons  
- Dynamic page numbers  
- Navigation is hidden when there is only one page or no results
  
### 2. Load More (optional)
  
-   Initial render:  **8 items**
-   Click  **Load more**  → loads next items
-   Button disappears when no more items


## 🧩 Data Handling

- Data loaded from local JSON file
- Simulated API:
  - delay (300–600ms)
  - error handling support

## 🧪 Error Simulation

The fake API layer supports error simulation for testing UI states.

```js
const SHOULD_API_FAIL = true;
```
## 📐 Layout

-   Responsive grid:
    -   3 columns (desktop)
    -   2 columns (tablet)
    -   1 column (mobile)
-   Cards with variable height (masonry-like effect)
-   Optional images

## 🔄 Sorting

-   Items sorted by date (**descending**) on load

## 🚦 UI States

-   Loading state
-   Error state
-   Empty state

## ♿ Accessibility

-   `aria-pressed` for filter buttons
-   `aria-expanded` for dropdowns
-   `aria-live` for dynamic states
-   semantic HTML structure

## 🔥 UX Improvements

### Preventing layout shift on pagination

When navigating between pages, the application preserves the scroll position to prevent layout jumps. This is achieved by measuring the pagination position before and after rendering and adjusting scroll accordingly. This ensures a smoother and more stable user experience.


### Dropdown interaction improvements

- Only one dropdown can be open at a time
- Click outside closes dropdown
-  Event propagation is controlled to prevent unintended closing

### Filtering behavior

- Changing filters resets pagination to page 1
- Ensures consistent and predictable results display

# 🧱 Tech Stack

-   HTML5
-   CSS3 (BEM methodology)
-   Vanilla JavaScript (ES6 modules)
-   No external libraries / frameworks

# 📁 Project Structure
```bash
press-releases-listing/
├── assets/  
│ └── images/  
│     ├── news-1.webp   
│     ├── news-2.webp 
│     ├── news-3.webp
│     └── news-4.webp 
├── data/  
│ └── pressReleases.json  
├── js/  
│ ├── app.js  
│ ├── dataService.js 
│ ├── filters.js
│ ├── pagination.js
│ └── render.js  
├── styles/  
│ ├── card.css  
│ ├── filters.css  
│ ├── global.css 
│ ├── news.css  
│ └── pagination.css  
├── index.html  
├── README.md  
└── .gitignore
```

# 🧩 Architecture
  
-   **dataService.js**
    -   handles data fetching
    -   simulates API behavior
-   **filters.js**
    -   prepares filter options (type, year)
    -   contains filtering logic
    -   supports multi-select
-   **pagination.js**
    -   calculates pagination
    -   handles page navigation logic
-   **render.js**
    -   renders UI elements and pagination
    -   manages UI states
-   **app.js**
    -   coordinates all modules
    -   manages global state
    -   handles filtering and pagination interactions
    
# 👤 Author

## Krzysztof Worwa

GitHub:  [https://github.com/KrzysiekWorwa]
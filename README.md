# 📄 Press Releases Listing

A responsive News / Press Releases listing built with Vanilla JavaScript (ES6+).
## 🔗 Live Demo

👉 https://krzysiekworwa.github.io/press-releases-listing/

## 📦 Repository

👉 https://github.com/KrzysiekWorwa/press-releases-listing
# 🧠 Overview

The goal of this project was to build a **dynamic news listing** based on provided requirements, without using any frameworks (React, Vue, Angular).

The implementation focuses on:

-   clean structure
-   separation of concerns
-   handling UI states
-   user interaction (filtering + pagination)

# ⚙️ Features

## 🏷️ Filtering (chips)

-   Category filtering:
    -   **All news**
    -   **Regulatory**
    -   **Non Regulatory**
-   Active state management
-   Filtering resets visible items

## 📄 Load More pagination

-   Initial render: **8 items**
-   Click **Load more** → loads next items
-   Button disappears when no more items

## 🧩 Data handling

-   Data loaded from local JSON file
-   Simulated API:
    -   delay (300–600ms)
    -   error handling support
## 🧪 Error Simulation  
  
The fake API layer supports error simulation for testing UI states.
Error behavior is controlled via a configuration flag in the app: 
  
```js  
const SHOULD_API_FAIL = true;
```
This approach allows easy testing of loading and error states without relying on a real backend.
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
-   `aria-live` for dynamic states
-   semantic HTML structure

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
│ └── render.js  
├── styles/  
│ ├── global.css  
│ ├── news.css  
│ ├── chips.css  
│ └── card.css  
├── index.html  
├── README.md  
└── .gitignore
```

# 🧩 Architecture

The app is split into logical modules:

-   **dataService.js**
    -   fetching data
    -   fake API simulation
-   **render.js**
    -   UI rendering
    -   UI state handling
-   **app.js**
    -   state management
    -   filtering logic
    -   event handling

# 📌 Notes

This implementation covers the **Junior scope**:

-   filtering (chips)
-   load more pagination
-   UI states

Mid-level features like:

-   advanced filtering (type/year)
-   classic pagination

were intentionally not implemented.


# 👤 Author

## Krzysztof Worwa

GitHub:  [https://github.com/KrzysiekWorwa]
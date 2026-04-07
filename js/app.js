import { getPressReleases } from "./dataService.js";
import {
    renderCards,
    updateGridOverlay,
    updateActionsVisibility,
    showLoading,
    hideLoading,
    showError,
    showEmptyState,
    hideEmptyState
} from "./render.js";

const newsGrid = document.querySelector("#newsGrid");
const newsLoading = document.querySelector("#newsLoading");
const newsError = document.querySelector("#newsError");
const newsEmpty = document.querySelector("#newsEmpty");
const loadMoreButton = document.querySelector("#loadMoreButton");
const chipButtons = document.querySelectorAll(".news__chip");
const newsGridOverlay = document.querySelector("#newsGridOverlay");
const newsActions = document.querySelector("#newsActions");

const ITEMS_PER_PAGE = 8;
const SHOULD_API_FAIL = false;

const state = {
    allPressReleases: [],
    selectedCategory: "all",
    visibleItems: ITEMS_PER_PAGE
};

function getFilteredItems() {
    if (state.selectedCategory === "all") {
        return state.allPressReleases;
    }

    return state.allPressReleases.filter((item) => {
        return item.category === state.selectedCategory;
    });
}

function renderVisibleItems() {
    const filteredItems = getFilteredItems();

    if (filteredItems.length === 0) {
        showEmptyState(newsEmpty, newsGrid, newsGridOverlay, newsActions);
        return;
    }

    hideEmptyState(newsEmpty);

    const itemsToRender = filteredItems.slice(0, state.visibleItems);
    const hasMoreItems = filteredItems.length > state.visibleItems;

    renderCards(newsGrid, itemsToRender);
    updateActionsVisibility(newsActions, hasMoreItems);
    updateGridOverlay(newsGridOverlay, hasMoreItems);
}

function setActiveChip(clickedButton) {
    chipButtons.forEach((button) => {
        button.classList.remove("news__chip--active");
        button.setAttribute("aria-pressed", "false");
    });

    clickedButton.classList.add("news__chip--active");
    clickedButton.setAttribute("aria-pressed", "true");
}

function handleChipClick(event) {
    const clickedButton = event.currentTarget;
    const selectedCategory = clickedButton.dataset.category;

    state.selectedCategory = selectedCategory;
    state.visibleItems = ITEMS_PER_PAGE;

    setActiveChip(clickedButton);
    renderVisibleItems();
}

function initChipButtons() {
    chipButtons.forEach((button) => {
        button.addEventListener("click", handleChipClick);
    });
}

function handleLoadMore() {
    state.visibleItems += ITEMS_PER_PAGE;
    renderVisibleItems();
}

async function init() {
    try {
        showLoading(newsLoading, newsError, newsEmpty, newsGrid, newsGridOverlay, newsActions);

        const pressReleases = await getPressReleases({ shouldFail: SHOULD_API_FAIL });
        
        state.allPressReleases = [...pressReleases].sort((a, b) => {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
        });

        renderVisibleItems();
        initChipButtons();
        loadMoreButton.addEventListener("click", handleLoadMore);
    } catch (error) {
        console.error(error);
        showError(newsError, newsEmpty, newsGrid, newsGridOverlay, newsActions);
    } finally {
        hideLoading(newsLoading);
    }
}

init();
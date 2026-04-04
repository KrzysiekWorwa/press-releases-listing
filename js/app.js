import { getPressReleases } from "./dataService.js";
import {
    renderCards,
    updateGridOverlay,
    showPagination,
    updateLoadMoreButton,
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
const newsPagination = document.querySelector("#newsPagination");
const typeFilter = document.querySelector("#typeFilter");
const yearFilter = document.querySelector("#yearFilter");

const ITEMS_PER_PAGE = 8;

const state = {
    allPressReleases: [],
    selectedCategory: "all",
    selectedType: "all",
    selectedYear: "all",
    visibleItems: ITEMS_PER_PAGE
};

function getUniqueTypes(items) {
    return [...new Set(items.map((item) => item.type))].sort();
}

function getUniqueYears(items) {
    return [...new Set(items.map((item) => new Date(item.publishedAt).getFullYear()))]
        .sort((a, b) => b - a);
}

function renderTypeSelectOptions(items) {
    const types = getUniqueTypes(items);

    typeFilter.innerHTML = `
        <option value="all">All types</option>
        ${types.map((type) => `<option value="${type}">${type}</option>`).join("")}
    `;
}

function renderYearSelectOptions(items) {
    const years = getUniqueYears(items);

    yearFilter.innerHTML = `
        <option value="all">All years</option>
        ${years.map((year) => `<option value="${year}">${year}</option>`).join("")}
    `;
}

function getFilteredItems() {
    return state.allPressReleases.filter((item) => {
        const matchesCategory =
            state.selectedCategory === "all" || item.category === state.selectedCategory;

        const matchesType =
            state.selectedType === "all" || item.type === state.selectedType;

        const matchesYear =
            state.selectedYear === "all" ||
            new Date(item.publishedAt).getFullYear().toString() === state.selectedYear;

        return matchesCategory && matchesType && matchesYear;
    });
}

function renderVisibleItems() {
    const filteredItems = getFilteredItems();

    if (filteredItems.length === 0) {
        showEmptyState(newsEmpty, newsGrid, newsGridOverlay, newsPagination);
        return;
    }

    hideEmptyState(newsEmpty);
    showPagination(newsPagination);

    const itemsToRender = filteredItems.slice(0, state.visibleItems);
    const hasMoreItems = filteredItems.length > state.visibleItems;

    renderCards(newsGrid, itemsToRender);
    updateLoadMoreButton(loadMoreButton, hasMoreItems);
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

function handleTypeChange(event) {
    state.selectedType = event.target.value;
    state.visibleItems = ITEMS_PER_PAGE;
    renderVisibleItems();
}

function handleYearChange(event) {
    state.selectedYear = event.target.value;
    state.visibleItems = ITEMS_PER_PAGE;
    renderVisibleItems();
}

function initSelectFilters() {
    typeFilter.addEventListener("change", handleTypeChange);
    yearFilter.addEventListener("change", handleYearChange);
}

async function init() {
    try {
        showLoading(newsLoading, newsError, newsEmpty, newsGrid, newsGridOverlay, newsPagination);

        const pressReleases = await getPressReleases();
        state.allPressReleases = [...pressReleases].sort((a, b) => {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
        });

        renderTypeSelectOptions(state.allPressReleases);
        renderYearSelectOptions(state.allPressReleases);

        renderVisibleItems();
        initChipButtons();
        initSelectFilters();
        loadMoreButton.addEventListener("click", handleLoadMore);
    } catch (error) {
        console.error(error);
        showError(newsError, newsEmpty, newsGrid, newsGridOverlay, newsPagination);
    } finally {
        hideLoading(newsLoading);
    }
}

init();
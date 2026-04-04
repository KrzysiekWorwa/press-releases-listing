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
    hideEmptyState,
    hidePaginationNav,
    showPaginationNav,
    renderPaginationPages,
    updatePaginationArrows
} from "./render.js";

import {
    getFilteredItems,
    renderTypeSelectOptions,
    renderYearSelectOptions
} from "./filters.js";

import {
    getTotalPages,
    getItemsForPage,
    hasPreviousPage,
    hasNextPage
} from "./pagination.js";

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

const paginationNav = document.querySelector("#paginationNav");
const paginationPages = document.querySelector("#paginationPages");
const paginationPrev = document.querySelector("#paginationPrev");
const paginationNext = document.querySelector("#paginationNext");

const ITEMS_PER_PAGE = 8;
const PAGINATION_MODE = "pagination";

const state = {
    allPressReleases: [],
    selectedCategory: "all",
    selectedType: "all",
    selectedYear: "all",
    visibleItems: ITEMS_PER_PAGE,
    currentPage: 1
};

function getCurrentFilteredItems() {
    return getFilteredItems(state.allPressReleases, {
        selectedCategory: state.selectedCategory,
        selectedType: state.selectedType,
        selectedYear: state.selectedYear
    });
}

function getPaginationState(filteredItems) {
    return {
        totalPages: getTotalPages(filteredItems, ITEMS_PER_PAGE),
        hasPrevious: hasPreviousPage(state.currentPage),
        hasNext: hasNextPage(filteredItems, state.currentPage, ITEMS_PER_PAGE)
    };
}

function getItemsToRender(filteredItems) {
    if (PAGINATION_MODE === "load-more") {
        return filteredItems.slice(0, state.visibleItems);
    }

    return getItemsForPage(filteredItems, state.currentPage, ITEMS_PER_PAGE);
}

function renderVisibleItems() {
    const filteredItems = getCurrentFilteredItems();

    if (filteredItems.length === 0) {
        showEmptyState(newsEmpty, newsGrid, newsGridOverlay, newsPagination);
        return;
    }

    hideEmptyState(newsEmpty);
    showPagination(newsPagination);

    const itemsToRender = getItemsToRender(filteredItems);
    const hasMoreItems = filteredItems.length > state.visibleItems;

    const { totalPages, hasPrevious, hasNext } = getPaginationState(filteredItems);

    renderCards(newsGrid, itemsToRender);

    if (PAGINATION_MODE === "load-more") {
        updateLoadMoreButton(loadMoreButton, hasMoreItems);
        updateGridOverlay(newsGridOverlay, hasMoreItems);
        hidePaginationNav(paginationNav);
    } else {
        loadMoreButton.hidden = true;
        newsGridOverlay.hidden = true;

        showPaginationNav(paginationNav);
        renderPaginationPages(paginationPages, totalPages, state.currentPage);
        updatePaginationArrows(paginationPrev, paginationNext, hasPrevious, hasNext);
    }
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
    state.selectedCategory = event.currentTarget.dataset.category;
    resetPagination();

    setActiveChip(event.currentTarget);
    renderVisibleItems();
}

function handleTypeChange(event) {
    state.selectedType = event.target.value;
    resetPagination();
    renderVisibleItems();
}

function handleYearChange(event) {
    state.selectedYear = event.target.value;
    resetPagination();
    renderVisibleItems();
}

function initFilters() {
    chipButtons.forEach((btn) =>
        btn.addEventListener("click", handleChipClick)
    );

    typeFilter.addEventListener("change", handleTypeChange);
    yearFilter.addEventListener("change", handleYearChange);
}

function resetPagination() {
    state.currentPage = 1;
    state.visibleItems = ITEMS_PER_PAGE;
}

function handlePaginationClick(event) {
    const pageButton = event.target.closest(".news__pagination-page");
    if (!pageButton) return;

    state.currentPage = Number(pageButton.dataset.page);
    renderVisibleItems();
}

function handlePrevClick() {
    if (state.currentPage > 1) {
        state.currentPage -= 1;
        renderVisibleItems();
    }
}

function handleNextClick() {
    const filteredItems = getCurrentFilteredItems();
    const totalPages = getTotalPages(filteredItems, ITEMS_PER_PAGE);

    if (state.currentPage < totalPages) {
        state.currentPage += 1;
        renderVisibleItems();
    }
}

function handleLoadMore() {
    state.visibleItems += ITEMS_PER_PAGE;
    renderVisibleItems();
}

function initPagination() {
    paginationPages.addEventListener("click", handlePaginationClick);
    paginationPrev.addEventListener("click", handlePrevClick);
    paginationNext.addEventListener("click", handleNextClick);

    if (PAGINATION_MODE === "load-more") {
        loadMoreButton.addEventListener("click", handleLoadMore);
    }
}

async function init() {
    try {
        showLoading(
            newsLoading,
            newsError,
            newsEmpty,
            newsGrid,
            newsGridOverlay,
            newsPagination
        );

        const data = await getPressReleases();

        state.allPressReleases = [...data].sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        renderTypeSelectOptions(typeFilter, state.allPressReleases);
        renderYearSelectOptions(yearFilter, state.allPressReleases);

        renderVisibleItems();
        initFilters();
        initPagination();

    } catch (error) {
        console.error(error);
        showError(newsError, newsEmpty, newsGrid, newsGridOverlay, newsPagination);
    } finally {
        hideLoading(newsLoading);
    }
}

init();
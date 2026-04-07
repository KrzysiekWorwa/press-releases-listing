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

const typeFilterDropdown = document.querySelector("#typeFilterDropdown");
const typeFilterTrigger = document.querySelector("#typeFilterTrigger");
const typeFilterMenu = document.querySelector("#typeFilterMenu");

const yearFilterDropdown = document.querySelector("#yearFilterDropdown");
const yearFilterTrigger = document.querySelector("#yearFilterTrigger");
const yearFilterMenu = document.querySelector("#yearFilterMenu");

const paginationNav = document.querySelector("#paginationNav");
const paginationPages = document.querySelector("#paginationPages");
const paginationPrev = document.querySelector("#paginationPrev");
const paginationNext = document.querySelector("#paginationNext");

const ITEMS_PER_PAGE = 8;
const PAGINATION_MODE = "pagination";
const SHOULD_API_FAIL = false;

const state = {
    allPressReleases: [],
    selectedCategory: "all",
    selectedTypes: [],
    selectedYears: [],
    visibleItems: ITEMS_PER_PAGE,
    currentPage: 1
};

function getCurrentFilteredItems() {
    return getFilteredItems(state.allPressReleases, {
        selectedCategory: state.selectedCategory,
        selectedTypes: state.selectedTypes,
        selectedYears: state.selectedYears
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

        if (totalPages > 1) {
            showPaginationNav(paginationNav);
            renderPaginationPages(paginationPages, totalPages, state.currentPage);
            updatePaginationArrows(paginationPrev, paginationNext, hasPrevious, hasNext);
        } else {
            hidePaginationNav(paginationNav);
        }
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

function openTypeDropdown() {
    typeFilterMenu.hidden = false;
    typeFilterTrigger.setAttribute("aria-expanded", "true");
}

function closeTypeDropdown() {
    typeFilterMenu.hidden = true;
    typeFilterTrigger.setAttribute("aria-expanded", "false");
}

function toggleTypeDropdown() {
    const isExpanded = typeFilterTrigger.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
        closeTypeDropdown();
    } else {
        openTypeDropdown();
    }
}

function handleTypeChange() {
    const checkedOptions = typeFilterMenu.querySelectorAll('input[type="checkbox"]:checked');

    state.selectedTypes = Array.from(checkedOptions, (option) => option.value);

    resetPagination();
    renderVisibleItems();
}

function openYearDropdown() {
    yearFilterMenu.hidden = false;
    yearFilterTrigger.setAttribute("aria-expanded", "true");
}

function closeYearDropdown() {
    yearFilterMenu.hidden = true;
    yearFilterTrigger.setAttribute("aria-expanded", "false");
}

function toggleYearDropdown() {
    const isExpanded = yearFilterTrigger.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
        closeYearDropdown();
    } else {
        openYearDropdown();
    }
}

function handleYearChange() {
    const checkedOptions = yearFilterMenu.querySelectorAll('input[type="checkbox"]:checked');

    state.selectedYears = Array.from(checkedOptions, (option) => option.value);

    resetPagination();
    renderVisibleItems();
}

function initFilters() {
    chipButtons.forEach((btn) =>
        btn.addEventListener("click", handleChipClick)
    );

    typeFilterTrigger.addEventListener("click", toggleTypeDropdown);
    typeFilterMenu.addEventListener("change", handleTypeChange);

    yearFilterTrigger.addEventListener("click", toggleYearDropdown);
    yearFilterMenu.addEventListener("change", handleYearChange);

    document.addEventListener("click", (event) => {
        if (!typeFilterDropdown.contains(event.target)) {
            closeTypeDropdown();
        }

        if (!yearFilterDropdown.contains(event.target)) {
            closeYearDropdown();
        }
    });
}

function resetPagination() {
    state.currentPage = 1;
    state.visibleItems = ITEMS_PER_PAGE;
}

function preservePaginationPosition(callback) {
    const paginationTopBefore = newsPagination.getBoundingClientRect().top;

    callback();

    requestAnimationFrame(() => {
        const paginationTopAfter = newsPagination.getBoundingClientRect().top;
        const scrollDelta = paginationTopAfter - paginationTopBefore;

        window.scrollBy(0, scrollDelta);
    });
}

function handlePaginationClick(event) {
    const pageButton = event.target.closest(".news__pagination-page");
    if (!pageButton) return;

    state.currentPage = Number(pageButton.dataset.page);

    preservePaginationPosition(() => {
        renderVisibleItems();
    });
}

function handlePrevClick() {
    if (state.currentPage > 1) {
        state.currentPage -= 1;

        preservePaginationPosition(() => {
            renderVisibleItems();
        });
    }
}

function handleNextClick() {
    const filteredItems = getCurrentFilteredItems();
    const totalPages = getTotalPages(filteredItems, ITEMS_PER_PAGE);

    if (state.currentPage < totalPages) {
        state.currentPage += 1;

        preservePaginationPosition(() => {
            renderVisibleItems();
        });
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

        const data = await getPressReleases({ shouldFail: SHOULD_API_FAIL });

        state.allPressReleases = [...data].sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        renderTypeSelectOptions(typeFilterMenu, state.allPressReleases, state.selectedTypes);
        renderYearSelectOptions(yearFilterMenu, state.allPressReleases, state.selectedYears);

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
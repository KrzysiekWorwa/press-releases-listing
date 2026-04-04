export function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", "");
}

export function createNewCard(item) {
    const cardSizeClass = item.imageUrl ? "card--tall" : "card--short";

    return `
        <article class="card ${cardSizeClass}">
            ${item.imageUrl ?
            `
                <div class="card__image-wrapper">
                    <img src="${item.imageUrl}" alt="${item.title}" class="card__image">
                </div>
            `
            : ``}
            <div class="card__content">
                <p class="card__date">${formatDate(item.publishedAt)}</p>
                <h2 class="card__title">${item.title}</h2>
                <p class="card__excerpt">${item.excerpt}</p>
            </div>
            <a class="card__link-wrapper" href="${item.url}">
                <span class="card__link">Read more</span>
                <svg class="card__arrow" viewBox="0 0 17 14" fill="none">
                    <path d="M5.65674 12.4039L11.3136 6.74708L5.65674 1.09022" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
            </a>
        </article>
    `;
}

export function renderCards(container, items) {
    const cardsMarkup = items.map(createNewCard).join("");
    container.innerHTML = cardsMarkup;
}

function getPaginationPages(totalPages, currentPage) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
}

export function renderPaginationPages(container, totalPages, currentPage) {
    container.innerHTML = "";

    const pages = getPaginationPages(totalPages, currentPage);

    pages.forEach((page) => {
        const button = document.createElement("button");
        button.type = "button";

        if (page === "...") {
            button.className = "news__pagination-ellipsis";
            button.textContent = "...";
            button.disabled = true;
        } else {
            button.className = "news__pagination-page";
            button.textContent = page;
            button.dataset.page = page;

            if (page === currentPage) {
                button.classList.add("news__pagination-page--active");
            }
        }

        container.appendChild(button);
    });
}

export function showPaginationNav(paginationNav) {
    paginationNav.hidden = false;
}

export function hidePaginationNav(paginationNav) {
    paginationNav.hidden = true;
}

export function updatePaginationArrows(prevButton, nextButton, hasPrevious, hasNext) {
    prevButton.disabled = !hasPrevious;
    nextButton.disabled = !hasNext;
}

export function updateGridOverlay(newsGridOverlay, hasMoreItems) {
    newsGridOverlay.hidden = !hasMoreItems;
}

export function showPagination(newsPagination) {
    newsPagination.hidden = false;
}

export function updateLoadMoreButton(loadMoreButton, hasMoreItems) {
    loadMoreButton.hidden = !hasMoreItems;
}

export function showLoading(newsLoading, newsError, newsEmpty, newsGrid, newsGridOverlay, newsPagination) {
    newsLoading.hidden = false;
    newsError.hidden = true;
    newsEmpty.hidden = true;
    newsGrid.innerHTML = "";
    newsGridOverlay.hidden = true;
    newsPagination.hidden = true;
}

export function hideLoading(newsLoading) {
    newsLoading.hidden = true;
}

export function showError(newsError, newsEmpty, newsGrid, newsGridOverlay, newsPagination) {
    newsError.hidden = false;
    newsEmpty.hidden = true;
    newsGrid.innerHTML = "";
    newsGridOverlay.hidden = true;
    newsPagination.hidden = true;
}

export function showEmptyState(newsEmpty, newsGrid, newsGridOverlay, newsPagination) {
    newsEmpty.hidden = false;
    newsGrid.innerHTML = "";
    newsGridOverlay.hidden = true;
    newsPagination.hidden = true;
}

export function hideEmptyState(newsEmpty) {
    newsEmpty.hidden = true;
}
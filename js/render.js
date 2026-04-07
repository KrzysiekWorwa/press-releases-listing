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
            <a class="card__link-wrapper" href="${item.url}" aria-label="Read more about ${item.title}">
                <span class="card__link">Read more</span>
                <span class="sr-only">Read more about ${item.title}</span>
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

export function updateGridOverlay(newsGridOverlay, hasMoreItems) {
    newsGridOverlay.hidden = !hasMoreItems;
}

export function updateActionsVisibility(newsActions, hasMoreItems) {
    newsActions.hidden = !hasMoreItems;
}

export function showLoading(newsLoading, newsError, newsEmpty, newsGrid, newsGridOverlay, newsActions) {
    newsLoading.hidden = false;
    newsError.hidden = true;
    newsEmpty.hidden = true;
    newsGrid.innerHTML = "";
    newsGridOverlay.hidden = true;
    newsActions.hidden = true;
}

export function hideLoading(newsLoading) {
    newsLoading.hidden = true;
}

export function showError(newsError, newsEmpty, newsGrid, newsGridOverlay, newsActions) {
    newsError.hidden = false;
    newsEmpty.hidden = true;
    newsGrid.innerHTML = "";
    newsGridOverlay.hidden = true;
    newsActions.hidden = true;
}

export function showEmptyState(newsEmpty, newsGrid, newsGridOverlay, newsActions) {
    newsEmpty.hidden = false;
    newsGrid.innerHTML = "";
    newsGridOverlay.hidden = true;
    newsActions.hidden = true;
}

export function hideEmptyState(newsEmpty) {
    newsEmpty.hidden = true;
}
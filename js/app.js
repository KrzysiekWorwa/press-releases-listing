const newsGrid = document.querySelector("#newsGrid");
const newsLoading = document.querySelector("#newsLoading");
const newsError = document.querySelector("#newsError");

async function getPressReleases() {
    const shouldFail = false;
    const delay = Math.floor(Math.random() * 301) + 300;

    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                if (shouldFail) {
                    reject(new Error("Fake Api error"));
                }

                const response = await fetch("./data/pressReleases.json");

                if (!response.ok) {
                    throw new Error("Failed to fetch press releases");
                }

                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, delay);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", "");
}

function createNewCard(item) {
    const cardSizeClass = item.imageUrl ? 'tall' : 'short';

    return `
        <article class="card ${cardSizeClass}">
            ${item.imageUrl ?
            `
                    <div class="card__image-wrapper">
                        <img src="${item.imageUrl}" alt="${item.title}" class="card__image">
                    </div>
                `
            : ``
        }
            <div class="card__content">
                <p class="card__date">${formatDate(item.publishedAt)}</p>
                <h2 class="card__title">${item.title}</h2>
                <p class="card__excerpt">${item.excerpt}</p>
            </div>
            <a class="card__link" href="${item.url}">
                <span>Read more</span>
                <svg class="card__arrow" viewBox="0 0 17 14" fill="none">
                    <path d="M5.65674 12.4039L11.3136 6.74708L5.65674 1.09022" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
            </a>
        </article>
    `;
}

function renderCard(items) {
    const cardsMarkup = items.map(createNewCard).join("");
    newsGrid.innerHTML = cardsMarkup;
}

function showLoading() {
    newsLoading.hidden = false;
    newsError.hidden = true;
    newsGrid.innerHTML = "";
}

function hideLoading() {
    newsLoading.hidden = true;
}

function showError() {
    newsError.hidden = false;
    newsGrid.innerHTML = "";
}

async function init() {
    try {
        showLoading();

        const pressReleases = await getPressReleases();
        renderCard(pressReleases);
    }
    catch (error) {
        console.log(error);
        showError();
    }
    finally {
        hideLoading();
    }
}

init();
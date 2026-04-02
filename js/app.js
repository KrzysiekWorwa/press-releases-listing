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
        year: "numeric"
    });
}

function createNewCard(item) {
    return `
        <article class="card">
            ${item.imageUrl ?
            `
                    <div class="card__image">
                        <img src="${item.imageUrl}" alt="${item.title}">
                    </div>
                `
            : ``
        }
            <div class="card__content">
                <p class="card__date">${formatDate(item.publishedAt)}</p>
                <h2 class="card__title">${item.title}</h2>
                <p class="news-card__excerpt">${item.excerpt}</p>
                <a class="news-card__link" href="${item.url}">Read more</a>
            </div>
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
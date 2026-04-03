export async function getPressReleases({ shouldFail = false } = {}) {
    const delay = Math.floor(Math.random() * 301) + 300;

    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                if (shouldFail) {
                    reject(new Error("Fake API error"));
                    return;
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
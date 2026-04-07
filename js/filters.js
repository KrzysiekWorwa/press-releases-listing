export function getUniqueTypes(items) {
    return [...new Set(items.map((item) => item.type))].sort();
}

export function getUniqueYears(items) {
    return [...new Set(items.map((item) => new Date(item.publishedAt).getFullYear()))]
        .sort((a, b) => b - a);
}

export function renderTypeSelectOptions(typeFilterMenu, items, selectedTypes = []) {
    const types = getUniqueTypes(items);

    typeFilterMenu.innerHTML = types
        .map((type) => `
            <label class="news__select-option">
                <input
                    type="checkbox"
                    value="${type}"
                    ${selectedTypes.includes(type) ? "checked" : ""}
                >
                <span>${type}</span>
            </label>
        `)
        .join("");
}

export function renderYearSelectOptions(yearFilterMenu, items, selectedYears = []) {
    const years = getUniqueYears(items);

    yearFilterMenu.innerHTML = years
        .map((year) => `
            <label class="news__select-option">
                <input
                    type="checkbox"
                    value="${year}"
                    ${selectedYears.includes(year.toString()) ? "checked" : ""}
                >
                <span>${year}</span>
            </label>
        `)
        .join("");
}

export function getFilteredItems(items, filters) {
    return items.filter((item) => {
        const matchesCategory =
            filters.selectedCategory === "all" || item.category === filters.selectedCategory;

        const matchesType =
            filters.selectedTypes.length === 0 || filters.selectedTypes.includes(item.type);

        const matchesYear =
            filters.selectedYears.length === 0 ||
            filters.selectedYears.includes(new Date(item.publishedAt).getFullYear().toString());

        return matchesCategory && matchesType && matchesYear;
    });
}
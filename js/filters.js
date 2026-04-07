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

export function renderYearSelectOptions(yearFilter, items) {
    const years = getUniqueYears(items);

    yearFilter.innerHTML = `
        <option value="all">All years</option>
        ${years.map((year) => `<option value="${year}">${year}</option>`).join("")}
    `;
}

export function getFilteredItems(items, filters) {
    return items.filter((item) => {
        const matchesCategory =
            filters.selectedCategory === "all" || item.category === filters.selectedCategory;

        const matchesType =
            filters.selectedTypes.length === 0 || filters.selectedTypes.includes(item.type);

        const matchesYear =
            filters.selectedYear === "all" ||
            new Date(item.publishedAt).getFullYear().toString() === filters.selectedYear;

        return matchesCategory && matchesType && matchesYear;
    });
}
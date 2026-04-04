export function getUniqueTypes(items) {
    return [...new Set(items.map((item) => item.type))].sort();
}

export function getUniqueYears(items) {
    return [...new Set(items.map((item) => new Date(item.publishedAt).getFullYear()))]
        .sort((a, b) => b - a);
}

export function renderTypeSelectOptions(typeFilter, items) {
    const types = getUniqueTypes(items);

    typeFilter.innerHTML = `
        <option value="all">All types</option>
        ${types.map((type) => `<option value="${type}">${type}</option>`).join("")}
    `;
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
            filters.selectedType === "all" || item.type === filters.selectedType;

        const matchesYear =
            filters.selectedYear === "all" ||
            new Date(item.publishedAt).getFullYear().toString() === filters.selectedYear;

        return matchesCategory && matchesType && matchesYear;
    });
}
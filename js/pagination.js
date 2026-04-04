export function getTotalPages(items, itemsPerPage) {
    return Math.ceil(items.length / itemsPerPage);
}

export function getItemsForPage(items, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
}

export function hasPreviousPage(currentPage) {
    return currentPage > 1;
}

export function hasNextPage(items, currentPage, itemsPerPage) {
    return currentPage < getTotalPages(items, itemsPerPage);
}
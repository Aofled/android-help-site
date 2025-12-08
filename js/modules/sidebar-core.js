export const sidebarEl = document.querySelector('.sidebar');
// We store active listeners here to remove them later (prevents memory leaks on menu reload)
export const sidebarEventListeners = [];

export function addEventListener(element, type, listener) {
    element.addEventListener(type, listener);
    // Track the listener so we can clean it up
    sidebarEventListeners.push({element, type, listener});
}

export function cleanupEventListeners() {
    // Remove all old listeners before adding new ones to avoid duplicates
    sidebarEventListeners.forEach(({element, type, listener}) => {
        element.removeEventListener(type, listener);
    });
    sidebarEventListeners.length = 0;
}
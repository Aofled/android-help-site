export const sidebarEl = document.querySelector('.sidebar');
export const sidebarEventListeners = [];

export function addEventListener(element, type, listener) {
  element.addEventListener(type, listener);
  sidebarEventListeners.push({ element, type, listener });
}

export function cleanupEventListeners() {
  sidebarEventListeners.forEach(({ element, type, listener }) => {
    element.removeEventListener(type, listener);
  });
  sidebarEventListeners.length = 0;
}
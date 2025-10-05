import { sidebarEl, addEventListener } from './sidebar-core.js';

export function setupSidebarControls(hasSubItems) {
  if (!hasSubItems) return;

  const toggleBtn = sidebarEl.querySelector('.toggle-all');
  const sortBtn = sidebarEl.querySelector('.sort-subitems');

  if (toggleBtn) {
    const toggleHandler = () => {
      const allItems = sidebarEl.querySelectorAll('.sidebar-item.has-submenu');
      const allCollapsed = Array.from(allItems).every(item => item.classList.contains('collapsed'));

      allItems.forEach(item => {
        item.classList.toggle('collapsed', !allCollapsed);
      });
      
      const icon = toggleBtn.querySelector('.toggle-icon');
      const text = toggleBtn.querySelector('.toggle-text');
      if (icon && text) {
        text.textContent = allCollapsed ? 'Свернуть все' : 'Развернуть все';
        icon.style.transform = allCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    };

    addEventListener(toggleBtn, 'click', toggleHandler);
  }

  if (sortBtn) {
    const sortHandler = () => {
      const allSubmenus = sidebarEl.querySelectorAll('.submenu');
      const isSorted = sortBtn.classList.toggle('sorted');

      allSubmenus.forEach(submenu => {
        const items = Array.from(submenu.children);
        const originalOrder = JSON.parse(submenu.dataset.originalOrder);

        items.sort((a, b) => {
          return isSorted
            ? compareItems(a, b)
            : restoreOriginalOrder(a, b, originalOrder);
        });

        items.forEach(item => submenu.appendChild(item));
      });

      updateSortButtonText(sortBtn, isSorted);
    };

    addEventListener(sortBtn, 'click', sortHandler);
  }
}

function compareItems(a, b) {
  const textA = a.textContent.trim().toLowerCase();
  const textB = b.textContent.trim().toLowerCase();
  const isEnglishA = /[a-z]/.test(textA[0]);
  const isEnglishB = /[a-z]/.test(textB[0]);
  return isEnglishA && !isEnglishB ? -1 : !isEnglishA && isEnglishB ? 1 : textA.localeCompare(textB);
}

function restoreOriginalOrder(a, b, originalOrder) {
  const indexA = originalOrder.findIndex(item => item.title === a.textContent.trim());
  const indexB = originalOrder.findIndex(item => item.title === b.textContent.trim());
  return indexA - indexB;
}

function updateSortButtonText(btn, isSorted) {
  const textEl = btn.querySelector('.sort-text');
  if (textEl) {
    textEl.textContent = isSorted ? 'Оригинал' : 'A→Z';
  }
}
import {sidebarEl, addEventListener} from './sidebar-core.js';

export function setupSidebarControls(hasSubItems) {
    if (!hasSubItems) return;

    const controlsContainer = sidebarEl.querySelector('.sidebar-controls');

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
    <input type="text" class="sidebar-search" placeholder="Поиск..." />
  `;
    controlsContainer.parentNode.insertBefore(searchContainer, controlsContainer);

    const toggleBtn = sidebarEl.querySelector('.toggle-all');
    const sortBtn = sidebarEl.querySelector('.sort-subitems');
    const searchInput = searchContainer.querySelector('.sidebar-search');

    addEventListener(searchInput, 'input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterSidebarItems(searchTerm);
    });

    function filterSidebarItems(searchTerm) {
        const allItems = sidebarEl.querySelectorAll('.sidebar-item');

        allItems.forEach(item => {
            const title = item.querySelector('a').textContent.toLowerCase();
            const subItems = item.querySelectorAll('.submenu li');
            let hasVisibleSubItems = false;

            subItems.forEach(subItem => {
                const subTitle = subItem.textContent.toLowerCase();
                const isMatch = subTitle.includes(searchTerm);
                subItem.style.display = isMatch ? '' : 'none';
                if (isMatch) hasVisibleSubItems = true;
            });

            const isMainMatch = title.includes(searchTerm);
            item.style.display = (isMainMatch || hasVisibleSubItems) ? '' : 'none';
        });
    }

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
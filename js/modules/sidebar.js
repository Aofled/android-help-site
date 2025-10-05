import { loadContent } from '../core/content-loader.js';
import { updateUrl } from '../core/utilities.js';

const sidebarEl = document.querySelector('.sidebar');

export async function loadSidebarMenu(menuType) {
  if (!sidebarEl) return;

  try {
    const response = await fetch(`content/${menuType}/${menuType}.json?v=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const menuData = await response.json();
    renderSidebarMenu(menuType, menuData);

    if (menuData.menuItems.length > 0) {
      const firstItem = menuData.menuItems[0];
      await loadContent(menuType, firstItem.contentFile);
      updateUrl(firstItem.url);
    }
  } catch (error) {
    console.error("Ошибка загрузки меню:", error);
    sidebarEl.innerHTML = `<p>Ошибка загрузки меню: ${error.message}</p>`;
  }
}

function renderSidebarMenu(menuType, menuData) {
  const menuWithOriginalOrder = {
    ...menuData,
    menuItems: menuData.menuItems.map(item => ({
      ...item,
      subItems: item.subItems ? [...item.subItems] : null
    }))
  };

  sidebarEl.innerHTML = `
    <nav class="sidebar-menu">
      <div class="sidebar-controls">
        <button class="toggle-all">
          <svg class="toggle-icon" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 10l5 5 5-5z"/>
          </svg>
          <span class="toggle-text">Развернуть все</span>
        </button>
        <button class="sort-subitems" title="Сортировка подпунктов">
          <svg class="sort-icon" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
          </svg>
          <span class="sort-text">A→Z</span>
        </button>
      </div>
      <ul class="sidebar-main-list">
        ${menuData.menuItems.map(item => `
          <li class="sidebar-item ${item.subItems ? 'has-submenu' : ''}">
            <a href="${item.url}"
               data-content-file="${item.contentFile}"
               data-section="${menuType}"
               ${window.location.hash === item.url ? 'class="active"' : ''}>
              ${item.title}
              ${item.subItems ? '<span class="submenu-toggle">›</span>' : ''}
            </a>
            ${item.subItems ? `
              <ul class="submenu" data-original-order='${JSON.stringify(item.subItems)}'>
                ${item.subItems.map(subItem => `
                  <li>
                    <a href="${subItem.url}"
                       data-content-file="${subItem.contentFile}"
                       data-section="${menuType}"
                       ${window.location.hash === subItem.url ? 'class="active"' : ''}>
                      ${subItem.title}
                    </a>
                  </li>
                `).join('')}
              </ul>
            ` : ''}
          </li>
        `).join('')}
      </ul>
    </nav>
  `;

  setupSidebarListeners();
  setupSidebarControls();
  setupSorting();
}

function setupSidebarListeners() {
  sidebarEl.addEventListener('click', (e) => {
    const toggle = e.target.closest('.submenu-toggle');
    if (toggle) {
      e.preventDefault();
      const parentItem = toggle.closest('.sidebar-item');
      parentItem.classList.toggle('expanded');
      return;
    }

    const link = e.target.closest('a[data-content-file]');
    if (!link) return;

    e.preventDefault();
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    loadContent(link.dataset.section, link.dataset.contentFile);
    updateUrl(link.href);
  });
}

function setupSidebarControls() {
  const toggleBtn = sidebarEl.querySelector('.toggle-all');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const allItems = document.querySelectorAll('.sidebar-item.has-submenu');
    const allExpanded = Array.from(allItems).every(item => item.classList.contains('expanded'));

    allItems.forEach(item => {
      item.classList.toggle('expanded', !allExpanded);
    });

    const icon = toggleBtn.querySelector('.toggle-icon');
    const text = toggleBtn.querySelector('.toggle-text');

    if (!allExpanded) {
      text.textContent = 'Свернуть все';
      icon.style.transform = 'rotate(180deg)';
    } else {
      text.textContent = 'Развернуть все';
      icon.style.transform = 'rotate(0deg)';
    }
  });
}

export function setupHashChangeListener() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    document.querySelectorAll('.sidebar-menu a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  });
}

function setupSorting() {
  const sortBtn = sidebarEl.querySelector('.sort-subitems');
  if (!sortBtn) return;

  let isSorted = false;

  sortBtn.addEventListener('click', () => {
    const allSubmenus = document.querySelectorAll('.submenu');

    allSubmenus.forEach(submenu => {
      const originalOrder = JSON.parse(submenu.dataset.originalOrder);
      const items = Array.from(submenu.children);

      if (!isSorted) {
        items.sort((a, b) => {
          const textA = a.textContent.trim().toLowerCase();
          const textB = b.textContent.trim().toLowerCase();

          const isEnglishA = /[a-z]/.test(textA[0]);
          const isEnglishB = /[a-z]/.test(textB[0]);

          if (isEnglishA && !isEnglishB) return -1;
          if (!isEnglishA && isEnglishB) return 1;

          return textA.localeCompare(textB);
        });
      } else {
        items.sort((a, b) => {
          const indexA = originalOrder.findIndex(
            item => item.title === a.textContent.trim()
          );
          const indexB = originalOrder.findIndex(
            item => item.title === b.textContent.trim()
          );
          return indexA - indexB;
        });
      }

      items.forEach(item => submenu.appendChild(item));
    });

    isSorted = !isSorted;
    sortBtn.classList.toggle('sorted', isSorted);
    sortBtn.querySelector('.sort-text').textContent = isSorted ? 'Оригинал' : 'A→Z';
  });
}
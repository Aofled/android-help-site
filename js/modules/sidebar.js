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
  sidebarEl.innerHTML = `
    <nav class="sidebar-menu">
      <ul>
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
              <ul class="submenu">
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

export function setupHashChangeListener() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    document.querySelectorAll('.sidebar-menu a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  });
}
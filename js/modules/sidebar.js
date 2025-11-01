import {loadContent} from '../core/content-loader.js';
import {updateUrl} from '../core/utilities.js';
import {setupSidebarControls} from './sidebar-controls.js';
import {sidebarEl, sidebarEventListeners, addEventListener, cleanupEventListeners} from './sidebar-core.js';

export async function loadSidebarMenu(menuType) {
    if (!sidebarEl) return;

    try {
        cleanupEventListeners();

        const response = await fetch(`content/${menuType}/${menuType}.json?v=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const menuData = await response.json();
        renderSidebarMenu(menuType, menuData);

        if (menuData.menuItems.length > 0) {
            const firstItem = menuData.menuItems[0];
            await loadContent(menuType, firstItem.contentFile);
            updateUrl(firstItem.url);

            const firstMenuItem = document.querySelector('.sidebar-menu a[data-content-file]');
            if (firstMenuItem) {
                document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
                firstMenuItem.classList.add('active');
            }
        }
    } catch (error) {
        console.error("Ошибка загрузки меню:", error);
        sidebarEl.innerHTML = `<p>Ошибка загрузки меню: ${error.message}</p>`;
    }
}

function renderSidebarMenu(menuType, menuData) {
    const hasSubItems = menuData.menuItems.some(item => item.subItems && item.subItems.length > 0);

    sidebarEl.innerHTML = `
    <nav class="sidebar-menu">
      <div class="sidebar-controls">
        <button class="toggle-all" ${hasSubItems ? '' : 'disabled'}>
          <svg class="toggle-icon" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 10l5 5 5-5z"/>
          </svg>
          <span class="toggle-text">Свернуть все</span>
        </button>
        <button class="sort-subitems" title="Сортировка подпунктов" ${hasSubItems ? '' : 'disabled'}>
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
               data-section="${menuType}">
              ${item.title}
              ${item.subItems ? '<span class="submenu-toggle">›</span>' : ''}
            </a>
            ${item.subItems ? `
              <ul class="submenu" data-original-order='${JSON.stringify(item.subItems)}'>
                ${item.subItems.map(subItem => `
                  <li>
                    <a href="${subItem.url}"
                       data-content-file="${subItem.contentFile}"
                       data-section="${menuType}">
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
    setupSidebarControls(hasSubItems);
}

function setupSidebarListeners() {
    const clickHandler = (e) => {
        const toggle = e.target.closest('.submenu-toggle');
        if (toggle) {
            e.preventDefault();
            const parentItem = toggle.closest('.sidebar-item');
            parentItem.classList.toggle('collapsed');
            return;
        }

        const link = e.target.closest('a[data-content-file]');
        if (!link) return;

        e.preventDefault();
        document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        loadContent(link.dataset.section, link.dataset.contentFile);
        updateUrl(link.href);

        if (window.matchMedia('(max-width: 1023px)').matches) {
            const sidebar = document.querySelector('.sidebar');
            const burger = document.querySelector('.burger-menu');
            sidebar.classList.remove('mobile-visible');
            burger?.classList.remove('active');
        }
    };

    addEventListener(sidebarEl, 'click', clickHandler);
}

export function setupHashChangeListener() {
    const hashHandler = () => {
        const hash = window.location.hash;
        document.querySelectorAll('.sidebar-menu a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === hash);
        });
    };

    window.addEventListener('hashchange', hashHandler);
    sidebarEventListeners.push({
        element: window,
        type: 'hashchange',
        listener: hashHandler
    });
}
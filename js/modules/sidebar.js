import {loadContent} from '../core/content-loader.js';
import {escapeHtml, updateUrl} from '../core/utilities.js';
import {setupSidebarControls} from './sidebar-controls.js';
import {addEventListener, cleanupEventListeners, sidebarEl, sidebarEventListeners} from './sidebar-core.js';

export async function loadSidebarMenu(menuType) {
    if (!sidebarEl) return;

    try {
        cleanupEventListeners();

        const response = await fetch(`content/${menuType}/${menuType}.json?v=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const menuData = await response.json();
        renderSidebarMenu(menuType, menuData);

        const currentHash = window.location.hash;

        // Check if the current URL hash belongs to the loaded section (e.g. #android/activity)
        const isHashForThisSection = currentHash.startsWith(`#${menuType}/`);

        if (isHashForThisSection) {
            const targetItem = findItemByGeneratedUrl(menuData.menuItems, menuType, currentHash);

            if (targetItem) {
                await loadContent(menuType, targetItem.contentFile);
                activateSidebarLink(currentHash);
                return;
            }
        }

        if (menuData.menuItems.length > 0) {
            const firstItem = menuData.menuItems[0];
            await loadContent(menuType, firstItem.contentFile);

            const newUrl = generateUrl(menuType, firstItem.url);

            updateUrl(newUrl);
            activateSidebarLink(newUrl);
        }

    } catch (error) {
        console.error("Ошибка загрузки меню:", error);
        sidebarEl.innerHTML = `<p>Ошибка загрузки меню: ${error.message}</p>`;
    }
}

function generateUrl(section, originalJsonUrl) {
    const cleanSlug = originalJsonUrl.replace(/^#/, '');
    return `#${section}/${cleanSlug}`;
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
        ${menuData.menuItems.map(item => renderMenuItem(item, menuType)).join('')}
      </ul>
    </nav>
  `;

    setupSidebarListeners();
    setupSidebarControls(hasSubItems);
}

function renderMenuItem(item, menuType) {
    const href = generateUrl(menuType, item.url);

    return `
      <li class="sidebar-item ${item.subItems ? 'has-submenu' : ''}">
        <a href="${href}"
           data-content-file="${item.contentFile}"
           data-section="${menuType}">
          ${item.title}
          ${item.subItems ? '<span class="submenu-toggle">›</span>' : ''}
        </a>
        ${item.subItems ? `
          <ul class="submenu" data-original-order='${escapeHtml(JSON.stringify(item.subItems))}'>
            ${item.subItems.map(subItem => renderMenuItem(subItem, menuType)).join('')}
          </ul>
        ` : ''}
      </li>
    `;
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

        const href = link.getAttribute('href');
        activateSidebarLink(href);

        loadContent(link.dataset.section, link.dataset.contentFile);
        updateUrl(href);

        if (window.matchMedia('(max-width: 1023px)').matches) {
            const sidebar = document.querySelector('.sidebar');
            const burger = document.querySelector('.burger-menu');
            sidebar.classList.remove('mobile-visible');
            burger?.classList.remove('active');
        }
    };

    addEventListener(sidebarEl, 'click', clickHandler);
}

function activateSidebarLink(url) {
    sidebarEl.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));

    const link = sidebarEl.querySelector(`a[href="${url}"]`);
    if (link) {
        link.classList.add('active');

        const submenu = link.closest('.submenu');
        if (submenu) {
            const parentItem = submenu.closest('.sidebar-item');
            if (parentItem) {
                parentItem.classList.remove('collapsed');
            }
        }
    }
}

// Recursively search for an item in the menu tree (including sub-items)
function findItemByGeneratedUrl(items, menuType, targetUrl) {
    for (const item of items) {
        const generated = generateUrl(menuType, item.url);
        if (generated === targetUrl) return item;

        if (item.subItems) {
            const found = findItemByGeneratedUrl(item.subItems, menuType, targetUrl);
            if (found) return found;
        }
    }
    return null;
}

export function setupHashChangeListener() {
    const hashHandler = () => {
        const hash = window.location.hash;
        if (hash) {
            activateSidebarLink(hash);
        }
    };

    window.addEventListener('hashchange', hashHandler);
    sidebarEventListeners.push({
        element: window,
        type: 'hashchange',
        listener: hashHandler
    });
}
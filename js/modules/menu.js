import {loadSidebarMenu} from './sidebar.js';
import {showLoader} from '../core/content-loader.js';

export function setupMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('mobile-visible');
            burgerMenu.classList.toggle('active');
        });
    }

    const menuItems = document.querySelectorAll('[data-menu-item]');

    function setActiveMenuItem(activeItem) {
        menuItems.forEach(item => {
            const isActive = item.dataset.menuItem === activeItem;
            item.classList.toggle('active', isActive);
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const menuItem = item.dataset.menuItem;
            setActiveMenuItem(menuItem);
            await loadSidebarMenu(menuItem);
        });
    });

    init(setActiveMenuItem);
}

async function init(setActiveMenuItem) {
    const hash = window.location.hash;

    if (!hash) {
        setActiveMenuItem('android');
        loadSidebarMenu('android');
        return;
    }

    showLoader();

    document.querySelectorAll('[data-menu-item]').forEach(el => el.classList.remove('active'));

    const sections = ['android', 'kotlin', 'java', 'studio'];

    const checkPromises = sections.map(async (section) => {
        try {
            const response = await fetch(`content/${section}/${section}.json?v=${Date.now()}`);
            if (!response.ok) return null;
            const data = await response.json();

            if (findUrlInMenu(data.menuItems, hash)) {
                return section;
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    });

    const results = await Promise.all(checkPromises);

    const foundSection = results.find(s => s !== null);

    if (foundSection) {
        setActiveMenuItem(foundSection);
        loadSidebarMenu(foundSection);
    } else {
        setActiveMenuItem('android');
        loadSidebarMenu('android');
    }
}

function findUrlInMenu(items, url) {
    for (const item of items) {
        if (item.url === url) return true;
        if (item.subItems && findUrlInMenu(item.subItems, url)) return true;
    }
    return false;
}
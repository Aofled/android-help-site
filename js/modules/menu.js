import {loadSidebarMenu} from './sidebar.js';

export function setupMenu() {
    const menuItems = document.querySelectorAll('[data-menu-item]');

    function setActiveMenuItem(activeItem) {
        menuItems.forEach(item => {
            const isActive = item.dataset.menuItem === activeItem;
            item.classList.toggle('active', isActive);

            if (isActive) {
                const sidebarItem = document.querySelector(`.sidebar-item a[href="#${activeItem}"]`);
                if (sidebarItem) {
                    sidebarItem.closest('.sidebar-item')?.classList.add('expanded');
                }
            }
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const menuItem = item.dataset.menuItem;
            setActiveMenuItem(menuItem);
            await loadSidebarMenu(menuItem);

            if (window.location.hash.includes(menuItem)) {
                window.dispatchEvent(new Event('hashchange'));
            }
        });
    });

    setActiveMenuItem('android');
    loadSidebarMenu('android');
}
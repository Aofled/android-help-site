import {loadSidebarMenu} from './sidebar.js';

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
        menuItems.forEach(item => item.classList.remove('active'));

        menuItems.forEach(item => {
            if (item.dataset.menuItem === activeItem) {
                item.classList.add('active');
            }
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

    // Parse URL hash to determine which section to load (e.g., #java/basics -> load 'java')
    const hash = window.location.hash;
    const validSections = ['android', 'kotlin', 'java', 'studio'];
    let sectionToLoad = 'android';

    if (hash) {
        const parts = hash.replace('#', '').split('/');
        const potentialSection = parts[0];

        if (validSections.includes(potentialSection)) {
            sectionToLoad = potentialSection;
        }
    }

    setActiveMenuItem(sectionToLoad);
    loadSidebarMenu(sectionToLoad);
}
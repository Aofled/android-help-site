document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('[data-menu-item]');

    function setActiveMenuItem(activeItem) {
        menuItems.forEach(item => {
            if (item.dataset.menuItem === activeItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const menuItem = this.dataset.menuItem;
                setActiveMenuItem(menuItem);
                loadSidebarMenu(menuItem);
            });
    });

    setActiveMenuItem('android');
    if (window.loadSidebarMenu) {
        loadSidebarMenu('android');
    }
});
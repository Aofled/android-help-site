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
            item.addEventListener('click', async function(e) {
              e.preventDefault();
              const menuItem = this.dataset.menuItem;
              setActiveMenuItem(menuItem);
              await loadSidebarMenu(menuItem);

              if (window.location.hash.includes(menuItem)) {
                window.dispatchEvent(new Event('hashchange'));
              }
            });
    });

    setActiveMenuItem('android');
    if (window.loadSidebarMenu) {
        loadSidebarMenu('android');
    }
});
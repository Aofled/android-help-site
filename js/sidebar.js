function loadSidebarMenu(menuType) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const menuMapping = {
        'android-studio': 'studio'
    };

    const folderName = menuMapping[menuType] || menuType;
    const fileName = menuMapping[menuType] || menuType;

    fetch(`content/${folderName}/${fileName}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Не удалось загрузить меню для ${menuType}`);
            }
            return response.json();
        })
        .then(data => {
            sidebar.innerHTML = createMenuHTML(data.menuItems);
        })
        .catch(error => {
            console.error('Error loading sidebar menu:', error);
            sidebar.innerHTML = `<p>Ошибка загрузки меню: ${menuType}</p>`;
        });
}

function createMenuHTML(items, activeItem = null) {
    const firstItemId = items[0]?.title.toLowerCase().replace(/\s+/g, '-');
    const defaultActive = activeItem || firstItemId;

    return `
        <nav class="sidebar-menu">
            <ul>
                ${items.map(item => {
                    const itemId = item.title.toLowerCase().replace(/\s+/g, '-');
                    return `
                        <li>
                            <a href="${item.url || '#'}"
                               class="${itemId === defaultActive ? 'active' : ''}"
                               data-sidebar-item="${itemId}">
                                ${item.title}
                            </a>
                        </li>
                    `;
                }).join('')}
            </ul>
        </nav>
    `;
}

function setupSidebarListeners() {
    document.querySelector('.sidebar').addEventListener('click', function(e) {
        if (e.target.closest('[data-sidebar-item]')) {
            const allItems = document.querySelectorAll('[data-sidebar-item]');
            allItems.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

function loadSidebarMenu(menuType) {
    fetch(`content/${menuType}/${menuType}.json`)
        .then(response => response.json())
        .then(data => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.innerHTML = createMenuHTML(data.menuItems);
            setupSidebarListeners();

            if (data.menuItems.length > 0) {
                const firstItem = document.querySelector('[data-sidebar-item]');
                if (firstItem) firstItem.classList.add('active');
            }
        });
}

window.loadSidebarMenu = loadSidebarMenu;
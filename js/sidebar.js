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

function createMenuHTML(items, activeItem) {
    return `
        <nav class="sidebar-menu">
            <ul>
                ${items.map(item => `
                    <li>
                        <a href="${item.url || '#'}"
                           class="${item.title === activeItem ? 'active' : ''}"
                           data-sidebar-item="${item.title.toLowerCase()}">
                            ${item.title}
                        </a>
                    </li>
                `).join('')}
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

function loadSidebarMenu(menuType, activeItem = '') {
    fetch(`content/${menuType}/${menuType}.json`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.sidebar').innerHTML =
                createMenuHTML(data.menuItems, activeItem);
            setupSidebarListeners();
        });
}

window.loadSidebarMenu = loadSidebarMenu;
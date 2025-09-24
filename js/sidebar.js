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

function createMenuHTML(items) {
    return `
        <nav class="sidebar-menu">
            <ul>
                ${items.map(item => `
                    <li><a href="${item.url || '#'}">${item.title}</a></li>
                `).join('')}
            </ul>
        </nav>
    `;
}

window.loadSidebarMenu = loadSidebarMenu;
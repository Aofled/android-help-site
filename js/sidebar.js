function loadSidebarMenu(menuType) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const menuMapping = {
        'android-studio': 'studio'
    };

    const folderName = menuMapping[menuType] || menuType;
    const fileName = menuMapping[menuType] || menuType;

    fetch(`content/${menuType}/${menuType}.json?v=${Date.now()}`)
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
    const currentHash = window.location.hash.substring(1); // Убираем #

    return `
        <nav class="sidebar-menu">
            <ul>
                ${items.map(item => {
                    const itemId = item.url ? item.url.substring(1) : '';
                    const isActive = itemId === currentHash;
                    return `
                        <li>
                            <a href="${item.url || '#'}"
                               class="${isActive ? 'active' : ''}"
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
  document.querySelector('.sidebar').addEventListener('click', async (e) => {
    const link = e.target.closest('[data-content-file]');
    if (link) {
      e.preventDefault();
      const section = link.dataset.section;
      const contentFile = link.dataset.contentFile;

      document.querySelectorAll('.sidebar-menu a').forEach(a => {
        a.classList.remove('active');
      });

      link.classList.add('active');

      await window.contentLoader.loadContent(section, contentFile);

      window.history.pushState(null, '', link.getAttribute('href'));
    }
  });
}

async function loadSidebarMenu(menuType) {
  try {
    const menuResponse = await fetch(`content/${menuType}/${menuType}.json?v=${Date.now()}`);
    const menuData = await menuResponse.json();

    const sidebarHTML = `
      <nav class="sidebar-menu">
        <ul>
          ${menuData.menuItems.map((item, index) => `
            <li>
              <a href="${item.url}"
                 data-content-file="${item.contentFile}"
                 data-section="${menuType}"
                 ${index === 0 ? 'class="active"' : ''}>
                ${item.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>
    `;

    const sidebar = document.querySelector('.sidebar');
    sidebar.innerHTML = sidebarHTML;

    if (menuData.menuItems.length > 0) {
      const firstItem = menuData.menuItems[0];
      await window.contentLoader.loadContent(menuType, firstItem.contentFile);

      if (window.location.hash !== firstItem.url) {
        window.history.replaceState(null, '', firstItem.url);
      }
    }

    setupSidebarListeners();

  } catch (error) {
    console.error("Ошибка загрузки меню:", error);
  }
}

window.addEventListener('hashchange', function() {
    const allItems = document.querySelectorAll('[data-sidebar-item]');
    const currentHash = window.location.hash.substring(1);

    allItems.forEach(item => {
        const itemId = item.dataset.sidebarItem;
        item.classList.toggle('active', itemId === currentHash);
    });
});

window.loadSidebarMenu = loadSidebarMenu;
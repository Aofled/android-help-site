import {setupMenu} from './modules/menu.js';
import {setupFooter} from './modules/footer.js';
import {setupHashChangeListener} from './modules/sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    setupFooter();
    setupHashChangeListener();
});
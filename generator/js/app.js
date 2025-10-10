import { setupFooter } from './modules/footer.js';
import { initJsonSetting } from './content/json-setting.js';
import { initJsonBody } from './content/json-body.js';
import { initFileLoader } from './file-loader.js';
import { initJsonTabs } from './content/json-tabs.js';
import { initMenuForm } from './content/json-menu-form.js';
import { initContentForm } from './content/json-content-form.js';

document.addEventListener('DOMContentLoaded', () => {
    setupFooter();
    initJsonSetting();
    initJsonBody();
    initFileLoader();
    initJsonTabs();
    initMenuForm();
    initContentForm();
});

document.querySelector('.theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
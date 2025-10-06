import { setupMenu } from './modules/menu.js';
import { setupFooter } from './modules/footer.js';
import { setupHashChangeListener } from './modules/sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupFooter();
  setupHashChangeListener();
});

document.querySelector('.theme-toggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
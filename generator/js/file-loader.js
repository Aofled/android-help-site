export function initFileLoader() {
  const fileInput = document.getElementById('file-input');
  const jsonTextarea = document.getElementById('json-input');
  const statusBar = document.getElementById('json-status');

  document.querySelectorAll('[data-menu-item="load"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const parsed = JSON.parse(content);
        jsonTextarea.value = JSON.stringify(parsed, null, 2);
        statusBar.textContent = `Загружен файл: ${file.name}`;
        statusBar.style.color = '#3ddc84';
      } catch (error) {
        statusBar.textContent = `Ошибка: ${error.message}`;
        statusBar.style.color = '#ff4444';
      }
    };

    reader.onerror = () => {
      statusBar.textContent = 'Ошибка чтения файла';
      statusBar.style.color = '#ff4444';
    };

    reader.readAsText(file);
  });
}
export function initFileLoader() {
  const fileInput = document.getElementById('file-input');
  const jsonTextarea = document.getElementById('json-input');
  const statusBar = document.getElementById('json-status');
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  document.querySelectorAll('[data-menu-item="load"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.value = '';
      fileInput.click();
    });
  });

  fileInput.addEventListener('change', handleFileSelect);

  initDragAndDrop();

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      updateStatus(`Файл слишком большой (макс. ${MAX_FILE_SIZE/1024/1024}MB)`, 'error');
      return;
    }

    if (!file.name.endsWith('.json')) {
      updateStatus('Только .json файлы поддерживаются', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        updateStatus(`Загрузка: ${percent}%`, 'info');
      }
    };

    reader.onload = (fileEvent) => {
        try {
            const content = fileEvent.target.result;
            const parsed = JSON.parse(content);
            jsonTextarea.value = JSON.stringify(parsed, null, 2);
            updateStatus(`Загружен файл: ${file.name}`, 'success');

            if (window.updateLineNumbers) {
                window.updateLineNumbers();
            }

            const inputEvent = new Event('input', { bubbles: true });
            jsonTextarea.dispatchEvent(inputEvent);
        } catch (error) {
            updateStatus(`Ошибка парсинга: ${error.message}`, 'error');
        }
    };

    reader.onerror = () => {
      updateStatus('Ошибка чтения файла', 'error');
    };

    reader.readAsText(file);
  }

  function initDragAndDrop() {
    jsonTextarea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.target.classList.add('drag-over');
    });

    ['dragleave', 'drop'].forEach(event => {
      jsonTextarea.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove('drag-over');
      });
    });

    jsonTextarea.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
      }
    });
  }

  function updateStatus(message, type) {
    statusBar.textContent = message;
    statusBar.className = 'json-status-bar ' + (type ? `status-${type}` : '');
  }
}
export function initContentForm() {
  const initContentBtn = document.getElementById('init-content-structure');
  const jsonTextarea = document.getElementById('json-input');

  initContentBtn.addEventListener('click', () => {
    const baseStructure = {
      title: "",
      content: []
    };

    const jsonString = JSON.stringify(baseStructure, null, 2);

    if (jsonTextarea.value.trim() !== '') {
      if (!confirm('Текущее содержимое будет заменено. Продолжить?')) {
        return;
      }
    }

    jsonTextarea.value = jsonString;

    if (window.updateLineNumbers) {
      window.updateLineNumbers();
    }

    updateStatus('Структура контента инициализирована', 'success');
  });
}
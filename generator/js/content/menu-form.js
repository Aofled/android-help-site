export function initMenuForm() {
  const addButton = document.getElementById('add-to-json');
  const jsonTextarea = document.getElementById('json-input');
  const urlInput = document.getElementById('menu-url');
  const contentFileInput = document.getElementById('menu-content-file');

  urlInput.addEventListener('blur', () => {
    if (urlInput.value && !urlInput.value.startsWith('#')) {
      urlInput.value = '#' + urlInput.value;
    }
  });

  contentFileInput.addEventListener('blur', () => {
    if (contentFileInput.value && !contentFileInput.value.endsWith('.json')) {
      contentFileInput.value = contentFileInput.value.replace(/.json$/, '') + '.json';
    }
  });

  addButton.addEventListener('click', () => {
    const title = document.getElementById('menu-title').value.trim();
    let url = document.getElementById('menu-url').value.trim();
    let contentFile = document.getElementById('menu-content-file').value.trim();
    const hasSubItems = document.getElementById('menu-has-subitems').checked;

    if (!title) {
      alert('Пожалуйста, укажите title');
      return;
    }

    if (url && !url.startsWith('#')) url = '#' + url;
    if (contentFile && !contentFile.endsWith('.json')) contentFile += '.json';

    const menuItem = {
      title,
      ...(url && { url }),
      ...(contentFile && { contentFile }),
      ...(hasSubItems && { subItems: [] })
    };

    const jsonString = `,\n${JSON.stringify(menuItem, null, 2)}`;
    insertJsonAtCursor(jsonString);
  });

  function insertJsonAtCursor(jsonText) {
    const startPos = jsonTextarea.selectionStart;
    const endPos = jsonTextarea.selectionEnd;
    const currentValue = jsonTextarea.value;

    jsonTextarea.value = currentValue.substring(0, startPos) +
                       jsonText +
                       currentValue.substring(endPos);

    if (window.updateLineNumbers) {
      window.updateLineNumbers();
    }
    
    const newCursorPos = startPos + jsonText.length;
    jsonTextarea.setSelectionRange(newCursorPos, newCursorPos);
  }
}
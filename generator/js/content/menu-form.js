export function initMenuForm() {
  const addButton = document.getElementById('add-to-json');
  const jsonTextarea = document.getElementById('json-input');
  const urlInput = document.getElementById('menu-url');

  addButton.addEventListener('click', () => {
    const title = document.getElementById('menu-title').value.trim();
    const urlSlug = urlInput.value.trim();
    const hasSubItems = document.getElementById('menu-has-subitems').checked;
    const platform = document.querySelector('input[name="platform"]:checked').value;

    if (!title) {
      alert('Пожалуйста, укажите title');
      return;
    }

    if (!urlSlug) {
      alert('Пожалуйста, укажите URL Slug');
      return;
    }

    const url = `#${platform}-${urlSlug}`;
    const contentFile = `${platform}-${urlSlug}.json`;

    const menuItem = {
      title,
      url,
      contentFile,
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
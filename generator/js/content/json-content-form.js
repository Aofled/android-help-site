export function initContentForm() {
  const initContentBtn = document.getElementById('init-content-structure');
  const addContentBtn = document.getElementById('add-content-to-json');
  const jsonTextarea = document.getElementById('json-input');
  const contentTypeRadios = document.querySelectorAll('input[name="content-type"]');

  const inputGroups = {
    text: document.getElementById('text-input-group'),
    code: document.getElementById('code-input-group'),
    image: document.getElementById('image-input-group')
  };

    let buttonsContainer = inputGroups.text.querySelector('.text-format-buttons');

    if (!buttonsContainer) {
      buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'text-format-buttons';

      const linkBtn = document.createElement('button');
      linkBtn.className = 'format-button';
      linkBtn.textContent = '[ссылка]';
      linkBtn.title = 'Добавить ссылку (выделите текст)';

      const boldBtn = document.createElement('button');
      boldBtn.className = 'format-button';
      boldBtn.textContent = '**B**';
      boldBtn.title = 'Сделать текст жирным (выделите текст)';

      buttonsContainer.appendChild(boldBtn);
      buttonsContainer.appendChild(linkBtn);

      const textarea = inputGroups.text.querySelector('textarea');
      textarea.insertAdjacentElement('afterend', buttonsContainer);

      boldBtn.addEventListener('click', () => {
        const selectedText = textarea.value.substring(
          textarea.selectionStart,
          textarea.selectionEnd
        );

        if (!selectedText) {
          alert('Выделите текст, который нужно сделать жирным');
          return;
        }

        const beforeText = textarea.value.substring(0, textarea.selectionStart);
        const afterText = textarea.value.substring(textarea.selectionEnd);
        textarea.value = beforeText + `**${selectedText}**` + afterText;

        textarea.focus();
        const newPos = textarea.selectionStart + selectedText.length + 4;
        textarea.setSelectionRange(newPos, newPos);
      });

      linkBtn.addEventListener('click', () => {
        const selectedText = textarea.value.substring(
          textarea.selectionStart,
          textarea.selectionEnd
        );

        if (!selectedText) {
          alert('Выделите текст для ссылки');
          return;
        }

        const beforeText = textarea.value.substring(0, textarea.selectionStart);
        const afterText = textarea.value.substring(textarea.selectionEnd);
        textarea.value = beforeText + `[${selectedText}](https://)` + afterText;

        textarea.focus();
        const newPos = textarea.selectionStart + selectedText.length + 11;
        textarea.setSelectionRange(newPos, newPos);
      });
    }

  initContentBtn.addEventListener('click', () => {
    const baseStructure = {
      title: "",
      content: []
    };
    const jsonString = JSON.stringify(baseStructure, null, 2);

    if (jsonTextarea.value.trim() !== '' && !confirm('Текущее содержимое будет заменено. Продолжить?')) {
      return;
    }

    jsonTextarea.value = jsonString;
    if (window.updateLineNumbers) window.updateLineNumbers();
    updateStatus('Структура контента инициализирована', 'success');
  });

  contentTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {

      Object.values(inputGroups).forEach(group => {
        group.style.display = 'none';
      });

      inputGroups[radio.value].style.display = 'block';
    });
  });
  
  addContentBtn.addEventListener('click', () => {
    const contentType = document.querySelector('input[name="content-type"]:checked').value;
    let contentItem;

    switch (contentType) {
      case 'text':
        const textValue = document.getElementById('text-value').value.trim();
        if (!textValue) {
          alert('Пожалуйста, введите текст');
          return;
        }
        contentItem = {
          type: "text",
          value: textValue
        };
        break;

      case 'code':
        const codeValue = document.getElementById('code-value').value.trim();
        if (!codeValue) {
          alert('Пожалуйста, введите код');
          return;
        }
        const language = document.querySelector('input[name="code-language"]:checked').value;
        contentItem = {
          type: "code",
          language: language,
          value: codeValue
        };
        break;

      case 'image':
        let imageSrc = document.getElementById('image-src').value.trim();
          if (!imageSrc) {
            alert('Пожалуйста, укажите URL изображения');
            return;
          }
          
          if (!imageSrc.startsWith('/images/')) {
            imageSrc = '/images/' + imageSrc;
          }
          const alt = document.getElementById('image-alt').value.trim();
          const caption = document.getElementById('image-caption').value.trim();
          contentItem = {
            type: "image",
            src: imageSrc,
            alt: alt || "Изображение",
            ...(caption && { caption: caption })
          };
          break;
    }

    const jsonString = `,\n${JSON.stringify(contentItem, null, 2)}`;
    insertJsonAtCursor(jsonString);
  });

  function insertJsonAtCursor(jsonText) {
    const startPos = jsonTextarea.selectionStart;
    const endPos = jsonTextarea.selectionEnd;
    const currentValue = jsonTextarea.value;

    jsonTextarea.value = currentValue.substring(0, startPos) +
                       jsonText +
                       currentValue.substring(endPos);

    if (window.updateLineNumbers) window.updateLineNumbers();
    updateStatus('Контент добавлен', 'success');
  }
}
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
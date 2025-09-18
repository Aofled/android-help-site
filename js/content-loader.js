const contentCache = {};

const marked = window.marked || {
  parse: (text) => {
    // Basic fallback for Markdown
    return text
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$2</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }
};

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateContent(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Некорректные данные: ожидался объект');
  }

  if (!data.title || typeof data.title !== 'string') {
    throw new Error('Отсутствует или некорректен заголовок');
  }

  if (!Array.isArray(data.content)) {
    throw new Error('Контент должен быть массивом');
  }

  data.content.forEach(item => {
    if (!item.type || !['text', 'image', 'code'].includes(item.type)) {
      throw new Error(`Неизвестный тип контента: ${item.type}`);
    }
  });
}

function initCodeHighlighting() {
  if (window.hljs) {
    document.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });
  }
}

function setupCopyButtons() {
  document.querySelectorAll('.copy-code-btn').forEach(btn => {
    const originalHtml = btn.innerHTML;

    btn.addEventListener('click', async function() {
      const code = this.dataset.code;

      try {
        // Modern Clipboard API
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        }
        // Fallback for older browsers
        else {
          const textarea = document.createElement('textarea');
          textarea.value = code;
          textarea.style.position = 'fixed';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        this.classList.add('copied');
        this.innerHTML = '<svg width="14" height="16" viewBox="0 0 14 16" fill="#3ddc84"><path d="M2 4H0V16H11V14H2V4ZM5 0H14V12H5V0ZM4 1H1V13H4V1Z"/></svg> ✓ Скопировано!';

        setTimeout(() => {
          this.classList.remove('copied');
          this.innerHTML = originalHtml;
        }, 2000);

      } catch (err) {
        console.error('Ошибка копирования:', err);
        this.textContent = 'Ошибка!';
        setTimeout(() => { this.innerHTML = originalHtml; }, 1500);
      }
    });
  });
}

function renderContentBlocks(blocks) {
  return (blocks || []).map(block => {
    try {
      switch(block.type) {
        case 'text':
          return `<div class="text-block">${marked.parse(block.value)}</div>`;

        case 'image':
          return `
            <figure class="content-image-wrapper">
              <img src="${block.src}" alt="${block.alt || ''}"
                   class="content-image" loading="lazy">
              ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
            </figure>
          `;

        case 'code':
          return `
            <div class="code-block-wrapper">
              <button class="copy-code-btn" data-code="${escapeHtml(block.value)}">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="#aaa">
                  <path d="M2 4H0V16H11V14H2V4ZM5 0H14V12H5V0ZM4 1H1V13H4V1Z"/>
                </svg>
                Копировать
              </button>
              <pre><code class="language-${block.language || 'text'}">${escapeHtml(block.value)}</code></pre>
            </div>
          `;

        default:
          return `<div class="unknown-content-type">Неизвестный тип контента: ${block.type}</div>`;
      }
    } catch (e) {
      console.error('Ошибка рендеринга блока:', e);
      return `<div class="content-error">Ошибка отображения контента</div>`;
    }
  }).join('');
}

async function loadContent(section, contentFile) {
  const contentEl = document.querySelector('.content');
  const cacheKey = `${section}/${contentFile}`;

  if (contentCache[cacheKey]) {
    renderContent(contentCache[cacheKey]);
    return;
  }
    contentEl.innerHTML = `
      <div class="loader">
        <div class="spinner"></div>
        <p>Загрузка контента...</p>
      </div>
    `;

  try {
    const response = await fetch(`content/${section}/items/${contentFile}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const contentData = await response.json();
    renderContent(contentData);

  } catch (error) {
    console.error('Ошибка загрузки контента:', error);
    document.querySelector('.content').innerHTML = `
      <div class="error-content">
        <h2>Ошибка загрузки</h2>
        <p>Не удалось загрузить контент. Пожалуйста, попробуйте позже.</p>
        <button onclick="window.location.reload()">Обновить страницу</button>
      </div>
    `;
  }
}

function renderContent(data) {
  const contentEl = document.querySelector('.content');
  contentEl.innerHTML = `
    <article class="content-article">
      <h1 class="content-title">${data.title || 'Без названия'}</h1>
      <div class="content-body">
        ${renderContentBlocks(data.content)}
      </div>
    </article>
  `;

  initCodeHighlighting();
  setupCopyButtons();
}

window.contentLoader = {
  loadContent,
  renderContent
};
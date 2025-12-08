import {escapeHtml, validateContent} from './utilities.js';

const contentCache = {};
const contentEl = document.querySelector('.content');

const marked = window.marked || {
    parse: (text) => {
        return text
            // internet link
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // underlining
            .replace(/\+\+(.*?)\+\+/g, '<u>$1</u>')

            // headings
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
            .replace(/^###### (.*$)/gm, '<h6>$1</h6>')

            // bold text (2 options)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')

            // italics
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')

            // strikethrough
            .replace(/~(.*?)~/g, '<del>$1</del>')

            // selecting
            .replace(/`(.*?)`/g, '<code>$1</code>')

            // paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }
};

export async function loadContent(section, contentFile) {
    const cacheKey = `${section}/${contentFile}`;

    if (contentCache[cacheKey]) {
        renderContent(contentCache[cacheKey]);
        return;
    }

    showLoader();

    try {
        const response = await fetch(`content/${section}/items/${contentFile}?v=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const contentData = await response.json();
        validateContent(contentData);
        contentCache[cacheKey] = contentData;
        renderContent(contentData);
    } catch (error) {
        showError(error);
    }
}

export function showLoader() {
    contentEl.innerHTML = `
    <div class="loader">
      <div class="spinner"></div>
      <p>Загрузка контента...</p>
    </div>
  `;
}

function showError(error) {
    console.error('Ошибка загрузки контента:', error);
    contentEl.innerHTML = `
    <div class="error-content">
      <h2>Ошибка загрузки</h2>
      <p>${error.message}</p>
      <button onclick="window.location.reload()">Обновить страницу</button>
    </div>
  `;
}

function renderContent(data) {
    contentEl.innerHTML = `
    <article class="content-article">
      <h1 class="content-title">${data.title || 'Без названия'}</h1>
      <div class="content-body">
        ${data.content.map(renderContentBlock).join('')}
      </div>
    </article>
  `;

    initCodeHighlighting();
    setupCopyButtons();
}

function renderContentBlock(block) {
    try {
        switch (block.type) {
            case 'text':
                const cleanText = block.value
                    .replace(/^"|"$/g, '')
                    .replace(/\\n/g, '\n')
                    .replace(/\\\+/g, '+');
                const parsed = marked.parse(cleanText);
                return `<div class="text-block">${parsed}</div>`;
            case 'image':
                return renderImageBlock(block);
            case 'code':
                return renderCodeBlock(block);
            default:
                return `<div class="unknown-content-type">Неизвестный тип контента: ${block.type}</div>`;
        }
    } catch (e) {
        console.error('Ошибка рендеринга блока:', e);
        return `<div class="content-error">Ошибка отображения контента</div>`;
    }
}

function renderImageBlock(block) {
    return `
    <figure class="content-image-wrapper">
      <img src="${block.src}" alt="${block.alt || ''}" class="content-image"
           style="max-width: ${block.width || '100%'}; ${block.style || ''}"
           loading="lazy" decoding="async">
      ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
    </figure>`;
}

function renderCodeBlock(block) {
    return `
    <div class="code-block-wrapper">
      <button class="copy-code-btn" data-code="${escapeHtml(block.value)}">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="#aaa">
          <path d="M2 4H0V16H11V14H2V4ZM5 0H14V12H5V0ZM4 1H1V13H4V1Z"/>
        </svg>
        <span>Копировать</span>
      </button>
      <pre><code class="language-${block.language || 'text'}">${escapeHtml(block.value)}</code></pre>
    </div>`;
}

function initCodeHighlighting() {
    if (window.hljs) {
        document.querySelectorAll('pre code').forEach(hljs.highlightElement);
    }
}

function setupCopyButtons() {
    document.querySelectorAll('.copy-code-btn').forEach(btn => {
        const originalHtml = btn.innerHTML;
        const code = btn.dataset.code;

        btn.addEventListener('click', async () => {
            try {
                await copyToClipboard(code);
                showCopySuccess(btn, originalHtml);
            } catch (err) {
                showCopyError(btn, originalHtml, err);
            }
        });
    });
}

async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function showCopySuccess(btn, originalHtml) {
    btn.classList.add('copied');
    btn.innerHTML = '<svg width="14" height="16" viewBox="0 0 14 16" fill="#3ddc84"><path d="M2 4H0V16H11V14H2V4ZM5 0H14V12H5V0ZM4 1H1V13H4V1Z"/></svg> <span>✓ Скопировано!</span>';

    setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalHtml;
    }, 2000);
}

function showCopyError(btn, originalHtml, err) {
    console.error('Ошибка копирования:', err);
    btn.textContent = 'Ошибка!';
    setTimeout(() => {
        btn.innerHTML = originalHtml;
    }, 1500);
}
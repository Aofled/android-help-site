const marked = window.marked || {
  parse: (text) => text
};

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initCodeHighlighting() {
  if (window.hljs) {
    document.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });
  }
}

async function loadContent(section, contentFile) {
  try {
    const response = await fetch(`content/${section}/items/${contentFile}?v=${Date.now()}`);
    const contentData = await response.json();
    renderContent(contentData);
  } catch (error) {
    console.error("Ошибка загрузки контента:", error);
    document.querySelector('.content').innerHTML = `
      <div class="error">Контент временно недоступен</div>
    `;
  }
}

function renderContent(data) {
  const contentEl = document.querySelector('.content');
  contentEl.innerHTML = `
    <h1>${data.title}</h1>
    <div class="content-body">
      ${renderContentBlocks(data.content)}
    </div>
  `;
  initCodeHighlighting();
}

function renderContentBlocks(blocks) {
  return (blocks || []).map(block => {
    try {
      switch(block.type) {
        case 'text':
          return `<div class="text-block">${window.marked?.parse(block.value) || block.value}</div>`;
        case 'image':
          return `<img src="${block.src}" alt="${block.alt}" class="content-image">`;
        case 'code':
          return `<pre><code class="language-${block.language}">${escapeHtml(block.value)}</code></pre>`;
        default:
          return `<div class="unknown-block">Неизвестный тип контента: ${block.type}</div>`;
      }
    } catch (e) {
      console.error("Ошибка рендеринга блока:", e);
      return `<div class="error-block">Ошибка отображения контента</div>`;
    }
  }).join('');
}

window.contentLoader = {
  loadContent,
  renderContent
};
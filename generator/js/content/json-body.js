export function initJsonBody() {
    const textarea = document.getElementById('json-input');
    const statusBar = document.getElementById('json-status');
    const formatBtn = document.getElementById('format-json');
    const minifyBtn = document.getElementById('minify-json');
    const clearBtn = document.getElementById('clear-json');

    formatBtn.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(parsed, null, 2);
            updateStatus('JSON отформатирован', 'success');
        } catch (e) {
            updateStatus('Ошибка: невалидный JSON', 'error');
        }
    });

    minifyBtn.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(parsed);
            updateStatus('JSON минифицирован', 'success');
        } catch (e) {
            updateStatus('Ошибка: невалидный JSON', 'error');
        }
    });

    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        updateStatus('Очищено', 'info');
    });

    textarea.addEventListener('input', () => {
        debounceValidation();
    });

    function updateStatus(message, type) {
        statusBar.textContent = message;
        statusBar.style.color = type === 'error' ? '#ff4444' :
                              type === 'success' ? '#3ddc84' : '#888';
    }
    
    let debounceTimer;
    function debounceValidation() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            try {
                JSON.parse(textarea.value);
                updateStatus('Валидный JSON', 'success');
            } catch (e) {
                if (textarea.value.trim() === '') {
                    updateStatus('Готов к работе', 'info');
                } else {
                    updateStatus('Ошибка в JSON', 'error');
                }
            }
        }, 500);
    }
}
// Prevents XSS attacks by escaping special characters
export function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function updateUrl(url) {
    if (window.location.href !== url) {
        // Updates URL without reloading the page
        window.history.pushState(null, '', url);
    }
}

export function validateContent(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Некорректные данные: ожидался объект');
    }
    if (!data.title || typeof data.title !== 'string') {
        throw new Error('Отсутствует или некорректен заголовок');
    }
    if (!Array.isArray(data.content)) {
        throw new Error('Контент должен быть массивом');
    }

    // Ensure only supported content types are processed
    data.content.forEach(item => {
        if (!item.type || !['text', 'image', 'code'].includes(item.type)) {
            throw new Error(`Неизвестный тип контента: ${item.type}`);
        }
    });
}
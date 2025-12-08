export function updateStatus(message, type) {
    const statusBar = document.getElementById("json-status");
    if (!statusBar) return;

    statusBar.textContent = message;
    statusBar.className = "json-status-bar";
    statusBar.style.color = "";
    statusBar.style.backgroundColor = "";

    if (type) {
        statusBar.classList.add(`status-${type}`);
    }

    if (type === "success") {
        setTimeout(() => {
            if (statusBar.textContent === message) {
                statusBar.textContent = "Готов к работе";
                statusBar.className = "json-status-bar";
            }
        }, 3000);
    }
}

export function insertJsonAtCursor(jsonText) {
    const textarea = document.getElementById("json-input");
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentValue = textarea.value;

    textarea.value =
        currentValue.substring(0, startPos) +
        jsonText +
        currentValue.substring(endPos);

    if (window.updateLineNumbers) {
        window.updateLineNumbers();
    }

    const newCursorPos = startPos + jsonText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

export function initJsonBody() {
    const textarea = document.getElementById("json-input");
    const lineNumbers = document.querySelector(".line-numbers");
    const formatBtn = document.getElementById("format-json");
    const minifyBtn = document.getElementById("minify-json");
    const clearBtn = document.getElementById("clear-json");

    formatBtn.addEventListener("click", () => {
        try {
            const parsed = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(parsed, null, 2);
            updateStatus("JSON отформатирован", "success");
        } catch (e) {
            updateStatus("Ошибка: невалидный JSON", "error");
        }
    });

    minifyBtn.addEventListener("click", () => {
        try {
            const parsed = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(parsed);
            updateStatus("JSON минифицирован", "success");
            
            setTimeout(() => {
                textarea.style.whiteSpace = "pre";
                textarea.style.whiteSpace = "pre-wrap";
            }, 0);
        } catch (e) {
            updateStatus("Ошибка: невалидный JSON", "error");
        }
    });

    clearBtn.addEventListener("click", () => {
        if (textarea.value.trim() !== "") {
            if (!confirm("Вы уверены, что хотите очистить всё?")) {
                return;
            }
        }
        textarea.value = "";
        updateStatus("Очищено", "info");
        if (window.updateLineNumbers) window.updateLineNumbers();
    });

    textarea.addEventListener("input", () => {
        debounceValidation();
    });

    let debounceTimer;

    function debounceValidation() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            try {
                JSON.parse(textarea.value);
                updateStatus("Валидный JSON", "success");
            } catch (e) {
                if (textarea.value.trim() === "") {
                    updateStatus("Готов к работе", "info");
                } else {
                    updateStatus("Ошибка в JSON", "error");
                }
            }
        }, 500);
    }

    textarea.addEventListener("scroll", function () {
        lineNumbers.scrollTop = textarea.scrollTop;
    });

    updateLineNumbers();

    textarea.addEventListener("input", () => {
        updateLineNumbers();
        debounceValidation();
    });

    textarea.addEventListener("scroll", () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    });

    function updateLineNumbers() {
        const lines = textarea.value.split("\n").length || 1;
        lineNumbers.innerHTML = Array(lines)
            .fill()
            .map((_, i) => `<div>${i + 1}</div>`)
            .join("");
    }

    window.updateLineNumbers = function () {
        const lines = textarea.value.split("\n").length || 1;
        lineNumbers.innerHTML = Array(lines)
            .fill()
            .map((_, i) => `<div>${i + 1}</div>`)
            .join("");
    };
}
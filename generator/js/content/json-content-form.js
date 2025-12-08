import {updateStatus, insertJsonAtCursor} from "./json-body.js";

export function initContentForm() {
    const initContentBtn = document.getElementById("init-content-structure");
    const addContentBtn = document.getElementById("add-content-to-json");
    const jsonTextarea = document.getElementById("json-input");
    const contentTypeRadios = document.querySelectorAll(
        'input[name="content-type"]',
    );

    const inputGroups = {
        text: document.getElementById("text-input-group"),
        code: document.getElementById("code-input-group"),
        image: document.getElementById("image-input-group"),
    };

    let buttonsContainer = inputGroups.text.querySelector(".text-format-buttons");

    if (!buttonsContainer) {
        buttonsContainer = document.querySelector('.formatting-buttons');

        const firstRow = document.createElement('div');
        firstRow.className = 'buttons-row';

        const secondRow = document.createElement('div');
        secondRow.className = 'buttons-row';

        // first row - main formatting buttons
        const boldBtn = document.createElement("button");
        boldBtn.className = "format-button";
        boldBtn.textContent = "**B**";
        boldBtn.title = "Жирный текст";

        const italicBtn = document.createElement("button");
        italicBtn.className = "format-button";
        italicBtn.textContent = "*I*";
        italicBtn.title = "Курсивный текст";

        const strikethroughBtn = document.createElement("button");
        strikethroughBtn.className = "format-button";
        strikethroughBtn.textContent = "~~S~~";
        strikethroughBtn.title = "Зачеркнутый текст";

        const codeBtn = document.createElement("button");
        codeBtn.className = "format-button";
        codeBtn.textContent = "`C`";
        codeBtn.title = "Код в строке";

        const linkBtn = document.createElement("button");
        linkBtn.className = "format-button";
        linkBtn.textContent = "[ссылка]";
        linkBtn.title = "Добавить ссылку";

        // second row - header buttons
        const h1Btn = document.createElement("button");
        h1Btn.className = "format-button";
        h1Btn.textContent = "H1";
        h1Btn.title = "Заголовок 1 уровня";

        const h2Btn = document.createElement("button");
        h2Btn.className = "format-button";
        h2Btn.textContent = "H2";
        h2Btn.title = "Заголовок 2 уровня";

        const h3Btn = document.createElement("button");
        h3Btn.className = "format-button";
        h3Btn.textContent = "H3";
        h3Btn.title = "Заголовок 3 уровня";

        const h4Btn = document.createElement("button");
        h4Btn.className = "format-button";
        h4Btn.textContent = "H4";
        h4Btn.title = "Заголовок 4 уровня";

        firstRow.appendChild(boldBtn);
        firstRow.appendChild(italicBtn);
        firstRow.appendChild(strikethroughBtn);
        firstRow.appendChild(codeBtn);
        firstRow.appendChild(linkBtn);

        secondRow.appendChild(h1Btn);
        secondRow.appendChild(h2Btn);
        secondRow.appendChild(h3Btn);
        secondRow.appendChild(h4Btn);

        buttonsContainer.innerHTML = '';
        buttonsContainer.appendChild(firstRow);
        buttonsContainer.appendChild(secondRow);

        const textarea = inputGroups.text.querySelector("textarea");
        textarea.insertAdjacentElement("afterend", buttonsContainer);

        boldBtn.addEventListener("click", () =>
            formatText(textarea, "**", "Выделите текст для жирного начертания"),
        );
        italicBtn.addEventListener("click", () =>
            formatText(textarea, "*", "Выделите текст для курсива"),
        );
        strikethroughBtn.addEventListener("click", () =>
            formatText(textarea, "~~", "Выделите текст для зачеркивания"),
        );
        codeBtn.addEventListener("click", () =>
            formatText(textarea, "`", "Выделите текст для оформления как код"),
        );

        linkBtn.addEventListener("click", () => {
            const selectedText = textarea.value.substring(
                textarea.selectionStart,
                textarea.selectionEnd,
            );

            if (!selectedText) {
                alert("Выделите текст для ссылки");
                return;
            }

            const beforeText = textarea.value.substring(0, textarea.selectionStart);
            const afterText = textarea.value.substring(textarea.selectionEnd);
            textarea.value = beforeText + `[${selectedText}](https://)` + afterText;

            textarea.focus();
            const newPos = textarea.selectionStart + selectedText.length + 11;
            textarea.setSelectionRange(newPos, newPos);
        });

        h1Btn.addEventListener("click", () => addHeaderPrefix(textarea, "# "));
        h2Btn.addEventListener("click", () => addHeaderPrefix(textarea, "## "));
        h3Btn.addEventListener("click", () => addHeaderPrefix(textarea, "### "));
        h4Btn.addEventListener("click", () => addHeaderPrefix(textarea, "#### "));
    }

    initContentBtn.addEventListener("click", () => {
        const baseStructure = {
            title: "",
            content: [],
        };
        const jsonString = JSON.stringify(baseStructure, null, 2);

        if (
            jsonTextarea.value.trim() !== "" &&
            !confirm("Текущее содержимое будет заменено. Продолжить?")
        ) {
            return;
        }

        jsonTextarea.value = jsonString;
        if (window.updateLineNumbers) window.updateLineNumbers();
        updateStatus("Структура контента инициализирована", "success");
    });

    contentTypeRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            Object.values(inputGroups).forEach((group) => {
                group.style.display = "none";
            });

            inputGroups[radio.value].style.display = "block";
        });
    });

    addContentBtn.addEventListener("click", () => {
        const contentType = document.querySelector(
            'input[name="content-type"]:checked',
        ).value;
        let contentItem;

        switch (contentType) {
            case "text":
                let textValue = document.getElementById("text-value").value.trim();
                if (!textValue) {
                    alert("Пожалуйста, введите текст");
                    return;
                }
                textValue = textValue.replace(/\n/g, "\n\n");
                contentItem = {
                    type: "text",
                    value: textValue,
                };
                break;

            case "code":
                const codeValue = document.getElementById("code-value").value.trim();
                if (!codeValue) {
                    alert("Пожалуйста, введите код");
                    return;
                }
                const language = document.querySelector(
                    'input[name="code-language"]:checked',
                ).value;
                contentItem = {
                    type: "code",
                    language: language,
                    value: codeValue,
                };
                break;

            case "image":
                let imageSrc = document.getElementById("image-src").value.trim();
                if (!imageSrc) {
                    alert("Пожалуйста, укажите URL изображения");
                    return;
                }
                if (!imageSrc.startsWith("/images/")) {
                    imageSrc = "/images/" + imageSrc;
                }
                const alt = document.getElementById("image-alt").value.trim();
                const caption = document.getElementById("image-caption").value.trim();
                contentItem = {
                    type: "image",
                    src: imageSrc,
                    alt: alt || "Изображение",
                    ...(caption && {caption: caption}),
                };
                break;
        }

        const jsonString = `,\n${JSON.stringify(contentItem, null, 2)}`;
        insertJsonAtCursor(jsonString);
        updateStatus("Контент добавлен", "success");
    });

    function addHeaderPrefix(textarea, prefix) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const selectedText = textarea.value.substring(startPos, endPos);

        if (selectedText) {
            const beforeText = textarea.value.substring(0, startPos);
            const afterText = textarea.value.substring(endPos);
            textarea.value = beforeText + prefix + selectedText + afterText;

            textarea.focus();
            const newPos = startPos + prefix.length;
            textarea.setSelectionRange(newPos, newPos + selectedText.length);
        } else {
            const beforeText = textarea.value.substring(0, startPos);
            const afterText = textarea.value.substring(endPos);
            textarea.value = beforeText + prefix + afterText;

            textarea.focus();
            const newPos = startPos + prefix.length;
            textarea.setSelectionRange(newPos, newPos);
        }
    }

    function formatText(textarea, wrapper, alertMessage) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const selectedText = textarea.value.substring(startPos, endPos);

        if (!selectedText) {
            if (alertMessage) alert(alertMessage);
            return;
        }

        const beforeText = textarea.value.substring(0, startPos);
        const afterText = textarea.value.substring(endPos);

        textarea.value =
            beforeText + `${wrapper}${selectedText}${wrapper}` + afterText;

        textarea.focus();
        const newCursorPos =
            startPos + wrapper.length + selectedText.length + wrapper.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
}

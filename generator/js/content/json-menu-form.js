import {updateStatus, insertJsonAtCursor} from "./json-body.js";

export function initMenuForm() {
    const addButton = document.getElementById("add-to-json");
    const jsonTextarea = document.getElementById("json-input");
    const urlInput = document.getElementById("menu-url");
    const titleInput = document.getElementById("menu-title");
    const initStructureButton = document.getElementById("init-json-structure");
    const subItemsCheckbox = document.getElementById("menu-has-subitems");

    initStructureButton.addEventListener("click", () => {
        const baseStructure = {
            menuItems: [],
        };

        const jsonString = JSON.stringify(baseStructure, null, 2);

        if (jsonTextarea.value.trim() !== "") {
            if (!confirm("Текущее содержимое будет заменено. Продолжить?")) {
                return;
            }
        }

        jsonTextarea.value = jsonString;

        if (window.updateLineNumbers) {
            window.updateLineNumbers();
        }

        updateStatus("Структура меню инициализирована", "success");
    });

    addButton.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const urlSlug = urlInput.value.trim();
        const hasSubItems = subItemsCheckbox.checked;
        const platform = document.querySelector(
            'input[name="platform"]:checked',
        ).value;

        if (!title) {
            alert("Пожалуйста, укажите title");
            return;
        }

        if (!urlSlug) {
            alert("Пожалуйста, укажите URL Slug");
            return;
        }

        const url = `#${platform}-${urlSlug}`;
        const contentFile = `${platform}-${urlSlug}.json`;

        const menuItem = {
            title,
            url,
            contentFile,
            ...(hasSubItems && {subItems: []}),
        };

        const jsonString = `,\n${JSON.stringify(menuItem, null, 2)}`;
        insertJsonAtCursor(jsonString);

        titleInput.value = "";
        urlInput.value = "";
        subItemsCheckbox.checked = false;
        updateStatus("Пункт меню добавлен", "success");
    });
}
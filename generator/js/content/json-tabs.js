export function initJsonTabs() {
    const tabsContainer = document.querySelector(".json-tabs");
    if (!tabsContainer) return;

    const tabs = tabsContainer.querySelectorAll(".json-tab");
    const tabContents = document.querySelectorAll(".json-tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((c) => c.classList.remove("active"));

            tab.classList.add("active");
            const contentId = tab.getAttribute("data-tab");
            document.getElementById(contentId).classList.add("active");
        });
    });

    if (tabs.length > 0) {
        tabs[0].click();
    }
}
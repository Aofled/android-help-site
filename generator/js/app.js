import { setupFooter } from "./modules/footer.js";
import { initJsonSetting } from "./content/json-setting.js";
import { initJsonBody } from "./content/json-body.js";
import { initFileLoader } from "./file-loader.js";
import { initJsonTabs } from "./content/json-tabs.js";
import { initMenuForm } from "./content/json-menu-form.js";
import { initContentForm } from "./content/json-content-form.js";

document.addEventListener("DOMContentLoaded", () => {
  setupFooter();
  initJsonSetting();
  initJsonBody();
  initFileLoader();
  initJsonTabs();
  initMenuForm();
  initContentForm();
});
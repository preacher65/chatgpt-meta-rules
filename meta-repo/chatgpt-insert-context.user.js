
// ==UserScript==
// @name         ChatGPT: Insert Context Package
// @namespace    https://example.local/ctx
// @version      1.0.0
// @description  Adds an "Insert Context" button that fetches a template from GitHub and inserts it into the message box.
// @author       you
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==
/* HOW TO USE
1) Replace GITHUB_RAW_URL below with your raw template URL, e.g.
   https://raw.githubusercontent.com/<user>/<repo>/main/context/context-template-default.md
2) Reload ChatGPT. You will see a small "Insert Context" button above the composer.
3) Clicking it will fetch the template and insert it at the cursor. You can edit placeholders then send.
*/

(function() {
  "use strict";

  const RAW_URL = "GITHUB_RAW_URL"; // <-- REPLACE THIS

  function getComposer() {
    // Handles both chat.openai.com and chatgpt.com DOMs (subject to minor changes)
    return document.querySelector("textarea[placeholder*='Message']") || document.querySelector("textarea");
  }

  function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const pre = textarea.value.substring(0, start);
    const post = textarea.value.substring(end);
    textarea.value = pre + text + post;
    textarea.setSelectionRange(start + text.length, start + text.length);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function addButton() {
    if (document.getElementById("ctx-insert-btn")) return;
    const composer = getComposer();
    if (!composer) return;

    const toolbarHost = composer.closest("form") || composer.parentElement;
    if (!toolbarHost) return;

    const btn = document.createElement("button");
    btn.id = "ctx-insert-btn";
    btn.type = "button";
    btn.textContent = "Insert Context";
    btn.style.cssText = [
      "margin: 6px 8px 0 0",
      "padding: 6px 10px",
      "border-radius: 8px",
      "border: 1px solid rgba(255,255,255,0.2)",
      "background: transparent",
      "font-size: 12px",
      "cursor: pointer"
    ].join(";");

    btn.addEventListener("click", function() {
      btn.disabled = true;
      btn.textContent = "Fetching...";
      GM_xmlhttpRequest({
        method: "GET",
        url: RAW_URL,
        onload: function(res) {
          btn.disabled = false;
          btn.textContent = "Insert Context";
          if (res.status >= 200 && res.status < 300) {
            const composerNow = getComposer();
            if (!composerNow) return;
            insertAtCursor(composerNow, res.responseText.trim() + "\n\n");
          } else {
            alert("Fetch failed: " + res.status);
          }
        },
        onerror: function() {
          btn.disabled = false;
          btn.textContent = "Insert Context";
          alert("Network error while fetching the template.");
        }
      });
    });

    toolbarHost.appendChild(btn);
  }

  const obs = new MutationObserver(() => addButton());
  obs.observe(document.documentElement, { childList: true, subtree: true });
  addButton();
})();

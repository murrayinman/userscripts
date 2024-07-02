// ==UserScript==
// @name         Delete All Lessons in a CA Course
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete all lessons in a CA course with one click
// @author       Murray Inman
// @match        https://riosalado.coursearc.com/*
// @match        https://riosalado.coursearc.dev/*
// @grant        none
// @status       development
// ==/UserScript==

(function () {
  // Add a button to the page
  function addDeleteAllButton() {
    const button = document.createElement("button");
    button.innerHTML = "Delete All Lessons";
    button.id = "deleteAllLessons";
    button.classList.add("btn", "btn-danger");
    button.style.float = "left";
    const targetDiv = document.querySelector("div.main.inner div.row:nth-of-type(2) div.col-md-6.right-button");
    if (targetDiv) {
      targetDiv.insertBefore(button, targetDiv.firstChild);
    }

    button.addEventListener("click", handleDeleteAll);
  }

  // Function to handle the delete all process
  async function handleDeleteAll() {
    const deleteLinks = Array.from(document.querySelectorAll('table#module-list tr:not([style="display: none;"]) td.action ul li a.remove-content'));

    for (const link of deleteLinks) {
      link.click();
      await delay(500);
      const completeButton = document.querySelector("div#delete-modal.fixed .modal-footer button.complete-button");
      if (completeButton) {
        completeButton.click();
        await delay(500);
      }
    }
  }

  // Utility function to create a delay
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Add the delete all button when the script runs
  addDeleteAllButton();
})();

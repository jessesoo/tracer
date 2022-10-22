var cancel = false;

function waitUntilLoaded(callback) {
  setTimeout(() => {
    const loading = document.querySelector(".loading-container");

    if (loading) {
      waitUntilLoaded(callback);
      return;
    }

    callback();
  }, 100);
}

function onEscape(event) {
  if (event.code === "Escape") {
    cancel = true;
  }
}

function isTranslationPage() {
  return window.location.href.startsWith(
    "https://www.bilibilicomics.com/tracer/#/translate-editor"
  );
}

function getDialogRejectButton(callback, { delay = 500 } = {}) {
  const button = document.querySelector(
    ".p-dialog-footer .p-button.p-confirm-dialog-reject"
  );

  if (!button && delay > 0) {
    setTimeout(() => {
      getDialogRejectButton(callback, { delay: delay - 100 });
    }, 100);
  }

  return callback(button);
}

function waitUntilCancel(callback) {
  getDialogRejectButton((button) => {
    if (button) {
      button.click();
    }

    waitUntilLoaded(callback);
  });
}

function run() {
  const promptStart = prompt("Start from", "1");

  if (promptStart == null) {
    return;
  }

  const promptEnd = prompt("Stop at", `${getImageCards().length}`);

  if (promptEnd == null) {
    return;
  }

  const start = parseInt(promptStart);
  const stop = parseInt(promptEnd);

  if (isNaN(start) || isNaN(stop)) {
    alert("Please enter only numbers.");
    run();
    return;
  }

  if (start > stop) {
    alert("Stop page cannot come before start page number");
    run();
    return;
  }

  const cardList = document.querySelectorAll(".image-card");

  if (cardList.length === 0) {
    alert("Please refresh the page.");
    return;
  }

  const card = cardList[Math.max(0, start - 1)];

  if (card.classList.contains("actived")) {
    go({ stop });
    return;
  }

  card.click();

  waitUntilCancel(() => {
    window.removeEventListener("keydown", onEscape);
    window.addEventListener("keydown", onEscape, true);

    go({ stop });
  });
}

function getContainer(callback) {
  const container = document.querySelector(".operation-content");
  if (container) {
    callback(container);
    return;
  }

  setTimeout(() => {
    getContainer(callback);
  }, 100);
}

function addButton() {
  const existing = document.querySelector(`div[data-name="gm-uppercase"]`);

  if (existing) {
    return;
  }

  const button = document.createElement("div");
  button.innerHTML = "Aa";
  button.dataset.name = "gm-uppercase";
  button.style.width = "40px";
  button.style.height = "40px";
  button.style.display = "flex";
  button.style.flexFlow = "row nowrap";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.cursor = "pointer";
  button.style.order = 1;
  button.classList.add("editor-button");
  button.classList.add("p-ripple");
  button.addEventListener("click", (event) => {
    if (
      confirm(
        "Do you want to capitalize translations? ⚠️ Any unsaved changes will be lost."
      )
    ) {
      run();
    }
  });

  getContainer((container) => {
    container.prepend(button);
  });
}

function main() {
  if (!isTranslationPage()) {
    return;
  }

  addButton();
}

function getActiveIndex(callback) {
  const cardList = getImageCards();
  const index = cardList.findIndex((card) =>
    card.classList.contains("actived")
  );

  if (index === -1) {
    setTimeout(() => {
      getActiveIndex(callback);
    }, 100);

    return;
  }

  return callback(index);
}

function getImageCards() {
  return Array.from(document.querySelectorAll(".image-card"));
}

function next(callback) {
  document.querySelector(".bottom-action").childNodes[1].childNodes[2].click();
  waitUntilLoaded(callback);
}

function save() {
  document.querySelector(".bottom-action").childNodes[0].click();
}

function hasMore() {
  const cards = getImageCards();

  return (
    cards.length > 0 && !cards[cards.length - 1].classList.contains("actived")
  );
}

function uppercase(callback) {
  Array.from(document.querySelectorAll(".target-input")).forEach((target) => {
    if (target.value == "") {
      return;
    }

    target.value = target.value.toUpperCase();
    target.dispatchEvent(new Event("input", { bubbles: true }));
  });

  save();
  waitUntilLoaded(callback);
}

function done() {
  alert("Done.");
}

function go({ stop } = {}) {
  getActiveIndex((index) => {
    uppercase(() => {
      if (stop != null && index >= stop - 1) {
        done();
        return;
      }

      next(() => {
        if (cancel) {
          done();
          cancel = false;
          return;
        }

        if (hasMore()) {
          go({ stop });
          return;
        }

        uppercase(done);
      });
    });
  });
}

main();

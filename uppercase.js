
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

function run() {
    const start = parseInt(prompt("Start from", "1"));
    const stop = parseInt(prompt("Stop at", `${getImageCards().length}`));
  
    if (isNaN(start) || isNaN(stop)) {
      alert("Please enter only numbers.");
      main();
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
  
    waitUntilLoaded(() => {
      go({ stop });
    });
  
    window.removeEventListener("keydown", onEscape);
    window.addEventListener("keydown", onEscape, true);
}

function getContainer(callback) {
    const container = document.querySelector(".operation-content")
    if (container) {
        callback(container);
        return;
    }

    setTimeout(() => {
        getContainer(callback);
    }, 100);
}

function addButton() {
    const button = document.createElement("div");
    button.innerHTML = "T";
    button.style.width = "40px";
    button.style.height = "40px";
    button.style.display = "flex";
    button.style.flexFlow = "row nowrap";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.order = 1;
    button.addEventListener("click", run);
  
    getContainer(container => {
      container.prepend(button);
    })
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

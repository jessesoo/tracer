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

function main({ start = 1, stop = null } = {}) {
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
}

function getActiveIndex() {
  const cardList = getImageCards();
  const index = cardList.findIndex((card) =>
    card.classList.contains("actived")
  );

  return index === -1 ? null : index;
}

function getImageCards() {
  return Array.from(document.querySelectorAll(".image-card"));
}

function next() {
  document.querySelector(".bottom-action").childNodes[1].childNodes[2].click();
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

function done() {
  alert("Done.");
}

let cancel = false;

function go({ stop } = {}) {
  const index = getActiveIndex();

  Array.from(document.querySelectorAll(".target-input")).forEach((target) => {
    if (target.value == "") {
      return;
    }

    target.value = target.value.toUpperCase();
    target.dispatchEvent(new Event("input", { bubbles: true }));
  });

  save();
  waitUntilLoaded(() => {
    if (stop != null && index === stop - 1) {
      done();
      return;
    }

    next();
    waitUntilLoaded(() => {
      if (!cancel && hasMore()) {
        go({ stop });
        return;
      }

      done();
    });
  });
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    cancel = true;
  }
}, true);

main({ start: 1, stop: null });

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

  window.removeEventListener("keydown", onEscape);
  window.addEventListener("keydown", onEscape, true);
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

main({ start: 1, stop: null });

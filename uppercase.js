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

function main() {
  const card = document.querySelector(".image-card");

  if (!card) {
    alert("Please refresh the page.");
    return;
  }

  if (card.classList.contains("actived")) {
    go();
    return;
  }

  card.click();

  waitUntilLoaded(go);
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

function go() {
  Array.from(document.querySelectorAll(".target-input")).forEach((target) => {
    if (target.value == "") {
      return;
    }

    target.value = target.value.toUpperCase();
    target.dispatchEvent(new Event("input", { bubbles: true }));
  });

  save();
  waitUntilLoaded(() => {
    next();
    waitUntilLoaded(() => {
      if (hasMore()) {
        go();
        return;
      }

      alert("Done.");
    });
  });
}

main();

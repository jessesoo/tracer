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

function next() {
  document.querySelector(".bottom-action").childNodes[1].childNodes[2].click();
}

function download(csv, title) {
  const a = document.createElement("a");
  a.href = encodeURI("data:text/csv;charset=utf-8," + csv);
  a.target = "_blank";
  a.download = `${title} (߷).csv`;
  
  document.body.appendChild(a)
  a.click();
}

let sources = [];
let translations = [];

function downloadFile() {
  const title = document.querySelector(".episode-title").textContent;

  let csv = `ZH߷EN\n`;

  for (let i = 0; i < translations.length; i++) {
    csv += `${sources[i]}߷${translations[i]}\n`;
  }

  download(csv, title);
  sources = [];
  translations = [];
}

function getImageCards() {
  return Array.from(document.querySelectorAll(".image-card"));
}

function hasMore() {
  const cards = getImageCards();

  return (
    cards.length > 0 && !cards[cards.length - 1].classList.contains("actived")
  );
}

function go() {
  Array.from(document.querySelectorAll(".target-input")).forEach((target) => {
    translations.push([target.value]);
  });

  Array.from(document.querySelectorAll(".source-input")).forEach((source) => {
    sources.push([source.value]);
  });

  next();
  waitUntilLoaded(() => {
    if (hasMore()) {
      go();
      return;
    }

    downloadFile();
  });
}

main();

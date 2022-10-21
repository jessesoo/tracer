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

function isTranslationPage() {
  return window.location.href.startsWith(
    "https://www.bilibilicomics.com/tracer/#/translate-editor"
  );
}

function main() {
  if (!isTranslationPage()) {
    return;
  }

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
  a.download = `${title} (⌚).csv`;

  document.body.appendChild(a);
  a.click();
}

function downloadFile({ sources, translations } = {}) {
  const title = document.querySelector(".episode-title").textContent;

  let csv = `ZH⌚EN\n`;
  const wc = {
    zh: 0,
    en: 0,
  };

  for (let i = 0; i < translations.length; i++) {
    const splitSources = sources[i][0].split("\n");
    const splitTranslations = translations[i][0].split("\n");
    const len = Math.max(splitSources.length, splitTranslations.length);

    for (let i = 0; i < len; i++) {
      const source = i < splitSources.length ? splitSources[i] : "";
      const translation =
        i < splitTranslations.length ? splitTranslations[i] : "";
      csv += `${source}⌚${translation}\n`;

      wc.zh += match(source, /[\p{sc=Han}]{1}/gu);
      wc.zh += match(source, /\w+/g);
      wc.en += match(translation, /\w+/g);
    }
  }

  csv += `${wc.zh}⌚${wc.en}\n`;

  download(csv, title);

  alert(
    `${title}: ${wc.zh} (Chinese), ${wc.en} (English). Summary will be downloaded.`
  );
}

function match(text, pattern) {
  const result = text.match(pattern);
  if (result) {
    return result.length;
  }
  return 0;
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

function go({ sources = [], translations = [] } = {}) {
  Array.from(document.querySelectorAll(".target-input")).forEach((target) => {
    translations.push([target.value]);
  });

  Array.from(document.querySelectorAll(".source-input")).forEach((source) => {
    sources.push([source.value]);
  });

  const data = { sources, translations };

  next();
  waitUntilLoaded(() => {
    if (hasMore()) {
      go(data);
      return;
    }

    downloadFile(data);
  });
}

main();

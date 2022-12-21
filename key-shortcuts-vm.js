// ==UserScript==
// @name        key shortcuts (Tracer)
// @namespace   Tracer / Key Shortcuts
// @match       https://www.bilibilicomics.com/tracer/#/translate-editor/*
// @grant       none
// @version     1.0
// ==/UserScript==

function save() {
  document.querySelector(".bottom-action").childNodes[0].click();
}

function prev() {
  document.querySelector(".bottom-action").childNodes[1].childNodes[0].click();
}

function next() {
  document.querySelector(".bottom-action").childNodes[1].childNodes[2].click();
}

function shrinkImage() {
  document.querySelector(".minus-btn").click();
}

function enlargeImage() {
  document.querySelector(".plus-btn").click();
}

function onKeydown(event) {
  if (event.code === "KeyS" && (event.metaKey || event.ctrlKey)) {
    save();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (
    event.code === "ArrowDown" &&
    (event.metaKey || event.ctrlKey) &&
    event.altKey
  ) {
    next();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (
    event.code === "ArrowUp" &&
    (event.metaKey || event.ctrlKey) &&
    event.altKey
  ) {
    prev();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.code === "Minus" && event.ctrlKey) {
    shrinkImage();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.code === "Equal" && event.ctrlKey) {
    enlargeImage();
    event.preventDefault();
    event.stopPropagation();
    return;
  }
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

  window.removeEventListener("keydown", onKeydown);
  window.addEventListener("keydown", onKeydown, true);
}

main();


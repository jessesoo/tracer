function getInputList() {
  return Array.from(document.querySelectorAll(".source-input"));
}

function hasMatch() {
  const inputList = getInputList();

  return (
    inputList
      .map((input) => input.value)
      .join("")
      .indexOf("*") !== -1
  );
}

function makeNextAsterisk() {
  let url;
  let textIndex;
  let currentIndex;

  return function next() {
    if (url !== window.location.href) {
      url = window.location.href;
      textIndex = null;
      currentIndex = null;
    }

    const inputList = getInputList();

    for (let i = 0; i < inputList.length; ) {
      if (currentIndex != null) {
        i = currentIndex;
        currentIndex = null;
      }

      const input = inputList[i];

      textIndex = input.value.indexOf("*", textIndex || 0);

      if (textIndex !== -1) {
        onFound(input, textIndex);

        currentIndex =
          textIndex === input.value.length - 1
            ? i === inputList.length - 1
              ? 0
              : i + 1
            : i;
        textIndex = textIndex === input.value.length - 1 ? null : textIndex + 1;
        break;
      } else {
        // Go back to the first match.
        if (i === inputList.length - 1) {
          textIndex = null;

          if (hasMatch(inputList)) {
            i = 0;
            continue;
          }
        }
      }

      i += 1;
    }
  };
}

function onFound(input, textIndex) {
  input.focus();
  input.selectionStart = textIndex;
  input.selectionEnd = textIndex + 1;
  input.scrollIntoView();
}

function onTab(event) {
  if (event.code === "Tab") {
    if (!hasMatch()) {
      return;
    }

    nextAsterisk();
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

  window.removeEventListener("keydown", onTab);
  window.addEventListener("keydown", onTab, true);
  console.log("next asterisk is running...");
}

const nextAsterisk = makeNextAsterisk();

main();

function makeNextAsterisk() {
  let url;
  let currentIndex;
  let textIndex;
  let hasMatch = false;

  return function next() {
    if (url !== window.location.href) {
      url = window.location.href;
      currentIndex = null;
      textIndex = null;
      hasMatch = false;
    }

    const inputList = Array.from(document.querySelectorAll(".source-input"));

    for (let i = 0; i < inputList.length; ) {
      // Start from where it left off.
      if (currentIndex != null) {
        i = currentIndex;
        currentIndex = null;
      }

      const input = inputList[i];
      textIndex = input.value.indexOf("*", Math.max(textIndex, 0) + 1);

      if (textIndex !== -1) {
        currentIndex = i;
        hasMatch = true;
        onFound(input, textIndex);
        break;
      } else {
        // Go back to the first match.
        if (i === inputList.length - 1) {
          currentIndex = null;
          textIndex = null;
          i = hasMatch ? 0 : i;
          continue;
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

function main() {
  const nextAsterisk = makeNextAsterisk();

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code === "Tab") {
        nextAsterisk();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    },
    true
  );
}

main();

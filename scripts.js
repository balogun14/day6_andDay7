const API_URL = `https://random-words-api.vercel.app/word`;
var words = [];
const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const modalBody = document.getElementById("modalBody");
const modalButton = document.getElementById("modal");
const figureParts = document.querySelectorAll(".figure-part");
const modalClose = document.getElementById("close");
const correctLetters = [];
const wrongLetters = [];

async function fetchWords() {
  try {
    const response = await fetch(API_URL);
    let data = await response.json();
    // console.log(data);
    if (response) {
      hideloader();
    }
    return data;
  } catch (error) {
    alert("failed to fetch data reload the pade or check your connection");
    return null;
  }
}

async function main() {
  const word = await fetchWords();
  if (word !== null) {
    // console.log(`word appended: ${word[0].word}`);
    selectedWord = word[0].word.toLowerCase();
    displayWord(selectedWord);
    window.addEventListener("keydown", (e) => {
      // console.log(e.keyCode);
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key;
        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            correctLetters.push(letter);
            displayWord(selectedWord);
          } else {
            showNotification();
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);

            updateWrongLettersEl();
          } else {
            showNotification();
          }
        }
      }
    });
    playAgainBtn.addEventListener("click", () => {
      //  Empty arrays
      correctLetters.splice(0, correctLetters.length);
      wrongLetters.splice(0, wrongLetters.length);
      main();
      updateWrongLettersEl();
      location.reload();
      popup.style.display = "none";
    });
    let p = document.createElement("p");
    p.innerHTML = `
      <p>
      Meaning:
      ${word[0].definition}
      </p>
      `;
    modalButton.addEventListener("click", () => {
      modalBody.style.display = "block";
      const list = document.createDocumentFragment();

      modalBody.appendChild(p);
    });
  } else {
    alert("failed to fetch data reload the pade or check your connection");
  }
}
function hideloader() {
  document.getElementById("Loading").style.display = "none";
}

// Show hidden word
function displayWord(selectedWord) {
  wordEl.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
      )
      .join("")}
  `;

  const innerWord = wordEl.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    popup.style.display = "flex";
  }
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. 😕";
    popup.style.display = "flex";
  }
}

// Show notification
function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Keydown letter press

// Restart game and play again

modalClose.addEventListener("click", () => {
  modalBody.style.display = "none";
});

window.onclick = (e) => {
  if (e.target === modalBody) {
    modalBody.style.display = "none";
  }
};
fetchWords();
main();

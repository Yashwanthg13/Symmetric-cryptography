// Get the element from DOM
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const alphabet = document.getElementById("alphabet-input");
const letterCase = document.getElementById("letter-case");

// Rail Fence Cipher Encryption
function encryptRailFence(text, key) {
    let rail = new Array(key).fill(null).map(() => []);

    let directionDown = false;
    let row = 0;

    for (let i = 0; i < text.length; i++) {
        rail[row].push(text[i]);
        if (row === 0 || row === key - 1) {
            directionDown = !directionDown;
        }
        row += directionDown ? 1 : -1;
    }

    return rail.flat().join('');
}

// Rail Fence Cipher Decryption
function decryptRailFence(cipher, key) {
    let rail = new Array(key).fill(null).map(() => []);
    let directionDown = false;
    let row = 0;

    for (let i = 0; i < cipher.length; i++) {
        rail[row].push('*');
        if (row === 0 || row === key - 1) {
            directionDown = !directionDown;
        }
        row += directionDown ? 1 : -1;
    }

    let index = 0;
    for (let i = 0; i < key; i++) {
        for (let j = 0; j < rail[i].length; j++) {
            rail[i][j] = cipher[index++];
        }
    }

    let result = [];
    row = 0;
    directionDown = false;
    for (let i = 0; i < cipher.length; i++) {
        result.push(rail[row].shift());
        if (row === 0 || row === key - 1) {
            directionDown = !directionDown;
        }
        row += directionDown ? 1 : -1;
    }

    return result.join('');
}

// Change the heading title and clear the content depending on whether to encode or decode
selectEncodeOrDecode.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.value === "encode") {
      hInput.textContent = "Plaintext";
      hOutput.textContent = "Ciphertext";
      inputText.value = "";
      outputText.textContent = "";
    } else if (option.value === "decode") {
      hInput.textContent = "Ciphertext";
      hOutput.textContent = "Plaintext";
      inputText.value = "";
      outputText.textContent = "";
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let inputTextValue = inputText.value;
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  );
  let key = parseInt(alphabet.value); // Use the key as the number of rails
  let letterCaseValue = letterCase.value;

  if (selectedOption.value === "encode") {
    let enmsg = encryptRailFence(inputTextValue, key);
    if (letterCaseValue == 1) {
      outputText.textContent = enmsg;
    } else if (letterCaseValue == 2) {
      outputText.textContent = enmsg.toLowerCase();
    } else if (letterCaseValue == 3) {
      outputText.textContent = enmsg.toUpperCase();
    }
  }

  if (selectedOption.value === "decode") {
    let dymsg = decryptRailFence(inputTextValue, key);
    if (letterCaseValue == 1) {
      outputText.textContent = dymsg;
    } else if (letterCaseValue == 2) {
      outputText.textContent = dymsg.toLowerCase();
    } else if (letterCaseValue == 3) {
      outputText.textContent = dymsg.toUpperCase();
    }
  }
});

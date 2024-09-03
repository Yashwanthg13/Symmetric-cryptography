// Get the element from DOM
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const alphabet = document.getElementById("alphabet-input");
const letterCase = document.getElementById("letter-case");

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
  let alphabetValue = alphabet.value;
  let letterCaseValue = letterCase.value;
// Utility function to create a mapping of characters to indices
function createCharMapping() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !?@#&*';
  let charToIndex = {};
  let indexToChar = [];

  for (let i = 0; i < alphabet.length; i++) {
      charToIndex[alphabet[i]] = i;
      indexToChar[i] = alphabet[i];
  }

  return { charToIndex, indexToChar, size: alphabet.length };
}

// Utility function to repeat the key to match the length of the message
function repeatKey(message, key) {
  let repeatedKey = key;
  while (repeatedKey.length < message.length) {
      repeatedKey += key;
  }
  return repeatedKey.slice(0, message.length);
}

// Function to encrypt a message using the Vigenère cipher
function vigenereEncrypt(message, key) {
  const { charToIndex, indexToChar, size } = createCharMapping();
  const repeatedKey = repeatKey(message, key);
  let encryptedMessage = '';

  for (let i = 0; i < message.length; i++) {
      let messageChar = message[i];
      let keyChar = repeatedKey[i];

      if (charToIndex.hasOwnProperty(messageChar) && charToIndex.hasOwnProperty(keyChar)) {
          let encryptedCharIndex = (charToIndex[messageChar] + charToIndex[keyChar]) % size;
          encryptedMessage += indexToChar[encryptedCharIndex];
      } else {
          encryptedMessage += messageChar; // Keep non-alphabetic characters unchanged
      }
  }

  return encryptedMessage;
}

// Function to decrypt a message using the Vigenère cipher
function vigenereDecrypt(message, key) {
  const { charToIndex, indexToChar, size } = createCharMapping();
  const repeatedKey = repeatKey(message, key);
  let decryptedMessage = '';

  for (let i = 0; i < message.length; i++) {
      let messageChar = message[i];
      let keyChar = repeatedKey[i];

      if (charToIndex.hasOwnProperty(messageChar) && charToIndex.hasOwnProperty(keyChar)) {
          let decryptedCharIndex = (charToIndex[messageChar] - charToIndex[keyChar] + size) % size;
          decryptedMessage += indexToChar[decryptedCharIndex];
      } else {
          decryptedMessage += messageChar; // Keep non-alphabetic characters unchanged
      }
  }

  return decryptedMessage;
}

  if(selectedOption.value =="encode"){
    let enmsg=vigenereEncrypt(inputTextValue,alphabetValue);
    if(letterCaseValue==1){
      outputText.textContent=enmsg;
    }
    else if (letterCaseValue == 2) {
      outputText.textContent=enmsg.toLowerCase();
    }
    // Change the letters to uppercase
    else if (letterCaseValue == 3) {
      outputText.textContent=enmsg.toUpperCase();
    }
    if(foreignCharsValue==1){
      outputText.textContent=removeForeignChars(enmsg);
    }
}
if(selectedOption.value =="decode"){
    let dymsg=vigenereDecrypt(inputTextValue,alphabetValue);
    if(letterCaseValue==1){
      outputText.textContent=dymsg;
    }
    else if (letterCaseValue == 2) {
      outputText.textContent=dymsg.toLowerCase();
    }
    // Change the letters to uppercase
    else if (letterCaseValue == 3) {
      outputText.textContent=dymsg.toUpperCase();
    }}
});

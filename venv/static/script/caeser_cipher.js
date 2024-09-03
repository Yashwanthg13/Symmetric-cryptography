// Get the element from DOM
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKey = document.getElementById("shift-input");
const modulo = document.getElementById("mod-input");
const alphabet = document.getElementById("alphabet-input");
const letterCase = document.getElementById("letter-case");

// Change heading and clear content based on selection
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

// Perform Caesar cipher on form submit
form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  let inputTextValue = inputText.value; // Get input text value
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  ); // Find selected option
  let shiftValue = parseInt(shiftKey.value); // Get shift value
  let moduloValue = parseInt(modulo.value); // Get modulo value
  let alphabetValue = alphabet.value; // Get alphabet value
  let letterCaseValue = letterCase.value; // Get letter case value

  // Caesar cipher function
  function caesarCipher(decode, text, shift, mod, charset, foreignChars) {
    if (decode == "decode") {
      shift = -shift; // Reverse shift for decoding
    }
    charset = charset.toLowerCase(); 
    let result = ""; 
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i);
      const index = charset.indexOf(char.toLowerCase()); // Find index
      if (index !== -1) {
        let newIndex = (index + shift) % mod; // Compute new index
        if (newIndex < 0) {
          newIndex += mod; // Adjust negative index
        }
        char =
          char === char.toLowerCase()
            ? charset[newIndex]
            : charset[newIndex].toUpperCase(); // Case adjustment
      }
      result += char; // Append to result
    }
    return result; // Return result
  }

  let cipherOutput = caesarCipher(
    selectedOption.value,
    inputTextValue,
    shiftValue,
    moduloValue,
    alphabetValue,
  ); // Get cipher output

  if (letterCaseValue == 2) {
    cipherOutput = cipherOutput.toLowerCase(); // Convert to lowercase
  } else if (letterCaseValue == 3) {
    cipherOutput = cipherOutput.toUpperCase(); // Convert to uppercase
  }

  outputText.textContent = cipherOutput; //  output
});

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
    (option) => option.checked);
  let alphabetValue = alphabet.value;
  let letterCaseValue = letterCase.value;



// Replace padding 'X' with space

 // Utility function to remove duplicates from a string
function removeDuplicates(str) {
    let result = "";
    let seen = new Set();
    for (let char of str) {
      if (!seen.has(char)) {
        result += char;
        seen.add(char);
      }
    }
    return result;
  }
  
  // Utility function to prepare the key square
  function prepareKeySquare(keyword) {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
    keyword = keyword.toUpperCase().replace(/J/g, 'I').replace(/ /g, '');
    let keySquare = removeDuplicates(keyword + alphabet);
    let matrix = [];
    for (let i = 0; i < 6; i++) {
      matrix.push(keySquare.slice(i * 6, (i + 1) * 6).split(''));
    }
    return matrix;
  }
  
  // Utility function to find the position of a character in the key square
  function findPosition(matrix, char) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === char) {
          return { row, col };
        }
      }
    }
    return null;
  }
  
  // Utility function to preprocess the plaintext and handle special symbols
  function preprocessText(text) {
    text = text.toUpperCase().replace(/J/g, 'I');
    let processedText = "";
    for (let char of text) {
      if (/[A-Z0-9]/.test(char)) {
        processedText += char;
      } else {
        processedText += char; // Keep special symbols as they are
      }
    }
    if (processedText.length % 2 !== 0) {
      processedText += 'X'; // Add padding character if necessary
    }
    return processedText;
  }
  
  // Utility function to create pairs from the text
  function createPairs(text) {
    let pairs = [];
    let buffer = '';
  
    for (let char of text) {
      if (/[A-Z0-9]/.test(char)) {
        buffer += char;
        if (buffer.length === 2) {
          pairs.push(buffer);
          buffer = '';
        }
      } else {
        if (buffer.length === 1) {
          buffer += 'X';
          pairs.push(buffer);
          buffer = '';
        }
        pairs.push(char); // Keep special symbols unchanged
      }
    }
    if (buffer.length === 1) {
      buffer += 'X';
      pairs.push(buffer);
    }
    return pairs;
  }
  
  // Encryption function
  function playfairEncrypt(plaintext, keyword) {
    const matrix = prepareKeySquare(keyword);
    const pairs = createPairs(preprocessText(plaintext));
    let ciphertext = "";
  
    for (let pair of pairs) {
      if (pair.length === 2 && /^[A-Z0-9]{2}$/.test(pair)) {
        let a = pair[0];
        let b = pair[1];
        let posA = findPosition(matrix, a);
        let posB = findPosition(matrix, b);
  
        if (posA.row === posB.row) {
          ciphertext += matrix[posA.row][(posA.col + 1) % 6];
          ciphertext += matrix[posB.row][(posB.col + 1) % 6];
        } else if (posA.col === posB.col) {
          ciphertext += matrix[(posA.row + 1) % 6][posA.col];
          ciphertext += matrix[(posB.row + 1) % 6][posB.col];
        } else {
          ciphertext += matrix[posA.row][posB.col];
          ciphertext += matrix[posB.row][posA.col];
        }
      } else {
        ciphertext += pair; // Keep special symbols unchanged
      }
    }
  
    return ciphertext;
  }
  
  // Decryption function
  function playfairDecrypt(ciphertext, keyword) {
    const matrix = prepareKeySquare(keyword);
    const pairs = createPairs(ciphertext);
    let plaintext = "";
  
    for (let pair of pairs) {
      if (pair.length === 2 && /^[A-Z0-9]{2}$/.test(pair)) {
        let a = pair[0];
        let b = pair[1];
        let posA = findPosition(matrix, a);
        let posB = findPosition(matrix, b);
  
        if (posA.row === posB.row) {
          plaintext += matrix[posA.row][(posA.col + 5) % 6];
          plaintext += matrix[posB.row][(posB.col + 5) % 6];
        } else if (posA.col === posB.col) {
          plaintext += matrix[(posA.row + 5) % 6][posA.col];
          plaintext += matrix[(posB.row + 5) % 6][posB.col];
        } else {
          plaintext += matrix[posA.row][posB.col];
          plaintext += matrix[posB.row][posA.col];
        }
      } else {
        plaintext += pair; // Keep special symbols unchanged
      }
    }
  
    // Remove padding character 'X' if it was added
    if (plaintext.endsWith('X')) {
      plaintext = plaintext.slice(0, -1);
    }
    return plaintext;
  }
  

  if(selectedOption.value =="encode"){
    let enmsg=playfairEncrypt(inputTextValue, alphabetValue);
    if(letterCaseValue == 1){
       outputText.textContent=enmsg.toUpperCase();
    }
    else if (letterCaseValue == 2) {
      outputText.textContent=enmsg.toLowerCase();
    }
}
  if(selectedOption.value =="decode"){
    let dymsg=playfairDecrypt(inputTextValue, alphabetValue);
    if(letterCaseValue == 1){
       outputText.textContent=dymsg.toUpperCase().replace(/[X]/g,"");
    }
    else if (letterCaseValue == 2){
      outputText.textContent=dymsg.toLowerCase().replace(/[x]/g,"");
    }
}
});


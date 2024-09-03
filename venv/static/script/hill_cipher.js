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

  const inputTextValue = inputText.value;
  let letterCaseValue = letterCase.value;
  const selectedOption = Array.from(selectEncodeOrDecode).find(option => option.checked);
  const key = alphabet.value.split(',').map(Number);

  if (key.length !== 4 || key.some(isNaN)) {
    alert('Please enter exactly 4 numbers separated by commas for the key.');
    return;
  }

  // Check if the key matrix is invertible
  if (!isInvertible(createMatrix(key))) {
    alert('The key matrix is not invertible. Please use a different key.');
    return;
  }

  if (selectedOption.value === "encode") {
    const enmsg = encrypt(inputTextValue, key);
    if (letterCaseValue == 1) {
        outputText.textContent=enmsg.toLowerCase();
      }
      // Change the letters to uppercase
      else if (letterCaseValue == 2) {
        outputText.textContent=enmsg.toUpperCase();
      }
  } 
   if (selectedOption.value === "decode") {
    const dymsg = decrypt(inputTextValue, key);
    if (letterCaseValue == 1) {
        outputText.textContent=dymsg.toLowerCase();
      }
      // Change the letters to uppercase
      else if (letterCaseValue == 2) {
        outputText.textContent=dymsg.toUpperCase();
      }
  }
});

// Helper functions
function createMatrix(array) {
  return [
    [array[0], array[1]],
    [array[2], array[3]]
  ];
}

function multiplyMatrices(a, b) {
  return [
    [
      (a[0][0] * b[0][0] + a[0][1] * b[1][0]) % 26,
      (a[0][0] * b[0][1] + a[0][1] * b[1][1]) % 26
    ],
    [
      (a[1][0] * b[0][0] + a[1][1] * b[1][0]) % 26,
      (a[1][0] * b[0][1] + a[1][1] * b[1][1]) % 26
    ]
  ];
}

function modInverse(a, mod) {
  a = a % mod;
  for (let x = 1; x < mod; x++) {
    if ((a * x) % mod === 1) {
      return x;
    }
  }
  return -1; // Should not happen for valid inputs
}

function inverseMatrix(matrix) {
  const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
  const detInv = modInverse(det, 26);

  return [
    [
      (matrix[1][1] * detInv + 26) % 26,
      (-matrix[0][1] * detInv + 26) % 26
    ],
    [
      (-matrix[1][0] * detInv + 26) % 26,
      (matrix[0][0] * detInv + 26) % 26
    ]
  ];
}

function charToPos(char) {
  return char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}

function posToChar(pos, originalChar) {
  return String.fromCharCode(pos + 'A'.charCodeAt(0));
}

function filterText(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

function encrypt(plaintext, key) {
  const keyMatrix = createMatrix(key);
  const filteredText = filterText(plaintext);
  const paddedText = filteredText.padEnd(Math.ceil(filteredText.length / 2) * 2, 'X');
  
  const cipherText = [];
  for (let i = 0; i < paddedText.length; i += 2) {
    const ptMatrix = [
      [charToPos(paddedText[i])],
      [charToPos(paddedText[i + 1])]
    ];
    
    const encryptedMatrix = multiplyMatrices(keyMatrix, ptMatrix);
    cipherText.push(posToChar(encryptedMatrix[0][0], paddedText[i]));
    cipherText.push(posToChar(encryptedMatrix[1][0], paddedText[i + 1]));
  }
  
  return cipherText.join('');
}

function decrypt(ciphertext, key) {
  const keyMatrix = createMatrix(key);
  const inverseKeyMatrix = inverseMatrix(keyMatrix);
  
  const filteredText = filterText(ciphertext);
  const plainText = [];
  for (let i = 0; i < filteredText.length; i += 2) {
    const ctMatrix = [
      [charToPos(filteredText[i])],
      [charToPos(filteredText[i + 1])]
    ];
    
    const decryptedMatrix = multiplyMatrices(inverseKeyMatrix, ctMatrix);
    plainText.push(posToChar(decryptedMatrix[0][0], filteredText[i]));
    plainText.push(posToChar(decryptedMatrix[1][0], filteredText[i + 1]));
  }
  
  return plainText.join('').replace(/X+$/, ''); // Remove padding
}

function isInvertible(matrix) {
  const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
  return modInverse(det, 26) !== -1;
}
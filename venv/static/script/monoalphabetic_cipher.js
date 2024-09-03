// Get the element from DOM
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");

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

// When the click submit it will perform caesar cipher
form.addEventListener("submit", (event) => {
  event.preventDefault();

  let inputTextValue = inputText.value;
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  );
  function createMonoalphabeticCipherKey() {
    return {
       A: 'Q',
       B: 'W',
       C: 'E',
       D: 'R',
       E: 'T',
       F: 'Y',
       G: 'U',
       H: 'I',
       I: 'O',
       J: 'P',
       K: 'A',
       L: 'S',
       M: 'D',
       N: 'F',
       O: 'G',
       P: 'H',
       Q: 'J',
       R: 'K',
       S: 'L',
       T: 'Z',
       U: 'X',
       V: 'C',
       W: 'V',
       X: 'B',
       Y: 'N',
       Z: 'M',
       a: 'x',
       b: 'y',
       c: 'r',
       d: 'v',
       e: 'a',
       f: 'h',
       g: 't',
       h: 'i',
       i: 'j',
       j: 's',
       k: 'c',
       l: 'l',
       m: 'q',
       n: 'g',
       o: 'e',
       p: 'm',
       q: 'o',
       r: 'b',
       s: 'z',
       t: 'n',
       u: 'p',
       v: 'u',
       w: 'f',
       x: 'd',
       y: 'k',
       z: 'w',
       1:4,
       2:5,
       3:6,
       4:7,
       5:8,
       6:9,
       7:"0",
       8:1,
       9:2,
       0:3,
     };
   }
   cpKey= createMonoalphabeticCipherKey();
    function monoalphabeticCipherEncrypt(message, cipherKey) {
       let encryptedMessage = '';
       for (let i = 0; i < message.length; i++) {
           let char = message[i]; // Convert to uppercase for simplicity
           if (cipherKey[char]) {
               encryptedMessage += cipherKey[char];
           } else {
               encryptedMessage += char; // Non-alphabetic characters remain unchanged
           }
       }
       return encryptedMessage;
   }

   function createDecryptionKey(cipherKey) {
    let decryptionKey = {};
    for (let char in cipherKey) {
        if (cipherKey.hasOwnProperty(char)) {
            decryptionKey[cipherKey[char]] = char;
        }
    }
    return decryptionKey;
}
   function monoalphabeticCipherDecrypt(encryptedMessage, decryptionKey) {
    let decryptedMessage = '';
    for (let i = 0; i < encryptedMessage.length; i++) {
        let char = encryptedMessage[i]; // Convert to uppercase for simplicity
        if (decryptionKey[char]) {
            decryptedMessage += decryptionKey[char];
        } else {
            decryptedMessage += char; // Non-alphabetic characters remain unchanged
        }
    }
    return decryptedMessage;
}
   if(selectedOption.value =="encode"){
    let enmsg=monoalphabeticCipherEncrypt(inputTextValue, cpKey);
      outputText.textContent=enmsg;
}
if(selectedOption.value =="decode"){
    let dyKey=createDecryptionKey(cpKey);
    let dymsg=monoalphabeticCipherDecrypt(inputTextValue, dyKey);
      outputText.textContent=dymsg;
}
});

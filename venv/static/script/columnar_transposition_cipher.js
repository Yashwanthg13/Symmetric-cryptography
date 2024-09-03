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
// Encryption
function encryptMessage(msg, key) {
    let cipher = "";

    // Track key indices
    let k_indx = 0;

    const msg_len = msg.length;
    const msg_lst = Array.from(msg);
    const key_lst = Array.from(key).sort();

    // Calculate number of columns
    const col = key.length;

    // Calculate number of rows
    const row = Math.ceil(msg_len / col);

    // Add padding character '_' to fill the empty cells in the matrix
    const fill_null = (row * col) - msg_len;
    for (let i = 0; i < fill_null; i++) {
        msg_lst.push('_');
    }

    // Create matrix and insert message and padding characters row-wise
    const matrix = [];
    for (let i = 0; i < msg_lst.length; i += col) {
        matrix.push(msg_lst.slice(i, i + col));
    }

    // Read matrix column-wise using key
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);
        for (const row of matrix) {
            cipher += row[curr_idx];
        }
        k_indx++;
    }

    return cipher;
}

// Decryption
function decryptMessage(cipher, key) {
    let msg = "";

    // Track key indices
    let k_indx = 0;

    // Track message indices
    let msg_indx = 0;
    const msg_len = cipher.length;
    const msg_lst = Array.from(cipher);

    // Calculate number of columns
    const col = key.length;

    // Calculate number of rows
    const row = Math.ceil(msg_len / col);

    // Convert key into list and sort alphabetically
    const key_lst = Array.from(key).sort();

    // Create an empty matrix to store the deciphered message
    const dec_cipher = [];
    for (let i = 0; i < row; i++) {
        dec_cipher.push(Array(col).fill(null));
    }

    // Arrange the matrix column-wise according to permutation order by adding into a new matrix
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);

        for (let j = 0; j < row; j++) {
            dec_cipher[j][curr_idx] = msg_lst[msg_indx];
            msg_indx++;
        }
        k_indx++;
    }

    // Convert decrypted message matrix into a string
    msg = dec_cipher.flat().join('');

    // Remove padding characters
    return msg.replace(/_+$/, '');
}
  if(selectedOption.value =="encode"){
    let enmsg=encryptMessage(inputTextValue,alphabetValue);
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
}
if(selectedOption.value =="decode"){
    let dymsg=decryptMessage(inputTextValue,alphabetValue);
    if(letterCaseValue==1){
      outputText.textContent=dymsg;
    }
    else if (letterCaseValue == 2) {
      outputText.textContent=dymsg.toLowerCase();
    }
    // Change the letters to uppercase
    else if (letterCaseValue == 3) {
      outputText.textContent=dymsg.toUpperCase();
    }
}
});

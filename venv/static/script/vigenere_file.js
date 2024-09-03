document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

let originalContent = '';
let processedContent = '';

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      originalContent = e.target.result;
      document.getElementById('fileContent').value = originalContent;
      document.getElementById('fileSize').textContent = file.size;
      document.getElementById('downloadButton').style.display = 'none';
    };
    reader.readAsText(file);
  }
}
function encryptFile() {
  const key = document.getElementById('key').value;
  if (key) {
    processedContent = vigenereCipher(originalContent, key, true);
    document.getElementById('fileContent').value = processedContent;
    document.getElementById('downloadButton').style.display = 'inline';
  } else {
    alert('Please enter a key for encryption.');
  }
} 
function decryptFile() {
  const key = document.getElementById('key').value;
  if (key) {
    processedContent = vigenereCipher(processedContent, key, false);
    document.getElementById('fileContent').value = processedContent;
    document.getElementById('downloadButton').style.display = 'inline';
  } else {
    alert('Please enter a key for decryption.');
  }
}

function downloadFile() {
  const blob = new Blob([processedContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function vigenereCipher(text, key, encrypt = true) {
  key = key.toUpperCase().replace(/[^A-Z]/g, ''); // Clean the key
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-zA-Z]/)) {
      const charCode = text.charCodeAt(i);
      const isUpperCase = (charCode >= 65 && charCode <= 90);
      const isLowerCase = (charCode >= 97 && charCode <= 122);
      const base = isUpperCase ? 65 : 97;
      const keyCharCode = key.charCodeAt(keyIndex % key.length) - 65;
      const offset = encrypt ? keyCharCode : -keyCharCode;
      if (isUpperCase || isLowerCase) {
        const newCharCode = ((charCode - base + offset + 26) % 26) + base;
        result += String.fromCharCode(newCharCode);
        keyIndex++;
      }
    } else {
      result += char;
    }
  }
  return result;
}

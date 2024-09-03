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
  const numRails = parseInt(key, 10);
  if (key && numRails > 1) {
    processedContent = railFenceCipher(originalContent, numRails, true);
    document.getElementById('fileContent').value = processedContent;
    document.getElementById('downloadButton').style.display = 'inline';
  } else {
    alert('Please enter a valid number of rails for encryption.');
  }
}

function decryptFile() {
  const key = document.getElementById('key').value;
  const numRails = parseInt(key, 10);
  if (key && numRails > 1) {
    processedContent = railFenceCipher(processedContent, numRails, false);
    document.getElementById('fileContent').value = processedContent;
    document.getElementById('downloadButton').style.display = 'inline';
  } else {
    alert('Please enter a valid number of rails for decryption.');
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

function railFenceCipher(text, numRails, encrypt = true) {
  if (numRails === 1) return text;
  const railFence = Array.from({ length: numRails }, () => []);
  let direction = 1;
  let rail = 0;

  if (encrypt) {
    for (const char of text) {
      railFence[rail].push(char);
      rail += direction;
      if (rail === numRails - 1 || rail === 0) direction *= -1;
    }
    return railFence.flat().join('');
  } else {
    const zigzagPattern = Array.from({ length: text.length }, () => 0);
    for (let i = 0, r = 0, dir = 1; i < text.length; i++) {
      zigzagPattern[i] = r;
      r += dir;
      if (r === numRails - 1 || r === 0) dir *= -1;
    }
    const railIndices = Array.from({ length: numRails }, () => []);
    zigzagPattern.forEach((r, i) => railIndices[r].push(i));
    const decryptedArray = Array(text.length);
    let charIndex = 0;
    railIndices.forEach(indices => {
      indices.forEach(index => {
        decryptedArray[index] = text[charIndex];
        charIndex++;
      });
    });
    return decryptedArray.join('');
  }
}
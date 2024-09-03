// Add event listener for file input change
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

let originalContent = ''; // Store original file content
let processedContent = ''; // Store encrypted/decrypted content

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      originalContent = e.target.result; // Set original content
      document.getElementById('fileContent').value = originalContent; // Display content
      document.getElementById('fileSize').textContent = file.size; // Show file size
      document.getElementById('downloadButton').style.display = 'none'; // Hide download button
    };
    reader.readAsText(file); // Read file as text
  }
}

// Encrypt file content
function encryptFile() {
  const key = document.getElementById('key').value; // Get encryption key
  if (key) {
    processedContent = columnarTranspositionCipher(originalContent, key, true); // Encrypt content
    document.getElementById('fileContent').value = processedContent; // Display encrypted content
    document.getElementById('downloadButton').style.display = 'inline'; // Show download button
  } else {
    alert('Please enter a key for encryption.'); // Alert if no key
  }
}

// Decrypt file content
function decryptFile() {
  const key = document.getElementById('key').value; // Get decryption key
  if (key) {
    processedContent = columnarTranspositionCipher(processedContent, key, false); // Decrypt content
    document.getElementById('fileContent').value = processedContent; // Display decrypted content
    document.getElementById('downloadButton').style.display = 'inline'; // Show download button
  } else {
    alert('Please enter a key for decryption.'); // Alert if no key
  }
}

// Download file
function downloadFile() {
  const blob = new Blob([processedContent], { type: 'text/plain' }); // Create a blob with content
  const url = URL.createObjectURL(blob); // Create a URL for the blob
  const a = document.createElement('a'); // Create an anchor element
  a.href = url; // Set URL as href
  a.download = 'output.txt'; // Set download file name
  document.body.appendChild(a); // Append anchor to body
  a.click(); // Trigger download
  document.body.removeChild(a); // Remove anchor from body
  URL.revokeObjectURL(url); // Revoke URL
}

// Columnar transposition cipher
function columnarTranspositionCipher(text, key, encrypt = true) {
  const numCols = key.length; // Number of columns
  const numRows = Math.ceil(text.length / numCols); // Number of rows
  const filledCells = numCols * numRows; // Total cells
  const filler = ' '; // Filler character
  
  let grid = Array.from({ length: numRows }, () => Array(numCols).fill(filler)); // Create grid
  if (encrypt) {
    let charIndex = 0; // Initialize character index
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        grid[r][c] = text[charIndex] || filler; // Fill grid with text
        charIndex++;
      }
    }
    
    const orderedCols = getColumnOrder(key); // Get column order
    let result = ''; // Initialize result
    for (let c = 0; c < numCols; c++) {
      const col = orderedCols.indexOf(c); // Get column index
      for (let r = 0; r < numRows; r++) {
        result += grid[r][col]; // Append column data to result
      }
    }
    return result; // Return encrypted text
  } else {
    const orderedCols = getColumnOrder(key); // Get column order
    let charIndex = 0; // Initialize character index
    for (let c = 0; c < numCols; c++) {
      const col = orderedCols.indexOf(c); // Get column index
      for (let r = 0; r < numRows; r++) {
        grid[r][col] = text[charIndex] || filler; // Fill grid with text
        charIndex++;
      }
    }
    
    let result = ''; // Initialize result
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        result += grid[r][c]; // Append row data to result
      }
    }
    return result.trim(); // Return decrypted text
  }
}

// Get column order from key
function getColumnOrder(key) {
  const keyArr = key.split(''); // Convert key to array
  const sortedKey = [...keyArr].sort(); // Sort key characters
  return keyArr.map(char => sortedKey.indexOf(char)); // Map key to column order
}

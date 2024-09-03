// Function to preprocess text
function preprocessText(text) {
    text = text.toUpperCase().replace(/J/g, "I");
    return text;
}

// Function to generate the Playfair cipher key table
function generateKeyTable(key) {
    key = key.toUpperCase().replace(/[^A-Z]/g, "");
    let keySet = new Set(key);
    key = [...keySet].join("");
    
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let keyTable = key;
    for (let char of alphabet) {
        if (!keyTable.includes(char)) {
            keyTable += char;
        }
    }
    
    return keyTable;
}

// Function to create digraphs
function createDigraphs(plaintext) {
    let digraphs = [];
    let i = 0;
    while (i < plaintext.length) {
        let first = plaintext[i];
        let second = plaintext[i + 1];
        if (!second || first === second) {
            digraphs.push(first + 'X');
            i++;
        } else {
            digraphs.push(first + second);
            i += 2;
        }
    }
    return digraphs;
}

// Function to find the positions of characters in the key table
function findPositions(keyTable, char) {
    let positions = [];
    for (let i = 0; i < keyTable.length; i++) {
        if (keyTable[i] === char) {
            positions.push(i);
        }
    }
    return positions;
}

// Encrypt function
function encrypt(plaintext, key) {
    plaintext = preprocessText(plaintext);
    let keyTable = generateKeyTable(key);
    let digraphs = createDigraphs(plaintext);
    let ciphertext = "";
    
    for (let digraph of digraphs) {
        let firstChar = digraph.charAt(0);
        let secondChar = digraph.charAt(1);
        
        let firstPos = findPositions(keyTable, firstChar);
        let secondPos = findPositions(keyTable, secondChar);
        
        if (firstPos.length > 0 && secondPos.length > 0) {
            let row1 = Math.floor(firstPos[0] / 5);
            let col1 = firstPos[0] % 5;
            let row2 = Math.floor(secondPos[0] / 5);
            let col2 = secondPos[0] % 5;
            
            if (row1 === row2) {
                ciphertext += keyTable[row1 * 5 + (col1 + 1) % 5];
                ciphertext += keyTable[row2 * 5 + (col2 + 1) % 5];
            } else if (col1 === col2) {
                ciphertext += keyTable[((row1 + 1) % 5) * 5 + col1];
                ciphertext += keyTable[((row2 + 1) % 5) * 5 + col2];
            } else {
                ciphertext += keyTable[row1 * 5 + col2];
                ciphertext += keyTable[row2 * 5 + col1];
            }
        } else {
            ciphertext += firstChar + secondChar;
        }
    }
    
    return ciphertext;
}

// Decrypt function
function decrypt(ciphertext, key) {
    let keyTable = generateKeyTable(key);
    let plaintext = "";
    
    for (let i = 0; i < ciphertext.length; i += 2) {
        let firstChar = ciphertext.charAt(i);
        let secondChar = ciphertext.charAt(i + 1);
        
        let firstPos = findPositions(keyTable, firstChar);
        let secondPos = findPositions(keyTable, secondChar);
        
        if (firstPos.length > 0 && secondPos.length > 0) {
            let row1 = Math.floor(firstPos[0] / 5);
            let col1 = firstPos[0] % 5;
            let row2 = Math.floor(secondPos[0] / 5);
            let col2 = secondPos[0] % 5;
            
            if (row1 === row2) {
                plaintext += keyTable[row1 * 5 + (col1 + 4) % 5];
                plaintext += keyTable[row2 * 5 + (col2 + 4) % 5];
            } else if (col1 === col2) {
                plaintext += keyTable[((row1 + 4) % 5) * 5 + col1];
                plaintext += keyTable[((row2 + 4) % 5) * 5 + col2];
            } else {
                plaintext += keyTable[row1 * 5 + col2];
                plaintext += keyTable[row2 * 5 + col1];
            }
        } else {
            plaintext += firstChar + secondChar;
        }
    }
    
    plaintext = plaintext.replace(/([Xx])+/g, '');
    return plaintext;
}

// Function to handle file reading
function handleFile() {
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput.files.length) {
        alert('Please select a file.');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        document.getElementById('fileContent').value = e.target.result;
        document.getElementById('fileSize').textContent = file.size;
    };
    
    reader.readAsText(file);
}

// Function to handle file encryption
function encryptFile() {
    const key = document.getElementById('key').value;
    const fileContent = document.getElementById('fileContent').value;
    
    if (!key || !fileContent) {
        alert('Please provide a key and load a file.');
        return;
    }
    
    const ciphertext = encrypt(fileContent, key);
    document.getElementById('fileContent').value = ciphertext;
    enableDownload(ciphertext, 'output.txt');
}

// Function to handle file decryption
function decryptFile() {
    const key = document.getElementById('key').value;
    const fileContent = document.getElementById('fileContent').value;
    
    if (!key || !fileContent) {
        alert('Please provide a key and load a file.');
        return;
    }
    
    const plaintext = decrypt(fileContent, key);
    document.getElementById('fileContent').value = plaintext;
    enableDownload(plaintext, 'output.txt');
}

// Function to enable the download button and handle file download
function enableDownload(content, filename) {
    const downloadButton = document.getElementById('downloadButton');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    downloadButton.href = url;
    downloadButton.download = filename;
    downloadButton.style.display = 'inline-block';
}

// Function to handle file download
function downloadFile() {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.click();
}

// Attach event listener to file input
document.getElementById('fileInput').addEventListener('change', handleFile);

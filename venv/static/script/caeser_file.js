// Function to handle file selection and display its content
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const content = event.target.result;
        document.getElementById('fileContent').value = content; // Display file content in textarea
        document.getElementById('fileSize').textContent = file.size;
        document.getElementById('download-btn').style.display = 'none'; // Hide download button initially
    };
    reader.readAsText(file);
}

// Add event listener to file input to handle file selection
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// Encrypt file content using Caesar Cipher
function encryptFile() {
    const content = document.getElementById('fileContent').value;
    const shift = parseInt(document.getElementById('shiftKey').value);
    const encryptedContent = caesarCipher(content, shift);
    document.getElementById('fileContent').value = encryptedContent;
    document.getElementById('download-btn').style.display = 'inline-block';
}

// Decrypt file content using Caesar Cipher
function decryptFile() {
    const content = document.getElementById('fileContent').value;
    const shift = parseInt(document.getElementById('shiftKey').value);
    const decryptedContent = caesarCipher(content, -shift); // Use negative shift for decryption
    document.getElementById('fileContent').value = decryptedContent;
    document.getElementById('download-btn').style.display = 'inline-block';
}

// Download processed content as a text file
function downloadFile() {
    const content = document.getElementById('fileContent').value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Caesar Cipher function for encryption and decryption
function caesarCipher(text, shift) {
    return text.replace(/[a-zA-Z]/g, function(char) {
        let code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {  // Uppercase letters
            code = ((code - 65 + shift) % 26 + 26) % 26 + 65;
        } else if (code >= 97 && code <= 122) {  // Lowercase letters
            code = ((code - 97 + shift) % 26 + 26) % 26 + 97;
        }
        return String.fromCharCode(code);
    });
}

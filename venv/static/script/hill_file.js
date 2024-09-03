function readFile(input, callback) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        callback(event.target.result);
    };

    reader.readAsText(file);
}

function parseKeyMatrix(keyMatrixStr) {
    return keyMatrixStr.split(',').map(Number);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function encryptHillCipher(plaintext, keyMatrix) {
    let textVector = [];
    for (let i = 0; i < plaintext.length; i++) {
        textVector.push(plaintext.charCodeAt(i) - 97);
    }

    // Pad with 'x' (23) if necessary
    const paddingChar = 23; // 'x'
    if (textVector.length % 2 !== 0) {
        textVector.push(paddingChar); // Add padding character
    }

    let encryptedText = '';
    for (let i = 0; i < textVector.length; i += 2) {
        let subText = textVector.slice(i, i + 2);
        for (let row = 0; row < 2; row++) {
            let sum = 0;
            for (let col = 0; col < 2; col++) {
                sum += keyMatrix[row * 2 + col] * (subText[col] || 0);
            }
            encryptedText += String.fromCharCode(mod(sum, 26) + 97);
        }
    }

    return encryptedText;
}

function decryptHillCipher(ciphertext, keyMatrix) {
    const det = matrixDeterminant(keyMatrix);
    const invDet = modInverse(det, 26);
    if (invDet === null) {
        throw new Error("Key matrix is not invertible.");
    }
    const adjMatrix = matrixAdjugate(keyMatrix);
    const invMatrix = adjMatrix.map(x => mod(x * invDet, 26));

    let textVector = [];
    for (let i = 0; i < ciphertext.length; i++) {
        textVector.push(ciphertext.charCodeAt(i) - 97);
    }

    let decryptedText = '';
    for (let i = 0; i < textVector.length; i += 2) {
        let subText = textVector.slice(i, i + 2);
        for (let row = 0; row < 2; row++) {
            let sum = 0;
            for (let col = 0; col < 2; col++) {
                sum += invMatrix[row * 2 + col] * (subText[col] || 0);
            }
            decryptedText += String.fromCharCode(mod(sum, 26) + 97);
        }
    }

    // Remove padding character if it was added
    decryptedText = decryptedText.replace(/x*$/, '');

    return decryptedText;
}

function matrixDeterminant(matrix) {
    return matrix[0] * matrix[3] - matrix[1] * matrix[2];
}

function modInverse(a, m) {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null; // Return null if no modular inverse exists
}

function matrixAdjugate(matrix) {
    return [
        matrix[3], -matrix[1],
        -matrix[2], matrix[0]
    ];
}

function isMatrixInvertible(matrix) {
    const det = matrixDeterminant(matrix);
    return modInverse(det, 26) !== null;
}

function displayFileContent() {
    const fileInput = document.getElementById('fileInput');
    readFile(fileInput, (content) => {
        document.getElementById('fileContent').value = content;
        document.getElementById('fileSize').textContent = content.length;
    });
}

function encryptFile() {
    const fileInput = document.getElementById('fileInput');
    const keyMatrixStr = document.getElementById('keyMatrix').value;
    const keyMatrix = parseKeyMatrix(keyMatrixStr);

    if (!isMatrixInvertible(keyMatrix)) {
        alert("Key matrix is not invertible.");
        return;
    }

    readFile(fileInput, (content) => {
        const encryptedContent = encryptHillCipher(content.toLowerCase().replace(/[^a-z]/g, ''), keyMatrix);
        document.getElementById('fileContent').value = encryptedContent;
        document.getElementById('downloadButton').style.display = 'block';
        document.getElementById('fileSize').textContent = encryptedContent.length;
    });
}

function decryptFile() {
    const fileInput = document.getElementById('fileInput');
    const keyMatrixStr = document.getElementById('keyMatrix').value;
    const keyMatrix = parseKeyMatrix(keyMatrixStr);

    if (!isMatrixInvertible(keyMatrix)) {
        alert("Key matrix is not invertible.");
        return;
    }

    readFile(fileInput, (content) => {
        try {
            const decryptedContent = decryptHillCipher(content.toLowerCase().replace(/[^a-z]/g, ''), keyMatrix);
            document.getElementById('fileContent').value = decryptedContent;
            document.getElementById('downloadButton').style.display = 'block';
            document.getElementById('fileSize').textContent = decryptedContent.length;
        } catch (error) {
            alert(error.message);
        }
    });
}

function downloadFile() {
    const content = document.getElementById('fileContent').value;
    const link = document.createElement('a');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = 'output.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

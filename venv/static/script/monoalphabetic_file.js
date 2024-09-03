    // Monoalphabetic cipher key
    const cipherKey = {
        'a': 'Q', 'b': 'W', 'c': 'E', 'd': 'R', 'e': 'T', 'f': 'Y', 'g': 'U',
        'h': 'I', 'i': 'O', 'j': 'P', 'k': 'A', 'l': 'S', 'm': 'D', 'n': 'F',
        'o': 'G', 'p': 'H', 'q': 'J', 'r': 'K', 's': 'L', 't': 'Z', 'u': 'X',
        'v': 'C', 'w': 'V', 'x': 'B', 'y': 'N', 'z': 'M',
        'A': 'q', 'B': 'w', 'C': 'e', 'D': 'r', 'E': 't', 'F': 'y', 'G': 'u',
        'H': 'i', 'I': 'o', 'J': 'p', 'K': 'a', 'L': 's', 'M': 'd', 'N': 'f',
        'O': 'g', 'P': 'h', 'Q': 'j', 'R': 'k', 'S': 'l', 'T': 'z', 'U': 'x',
        'V': 'c', 'W': 'v', 'X': 'b', 'Y': 'n', 'Z': 'm'
      };

    document.getElementById('fileInput').addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            document.getElementById('fileContent').value = contents;
            document.getElementById('fileSize').innerText = file.size;
        };
        reader.readAsText(file);
    }

    function encryptFile() {
        const fileContent = document.getElementById('fileContent').value;
        if (!fileContent) {
            alert('Please upload a file.');
            return;
        }

        const encryptedContent = applyCipher(fileContent, cipherKey, true);
        document.getElementById('fileContent').value = encryptedContent;
        document.getElementById('download-btn').style.display = 'inline';
    }

    function decryptFile() {
        const fileContent = document.getElementById('fileContent').value;
        if (!fileContent) {
            alert('Please upload a file.');
            return;
        }

        const decryptedContent = applyCipher(fileContent, cipherKey, false);
        document.getElementById('fileContent').value = decryptedContent;
        document.getElementById('download-btn').style.display = 'inline';
    }

    function downloadFile() {
        const fileContent = document.getElementById('fileContent').value;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    function applyCipher(text, cipher, encrypt) {
        const reverseCipher = Object.fromEntries(Object.entries(cipher).map(([k, v]) => [v, k]));
        return text.split('').map(char => {
            if (encrypt) {
                return cipher[char] || char;
            } else {
                return reverseCipher[char] || char;
            }
        }).join('');
    }
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const contents = e.target.result;
        document.getElementById('fileContent').value = contents; // Display
        document.getElementById('fileSize').innerText = file.size; // Size
    };
    reader.readAsText(file); // Read
}

async function getKeyMaterial(key) {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        'raw',
        enc.encode(key),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey'] // Key
    );
}

async function getKey(keyMaterial, salt) {
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256' // Hash
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'] // Key
    );
}

async function encryptFile() {
    const key = document.getElementById('key').value;
    const fileContent = document.getElementById('fileContent').value;
    if (!key || !fileContent) {
        alert('Please provide a key and upload a file.'); // Alert
        return;
    }

    const keyMaterial = await getKeyMaterial(key);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const aesKey = await getKey(keyMaterial, salt);

    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        enc.encode(fileContent) // Encrypt
    );

    const encryptedArray = new Uint8Array(encryptedContent);
    const combinedArray = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combinedArray.set(salt); // Salt
    combinedArray.set(iv, salt.length); // IV
    combinedArray.set(encryptedArray, salt.length + iv.length); // Encrypted

    const base64String = btoa(String.fromCharCode(...combinedArray));
    document.getElementById('fileContent').value = base64String; // Encode
    document.getElementById('downloadButton').style.display = 'inline'; // Show
    document.getElementById('downloadButton').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(base64String); // Link
}

async function decryptFile() {
    const key = document.getElementById('key').value;
    const fileContent = document.getElementById('fileContent').value;
    if (!key || !fileContent) {
        alert('Please provide a key and upload a file.'); // Alert
        return;
    }

    const combinedArray = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
    const salt = combinedArray.slice(0, 16); // Salt
    const iv = combinedArray.slice(16, 28); // IV
    const encryptedContent = combinedArray.slice(28); // Encrypted

    const keyMaterial = await getKeyMaterial(key);
    const aesKey = await getKey(keyMaterial, salt);

    const decryptedContent = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        encryptedContent // Decrypt
    );

    const dec = new TextDecoder();
    const decryptedText = dec.decode(decryptedContent);
    document.getElementById('fileContent').value = decryptedText; // Display
    document.getElementById('downloadButton').style.display = 'inline'; // Show
    document.getElementById('downloadButton').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(decryptedText); // Link
}

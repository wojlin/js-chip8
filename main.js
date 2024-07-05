import { CHIP8 } from './chip8.js';

var chip8 = null;
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const hexString = e.target.result;
            chip8 = new CHIP8(hexString, false, false);
            chip8.printMemory()
        };
        reader.readAsArrayBuffer(file);
    }
});

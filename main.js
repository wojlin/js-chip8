class CHIP8
{

    static DISPLAY_WIDTH = 64
    static DISPLAY_HEIGHT = 32

    static SPRITES_AMOUNT = 15
    static SPRITE_WIDTH = 8
    static SPRITE_HEIGHT = 15

    static REGISTERS_AMOUNT = 16
    static MEMORY_SIZE = 4096
    static NORMAL_START_POS = 512
    static ETI660_START_POS = 1536
    static FONT_START_POS = 90

    static CLOCK_SPEED = 60 // Hz

    static KEYBOARD_MAP = {
        "Numpad7": "1",
        "Numpad8": "2",
        "Numpad9": "3",
        "Numpad4": "4",
        "Numpad5": "5",
        "Numpad6": "6",
        "Numpad1": "7",
        "Numpad2": "8",
        "Numpad3": "9",
        "Numpad0": "0",
        "Insert": "A",
        "Home": "B",
        "PageUp": "C",
        "Delete": "D",
        "End": "E",
        "PageDown": "F",
    }

    constructor(data)
    {
        this.isPlaying = false;

        this.data = new Uint8Array(data)
        this.memory = new Uint8Array(CHIP8.MEMORY_SIZE) // 4096 cells of 8 bits
        this.vRegisters = new Uint8Array(CHIP8.REGISTERS_AMOUNT) // 16 cells of 8 bits
        this.iRegister = new Uint16Array(1); // 16 bits
        this.delayTimer = new Uint8Array(1) // 8 bits
        this.soundTimer = new Uint8Array(1) // 8 bits
        this.programCounter = new Uint16Array(1) // 16 bits
        this.stack = new Uint16Array(16) // 16 bits
        this.stackPointer = new Uint8Array(1) // 8 bits
        this.display = this.createDisplay()

        this.pushSpritesToMemory()

        this.setupSoundTimer();
        this.setupDelayTimer();

        this.printMemory();
        this.loadDataToMemory();
        this.programLoop();
        
    }


    printMemory()
    {
        let hex = ""
        for(let i = 0; i < this.data.length; i++)
        {
            hex += this.data[i].toString(16).padStart(2, '0').toLowerCase() + " "
        }
        console.log(hex)
    }

    loadDataToMemory()
    {
        for(let i = 0; i < this.data.length; i+=1)
        {
            const opcodeString = this.data[i].toString(16).padStart(2, '0').toLowerCase();
            this.memory[CHIP8.NORMAL_START_POS + i] = parseInt(opcodeString, 16)
        }
        this.programCounter[0] = CHIP8.NORMAL_START_POS
    }

    programLoop()
    {
        while(true)
        {

            const addr = this.programCounter[0]

            const opcode = this.memory[addr].toString(16) + this.memory[addr+1].toString(16)
            this.programCounter[0] += 2

            const opcodeString = opcode.toString(16).padStart(4, '0').toLowerCase();
            console.log(opcodeString)

            const nnnString = opcodeString.slice(1)
            const nString = opcodeString[3]
            const xString = opcodeString[1]
            const yString = opcodeString[2]
            const kkString = opcodeString.slice(2)

            const nnn = parseInt(nnnString, 16)
            const n = parseInt(nString, 16)
            const x = parseInt(xString, 16)
            const y = parseInt(yString, 16)
            const kk = parseInt(kkString, 16)

            console.log(opcodeString, nnnString, nString, xString, yString, kkString)

            switch(opcodeString) 
            {
                case '00e0': // Clear the display.
                    this.clearDisplay()
                    break;
                case '00ee': // Return from a subroutine.
                    this.programCounter[0] = this.stack[this.stack.length-1] // ?
                    this.stackPointer -= 1
                    //The interpreter sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.
                    break;
                case opcodeString[0] == '1': // Jump to location nnn.
                    this.programCounter[0] = parseInt(nnn, 16) // The interpreter sets the program counter to nnn.
                    break
                case opcodeString[0] == '2': // Call subroutine at nnn.
                    this.stackPointer+=1
                    this.stack[this.stack.length-1] = this.programCounter[0] // ?
                    this.programCounter[0] = nnn
                    // The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.
                    break
                case opcodeString[0] == '3': // Skip next instruction if Vx = kk.
                    if(this.vRegisters[x] == kk)
                    {
                        this.programCounter += 2 // ?
                    }
                    // The interpreter compares register Vx to kk,
                    // and if they are equal, increments the program counter by 2.
                    break
                case opcodeString[0] == '4': // Skip next instruction if Vx != kk.
                    if(this.vRegisters[x] != kk)
                    {
                        this.programCounter += 2 // ?
                    }
                    // The interpreter compares register Vx to kk, 
                    // and if they are not equal, increments the program counter by 2.
                    break
                case opcodeString[0] == '5' && opcodeString[3] == '0': // Skip next instruction if Vx = Vy.
                    if(this.vRegisters[x] == this.vRegisters[y])
                    {
                        this.programCounter += 2 // ?
                    }
                    // The interpreter compares register Vx to register Vy, and if they are equal, increments the program counter by 2.
                    break
                case opcodeString[0] == '6': // Set Vx = kk.
                    this.vRegisters[x] == kk
                    // The interpreter puts the value kk into register Vx.
                    break
                case opcodeString[0] == '7': // Set Vx = Vx + kk.
                    this.vRegisters[x] += kk
                    // Adds the value kk to the value of register Vx, then stores the result in Vx. 
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '0': // Set Vx = Vy.
                    this.vRegisters[x] = parseInt(this.vRegisters[y]) 
                    // Stores the value of register Vy in register Vx.
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '1': // Set Vx = Vx OR Vy.
                    this.vRegisters[x] = this.vRegisters[x] | this.vRegisters[y]
                    // Performs a bitwise OR on the values of Vx and Vy, then stores the result in Vx.
                    // A bitwise OR compares the corrseponding bits from two values,
                    // and if either bit is 1, then the same bit in the result is also 1. Otherwise, it is 0.
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '2': // Set Vx = Vx OR Vy.
                    this.vRegisters[x] = this.vRegisters[x] & this.vRegisters[y]
                    // Performs a bitwise AND on the values of Vx and Vy, 
                    // then stores the result in Vx. A bitwise AND compares the corrseponding bits from two values
                    // and if both bits are 1, then the same bit in the result is also 1. Otherwise, it is 0. 
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '3': // Set Vx = Vx XOR Vy.
                    this.vRegisters[x] = this.vRegisters[x] ^ this.vRegisters[y]
                    // Performs a bitwise exclusive OR on the values of Vx and Vy,
                    // then stores the result in Vx. An exclusive OR compares the corrseponding bits from two values,
                    // and if the bits are not both the same, then the corresponding bit in the result is set to 1. Otherwise, it is 0.
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '4': // Set Vx = Vx + Vy, set VF = carry.
                    const result = parseInt(this.vRegisters[x]) + parseInt(this.vRegisters[y])

                    this.vRegisters[this.vRegisters.length - 1] = 0
                    if(result > 255)
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 1
                    }

                    this.vRegisters[x] = result & 0xFF
                    // The values of Vx and Vy are added together. 
                    // If the result is greater than 8 bits (i.e., > 255,) VF is set to 1, otherwise 0.
                    // Only the lowest 8 bits of the result are kept, and stored in Vx
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '5': // Set Vx = Vx - Vy, set VF = NOT borrow.
                    this.vRegisters[this.vRegisters.length - 1] = 0
                    if(this.vRegisters[x] > this.vRegisters[y])
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 1
                    }
                    this.vRegisters[x] -= this.vRegisters[y]
                    //If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx, and the results stored in Vx.
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '6': // Set Vx = Vx SHR 1.
                    this.vRegisters[this.vRegisters.length - 1] = 0
                    if((this.vRegisters[x] & 1) === 1)
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 1
                    }
                    this.vRegisters[x] = this.vRegisters[x] / 2
                    // If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0. Then Vx is divided by 2.
                    break
                case opcodeString[0] == '8' && opcodeString[3] == '7': // Set Vx = Vy - Vx, set VF = NOT borrow.
                    this.vRegisters[this.vRegisters.length - 1] = 0
                    if(this.vRegisters[y] > this.vRegisters[x])
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 1
                    }
                    this.vRegisters[x] = this.vRegisters[x] - this.vRegisters[y]
                    // If Vy > Vx, then VF is set to 1, otherwise 0. 
                    // Then Vx is subtracted from Vy, and the results stored in Vx.
                    break
                case opcodeString[0] == '8' && opcodeString[3] == 'e': // Set Vx = Vx SHL 1
                    const x = this.vRegisters[x] & 0xFF;
                    this.vRegisters[this.vRegisters.length - 1] = 0
                    if((x >>> 7) === 1)
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 1
                    }
                    this.vRegisters[x] = this.vRegisters[x] * 2
                    //If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2.
                    break
                case opcodeString[0] == '9' && opcodeString[3] == '0': // Skip next instruction if Vx != Vy.
                    if(this.vRegisters[x] != this.vRegisters[y])
                    {
                        this.programCounter[0] += 2 // ?
                    }
                    //The values of Vx and Vy are compared, and if they are not equal, the program counter is increased by 2.
                    break
                case opcodeString[0] == 'a': // Set I = nnn.
                    this.iRegister[0] = nnn
                    // The value of register I is set to nnn.
                    break
                case opcodeString[0] == 'b': // Jump to location nnn + V0.
                    this.programCounter[0] = nnn + this.vRegisters[0]
                    // The program counter is set to nnn plus the value of V0.
                    break
                case opcodeString[0] == 'c': // Set Vx = random byte AND kk.
                    const random = Math.floor(Math.random() * 256);
                    this.vRegisters[x] = kk & random
                    // The interpreter generates a random number from 0 to 255,
                    // which is then ANDed with the value kk. The results are stored in Vx.
                    // See instruction 8xy2 for more information on AND.
                    break
                case opcodeString[0] == 'd': // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision
                    const bytesToRead = n
                    const startAddress = this.iRegister[0]

                    const xCoord = this.vRegisters[x]
                    const yCoord = this.vRegisters[y]

                    const touchedPixel = false

                    for(let i = 0; i < bytesToRead; i++)
                    {
                        let byte = this.memory[startAddress+i];
                        
                        if (byte >= 0) {
                            // Convert to binary and pad with leading zeros to make it 8 bits
                            byte = byte.toString(2).padStart(8, '0');
                        } else {
                            // Handle negative numbers using two's complement representation
                            const bits = 8; // Fixed to 8 bits for a whole byte
                            const mask = (1 << bits) - 1;
                            const bs = (byte & mask).toString(2);
                            byte = bs.padStart(8, '0');
                        }

                        for(let x = 0; x = CHIP8.SPRITE_WIDTH; x++)
                        {
                            if(this.getPixel(xCoord + x, yCoord))
                            {
                                this.setPixel(xCoord + x, yCoord, false)
                                touchedPixel = true
                            }
                            else
                            {
                                this.setPixel(xCoord + x, yCoord, true)
                            }
                            
                        }


                    }
                    
                    if(touchedPixel)
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 1
                    }else
                    {
                        this.vRegisters[this.vRegisters.length - 1] = 0
                    }
                    

                    // The interpreter reads n bytes from memory, starting at the address stored in I.
                    // These bytes are then displayed as sprites on screen at coordinates (Vx, Vy).
                    // Sprites are XORed onto the existing screen. 
                    // If this causes any pixels to be erased, VF is set to 1, otherwise it is set to 0.
                    // If the sprite is positioned so part of it is outside the coordinates of the display,
                    // it wraps around to the opposite side of the screen. 
                    break
                default:
                    console.error('unknown instruction:', opcodeString)
                    break
            }
            
            
            break
        }
    }

    setPixel(x, y, isOn)
    {
        const pixel = this.display.createImageData(1, 1);
        val = 0
        if(isOn)
        {
            val = 255
        }
        pixel.data[0] = val; // Red
        pixel.data[1] = val; // Green
        pixel.data[2] = val; // Blue
        pixel.data[3] = 255; // Alpha (opaque)

        const newX = x
        const newY = y

        if (x >=CHIP8.DISPLAY_WIDTH) {
            newX = x % CHIP8.DISPLAY_WIDTH
        } 

        if (y >=CHIP8.DISPLAY_HEIGHT) {
            newX = y % CHIP8.DISPLAY_HEIGHT
        } 
        this.display.putImageData(pixel, newX, newY);
    }

    getPixel(x, y)
    {
        const imageData = this.display.getImageData(x, y, 1, 1);
        const data = imageData.data;
        const r = data[0];
        const g = data[1];
        const b = data[2];
        const a = data[3];
        if(r == 255 && g == 255 && b == 255)
        {
            return true
        }else
        {
            return false
        }
    }

    setSoundTimer(value)
    {
        this.soundTimer[0] = value
    }

    setDelayTimer(value)
    {
        this.delayTimer[0] = value
    }

    setupSoundTimer()
    {
        console.log(this.soundTimer[0], this.isPlaying)

        if(this.soundTimer[0] > 0)
        {
            this.soundTimer[0] -= 1;    
            if(this.isPlaying == false)
            {
                this.speaker = this.createSpeaker();
                this.isPlaying = true;
            }   
        }else
        {
            if(this.isPlaying == true)
            {
                this.isPlaying = false;
                this.speaker.stop();    
            }
        }
       
    
        setTimeout(() => {
            this.setupSoundTimer();
        }, 1000/CHIP8.CLOCK_SPEED);
    }

    setupDelayTimer()
    {
        if(this.delayTimer > 0)
        {
            this.delayTimer -= 1;
        }
    
        setTimeout(() => {
            this.setupDelayTimer();
        }, 1000/CHIP8.CLOCK_SPEED);
    }




    createSpeaker()
    {
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.speaker = audioContext.createOscillator();
        this.speaker.type = 'square';
        this.speaker.frequency.value = 440; 
        this.speaker.connect(audioContext.destination);
        this.speaker.start();
        return this.speaker
    }

    playTone(length)
    {
        this.soundTimer[0] = length*60
    }


    pushSpritesToMemory()
    {
        let startPos = CHIP8.FONT_START_POS;
        let sprites = [0xF0,0x90,0x90,0x90,0xF0, // "0"
                       0x20,0x60,0x20,0x20,0x70, // "1"
                       0xF0,0x10,0xF0,0x80,0xF0, // "2"
                       0xF0,0x10,0xF0,0x10,0xF0, // "3"
                       0x90,0x90,0xF0,0x10,0x10, // "4"
                       0xF0,0x80,0xF0,0x10,0xF0, // "5"
                       0xF0,0x80,0xF0,0x90,0xF0, // "6"
                       0xF0,0x10,0x20,0x40,0x40, // "7"
                       0xF0,0x90,0xF0,0x90,0xF0, // "8"
                       0xF0,0x90,0xF0,0x10,0xF0, // "9"
                       0xF0,0x90,0xF0,0x90,0x90, // "A"
                       0xE0,0x90,0xE0,0x90,0xE0, // "B"
                       0xF0,0x80,0x80,0x80,0xF0, // "C"
                       0xE0,0x90,0x90,0x90,0xE0, // "D"
                       0xF0,0x80,0xF0,0x80,0xF0, // "E"
                       0xF0,0x80,0xF0,0x80,0x80  // "F"
                       ]

        for (let i = 0; i < sprites.length; i++) 
        {
            this.memory[startPos + i] = sprites[i];
        }
    }

    clearDisplay()
    {
        this.display.fillRect(0, 0, display.width, display.height);
    }

    createDisplay()
    {
        let display = document.getElementById("emulator-display")
        display.width = CHIP8.DISPLAY_WIDTH
        display.height = CHIP8.DISPLAY_HEIGHT
        let ctx = display.getContext('2d')
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.width, display.height);
        return ctx
    }

    mapKeyboard(key)
    {
        if(key in CHIP8.KEYBOARD_MAP)
        {
            return CHIP8.KEYBOARD_MAP[key]
        }else
        {
            console.error(key + " is unknown key in chip8 architecture")
        }
    }
}

var chip8 = null;

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const hexString = e.target.result;
            chip8 = new CHIP8(hexString);
        };
        reader.readAsArrayBuffer(file);
    }
});




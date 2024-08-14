# Chip-8 Emulator

## Overview

This project is a Chip-8 emulator written in JavaScript. Chip-8 is a simple, interpreted programming language used primarily on early home computers like the COSMAC VIP and Telmac 1800. This emulator allows you to run Chip-8 programs in modern web browsers, providing an accessible way to experience vintage computing.


## try

### [link](https://wojlin.github.io/js-chip8/)

## Features

- **Full Chip-8 Instruction Set:** Supports all core Chip-8 instructions.
- **Graphics Display:** Renders graphics in a canvas element, emulating the 64x32 pixel screen.
- **Sound Emulation:** Basic support for sound via JavaScript's Web Audio API.
- **Keypad Input:** Handles user input using keyboard mappings.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/wojlin/js-chip8.git
   ```

2. **Open the project directory:**

   ```bash
   cd chip8-emulator
   ```

3. **Open `index.html` in a web browser:**

   Simply double-click the `index.html` file or open it via your preferred web server.

## Usage

1. **Load a Chip-8 ROM:**

   - Click the "Load ROM" button in the emulator interface.
   - Select a `.ch8` file from your computer.

2. **Start Emulation:**

   - Click the "Start" button to begin executing the loaded ROM.
   - Use the "Pause" and "Reset" buttons to control the emulation.

3. **Controls:**

   - **Arrow Keys:** Map to Chip-8 keys for navigation and interaction.
   - **Number Keys (1-9, 0):** Map to the Chip-8 keypad.

## Instructions Set

For detailed information on Chip-8 instructions, refer to the [Chip-8 Instruction List](https://github.com/wojlin/js-chip8/docs.html).

## Contributing

Feel free to open issues or submit pull requests if you have suggestions or improvements. Please adhere to the project's coding style and contribute to the documentation where necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chip-8 Documentation](https://en.wikipedia.org/wiki/CHIP-8)
- [JavaScript Tutorial](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

This README provides a clear introduction to your Chip-8 emulator project, covering installation, usage, and contribution guidelines. Feel free to customize it further based on specific features or project details.
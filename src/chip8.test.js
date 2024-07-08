import { CHIP8 } from './chip8.js';

const REGISTER_SIZE = 16



// Function to wait for a condition asynchronously
function waitForCondition(conditionFunc, interval = 100) {
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            if (conditionFunc()) {
                clearInterval(intervalId);
                resolve();
            }
        }, interval);
    });
}



//6xkk - LD Vx, byte
async function testLDx()
{
    let result = true
    const valueSet = 0xF

    console.group("test LD Vx, byte")
    for(let x = 0; x < REGISTER_SIZE; x++)
    {
        console.log("iteration "+(x+1)+": v"+x+" should = " + valueSet)
        let chip8 = new CHIP8([parseInt("0x6"+x.toString(16),16),valueSet,0x00,0x00]);
        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
        let vRegisterVal = chip8.vRegisters[x]
        if(vRegisterVal != valueSet)
        {
            console.error("test failed")
            chip8.printMemory()
            console.end
            result = false
        }
    }
    console.groupEnd()
    return result;
}


//7xkk - ADD Vx, byte
async function testADDx()
{
    let result = true
    const valueSet = 0x0F

    console.group("test ADD Vx, byte")
    for(let x = 0; x < REGISTER_SIZE; x++)
    {
        console.log("iteration "+(x+1)+": v"+x+" should = " + valueSet*2)
        let chip8 = new CHIP8([parseInt("0x7"+x.toString(16),16),valueSet,parseInt("0x7"+x.toString(16),16),valueSet,0x00,0x00]);
        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
        let vRegisterVal = chip8.vRegisters[x]
        if(vRegisterVal != valueSet*2)
        {
            console.error("test failed")
            chip8.printMemory()
            console.end
            result = false
        }
    }
    console.groupEnd()
    return result;
}


//8xy0 - LD Vx, Vy
async function testLDxy()
{
    let result = true
    const value = 5

    console.group("test LD Vx, Vy")
    for(let x = 0; x < REGISTER_SIZE; x++)
    {
        console.log("iteration "+x+": v0 should = " + value)

        let chip8 = new CHIP8(
            [parseInt("0x6"+x.toString(16),16),value,
            0x80, "0x"+x.toString(16)+"0",
            0x00,0x00]);

        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
        let vRegisterVal = chip8.vRegisters[0]
        if(vRegisterVal != value)
        {
            console.error("test failed")
            chip8.printMemory()
            console.end
            result = false
        }
    }
    console.groupEnd()
    return result;
}


//8xy1 - OR Vx, Vy
async function testORxy()
{
    let result = true
    const valueX = 5
    const valueY = 3

    console.group("test OR Vx, Vy")
    for(let x = 1; x < REGISTER_SIZE; x++)
    {
        console.log("iteration "+x+": v"+(x-1)+" should = " + (valueX | valueY))

        let chip8 = new CHIP8(
            [parseInt("0x6"+x.toString(16),16),valueX, // load value 3 to tegister x
             parseInt("0x6"+(x-1).toString(16),16),valueY, // load value 3 to tegister x - 1
            "0x8"+(x-1).toString(16), "0x"+(x).toString(16)+"1", // do OR operation on vX = i vY = i - 1
            0x00,0x00] // end program
            );

        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
        let vRegisterVal = chip8.vRegisters[x-1]
        if(vRegisterVal != (valueX | valueY))
        {
            console.error("test failed")
            chip8.printMemory()
            console.end
            result = false
        }
    }
    console.groupEnd()
    return result;
}


//8xy2 - AND Vx, Vy
async function testANDxy()
{
    let result = true
    const valueX = 5
    const valueY = 3

    console.group("test AND Vx, Vy")
    for(let x = 1; x < REGISTER_SIZE; x++)
    {
        console.log("iteration "+x+": v"+(x-1)+" should = " + (valueX | valueY))

        let chip8 = new CHIP8(
            [parseInt("0x6"+x.toString(16),16),valueX, // load value 5 to tegister x
             parseInt("0x6"+(x-1).toString(16),16),valueY, // load value 3 to tegister x - 1
            "0x8"+(x-1).toString(16), "0x"+(x).toString(16)+"2", // do AND operation on vX = i vY = i - 1
            0x00,0x00] // end program
            );

        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
        let vRegisterVal = chip8.vRegisters[x-1]
        if(vRegisterVal != (valueX & valueY))
        {
            console.error("test failed")
            chip8.printMemory()
            console.end
            result = false
        }
    }
    console.groupEnd()
    return result;
}


//8xy3 - XOR Vx, Vy
async function testXORxy()
{
    let result = true
    const valueX = 4
    const valueY = 3
    // xor result = 7

    console.group("test XOR Vx, Vy")
    for(let x = 1; x < REGISTER_SIZE; x++)
    {
        console.log("iteration "+x+": v"+(x-1)+" should = " + (valueX | valueY))

        let chip8 = new CHIP8(
            [parseInt("0x6"+x.toString(16),16),valueX, // load value 4 to tegister x
             parseInt("0x6"+(x-1).toString(16),16),valueY, // load value 3 to tegister x - 1
            "0x8"+(x-1).toString(16), "0x"+(x).toString(16)+"1", // do XOR operation on vX = i vY = i - 1
            0x00,0x00] // end program
            );

        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
        let vRegisterVal = chip8.vRegisters[x-1]
        if(vRegisterVal != (valueX ^ valueY))
        {
            console.error("test failed")
            chip8.printMemory()
            console.end
            result = false
        }
    }
    console.groupEnd()
    return result;
}



//8xy4 - ADD Vx, Vy
async function testADDxy()
{
    let result = true
    let valueX = 2
    let valueY = 3

    console.group("test ADD Vx, Vy")

    console.log("iteration 1: v0 should = 5 and vF should = 0")
    let chip8 = new CHIP8(
        [0x60,valueX, // load value 4 to tegister x
        0x61,valueY, // load value 3 to tegister y
        0x80, 0x14, // do ADD operation on vX = i - 1 vY = i
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let vRegisterVal = chip8.vRegisters[0]
    let fFlag = chip8.vRegisters[15]

    if(vRegisterVal != (valueX + valueY) || fFlag != 0)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }


    console.log("iteration 1: v0 should = 15 and vF should = 1")

    valueX = 250
    valueY = 20

    chip8 = new CHIP8(
        [0x60,valueX, // load value 4 to tegister x
        0x61,valueY, // load value 3 to tegister y
        0x80, 0x14, // do ADD operation on vX = i - 1 vY = i
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    vRegisterVal = chip8.vRegisters[0]
    fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 14 || fFlag != 1)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }
    

    console.groupEnd()
    return result;
}


//8xy5 - SUB Vx, Vy
async function testSUBxy()
{
    let result = true
    let valueX = 5
    let valueY = 3

    console.group("test SUB Vx, Vy")

    console.log("iteration 1: v0 should = 2 and vF should = 0")
    let chip8 = new CHIP8(
        [0x60,valueX, // load value 4 to tegister x
        0x61,valueY, // load value 3 to tegister y
        0x80, 0x15, // do ADD operation on vX = i - 1 vY = i
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let vRegisterVal = chip8.vRegisters[0]
    let fFlag = chip8.vRegisters[15]

    if(vRegisterVal != (valueX - valueY) || fFlag != 1)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }


    console.log("iteration 1: v0 should = 0 and vF should = 1")

    valueX = 5
    valueY = 15

    chip8 = new CHIP8(
        [0x60,valueX, // load value 4 to tegister x
        0x61,valueY, // load value 3 to tegister y
        0x80, 0x15, // do ADD operation on vX = i - 1 vY = i
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    vRegisterVal = chip8.vRegisters[0]
    fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 246 || fFlag != 0)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }
    

    console.groupEnd()
    return result;
}


//8xy6 - SHR Vx {, Vy}
async function testSHRx()
{
    let result = true

    console.group("test SHR Vx {, Vy}")

    console.log("iteration 1: v0 should = 2 and vF should = 0")
    let chip8 = new CHIP8(
        [0x60,0x04, // load value 8 to register x
        0x61,0x00, // load value 0 to register y
        0x80, 0x16, // do SHR operation on vX = 0 vY = 1
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let vRegisterVal = chip8.vRegisters[0]
    let fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 2 || fFlag != 0)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }


    console.log("iteration 2: v0 should = 2 and vF should = 1")

    chip8 = new CHIP8(
        [0x60,0x05, // load value 5 to register x
        0x61,0x00, // load value 0 to register y
        0x80, 0x16, // do ADD operation on vX = i - 1 vY = i
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    vRegisterVal = chip8.vRegisters[0]
    fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 2 || fFlag != 1)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }
    

    console.groupEnd()
    return result;
}


//8xy7 - SUBN Vx, Vy
async function testSUBNxy()
{
    let result = true

    console.group("test SUBN Vx, Vy")

    console.log("iteration 1: v0 should = 6 and vF should = 1")
    let chip8 = new CHIP8(
        [0x60,0x02, // load value 8 to register x
        0x61,0x08, // load value 2 to register y
        0x80, 0x17, // do SUBN operation on vX = 0 vY = 1
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let vRegisterVal = chip8.vRegisters[0]
    let fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 6 || fFlag != 1)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }


    console.log("iteration 2: v0 should = 0 and vF should = 0")

    chip8 = new CHIP8(
        [0x60,0x06, // load value 5 to register x
        0x61,0x03, // load value 0 to register y
        0x80, 0x17, // do ADD operation on vX = 0 vY = 0
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    vRegisterVal = chip8.vRegisters[0]
    fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 253 || fFlag != 0)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }
    

    console.groupEnd()
    return result;
}


//8xyE - SHL Vx {, Vy}
async function testSHLx()
{
    let result = true

    console.group("test SHL Vx {, Vy}")

    console.log("iteration 1: v0 should = 254 and vF should = 1")
    let chip8 = new CHIP8(
        [0x60,0xFF, // load value 255 to register x
        0x80, 0x1e, // do SHL operation on vX = 255
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let vRegisterVal = chip8.vRegisters[0]
    let fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 254 || fFlag != 1)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }


    console.log("iteration 2: v0 should = 8 and vF should = 0")

    chip8 = new CHIP8(
        [0x60,0x04, // load value 4 to register x
        0x80, 0x1e, // do SHL operation on vX = 4
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    vRegisterVal = chip8.vRegisters[0]
    fFlag = chip8.vRegisters[15]

    if(vRegisterVal != 8 || fFlag != 0)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }
    

    console.groupEnd()
    return result;
}


//9xy0 - SNE Vx, Vy
async function testSNExy()
{
    let result = true

    console.group("test SNE Vx, Vy")

    console.log("iteration 1: pc should = 520")
    let chip8 = new CHIP8(
        [0x60,0x02, // load value 2 to register x
        0x61,0x02, // load value 2 to register y
        0x90, 0x10, // do SNE operation on V0 and v1
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let pc = chip8.programCounter[0]

    if(pc != 520)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }


    console.log("iteration 2: pc should = 522")

    chip8 = new CHIP8(
        [0x60,0x02, // load value 2 to register x
        0x61,0x01, // load value 1 to register y
        0x90, 0x10, // do SNE operation on V0 and v1
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    pc = chip8.programCounter[0]

    if(pc != 522)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }
    

    console.groupEnd()
    return result;
}


//Annn - LD I, addr
async function testLDi()
{
    let result = true

    console.group("test LD I, addr")

    console.log("iteration 1: I register should = 600")
    let chip8 = new CHIP8(
        [
        0xA1, 0xBC, // put value 444 in I register
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let i = chip8.iRegister[0]

    if(i != 444)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }

    console.groupEnd()
    return result;
}


//Bnnn - JP V0, addr
async function testJPv()
{
    let result = true

    console.group("test JP V0, addr")

    console.log("iteration 1: pc shuld = 260")
    let chip8 = new CHIP8(
        [
        0x60,0x05, // set 5 at v0
        0xB0, 0xFF, // jump to 255 + 5
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let pos = chip8.programCounter[0]

    if(pos != 260)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }

    console.groupEnd()
    return result;
}


//Cxkk - RND Vx, byte
async function testRNDx()
{
    let result = true

    console.group("test JP V0, addr")

    console.log("iteration 1: pc shuld = 260")
    let chip8 = new CHIP8(
        [
        0xC0, 0x0F, // get random number & 15 and store in v0
        0x00,0x00] // end program
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    let x = chip8.vRegisters[0]

    if(x > 15)
    {
        console.error("test failed")
        chip8.printMemory()
        console.end
        result = false
    }

    console.groupEnd()
    return result;
}


async function drwTopLeft()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X01, // SET V1 TO 1 
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0x80, 0x00 // set data: "10000000" to draw at mem location 522
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(1,1))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}

async function drwTopRight()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X3E, // SET V0 TO 62
        0x61, 0X01, // SET V1 TO 1 
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0x80, 0x00 // set data: "10000000" to draw at mem location 522
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(62,1))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}

async function drwBottomRight()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X3E, // SET V0 TO 62
        0x61, 0X1E, // SET V1 TO 30
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0x80, 0x00 // set data: "10000000" to draw at mem location 522
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(62,30))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}

async function drwBottomLeft()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X1E, // SET V1 TO 30
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0x80, 0x00 // set data: "10000000" to draw at mem location 522
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(1,30))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}

async function drwXORmiss()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X01, // SET V1 TO 1
        0xA2, 0x0E, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0xA2, 0x10, // set i register to 524
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0xAA, 0x00, // set data: "10101010" to draw at mem location 526
        0x55, 0x00 // set data: "01010101" to draw at mem location 528
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(1,1) || 
        !chip8.getPixel(2,1) || 
        !chip8.getPixel(3,1) || 
        !chip8.getPixel(4,1) || 
        !chip8.getPixel(5,1) || 
        !chip8.getPixel(6,1) ||
        !chip8.getPixel(7,1) ||
        !chip8.getPixel(8,1))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}


async function drwXORhit()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X01, // SET V1 TO 1
        0xA2, 0x0C, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0xAA, 0x00, // set data: "10101010" to draw at mem location 526
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.getPixel(1,1) || 
        chip8.getPixel(2,1) || 
        chip8.getPixel(3,1) || 
        chip8.getPixel(4,1) || 
        chip8.getPixel(5,1) || 
        chip8.getPixel(6,1) ||
        chip8.getPixel(7,1) ||
        chip8.getPixel(8,1))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}


async function drwWrapHorizontal()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X3C, // SET V0 TO 60
        0x61, 0X01, // SET V1 TO 1 
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
        0x00,0x00, // end program
        0xFF, 0x00 // set data: "11111111" to draw at mem location 522
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(0,1) || !chip8.getPixel(1,1) || !chip8.getPixel(2,1) || !chip8.getPixel(3,1) ||
       !chip8.getPixel(60,1) || !chip8.getPixel(61,1) || !chip8.getPixel(62,1) || !chip8.getPixel(63,1))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}

async function drwWrapVertical()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X00, // SET V0 TO 0
        0x61, 0X20, // SET V1 TO 32
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 0 vY = 32 
        0x00,0x00, // end program
        0xFF, 0x00 // set data: "11111111" to draw at mem location 522
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(!chip8.getPixel(0,0) || !chip8.getPixel(1,0) || !chip8.getPixel(2,0) || !chip8.getPixel(3,0) ||
       !chip8.getPixel(4,0) || !chip8.getPixel(5,0) || !chip8.getPixel(6,0) || !chip8.getPixel(7,0))
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}


async function drwFont()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X00, // SET V0 TO 0
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x00, // set i register to 0
        0xD0, 0x15, // draw char at address I at vX = 0 vY = 0 

        0x60, 0X05, // SET V0 TO 0
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x05, // set i register to 5
        0xD0, 0x15, // draw char at address I at vX = 5 vY = 0 

        0x60, 0X0A, // SET V0 TO 10
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x0A, // set i register to 10
        0xD0, 0x15, // draw char at address I at vX = 10 vY = 0 

        0x60, 0X0F, // SET V0 TO 15
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x0F, // set i register to 15
        0xD0, 0x15, // draw char at address I at vX = 15 vY = 0 

        0x60, 0X14, // SET V0 TO 20
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x14, // set i register to 20
        0xD0, 0x15, // draw char at address I at vX = 20 vY = 0 

        0x60, 0X19, // SET V0 TO 25
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x19, // set i register to 25
        0xD0, 0x15, // draw char at address I at vX = 25 vY = 0 

        0x60, 0X1E, // SET V0 TO 30
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x1E, // set i register to 30
        0xD0, 0x15, // draw char at address I at vX = 30 vY = 0 

        0x60, 0X23, // SET V0 TO 35
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x23, // set i register to 35
        0xD0, 0x15, // draw char at address I at vX = 35 vY = 0 

        0x60, 0X28, // SET V0 TO 40
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x28, // set i register to 40
        0xD0, 0x15, // draw char at address I at vX = 40 vY = 0 

        0x60, 0X2D, // SET V0 TO 45
        0x61, 0X00, // SET V1 TO 0
        0xA0, 0x2D, // set i register to 45
        0xD0, 0x15, // draw char at address I at vX = 45 vY = 0 

        0x00,0x00, // end program
        ] 
        );


    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    const imageData = chip8.display.getImageData(0, 0, 64, 32);
    const pixels = imageData.data;
    const hash = pixels.reduce((sum, num) => sum + num, 0)


    if(hash != 620160)
    {
        console.error("subtest failed")
        chip8.printMemory()
        return false
    }
    else
    {
        console.log("subtest passed")
        return true
    }
}


//Dxyn - DRW Vx, Vy, nibble
async function testDRWxyn()
{
    let result = true

    console.group("test DRW Vx, Vy, nibble")

    console.log("subtest 1: top left pixel")
    result = result && drwTopLeft();
    console.log("subtest 2: top right pixel")
    result = result && drwTopRight();
    console.log("subtest 3: bottom right pixel")
    result = result && drwBottomRight();
    console.log("subtest 4: bottom left pixel")
    result = result && drwBottomLeft();
    console.log("subtest 5: XOR miss")
    result = result && drwXORmiss();
    console.log("subtest 6: XOR hit")
    result = result && drwXORhit();
    console.log("subtest 7: wrap horizontal")
    result = result && drwWrapHorizontal();
    console.log("subtest 8: wrap vertical")
    result = result && drwWrapVertical();
    console.log("subtest 9: font")
    result = result && drwFont();
    console.groupEnd()
    return result;
}


//Ex9E - SKP Vx
async function testSKPx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X00, // SET V1 TO 0
        0xE0, 0x9e, // skip bc key "1" is pressed
        0x61, 0X01, // SET V1 TO 1
        0x00,0x00, // end program
        ] 
        );

    chip8.pressedKeys = {49: true}

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] == 1)
    {
        console.error("instruction not skipped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//ExA1 - SKNP Vx
async function testSKPNx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X00, // SET V1 TO 0
        0xE0, 0xA1, // skip bc key "1" is pressed
        0x61, 0X01, // SET V1 TO 1
        0x00,0x00, // end program
        ] 
        );

    chip8.pressedKeys = {49: true}

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] != 1)
    {
        console.error("instruction skipped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//Fx15 - LD DT, Vx
async function testLDDTx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X32, // SET V0 TO 50
        0xF0, 0x15, // set delay timer to register 0 value
        0x00,0x00, // end program
        ] 
        );


    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.delayTimer[0] < 20 || chip8.delayTimer > 50)
    {
        console.error("delay timer not set")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//Fx18 - LD ST, Vx
async function testLDSTx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X32, // SET V0 TO 50
        0xF0, 0x18, // set sound timer to register 0 value
        0x00,0x00, // end program
        ] 
        );


    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.soundTimer[0] < 20 || chip8.soundTimer > 50)
    {
        console.error("sound timer not set")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//Fx07 - LD Vx, DT
async function testLDxDT()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X32, // SET V0 TO 50
        0xF0, 0x15, // set delay timer to register 0 value
        0xF1, 0x07, // value of dt is placed into register 1
        0x00,0x00, // end program
        ] 
        );


    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] < 20 || chip8.vRegisters[1] > 50)
    {
        console.error("value of dt is not copyied into register")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//Fx0A - LD Vx, K
async function testLDxK()
{
    let chip8 = new CHIP8(
        [
        0xF0, 0X0A, // wait for key press
        0x00,0x00, // end program
        ] 
        );
    
    chip8.pressedKeys = {49: true}

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[0] != 1)
    {
        console.error("wrong key mapped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


//Fx1E - ADD I, Vx
async function testADDix()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X0A, // load 10 into register 0
        0xA0, 0x05, // load 5 into I register
        0xF0, 0x1E, // register i = 5 + 10
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.iRegister[0] != 15)
    {
        console.error("i register should contain value 15")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


//Fx29 - LD F, Vx
async function testLDFx()
{
    let result = true;

    for(let i = 0; i < 16; i++)
    {
        console.log("iteration: ", i+1, " i should = ", i*5)
        let chip8 = new CHIP8(
        [
        0x60, i, // load i into register 0 
        0xF0, 0x29, // i = location of sprite for digit Vx
        0x00,0x00, // end program
        ] 
        );
    
        await waitForCondition(() => chip8.stop);
        chip8.printMemory()
    
        if(chip8.iRegister[0] != i*5)
        {
            console.error("i register should contain value i*5")
            chip8.printMemory()
            result = false
        }
    }  
    
    return result
    
}


// Fx33 - LD B, Vx
async function testLDBx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X7B, // load 123 into register 0
        0xA7, 0xD0, // set I register to 2000
        0xF0, 0x33, // store bcd of register 0 in memory at loaction I,i+1,i_2
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.memory[2000] != 1 || chip8.memory[2001] != 2 || chip8.memory[2002] != 3)
    {
        console.log(chip8.memory)
        console.error("memory 2000 should be = 1, memory 2001 should be = 2, memory 2002 should be = 3")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


// Fx55 - LD [I], Vx
async function testLDIx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0X00, // load 0 into register 0 
        0x61, 0X01, // load 1 into register 1 
        0x62, 0X02, // load 2 into register 2 
        0x63, 0X03, // load 3 into register 3 
        0x64, 0X04, // load 4 into register 4 
        0xA7, 0xD0, // set I register to 2000
        0xF4, 0x55, // copy values from register 0 to 4 into memory starting at 2000
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.memory[2000] != 0 || chip8.memory[2001] != 1 || chip8.memory[2002] != 2 || chip8.memory[2003] != 3 || chip8.memory[2004] != 4)
    {
        console.log(chip8.memory)
        console.error("memory 2000 should be = 0, memory 2001 should be = 1, memory 2002 should be = 2, memory 2003 should be = 3, memory 2004 should be = 4")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


// Fx65 - LD Vx, [I]
async function testLDxI()
{
    let chip8 = new CHIP8(
        [
        0xA2, 0x06, // set I register to 518
        0xF4, 0x65, 
        0x00,0x00, // end program
        0x01, 0x02, // payload
        0x03, 0x04, // payload
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[0] != 1 || chip8.vRegisters[1] != 2 || chip8.vRegisters[2] != 3 || chip8.vRegisters[3] != 4)
    {
        console.log(chip8.memory)
        console.error("v0 needs to be 1, v1 needs to be 2, v2 needs to be 3, v3 needs to be 4")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


//5xy0 - SE Vx, Vy
async function testSExy()
{
    let chip8 = new CHIP8(
        [
        0x60, 0x01, // set register 0 to 1
        0x61, 0x01, // set register 1 to 1
        0x50, 0x10, // skip instruction 
        0x00,0x00, // end program
        0x62, 0x01, // set register 2 to 1
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[2] != 1)
    {
        console.error("instruction not skipped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//3xkk - SE Vx, byte
async function testSEx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0x01, // set register 0 to 1
        0x30, 0x01, // skip instruction
        0x00,0x00, // end program
        0x61, 0x01, // set register 1 to 1
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] != 1)
    {
        console.error("instruction not skipped")
        chip8.printMemory()
        return false
    }


    chip8 = new CHIP8(
        [
        0x60, 0x01, // set register 0 to 1
        0x30, 0x00, // skip instruction
        0x00,0x00, // end program
        0x61, 0x01, // set register 1 to 1
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] == 1)
    {
        console.error("instruction skipped but should not")
        chip8.printMemory()
        return false
    }
    

    return true
}


//4xkk - SNE Vx, byte
async function testSNEx()
{
    let chip8 = new CHIP8(
        [
        0x60, 0x01, // set register 0 to 1
        0x40, 0x00, // skip instruction
        0x00,0x00, // end program
        0x61, 0x01, // set register 1 to 1
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] != 1)
    {
        console.error("instruction not skipped")
        chip8.printMemory()
        return false
    }


    chip8 = new CHIP8(
        [
        0x60, 0x01, // set register 0 to 1
        0x40, 0x01, // skip instruction
        0x00,0x00, // end program
        0x61, 0x01, // set register 1 to 1
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[1] == 1)
    {
        console.error("instruction skipped but should not")
        chip8.printMemory()
        return false
    }
    

    return true
}


//1nnn - JP addr
async function testJP()
{
    let chip8 = new CHIP8(
        [
        0x12, 0x06, // jump to 518
        0x60, 0x00, // set register 0 to 0
        0x00,0x00, // end program
        0x60, 0x01, // set register 0 to 1
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[0] != 1)
    {
        console.error("not jumped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


//00E0 - CLS
async function testCLS()
{
    let chip8 = new CHIP8(
        [
            0x60, 0X00, // SET V0 TO 0
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x00, // set i register to 0
            0xD0, 0x15, // draw char at address I at vX = 0 vY = 0 
    
            0x60, 0X05, // SET V0 TO 0
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x05, // set i register to 5
            0xD0, 0x15, // draw char at address I at vX = 5 vY = 0 
    
            0x60, 0X0A, // SET V0 TO 10
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x0A, // set i register to 10
            0xD0, 0x15, // draw char at address I at vX = 10 vY = 0 
    
            0x60, 0X0F, // SET V0 TO 15
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x0F, // set i register to 15
            0xD0, 0x15, // draw char at address I at vX = 15 vY = 0 
    
            0x60, 0X14, // SET V0 TO 20
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x14, // set i register to 20
            0xD0, 0x15, // draw char at address I at vX = 20 vY = 0 
    
            0x60, 0X19, // SET V0 TO 25
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x19, // set i register to 25
            0xD0, 0x15, // draw char at address I at vX = 25 vY = 0 
    
            0x60, 0X1E, // SET V0 TO 30
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x1E, // set i register to 30
            0xD0, 0x15, // draw char at address I at vX = 30 vY = 0 
    
            0x60, 0X23, // SET V0 TO 35
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x23, // set i register to 35
            0xD0, 0x15, // draw char at address I at vX = 35 vY = 0 
    
            0x60, 0X28, // SET V0 TO 40
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x28, // set i register to 40
            0xD0, 0x15, // draw char at address I at vX = 40 vY = 0 
    
            0x60, 0X2D, // SET V0 TO 45
            0x61, 0X00, // SET V1 TO 0
            0xA0, 0x2D, // set i register to 45
            0xD0, 0x15, // draw char at address I at vX = 45 vY = 0 
            
            0x00, 0xE0, // clear screen

            0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()


    const imageData = chip8.display.getImageData(0, 0, 64, 32);
    const pixels = imageData.data;
    const hash = pixels.reduce((sum, num) => sum + num, 0)

    console.log(hash)
    if(hash != 522240)
    {
        console.error("screen not cleared")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}


//2nnn - CALL addr
async function testCALL()
{
    let chip8 = new CHIP8(
        [
        0x22, 0x06, // jump to 518
        0x60, 0x01, // set register 0 to 1
        0x00,0x00, // end program
        0x60, 0x02, // set register 0 to 2
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[0] != 2 || chip8.stack[0] != 514)
    {
        console.error("not jumped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}

//00EE - RET
async function testRET()
{
    let chip8 = new CHIP8(
        [  
        0x60, 0x00, // set register 0 to 0
        0x22, 0x04, // jump to 516
        0x70, 0x01, // add 1 to register 0 
        0x30, 0x02, // skip if true 
        0x00, 0xEE, // return from a subroutine
        0x00,0x00, // end program
        ] 
        );

    await waitForCondition(() => chip8.stop);
    chip8.printMemory()

    if(chip8.vRegisters[0] != 2)
    {
        console.error("not jumped")
        chip8.printMemory()
        return false
    }
    else
    {
        return true
    }
}




function test()
{
    // Array of test functions
    const tests = [testLDx,
        testADDx,
        testLDxy, 
        testORxy,
        testANDxy,
        testXORxy,
        testADDxy,
        testSUBxy,
        testSHRx,
        testSUBNxy,
        testSHLx,
        testSNExy,
        testLDi,
        testJPv,
        testRNDx,
        testDRWxyn,
        testSKPx,
        testSKPNx,
        testLDDTx,
        testLDSTx,
        testLDxDT,
        testLDxK,
        testADDix,
        testLDFx,
        testLDBx,
        testLDIx,
        testLDxI,
        testSExy,
        testSEx,
        testSNEx,
        testJP,
        testCLS,
        testCALL,
        testRET]

    console.log("LAUNCHING TEST SUITE")
    console.log("instructions coverage:", (tests.length/34)*100+"%")

    let content = document.createElement("div")
    content.style = "border: solid black 2px; width: fit-content; margin:auto; display:block;"
    
    let title = document.createElement("div")
    title.style = "text-align: center; font-weight: bold;"
    title.innerHTML = "CHIP8 test suite"
    content.appendChild(title)

    let ctable = document.createElement('table');
    ctable.style = "border-top: solid 1px black; border-bottom: solid 1px black;width:100%;";
    const crow = document.createElement('tr');
    const ccell1 = document.createElement('td');
    const ccell2 = document.createElement('td');

    ccell1.innerHTML = "coverage";
    ccell2.innerHTML = ((tests.length/34)*100).toFixed(2)+"%"

    crow.appendChild(ccell1);
    crow.appendChild(ccell2);
    ctable.appendChild(crow);

    content.appendChild(ctable)

    let table = document.createElement('table');
    
    for(let i =0; i < tests.length; i++)
    {
        const row = document.createElement('tr');
        
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');

        row.appendChild(cell1);
        row.appendChild(cell2);

        cell1.innerHTML = tests[i].name
        cell2.style.color = "gray";
        cell2.id = tests[i].name
        cell2.innerHTML = "-------------"
        table.appendChild(row)
    }
    content.appendChild(table)

    let details = document.createElement("div")
    details.style = "border-top: solid 1px black; color: gray; text-align:center; width:max-content;"
    details.innerHTML = "for more details check console"
    content.appendChild(details)
    document.body.appendChild(content)

    // Execute tests sequentially
    tests.reduce((chain, testFunction) => {
        return chain.then(previousResults => {
            console.log(`Running ${testFunction.name}...`);
            return testFunction().then(result => {

                if(result)
                {
                    document.getElementById(testFunction.name).style.color = "green";
                    document.getElementById(testFunction.name).innerHTML = "PASSED"
                }else
                {
                    document.getElementById(testFunction.name).style.color = "red";
                    document.getElementById(testFunction.name).innerHTML = "FAILED"
                }

                previousResults.push({ name: testFunction.name, result });
                return previousResults;
            });
        });
    }, Promise.resolve([])).then(allResults => {
        console.log("All tests completed:");
        allResults.forEach(testResult => {
            if (testResult.result) {
                console.log(`%c ${testResult.name} passed`, 'color:green;');
            } else {
                console.log(`%c ${testResult.name} failed`, 'color:red;');
            }
        });
    }).catch(error => {
        console.error("Error during test execution:", error);
    });
}

test()



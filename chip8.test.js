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



// test LD Vx, byte
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


// test ADD Vx, byte
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


// test LD Vx, Vy
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


// test OR Vx, Vy
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


// test AND Vx, Vy
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


// test XOR Vx, Vy
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



// test ADD Vx, Vy
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


// test SUB Vx, Vy
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


// test SHR Vx {, Vy}
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


// test SUBN Vx, Vy
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


// test SHL Vx {, Vy}
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


// test SNE Vx, Vy
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


// test LD I, addr
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


// test JP V0, addr
async function testJP()
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


// test RND Vx, byte
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
        0x60, 0X01, // SET V0 TO 1
        0x61, 0X20, // SET V1 TO 32
        0xA2, 0x0A, // set i register to 522
        0xD0, 0x11, // draw one byte at address I at vX = 1 vY = 1 
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

// test DRW Vx, Vy, nibble
async function testDRWxyn()
{
    let result = true

    console.group("test DRW Vx, Vy, nibble")

    console.log("subtest 1: top left pixel")
    result = result & drwTopLeft();
    console.log("subtest 2: top right pixel")
    result = result & drwTopRight();
    console.log("subtest 3: bottom right pixel")
    result = result & drwBottomRight();
    console.log("subtest 4: bottom left pixel")
    result = result & drwBottomLeft();
    console.log("subtest 5: XOR miss")
    result = result & drwXORmiss();
    console.log("subtest 6: XOR hit")
    result = result & drwXORhit();
    console.log("subtest 7: wrap horizontal")
    result = result & drwWrapHorizontal();
    console.log("subtest 8: wrap vertical")
    result = result & drwWrapVertical();

    console.groupEnd()
    return result;
}

function test()
{
    // Array of test functions
    const tests = [testLDx, testADDx, testLDxy, testORxy, testANDxy, testXORxy, testADDxy, testSUBxy, testSHRx, testSUBNxy, testSHLx, testSNExy, testLDi, testJP, testRNDx, testDRWxyn];

    console.log("LAUNCHING TEST SUITE")
    console.log("instructions coverage:", (tests.length/36)*100+"%")

    // Execute tests sequentially
    tests.reduce((chain, testFunction) => {
        return chain.then(previousResults => {
            console.log(`Running ${testFunction.name}...`);
            return testFunction().then(result => {
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



const net = require("net");

const PORT = 65432; 
///ip must match with your network 
const HOST = "10.250.227.165";
const shift = 3;

function decryptCaesar(message, shift) {
  let result = "";

  for (let i = 0; i < message.length; i++) {
    let char = message[i];

    if (char >= "A" && char <= "Z") {
      let currentCode = message.charCodeAt(i);
      let newCode = ((currentCode - 65 - shift + 26) % 26) + 65;
      result += String.fromCharCode(newCode);
    }
    else if (char >= "a" && char <= "z") {
      let currentCode = message.charCodeAt(i);
      let newCode = ((currentCode - 97 - shift + 26) % 26) + 97;
      result += String.fromCharCode(newCode);
    }
    else {
      result += char;
    }
  }
  return result;
}



const server = net.createServer((socket) => {
  console.log(`\n[+] Client connected from: ${socket.remoteAddress}`);

  socket.on("data", (rawData) => {
    // 1. Read the encrypted message directly from the raw data stream
    const encryptedMessage = rawData.toString("utf8");

    console.log(`\n[+] Encrypted Message Received: ${encryptedMessage}`);

    // 2. Decrypt and read the message
    const decryptedMessage = decryptCaesar(encryptedMessage, shift);
    

    console.log("----------------------------------------");
    console.log(`[Message Output]: ${decryptedMessage}`);
    console.log("----------------------------------------");
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}...`);
});

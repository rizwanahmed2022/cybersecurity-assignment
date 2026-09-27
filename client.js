const net = require("net");

const PORT = 65431;
const HOST = "192.168.100.28";
const message = "Rizwa Ahmed ka Message";
const shift = 3;

console.log(`Original Message: ${message}`);

function caesarCipher(message, shift) {
  let result = ""; 
  for (let i = 0; i < message.length; i++) {
    let char = message[i];
    if (char >= "A" && char <= "Z") {
      let currentCode = message.charCodeAt(i);
      let newCode = ((currentCode - 65 + shift) % 26) + 65;
      result += String.fromCharCode(newCode);
    } else if (char >= "a" && char <= "z") {
      let currentCode = message.charCodeAt(i);
      let newCode = ((currentCode - 97 + shift) % 26) + 97;
      result += String.fromCharCode(newCode);
    } else {
      result += char; 
    }
  }
  return result;
}

// Encrypt the message
const encryptedMessage = caesarCipher(message, shift);

console.log(`Encrypted Message: ${encryptedMessage}`);




const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log("\nSending encrypted message...");

  // Send only the encrypted string over the TCP socket
  client.write(encryptedMessage);

 
 
  console.log("Message sent successfully!");

  client.destroy();
});

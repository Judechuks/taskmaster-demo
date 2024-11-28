const crypto = require("crypto"); // import the crypto module
const secretKey = crypto.randomBytes(32).toString("base64"); // generates a random 32-byte key and encodes it in base64
console.log(secretKey); // prints the generated secret key in order to copy it
// run `node the_name_of_this_file`
// copy the key and use .env for privacy

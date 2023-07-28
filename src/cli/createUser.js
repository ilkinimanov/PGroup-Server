const createUser = require('../utils/userUtils');


const args = process.argv.slice(2);
const email = args[args.indexOf("--email") + 1];
const password = args[args.indexOf("--password") + 1];


if (!email || !password) {
  console.log("Usage: node createUser.js --email <email> --password <password>");
} else {
  createUser(email, password);
}

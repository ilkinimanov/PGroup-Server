const server = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';


server.listen(PORT, HOST, () => {
  console.log(`Your server is available at http://${HOST}:${PORT}`);
});

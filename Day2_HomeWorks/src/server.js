const express = require("express");
const port = process.env.PORT;

const server = express();

server.listen(port, () => {
  console.log(`Server runinng on port{${port}}`);
});

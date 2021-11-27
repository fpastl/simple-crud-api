require('dotenv').config();
const app = require("./src/app");
PORT = process.env.PORT || 3000;
console.log(`Server started at PORT ${PORT}`);
app.listen(PORT);
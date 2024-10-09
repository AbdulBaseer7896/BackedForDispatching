require("dotenv").config();
require("./conn");

const express = require("express");
const User = require("./routes/user");
const MCnumber = require("./routes/mcNumber");

const app = express();


const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use("/api/v1", User);
app.use("/api/v1", MCnumber);

app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require('./routes/auth')
const pinRoute = require("./routes/pin")
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log(" > Connected to MongoDB on mongoose."))
  .catch((e) => console.log(e));



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", (req, res) => {
  res.status(200).json("Hello World");
});


app.use("/api/auth",authRoute)
app.use("/api/pin",pinRoute)




app.listen(8080, () => {
  console.log(" > Server is running on port 8080");
});

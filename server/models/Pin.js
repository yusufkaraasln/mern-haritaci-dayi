const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    min: 3,
    require: true,
  },
  desc: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
    min: 0,
    max: 5,
  },

  lat: {
    type: String,
    require: true,
  },
  long: {
    type: String,
    require: true,
  },
},{
    timestamps:true
});

module.exports = mongoose.model("Pin",PinSchema)
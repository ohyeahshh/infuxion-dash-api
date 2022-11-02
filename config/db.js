const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://test:Qd7lc4xhRhQTa9CW@cluster0.jo8w72a.mongodb.net/?retryWrites=true&w=majority"
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;
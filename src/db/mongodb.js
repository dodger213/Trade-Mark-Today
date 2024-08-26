const mongoose = require("mongoose");
const connectToMongodb = async () => {
  try {
    const database = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false, 
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`Error connecting to DB: ${(error).message}`);
    process.exit(1);
  }
};

module.exports = connectToMongodb;

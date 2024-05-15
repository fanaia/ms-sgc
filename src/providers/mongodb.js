const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNSTRING, {
      dbName: process.env.MONGODB_DBNAME,
    });
    console.log("MongoDB Connected: ", process.env.MONGODB_DBNAME);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connect;

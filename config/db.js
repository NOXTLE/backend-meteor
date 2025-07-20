const mongo = require("mongoose");

const connect = async () => {
  console.log(process.env.MONGOURI);
  try {
    const con = await mongo.connect(
      "mongodb+srv://adityasharan1903:FyYuAlpkWFP1FAXd@cluster0.mdnzmrb.mongodb.net/"
    );
    console.log(`MongoDB connected:`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connect;

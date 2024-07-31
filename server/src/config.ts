const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config()
const connectDB = async () => {
    const mongoURL = process.env.MONGO_URL;

    try {
        await mongoose.connect(mongoURL);
        // await mongoose.connect('mongodb://0.0.0.0:27017/mydatabase');
        console.log('connect to DataBase');
    } catch (err) {
        console.error('error to connect to database', err);
        process.exit(1);
    }

};

export default connectDB;

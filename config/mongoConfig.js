const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongodb = () => {
    const uri = process.env.MONGO_URI;
    mongoose.connect(
            uri,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }
        )
        .then( () => console.info('Connection to MongoDB established successfully!') );
        err => {
            console.error(err.message);
            process.exit(1);
        }
};

module.exports = connectToMongodb;
const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://navirathinam2k27:LY6wPdjD4tLtUbuc@vanakkamnode.3e9td.mongodb.net/devTinder');
}

module.exports = {connectDB}


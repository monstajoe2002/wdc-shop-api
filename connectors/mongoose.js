const mongoose = require('mongoose');
const connectDb = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
}
module.exports = connectDb;
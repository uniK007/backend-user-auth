const express = require('express');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

connectDb();
const app = express();
app.use(cors())
const port = process.env.PORT || 3000;

app.use(express.json());

const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
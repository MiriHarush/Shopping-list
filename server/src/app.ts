import express from 'express';
const cors = require("cors");
import connectDB from './config';
import shoppingRoutes from './routes/shoppingRoutes'; 

const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());

connectDB();

app.use('/api', shoppingRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
})
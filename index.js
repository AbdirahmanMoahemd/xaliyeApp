import dotenv from  'dotenv';
import path from 'path';
import express from'express';
import mongoose from'mongoose';
import productRouter from'./routes/productRoutes.js';
import categoryRouter from'./routes/categoreyRoutes.js';
import userRouter from'./routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMidlleware.js';

dotenv.config();
const app = express();  
const db_url = 'mongodb+srv://developerkaahiye2:abdirahman@ecommerce.or6jw.mongodb.net/xaliye?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;


//middleware
app.use(express.json())
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/orders', categoryRouter);



//DB connection
mongoose.connect(db_url).then( ()=>{
    console.log('Connected to database')
}).catch( e=>{
    console.log(e)
})


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, 
    console.log(`connected at port ${PORT}`));


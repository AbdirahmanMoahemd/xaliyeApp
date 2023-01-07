require('dotenv').config()
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const { authRouter } = require('./routes/auth');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/categorey');
const userRouter = require('./routes/user');
const uploadRoutes = require('./routes/uploadRoutes');



const app = express();  
const db_url = 'mongodb+srv://developerkaahiye2:abdirahman@ecommerce.or6jw.mongodb.net/xaliye?retryWrites=true&w=majority'

const __dirname2 = path.resolve()
app.use('/uploads', express.static(path.join(__dirname2, '/uploads')))

//middleware
app.use(express.json())
app.use(authRouter)  
app.use(adminRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use(userRouter)
app.use(uploadRoutes)


//DB connection
mongoose.connect(db_url).then( ()=>{
    console.log('Connected to database')
}).catch( e=>{
    console.log(e)
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, 
    console.log(`connected at port ${PORT}`));


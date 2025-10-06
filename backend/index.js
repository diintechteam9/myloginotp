const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');

dotenv.config({quiet:true});

const app=express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600
}))


const otpRouter=require('./routers/whatsapproute');

app.get("/",(req,res)=>{
    res.send('this is the my login otp backend');
});

app.use('/api/whatsapp',otpRouter);

const PORT=4000;

app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
});
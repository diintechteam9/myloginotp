const axios=require('axios');
require('dotenv').config();
const crypto=require('crypto');

const WHATSAPP_TOKEN=process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID=process.env.WHATSAPP_PHONE_ID;
const GRAPH_VERSION=process.env.GRAPH_VERSION;

function generateSixDigitOtp(){
    return crypto.randomInt(0,100000).toString().padStart(6,'0');
}

const generateOtp=async(req,res)=>{
    try {
        
         const {to}=req.body;

         if(!to){
            return res.status(400).json({
                success:false,
                message:"Phone number is required",
            });
         }

         const url=`https://graph.facebook.com/${GRAPH_VERSION}/${WHATSAPP_PHONE_ID}/messages`;
         const headers={
            Authorization:`Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type':'application/json',
         };

         const otp=generateSixDigitOtp();

         const data={
            messaging_product:'whatsapp',
            to,
            type:'template',
            template:{
                name:"otp_verification",
                language:{code : "en_US"},
                  components:[
                    {
                        type:"body",
                        parameters:[
                            {
                                type:"text",
                                text:otp,
                            }
                        ]
                    },
                    {
                        type:"button",
                        sub_type:"url",
                        index:"0",
                        parameters:[
                            {
                                type:"text",
                                text:otp
                            }
                        ]
                    }
                  ]
            }
         };

         const response=await axios.post(url,data,{headers});

         return res.status(200).json({
            success:true,
            message:"OTP send successfully",
            response:response.data,
         });
    
    } catch (error) {
        console.error("OTP sending failed",error.response?.data || error.message);

        return res.status(500).json({
            success:false,
            message:"OTP sending failed",
            error:error.response?.data || error.message,
        });
        
    }
};

module.exports={generateOtp};




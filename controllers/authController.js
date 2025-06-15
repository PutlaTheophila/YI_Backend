const Otp = require('../models/otpModel.js');
const User = require('../models/userModel.js');
const { createToken } = require('../utils/jwt.js'); // Optional integration
require('dotenv').config();
// twilio requirements
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendOtp = async (req, res) => {
  const { mobile } = req?.body;

  await new Promise(res => setTimeout(res, 3000)); // 3-second delay

  if (!mobile) return res.status(400).json({ error: 'Mobile number is required' });

  // the opt generated using the math.floor
  let code = Math.floor(100000 + Math.random() * 900000).toString(); 

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await Otp.deleteMany({ mobile }); // Remove previous OTPs
  const otp = await Otp.create({ mobile, code, expiresAt }); // create the new otp
  console.log(otp);

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are missing! Check your .env file and dotenv config.');
  }


  let mobileNumber = `+91${mobile.toString()}`;
  console.log(mobileNumber);
  // client.messages
  //   .create({
  //     body: ` OTP to login to YI Raipur is  ${code}`,
  //     to: `whatsapp:${mobileNumber}`,
  //     // from: 'whatsapp:+17344047768',
  //     from : 'whatsapp:+14155238886'
  //   })
  //   .then((message) => console.log(message.sid))
  //   .catch((err) => console.error(err));
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
};


exports.verifyOtp = async (req, res) => {
    const { mobile, code } = req.body;

    console.log(req.body);
  
    const otpDoc = await Otp.findOne({ mobile });
    console.log(otpDoc);
  
    if (!otpDoc || otpDoc.code !== code || otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  
    let existingUser = true;
    let user = await User.findOne({ mobile : mobile });
    console.log(user);
    if (!user) {
      existingUser = false;
    }

    let token = createToken(user?._id ) ;

    res.status(200).json({
      status:'success',
      token,
      existingUser
    })
  };
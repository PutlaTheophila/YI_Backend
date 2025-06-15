require('dotenv').config();

const accountSid = process.env.TWILIO_SID|| 'ACd1ba92e9bef03c074f916225a79edb4b';
const authToken = process.env.TWILIO_AUTH_TOKEN||'c73576c78028f6635c1e02fcaaeeaf14';


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are missing! Check your .env file and dotenv config.');
}

const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: `Hello from my app and this is the otp ${generateOTP()}`,
    to: '+919640348714',
    from: '+17344047768',
  })
  .then((message) => console.log(message.sid))
  .catch((err) => console.error(err));
  

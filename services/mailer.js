
    
  import { createTransport } from 'nodemailer';

  const MAIL_SETTINGS = {
    service: 'yahoomail',
    auth: {
      user: "rizwanc018@yahoo.com",
      pass: "MERASTOREh2@",
    },
  }

  
  const transporter = createTransport(MAIL_SETTINGS);
  
  export async function sendMail(params) {
    try {
      let info = await transporter.sendMail({
        from: MAIL_SETTINGS.auth.user,
        to: "crizwan440@gmail.com", 
        subject: 'Hello ✔',
        html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the club.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">999999</h1>
     </div>
      `,
      });
      return info;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
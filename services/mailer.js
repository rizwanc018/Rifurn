import { createTransport } from 'nodemailer';

const MAIL_SETTINGS = {
  service: 'gmail',
  auth: {
    user: "rifurn83@gmail.com",
    pass: process.env.MAILER_PASSWORD,
  },
}

const transporter = createTransport(MAIL_SETTINGS);

export async function sendOTP(email, otp) {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: `${email}`,
      subject: 'OTP from Rifurn',
      html: `
      <div
      class="container"
      style="max-width: 90%; margin: auto; padding-top: 20px"
      >
      <h2>Welcome to the club.</h2>
      <h4>Enter the OTP</h4>
      <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
      </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
}
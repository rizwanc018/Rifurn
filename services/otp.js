import { generate } from 'otp-generator';

export default function generateOTP() {
    const OTP = generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    return OTP;
}
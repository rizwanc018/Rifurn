import { generate } from 'otp-generator';
import { OTP_LENGTH, OTP_CONFIG } from '../constants/constants';

export default function generateOTP() {
    const OTP = generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    return OTP;
}

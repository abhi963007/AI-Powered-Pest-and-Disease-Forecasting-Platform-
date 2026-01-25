const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"AgroScan Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your AgroScan Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4CAF50; text-align: center;">AgroScan Verification</h2>
                <p>Hello,</p>
                <p>Thank you for choosing AgroScan. Your one-time password (OTP) for verification is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</span>
                </div>
                <p>This code is valid for 10 minutes. Please do not share this code with anyone.</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTP };

import dbConnect from "@/lib/dbConnect";
import mailSender from "@/helpers/mailsend";
import UserModel from "@/model/User";

import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();
  const { email, firstName, lastName, phone, password } = await request.json();

  console.log(email,);
  

  const existingVerifiedUserByUsername = await UserModel.findOne({
    email,
    isVerified: true,
  });

  if (existingVerifiedUserByUsername) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  } 
  else {
    // Validate the email address
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
      });
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send the OTP to the user's email (this is a placeholder, implement your own email sending logic)
    const newUser = new UserModel({
      firstName,
      lastName,
      phone,
      email,
      mobileNmber: phone,
      password: await bcrypt.hash(password, 10), // Hash the password before saving
      verifyCode: otp,
    });
    await newUser.save();
    await mailSender(
      email,
      "You Got a Mentor OTP Verification",
      `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 40px 0; text-align: center; background-color: #f6f9fc;">
                    <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      <tr>
                        <td style="padding: 40px;">
                          <h1 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: bold; text-align: center;">Verify Your Email Address</h1>
                          <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 24px; text-align: center;">Please use the verification code below to complete your sign-in process:</p>
                          <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
                            <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${otp}</span>
                          </div>
                          <p style="margin: 30px 0 0; color: #64748b; font-size: 14px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
                          <p style="margin: 10px 0 0; color: #64748b; font-size: 14px; text-align: center;">This code will expire in 1 minutes.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 40px; background-color: #f8fafc; border-radius: 0 0 8px 8px; text-align: center;">
                          <p style="margin: 0; color: #64748b; font-size: 14px;">You Got a Mentor - Professional Mentorship Platform</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
          `
    );
    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
    });
  }
}

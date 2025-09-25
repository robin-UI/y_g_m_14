import dbConnect from "@/lib/dbConnect";
import mailSender from "@/helpers/mailsend";
import UserModel from "@/model/User";

import bcrypt from "bcrypt";
import Mentor from "@/model/Mentor";
import Student from "@/model/Student";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, firstName, lastName, phone, password, role } = await request.json();

  try {
    const existingVerifiedUserByUsername = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json({ success: false, error: "User already exists" }, {
        status: 400,
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isverified) {
        return Response.json({
          success: false,
          message: "User is already exist with this email"
        }, { status: 400 })
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        firstName,
        lastName,
        mobileNmber: phone,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expireDate,
        isverified: false,
        role,
      })

      await newUser.save();

      if (role === 'MENTOR') {
        const newMentor = new Mentor({
          userId: newUser._id,
        });
        await newMentor.save();
      } else if (role === 'STUDENT') {
        // If you have a Student model, you can create a new student document here
        const newStudent = new Student({
          userId: newUser._id,
        });
        await newStudent.save();
      }
    }

    // Send Verification Email
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
                              <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${verifyCode}</span>
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

    return Response.json({
      success: true,
      message: "User register successfully. Pleas verify your email"
    }, { status: 201 })

  } catch (error) {
    console.error("Error regstring user", error)
    return Response.json({
      success: false,
      message: "Error regstring User"
    }, {
      status: 500
    })
  }
}

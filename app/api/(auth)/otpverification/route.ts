import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { email, otp } = await request.json();

  const existingVerifiedUserByUsername = await UserModel.findOne({
    email,
    isVerified: true,
  });

  if (existingVerifiedUserByUsername) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  } else {
    // Validate the email address
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
      });
    }

    // Check if the OTP is valid
    const user = await UserModel.findOne({
      email,
      verifyCode: otp,
      //   verifyCodeExpiry: { $gt: new Date() }, // Check if the OTP is not expired
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), {
        status: 400,
      });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    return new Response(
      JSON.stringify({ message: "User verified successfully" }),
      {
        status: 200,
      }
    );
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { email, code } = await request.json();
  const decodedEmail = decodeURIComponent(email);
  // console.log(decodedEmail, code);
  
  const user = await UserModel.findOne({ email: decodedEmail });

  if (!user) {
    return Response.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    );
  }

  if (user.isVerified) {
    return  Response.json({ message: "User already exists" }, {
      status: 400,
    });
  } else {
    // Validate the email address
    if (!decodedEmail || !/\S+@\S+\.\S+/.test(decodedEmail)) {
      return Response.json({ message: "Invalid email address" }, {
        status: 400,
      });
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  }
}

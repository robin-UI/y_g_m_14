import nodemailer from 'nodemailer';

const mailSender = async (email: string, title: string, body: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // Use 465 for SSL, or 587 for TLS
      secure: false, // Use true for SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Disable SSL certificate validation
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email info: ", info);
    return info;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message, "nodemailer error");
    } else {
      console.log("Unknown error", error, "nodemailer error");
    }
  }
};

export default mailSender;
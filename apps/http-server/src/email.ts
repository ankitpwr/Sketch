import nodemailer from "nodemailer";
import { EmailTemplate } from "./emailTemplate";
console.log("hlw");
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ankitpam321@gmail.com",
    pass: "kyyq gkef vqhs gwvd",
  },
});

export const sendEmail = async (email: string, otp: string, name: string) => {
  try {
    let template = EmailTemplate.replace("{verification_code}", otp);
    template = EmailTemplate.replace("{username}", name);

    const info = await transporter.sendMail({
      from: '"Sketch" <ankitpam321@gmail.com>',
      to: `${email}`,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: template,
    });
    console.log(info);
  } catch (error) {}
};

import nodemailer from "nodemailer";
import { EmailTemplate } from "./emailTemplate";
console.log("hlw");
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as SMTPTransport.Options);

export const sendEmail = async (email: string, otp: string, name: string) => {
  try {
    let template = EmailTemplate.replace("{verification_code}", otp);
    template = EmailTemplate.replace("{username}", name);

    const info = await transporter.sendMail({
      from: `"Sketch" <${process.env.EMAIL_FROM}>`,
      to: `${email}`,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: template,
    });
  } catch (error) {
    console.log(error);
  }
};

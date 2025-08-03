import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      pass: process.env.EMAILSECRETKEY,
      user: process.env.SENDEREMAIL,
    },
  });

  async sendEmail(email: string, subject: string, text: string) {
    try {
      let resultEmail = await this.transporter.sendMail({
        to: email,
        subject: subject,
        text: text,
      });

      return resultEmail;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

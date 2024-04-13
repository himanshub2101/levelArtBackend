import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        // Setup your mail transporter (e.g., SMTP, Gmail, SendGrid, etc.)
        service: 'gmail',
        auth: {
          user: 'himanshubaghel2101@gmail.com',
          pass: 'ddhw hmdh sqos tpte',
        },
      });

      const mailOptions = {
        from: 'himanshubaghel2101@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        html: `
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="http://example.com/reset-password?token=${token}">Reset Password</a>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      // Handle error
      console.error('Error sending password reset email:', error);
    }
  }
}

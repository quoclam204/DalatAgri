import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"DalatAgri Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Đặt lại mật khẩu DalatAgri',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Đặt lại mật khẩu DalatAgri</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản DalatAgri của mình.</p>
          <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
          <p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #16a34a; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Đặt Lại Mật Khẩu
            </a>
          </p>
          <p>Hoặc bạn có thể copy và dán đường dẫn sau vào trình duyệt:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p style="color: #ef4444; font-size: 0.9em;">Đường dẫn này sẽ hết hạn sau 15 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, xin vui lòng bỏ qua email này.</p>
          <br>
          <p>Trân trọng,</p>
          <p>Đội ngũ DalatAgri</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      throw new InternalServerErrorException('Hệ thống chưa được cấu hình Email. Vui lòng thiết lập cấu hình EMAIL_USER và EMAIL_PASS trong file .env');
    }
  }
}

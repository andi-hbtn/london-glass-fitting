import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
    constructor(private configService: ConfigService) { }

    public async sendEmail(data: ContactDto, file: Express.Multer.File): Promise<any> {
        const transporter = nodemailer.createTransport({
            service: this.configService.get<string>('EMAIL_SERVICE'),
            host: this.configService.get<string>('EMAIL_HOST'),
            port: parseInt(this.configService.get<string>('EMAIL_PORT')),
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });

        const emailHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${data.fullname}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Postal Code:</strong> ${data.postal_code}</p>
        <p><strong>Subject:</strong> ${data.subject ?? 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${data.message}</p>
        <hr />
        <p style="font-size: 12px; color: gray;">This message was sent from the contact form on your website.</p>
      </div>
    `;

        const attachments = file
            ? [
                {
                    filename: file.originalname,
                    content: file.buffer,
                    contentType: file.mimetype,
                },
            ]
            : [];

        try {
            await transporter.sendMail({
                from: this.configService.get<string>('EMAIL_INFO'),
                to: [
                    this.configService.get<string>('EMAIL_INFO'),
                    this.configService.get<string>('EMAIL_SALES'),
                ],
                subject: `New Contact Message from ${data.fullname}`,
                html: emailHtml,
                attachments,
            });

            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

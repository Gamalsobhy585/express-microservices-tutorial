import nodemailer from 'nodemailer';

export class MailService {

    private static transporter =
        nodemailer.createTransport({

            host:
                process.env.MAIL_HOST,

            port:
                Number(
                    process.env.MAIL_PORT
                    ?? 587,
                ),

            secure:
                process.env.MAIL_SECURE
                === 'true',

            auth: {

                user:
                    process.env
                        .MAIL_USERNAME,

                pass:
                    process.env
                        .MAIL_PASSWORD,
            },
        });


    static async sendVerificationOtp(
        email: string,
        otp: string,
    ): Promise<void> {

        await this.transporter.sendMail({

            from: {
                name:
                    process.env
                        .MAIL_FROM_NAME
                    ?? 'Identity Service',

                address:
                    process.env
                        .MAIL_FROM_ADDRESS
                    ?? 'no-reply@example.com',
            },

            to:
                email,

            subject:
                'Verify your email',

            html: `
                <h2>Email Verification</h2>

                <p>
                    Your verification code is:
                </p>

                <h1>
                    ${otp}
                </h1>

                <p>
                    This code expires in
                    ${
                        process.env
                            .OTP_EXPIRES_IN_MINUTES
                        ?? 10
                    }
                    minutes.
                </p>
            `,
        });
    }
}
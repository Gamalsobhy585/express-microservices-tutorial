import 'dotenv/config';
import { connectRabbitMQ, QUEUES } from '../config/rabbitmq.js';
import type { OtpEmailJob } from '../modules/auth/services/otp-email.producer.js';
import { MailService } from '../shared/services/mail.service.js';
async function start() {
    const channel = await connectRabbitMQ();

    // don't push more than 5 unacked messages to this consumer at once
    channel.prefetch(5);

    console.log('Waiting for OTP email jobs...');

    channel.consume(QUEUES.OTP_EMAIL, async (msg) => {
        if (!msg) return;

        try {
            const job: OtpEmailJob = JSON.parse(msg.content.toString());
            await MailService.sendVerificationOtp(job.email, job.otp);
            channel.ack(msg);
        } catch (error) {
            console.error('Failed to process OTP email job:', error);
            // requeue=false to avoid poison-message loops; send to a
            // dead-letter queue in production instead of dropping it
            channel.nack(msg, false, false);
        }
    });
}

start();
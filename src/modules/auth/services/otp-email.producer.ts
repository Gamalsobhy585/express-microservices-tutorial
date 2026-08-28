import { connectRabbitMQ, QUEUES } from '../../../config/rabbitmq.js';

export interface OtpEmailJob {
    email: string;
    otp: string;
}

export class OtpEmailProducer {
    static async publish(job: OtpEmailJob): Promise<void> {
        const channel = await connectRabbitMQ();

        channel.sendToQueue(
            QUEUES.OTP_EMAIL,
            Buffer.from(JSON.stringify(job)),
            { persistent: true }, // survive broker restarts
        );
    }
}
import amqp, { type ChannelModel, type Channel } from 'amqplib';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const QUEUES = {
    OTP_EMAIL: 'otp_email_queue',
} as const;

export async function connectRabbitMQ(): Promise<Channel> {
    if (channel) return channel;

    connection = await amqp.connect(
        process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
    );

    connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        channel = null;
        connection = null;
    });

    connection.on('close', () => {
        console.warn('RabbitMQ connection closed');
        channel = null;
        connection = null;
    });

    channel = await connection.createChannel();

    await channel.assertQueue(QUEUES.OTP_EMAIL, {
        durable: true, // survive broker restarts
    });

    return channel;
}

export async function closeRabbitMQ(): Promise<void> {
    await channel?.close();
    await connection?.close();
    channel = null;
    connection = null;
}

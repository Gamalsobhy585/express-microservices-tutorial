import 'dotenv/config';

import app from './app.js';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {

    console.log(
        `Identity Service running on port ${PORT}`,
    );

});

const shutdown = () => {

    console.log(
        'Shutting down Identity Service...',
    );

    server.close(() => {

        console.log(
            'HTTP server closed.',
        );

        process.exit(0);
    });
};

process.on(
    'SIGTERM',
    shutdown,
);

process.on(
    'SIGINT',
    shutdown,
);
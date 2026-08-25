import {
    z,
} from 'zod';

export const userIdRequest =
    z.object({

        params: z.object({

            id: z.coerce
                .number()
                .int()
                .positive(),

        }),

    });
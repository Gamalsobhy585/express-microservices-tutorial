import memjs from 'memjs';


export class CacheService {

    private static client =
        memjs.Client.create(
            `${
                process.env.MEMCACHED_HOST
                ?? '127.0.0.1'
            }:${
                process.env.MEMCACHED_PORT
                ?? '11211'
            }`,
        );


    static async get<T>(
        key: string,
    ): Promise<T | null> {

        try {

            const result =
                await this.client.get(
                    key,
                );


            if (
                !result.value
            ) {

                return null;
            }


            return JSON.parse(
                result.value.toString(),
            ) as T;

        } catch (error) {

            /*
             * Cache failure must NOT
             * break the API.
             */
            console.error(
                'Memcached GET failed:',
                error,
            );


            return null;
        }
    }


    static async set(
        key: string,
        value: unknown,
        ttl?: number,
    ): Promise<void> {

        try {

            const expires =
                ttl
                ??
                Number(
                    process.env
                        .MEMCACHED_DEFAULT_TTL
                    ?? 300,
                );


            await this.client.set(
                key,
                JSON.stringify(
                    value,
                ),
                {
                    expires,
                },
            );

        } catch (error) {

            console.error(
                'Memcached SET failed:',
                error,
            );
        }
    }


    static async delete(
        key: string,
    ): Promise<void> {

        try {

            await this.client.delete(
                key,
            );

        } catch (error) {

            console.error(
                'Memcached DELETE failed:',
                error,
            );
        }
    }


    static userProfileKey(
        userId: number,
    ): string {

        return `user:${userId}:profile`;
    }
}
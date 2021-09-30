import { createConnection, getConnectionOptions } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const connectionOptions = await getConnectionOptions();
      return await createConnection(connectionOptions);
    },
  },
];

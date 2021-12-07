import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'ecommerce',
      entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true, //TODO não usar como true em produção
    }),
  },
];
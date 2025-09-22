import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'nestuser',
  password: process.env.DB_PASSWORD || 'nestpassword',
  database: process.env.DB_NAME || 'nestdb',
};

async function mockDataDatabase(): Promise<void> {
  const client = new Client(connectionConfig);

  try {
    await client.connect();
    console.log('Conectado a la base de datos.');

    const cars = [
      {
        id: uuidv4(),
        brand: 'Toyota',
        model: 'Corolla',
        description: 'Sedán confiable y eficiente',
      },
      {
        id: uuidv4(),
        brand: 'Ford',
        model: 'Mustang',
        description: 'Deportivo clásico',
      },
      {
        id: uuidv4(),
        brand: 'Volkswagen',
        model: 'Golf',
        description: 'Hatchback popular',
      },
    ];

    for (const car of cars) {
      await client.query(
        `
        INSERT INTO model_car (id, brand, model, description)
        VALUES ($1, $2, $3, $4)
      `,
        [car.id, car.brand, car.model, car.description],
      );
    }

    console.log('Modelos insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    await client.end();
    console.log('Conexión cerrada.');
  }
}

void mockDataDatabase();

import 'reflect-metadata';
import { Admin, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { ModelCar } from 'src/domain/car/entities/ModelCar';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Concesionary } from 'src/domain/user/entities/Concesionary';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { User } from 'src/domain/user/entities/User';
import { Review } from 'src/domain/review/entities/Review';
import { Purchase } from 'src/domain/purchase/entities/Purchase';

// ⚙️ Configurá tu conexión TypeORM
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'nestuser',
  password: process.env.DB_PASSWORD || 'nestpassword',
  database: process.env.DB_NAME || 'nestdb',
  synchronize: false,
  entities: [
    ModelCar,
    SaleCar,
    FavoriteCar,
    User,
    Admin,
    Buyer,
    Concesionary,
    Review,
    SaleCar,
    Purchase,
  ],
});

export async function mockData() {
  await AppDataSource.initialize();
  console.log('🔌 Conectado a la base de datos');

  const modelCarRepo = AppDataSource.getRepository(ModelCar);
  const userRepo = AppDataSource.getRepository(Buyer);
  const concesionaryRepo = AppDataSource.getRepository(Concesionary);
  const saleCarRepo = AppDataSource.getRepository(SaleCar);
  const favoriteCarRepo = AppDataSource.getRepository(FavoriteCar);

  try {
    const models = await modelCarRepo.save([
      modelCarRepo.create({
        id: uuidv4(),
        brand: 'Toyota',
        model: 'Corolla',
        description: 'Sedán confiable y eficiente',
        imageUrl:
          'https://images.unsplash.com/photo-1638618164682-12b986ec2a75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=webp&q=60&w=3000',
      }),
      modelCarRepo.create({
        id: uuidv4(),
        brand: 'Ford',
        model: 'Mustang',
        description: 'Deportivo clásico',
        imageUrl:
          'https://images.unsplash.com/photo-1625231334168-35067f8853ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=webp&q=60&w=3000',
      }),
      modelCarRepo.create({
        id: uuidv4(),
        brand: 'Volkswagen',
        model: 'Golf',
        imageUrl:
          'https://images.unsplash.com/photo-1618767747322-64e376fd4826?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=webp&q=60&w=3000',
        description: 'Hatchback popular',
      }),
    ]);
    console.log('✅ Modelos insertados');

    const password = await bcrypt.hash('12345678', 10);
    const buyer = await userRepo.save(
      userRepo.create({
        email: 'buyer@example.com',
        password,
        fullname: 'Juan Comprador',
        role: UserRole.BUYER,
      }),
    );
    console.log('✅ Buyer insertado');

    // 3. Crear concesionario
    const concesionary = await concesionaryRepo.save(
      concesionaryRepo.create({
        email: 'dealer@example.com',
        password,
        fullname: 'Auto Concesionaria',
        role: UserRole.CONCESIONARY,
      }),
    );
    console.log('✅ Concesionario insertado');

    const saleCars = await saleCarRepo.save([
      saleCarRepo.create({
        modelCar: models[0],
        concesionary,
        price: 15000,
        status: StatusCar.AVAILABLE,
      }),
      saleCarRepo.create({
        modelCar: models[1],
        concesionary,
        price: 25000,
        status: StatusCar.AVAILABLE,
      }),
    ]);
    console.log('✅ Autos en venta insertados');

    // 5. Agregar favoritos
    await favoriteCarRepo.save(
      favoriteCarRepo.create({
        buyer,
        saleCar: saleCars[0],
      }),
    );
    console.log('✅ Favoritos insertados');

    console.log('🎉 Mockeo completado con éxito');
  } catch (error) {
    console.error('❌ Error al insertar datos mock:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Conexión cerrada');
  }
}

void mockData();

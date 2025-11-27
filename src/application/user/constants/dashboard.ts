import { UserRole } from 'src/domain/user/enums/UserRole';

const buyerProfile = [
  {
    id: 'explore-cars',
    title: 'Explorar autos',
    description: 'Acá podés explorar los autos disponibles para la venta',
  },
  {
    id: 'favourites-cars',
    title: 'Autos favoritos',
    description: 'Visualizá los autos que marcaste como favoritos',
  },
  {
    id: 'my-cars',
    title: 'Autos comprados',
    description: 'Visualizá los autos que compraste',
  },
];

const concesionaryProfile = [
  {
    id: 'create-sale-car',
    title: 'Publicar venta',
    description: 'Agregá un auto para la venta',
  },
  {
    id: 'manage-cars',
    title: 'Gestión de autos',
    description: 'Gestioná los autos de tu concesionaria',
  },
  {
    id: 'sales',
    title: 'Ventas',
    description: 'Visualizá las ventas realizadas por tu concesionaria',
  },
  {
    id: 'customers',
    title: 'Mis clientes',
    description: 'Visualizá la información de tus clientes',
  },
];

const administratorProfile = [
  {
    id: 'reports',
    title: 'Reportes y estadísticas',
    description:
      'Acá encontrarás los reportes y estadisticas de tus concesionarias y clientes',
  },

  {
    id: 'most-favorited-cars',
    title: 'Autos preferidos',
    description: 'Visualizá los autos preferidos por los usuarios',
  },
  {
    id: 'registered-users',
    title: 'Usuarios registrados',
    description: 'Visualizá los usuarios registrados en la plataforma',
  },
  {
    id: 'manage-concesionaries',
    title: 'Gestioná las concesionarias',
    description: 'Gestioná las concesionarias registradas en la plataforma',
  },
  {
    id: 'total-purchases',
    title: 'Todas las ventas',
    description: 'Visualizá todas las ventas realizadas en la plataforma',
  },
];

export const DASHBOARD_PROFILE = {
  [UserRole.ADMINISTRATOR]: administratorProfile,
  [UserRole.CONCESIONARY]: concesionaryProfile,
  [UserRole.BUYER]: buyerProfile,
};

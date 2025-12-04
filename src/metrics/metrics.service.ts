import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;

  public purchaseCount: Counter<string>;
  public purchaseByDealership: Counter<string>;
  public purchaseByModel: Counter<string>;
  public usersRegistered: Counter<string>;
  public saleCarPublished: Counter<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    this.purchaseCount = new Counter({
      name: 'app_purchases_total',
      help: 'Cantidad total de compras realizadas',
      registers: [this.registry],
    });

    this.purchaseByDealership = new Counter({
      name: 'app_purchases_by_dealership',
      help: 'Cantidad de compras agrupadas por concesionaria',
      labelNames: ['dealershipId', 'dealershipName'],
      registers: [this.registry],
    });

    this.purchaseByModel = new Counter({
      name: 'app_purchases_by_model',
      help: 'Cantidad de compras agrupadas por modelo',
      labelNames: ['modelId', 'modelName'],
      registers: [this.registry],
    });

    this.usersRegistered = new Counter({
      name: 'app_users_registered_total',
      help: 'Cantidad total de usuarios registrados',
      labelNames: ['role'],
      registers: [this.registry],
    });

    this.saleCarPublished = new Counter({
      name: 'app_salecars_published_total',
      help: 'Cantidad total de publicaciones creadas',
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

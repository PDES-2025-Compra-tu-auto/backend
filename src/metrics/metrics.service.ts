import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;

  public purchaseCount: Counter<string>;
  public purchaseByDealership: Counter<string>;
  public purchaseByModel: Counter<string>;

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
      labelNames: ['dealershipId'],
      registers: [this.registry],
    });

    this.purchaseByModel = new Counter({
      name: 'app_purchases_by_model',
      help: 'Cantidad de compras agrupadas por modelo',
      labelNames: ['modelId'],
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

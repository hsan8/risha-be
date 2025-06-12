// TODO: To be changed

import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly myCounter: Counter<string>;
  private readonly myGauge: Gauge<string>;

  constructor() {
    this.registry = new Registry();

    this.myCounter = new Counter({
      name: 'my_custom_counter',
      help: 'A custom counter for demonstration',
    });

    this.myGauge = new Gauge({
      name: 'my_custom_gauge',
      help: 'A custom gauge for demonstration',
    });

    this.registry.registerMetric(this.myCounter);
    this.registry.registerMetric(this.myGauge);
  }

  incrementCounter() {
    this.myCounter.inc();
  }

  setGauge(value: number) {
    this.myGauge.set(value);
  }

  async getMetrics() {
    return this.registry.metrics();
  }
}

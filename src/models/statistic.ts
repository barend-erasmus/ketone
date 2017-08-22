export class Statistic {
    public growth: number = 0;
    public growthRate: number = 0;
    public hasPositiveGrowth: boolean = false;

    constructor(public previousValue: number, public currentValue: number, public previousValueTimestamp: Date, public currentValueTimestamp: Date) {
        this.growth = currentValue - previousValue;

        this.growthRate = previousValue === 0 && currentValue === 0 ? 0 : (previousValue === 0 ? 100 : (currentValue - previousValue) / previousValue);

        this.hasPositiveGrowth = this.growthRate > 0;
    }
}

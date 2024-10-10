export interface GraphDataModel {
    doughnutIncomeDebtTotal: [number, number];
    lineChartDataIncome: number[];
    lineChartDataDebts: number[];
    dateFrom: string;
    dateTo: string
}

export const defaultGraphDataModel: GraphDataModel = {
    doughnutIncomeDebtTotal: [55, 45],
    lineChartDataIncome: [45, 50, 55, 60, 40, 45, 50, 55, 60, 40],
    lineChartDataDebts: [13.5, 15, 16.5, 18, 12, 13.5, 15, 16.5, 18, 12],
    dateFrom: new Date(new Date().getFullYear(), 0, 1).toString(),
    dateTo: new Date().toString(),
}
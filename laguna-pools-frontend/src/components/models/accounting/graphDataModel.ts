export interface GraphDataModel {
    doughnutIncomeTotal: number;
    doughnutDebtTotal: number;
    lineChartDataIncome: number[];
    lineChartDataDebts: number[];
    dateFrom: string;
    dateTo: string
}

export const defaultGraphDataModel: GraphDataModel = {
    doughnutIncomeTotal: 55,
    doughnutDebtTotal: 45,
    lineChartDataIncome: [45, 50, 55, 60, 40, 45, 50, 55, 60, 40],
    lineChartDataDebts: [13.5, 15, 16.5, 18, 12, 13.5, 15, 16.5, 18, 12],
    dateFrom: new Date(new Date().getFullYear(), 0, 1).toString(),
    dateTo: new Date().toString(),
}
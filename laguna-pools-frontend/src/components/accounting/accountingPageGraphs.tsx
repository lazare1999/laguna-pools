import React from "react";
import {Doughnut, Line} from "react-chartjs-2";
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {GraphDataModel} from "../models/accounting/graphDataModel";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface AccountingPageFiltersProps {
    data: GraphDataModel;
}

const AccountingPageGraphs: React.FC<AccountingPageFiltersProps> = ({data}) => {
    const labels = generateMonthlyLabels(data.dateFrom, data.dateTo);

    const monthlyIncomeData = aggregateMonthlyData(data.lineChartDataIncome, labels);
    const monthlyDebtsData = aggregateMonthlyData(data.lineChartDataDebts, labels);

    const lineChartData = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: monthlyIncomeData,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: 'Debts',
                data: monthlyDebtsData,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const optionsL = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
            },
        },
    };

    const doughnutData = {
        labels: ['Income', 'Debt'],
        datasets: [
            {
                data: data.doughnutIncomeDebtTotal,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const optionsD = {
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '400px', height: '400px', marginRight: '40px'}}>
                <Doughnut data={doughnutData} options={optionsD}/>
            </div>
            <div style={{width: '600px', height: '400px'}}>
                <Line data={lineChartData} options={optionsL}/>
            </div>
        </div>
    );
};

// Helper function to generate monthly labels based on the provided date range
const generateMonthlyLabels = (startDate: string, endDate: string): string[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const labels: string[] = [];

    for (let d = new Date(start.getFullYear(), start.getMonth(), 1); d <= end; d.setMonth(d.getMonth() + 1)) {
        labels.push(d.toLocaleString('default', {month: 'long', year: 'numeric'})); // Format as 'Month Year'
    }

    return labels;
};

// Helper function to aggregate data by month
const aggregateMonthlyData = (data: number[], labels: string[]): number[] => {
    const monthlyData: number[] = new Array(labels.length).fill(0);

    // Assuming the data aligns with the labels, you can customize this logic as needed
    for (let i = 0; i < data.length; i++) {
        const monthIndex = Math.floor(i / (data.length / labels.length));
        if (monthIndex < monthlyData.length) {
            monthlyData[monthIndex] += data[i];
        }
    }

    return monthlyData;
};

export default AccountingPageGraphs;

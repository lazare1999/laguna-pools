import React from "react";
import {Bar, Doughnut} from "react-chartjs-2"; // Import Bar instead of Line
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {GraphDataModel} from "../models/accounting/graphDataModel";

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface AccountingPageFiltersProps {
    data: GraphDataModel;
}

const AccountingPageGraphs: React.FC<AccountingPageFiltersProps> = ({data}) => {
    const labels = generateMonthlyLabels(data.dateFrom, data.dateTo);

    const monthlyIncomeData = aggregateMonthlyData(data.lineChartDataIncome, labels);
    const monthlyDebtsData = aggregateMonthlyData(data.lineChartDataDebts, labels);

    // Modify the lineChartData to fit a bar chart
    const barChartData = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: monthlyIncomeData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
            {
                label: 'Debts',
                data: monthlyDebtsData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
            },
        ],
    };

    const optionsB = {
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
                beginAtZero: true, // Start y-axis at zero for better equalizer effect
            },
        },
    };

    const doughnutData = {
        labels: ['Income', 'Debt'],
        datasets: [
            {
                data: [data.doughnutIncomeTotal, data.doughnutDebtTotal],
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
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <div style={{width: '400px', height: '400px', marginRight: '40px'}}>
                <Doughnut data={doughnutData} options={optionsD}/>
            </div>
            <div style={{width: '600px', height: '400px'}}>
                <Bar data={barChartData} options={optionsB}/> {/* Use Bar instead of Line */}
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

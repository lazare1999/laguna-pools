import React, {useEffect, useState} from "react";
import {Bar, Doughnut} from "react-chartjs-2"; // Import Bar instead of Line
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {defaultGraphDataModel} from "../models/accounting/graphDataModel";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import {AlertDialog} from "../../utils/alertsUtils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface AccountingPageGraphsProps {
    dayFrom: string
    dayTo: string
}

const AccountingPageGraphs: React.FC<AccountingPageGraphsProps> = ({dayFrom, dayTo}: AccountingPageGraphsProps) => {

    const [data, setData] = useState(defaultGraphDataModel);
    const labels = generateMonthlyLabels(data.dateFrom, data.dateTo);

    const monthlyIncomeData = aggregateMonthlyData(data.lineChartDataIncome, labels);
    const monthlyDebtsData = aggregateMonthlyData(data.lineChartDataDebts, labels);

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const fetchStats = async () => {
        try {
            const params: Record<string, any> = {
                dayFrom: dayFrom,
                dayTo: dayTo,
            };
            const queryString = new URLSearchParams(params as any).toString();
            const response = await authClient.request(`accounting/stats?${queryString}`, HttpMethod.GET);

            if (response.status === 200) {
                setData(response.data);
            }
        } catch (error) {
            setAlertMessage(`Error fetching data: ${error}`);
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchStats().then(r => r);
    }, []);


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
                beginAtZero: true,
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
            <AlertDialog
                open={alertOpen}
                title="Error"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

const generateMonthlyLabels = (startDate: string, endDate: string): string[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const labels: string[] = [];

    for (let d = new Date(start.getFullYear(), start.getMonth(), 1); d <= end; d.setMonth(d.getMonth() + 1)) {
        labels.push(d.toLocaleString('default', {month: 'long', year: 'numeric'})); // Format as 'Month Year'
    }

    return labels;
};

const aggregateMonthlyData = (data: number[], labels: string[]): number[] => {
    const monthlyData: number[] = new Array(labels.length).fill(0);

    for (let i = 0; i < data.length; i++) {
        const monthIndex = Math.floor(i / (data.length / labels.length));
        if (monthIndex < monthlyData.length) {
            monthlyData[monthIndex] += data[i];
        }
    }

    return monthlyData;
};

export default AccountingPageGraphs;

import * as XLSX from "xlsx";

export const exportTableToExcel = (tableData: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(tableData, {skipHeader: true});

    const columnNames = tableData[0] ? Object.keys(tableData[0]) : [];

    worksheet['!cols'] = columnNames.map((colName) => {
        if (colName === "Groups") {
            return {wch: 23};
        } else {
            return {wch: 15};
        }
    });

    Object.keys(worksheet).forEach((cell) => {
        if (cell[0] === '!') return;

        if (worksheet[cell].v === "") {
            worksheet[cell].s = {
                fill: {
                    patternType: "solid",
                    fgColor: {rgb: "#ff7300"},
                },
            };
        }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    age: string;
    cost: number;
    expDate: string;
    doctorCheckTill: string;
    phoneNumber: string;
    idStatus: boolean;
    contractStatus: boolean;
    notes: string;
    parent: string;
}

export const fetchExcelFile = async (file: File): Promise<Client[]> => {
    return new Promise<Client[]>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // Row-based data

            const clients: Client[] = jsonData.slice(1).map(row => ({
                id: parseInt(row[0] as string),
                firstName: row[1] as string,
                lastName: row[2] as string,
                age: row[3] as string,
                cost: parseFloat(row[4] as string),
                expDate: row[5] as string,
                doctorCheckTill: row[6] as string,
                phoneNumber: row[7] as string,
                idStatus: Boolean(row[8]),
                contractStatus: Boolean(row[9]),
                notes: row[10] as string,
                parent: row[11] as string
            }));

            resolve(clients);
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

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
import * as XLSX from "xlsx";

export const exportTableToExcel = (tableData: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

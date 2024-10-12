import * as fs from 'fs';
import * as path from 'path';
import {fetchExcelFile} from "../utils/excel";

describe('Test excel importing', () => {
    test('should correctly parse the Excel file and return Client objects', async () => {
        const filePath = path.resolve(__dirname, 'data/Test_Excel.xlsx');
        const buffer = fs.readFileSync(filePath);
        const file = new File([buffer], 'Test_Excel.xlsx');

        const clients = await fetchExcelFile(file);

        expect(clients[0].firstName).toEqual("TestName");
    });
});
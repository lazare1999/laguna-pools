import * as fs from 'fs';
import * as path from 'path';
import {Client, fetchExcelFile} from "../utils/excel";

describe('Test excel importing', () => {
    let clients: Client[];

    beforeAll(async () => {
        const filePath = path.resolve(__dirname, 'data/Test_Excel.xlsx');
        const buffer = fs.readFileSync(filePath);
        const file = new File([buffer], 'Test_Excel.xlsx');

        clients = await fetchExcelFile(file);
    });

    test('should correctly parse the Excel file and return Client objects', () => {
        expect(clients[0].firstName).toEqual("TestName");
    });

    test('should return 4 clients', () => {
        expect(clients.length).toBe(4);
    });
});
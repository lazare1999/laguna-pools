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

    test("test that groups are read correctly", () => {
        expect(clients[0].groups[0].day).toEqual("Monday");
        expect(clients[0].groups[0].hour).toEqual("10:00");
    });

    test("test that multiple groups are read correctly", () => {
        expect(clients[1].groups.length).toBe(2);
        expect(clients[1].groups[1].day).toEqual("Friday");
    });

    test("test that empty groups are read correctly", () => {
        expect(clients[3].groups).toEqual([]);
    });

    test("test that hour is read correctly", () => {
        expect(clients[2].groups[0].hour).toEqual("09:00");
    });

});

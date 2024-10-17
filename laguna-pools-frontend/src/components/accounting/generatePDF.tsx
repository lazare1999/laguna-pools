import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {format} from "date-fns";
import {AccountingClientModel} from "../models/accounting/accountingClientModel";

const GeneratePDF = async (accountingData: AccountingClientModel) => {
    const {client, amount, date, type, note, id} = accountingData;

    const formattedDate = format(new Date(date), "MMMM dd, yyyy");
    const phoneNumber = client?.phoneNumber || "N/A";
    const noteContent = note || "No notes available";
    const typeName = client?.type || "N/A";

    const doc = new jsPDF();

    const response = await fetch('/fonts/bpg_glaho_sylfaen.ttf');
    const fontBlob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = () => {
        const base64data = reader.result as string;
        const fontBase64 = base64data.split(',')[1];

        doc.addFileToVFS("bpg_glaho_sylfaen.ttf", fontBase64);
        doc.addFont("bpg_glaho_sylfaen.ttf", "bpg_glaho_sylfaen", "normal");
        doc.setFont("bpg_glaho_sylfaen");

        doc.setFontSize(18);
        doc.text("Accounting Client Report", 10, 10);
        doc.setFontSize(12);
        doc.text(`Client Name: ${client?.firstName} ${client?.lastName}`, 10, 20);
        doc.text(`Phone Number: ${phoneNumber}`, 10, 30);
        doc.text(`Amount: ${amount}`, 10, 40);
        doc.text(`Date: ${formattedDate}`, 10, 50);
        doc.text(`Transaction Type: ${type}`, 10, 60);
        doc.text(`Note: ${noteContent}`, 10, 70);

        const columns = ["Field", "Value"];
        const rows = [
            ["Birthday", client?.age],
            ["Debt", client?.debt.toString()],
            ["Expiration Date", client?.expDate],
            ["Doctor Check Till", client?.doctorCheckTill],
            ["ID Status", client?.idStatus ? "Active" : "Inactive"],
            ["Contract Status", client?.contractStatus ? "Active" : "Inactive"],
            ["Type", typeName],
        ];

        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 85,
        });

        doc.save(`order_${id}.pdf`);
    };

    reader.readAsDataURL(fontBlob);
};

export default GeneratePDF;


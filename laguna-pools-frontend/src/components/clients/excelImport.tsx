import React, {useState} from 'react';
import {fetchExcelFile} from "../../utils/excel";
import {Button} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {TABLE_BUTTON_STYLES} from "../../utils/constants";
import ApiService from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import {Toast} from "../../utils/alertsUtils";

const ExcelImport: React.FC = () => {

    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");


    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            try {
                const parsedClients = await fetchExcelFile(file);
                ApiService.request("clients/list", HttpMethod.POST,
                    {clients: parsedClients}
                ).then(res => {
                    if (res.status === 200) {
                        setToastMessage(res.data);
                        setToastOpen(true);
                    }
                }).catch(err => console.error(err));
            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        }
    };

    return (
        <div>
            <Toast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                options={{autoHideDuration: 3000}}
            />
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{display: 'none'}}
                id="file-upload"
            />

            <label htmlFor="file-upload">
                <Button
                    variant="outlined"
                    sx={TABLE_BUTTON_STYLES}
                    component="span"
                >
                    <UploadFileIcon/>
                </Button>
            </label>
        </div>
    );
};

export default ExcelImport;
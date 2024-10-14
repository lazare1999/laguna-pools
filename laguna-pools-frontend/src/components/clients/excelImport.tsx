import React from 'react';
import {fetchExcelFile} from "../../utils/excel";
import {Button} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {TABLE_BUTTON_STYLES} from "../../utils/constants";
import ApiService from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";

const ExcelImport: React.FC = () => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            try {
                const parsedClients = await fetchExcelFile(file);
                ApiService.request("clients/list", HttpMethod.POST,
                    {clients: parsedClients}
                ).catch(err => console.error(err));

            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{display: 'none'}} // Hide the input element
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
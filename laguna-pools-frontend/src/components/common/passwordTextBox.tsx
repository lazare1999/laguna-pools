import React, {useState} from 'react';
import {IconButton, InputAdornment, TextField} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordFieldProps {
    password: string;
    helperText: string;
    label: string;
    onChange: any;
    id: string;
    name: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({password, helperText, onChange, label, id, name}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <TextField
            id={id}
            name={name}
            margin="normal"
            required
            fullWidth
            label={label}
            type={showPassword ? 'text' : 'password'}
            value={password}
            helperText={helperText}
            error={!!helperText}
            onChange={onChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            slotProps={{
                inputLabel: {
                    shrink: true,
                }
            }}
        />
    );
};

export default PasswordField;
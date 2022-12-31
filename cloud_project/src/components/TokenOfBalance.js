import React from 'react'

import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";

function TokenOfBalance(props) {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.amount}</td>
        </tr>
    )
}

export default TokenOfBalance;
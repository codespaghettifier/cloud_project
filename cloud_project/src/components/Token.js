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

function Token(props) {
    return (
        <tr>
            <td>{props.name}</td>
        </tr>
    )
}

export default Token;
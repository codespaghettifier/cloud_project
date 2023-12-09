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

function User(props) {
    return (
        <tr>
            <td>{props.name}</td>
            <td>
                <Button type="submit" onClick={props.balanceOnClick}>portfele</Button>
            </td>
        </tr>
    )
}

export default User;
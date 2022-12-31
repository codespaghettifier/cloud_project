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

function Balance(props) {
    return (
        <tr>
            <td>{props.address}</td>
            <td>
                <Button type="submit" onClick={props.tokensOnClick}>Saldo</Button>
            </td>
            <td>
                <Button type="submit" onClick={props.transactionsOnClick}>transakcje</Button>
            </td>
        </tr>
    )
}

export default Balance;
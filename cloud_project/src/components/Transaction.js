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

function Transaction(props) {
    return (
        <tr>
            <td>{props.transaction.hash}</td>
            <td>
                <p>
                    {props.transaction.from + '\t'}
                    <Button type="submit" onClick={props.fromOnClick}>portfel</Button>
                </p>
            </td>
            <td>
                <p>
                    {props.transaction.to + '\t'}
                    <Button type="submit" onClick={props.toOnClick}>portfel</Button>
                </p>
            </td>
            <td>{props.transaction.token}</td>
            <td>{props.transaction.amount}</td>
        </tr>
    )
}

export default Transaction;
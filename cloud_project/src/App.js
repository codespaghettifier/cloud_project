import logo from './logo.svg';
import './App.css';

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
import {useState} from 'react';

import User from './components/User.js'
import Balance from './components/Balance.js'
import TokenOfBalance from './components/TokenOfBalance.js'
import Transaction from './components/Transaction.js'
import Token from './components/Token.js'


function App() {
    const [addOrShowMenu, setAddOrShowMenu] = useState('')
    const [addMenu, setAddMenu] = useState('')
    const [showMenu, setShowMenu] = useState('')
    
    const [userName, setUserName] = useState('')
    const [balanceAddress, setBalanceAddress] = useState('')
    const [ownerOfBalances, setOwnerOfBalances] = useState('')
    const [transactionHash, setTransactionHash] = useState('')
    const [transactionFrom, setTransactionFrom] = useState('')
    const [transactionTo, setTransactionTo] = useState('')
    const [transactionFromOrTo, setTransactionFromOrTo] = useState('')
    const [transactionToken, setTransactionToken] = useState('')
    const [transactionAmount, setTransactionAmount] = useState('')
    const [token, setToken] = useState('')

    const [users, setUsers] = useState([])
    const [balances, setBalances] = useState([])
    const [tokensOfBalance, setTokensOfBalance] = useState([])
    const [tokens, setTokens] = useState([])
    const [transactions, setTransactions] = useState([])

    const addUser = async () => {
        console.log("add user: ", userName)
        if(userName == '') return;

        await fetch('/user', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'name': userName})
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
        }).catch(error => console.log(error))

        setUserName('')
    }

    const addBalance = async () => {
        console.log(`add balance: ${userName}, ${balanceAddress}`)
        if(userName == '' || balanceAddress == '') return;

        await fetch('/balance', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'user': userName, 'address': balanceAddress})
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
        }).catch(error => console.log(error))

        setUserName('')
        setBalanceAddress('')
    }

    const addTransaction = async () => {
        console.log(`add transaction: ${transactionHash}, ${transactionFrom}, ${transactionTo}, ${transactionToken}, ${transactionAmount}`)
        if(transactionHash == '' || transactionFrom == '' || transactionTo == '' || transactionToken == '' || transactionAmount <= 0) return;

        await fetch('/transaction', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'hash': transactionHash,
                'from': transactionFrom,
                'to': transactionTo,
                'token': transactionToken,
                'amount': transactionAmount
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
        }).catch(error => console.log(error))

        setTransactionHash('')
        setTransactionFrom('')
        setTransactionTo('')
        setTransactionToken('')
        setTransactionAmount('')
    }

    const addToken = async () => {
        console.log("add token: ", token)
        if(token == '') return;

        await fetch('/token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'name': token})
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
        }).catch(error => console.log(error))

        setToken('')
    }

    const showUsers = async () => {
        console.log("show users")

        await fetch('/user', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
            if(data.status == 'success')
            {
                setUsers(data.records)
            }
        }).catch(error => console.log(error))
    }

    const showBalancesOfUser = async (user) => {
        user = user === undefined ? ownerOfBalances : user
        console.log("show balances of user: " + user)
        setShowMenu('balancesOfUser')

        await fetch(`/balance?user=${user}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
            if(data.status == 'success')
            {
                console.log(data.records)
                setBalances(data.records)
            }
        }).catch(error => console.log(error))
    }

    const showTokensOfBalance = async (balance) => {
        balance = balance === undefined ? balanceAddress : balance
        console.log("show tokens of balance: " + balance)
        if(balance == '') return;
        setShowMenu('tokensOfBalance')

        await fetch(`/transaction?fromOrTo=${balance}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
            if(data.status == 'success')
            {
                setTransactions(data.records)

                let tokenAmounts = {}
                data.records.forEach((transaction) => {
                    if(!(transaction.token in tokenAmounts)) tokenAmounts[transaction.token] = {name: transaction.token, amount: 0}

                    tokenAmounts[transaction.token].amount += transaction.from == balance ? -parseInt(transaction.amount) : parseInt(transaction.amount)
                })
                for(let key in tokenAmounts)
                {
                    if(tokenAmounts[key].amount == 0) delete tokenAmounts[key]
                }
                setTokensOfBalance(tokenAmounts)
            }
        }).catch(error => console.log(error))
    }

    const showTransactions = async (hash, from, to, fromOrTo) => {
        hash = hash === undefined ? transactionHash : hash
        from = from === undefined ? transactionFrom : from
        to = to === undefined ? transactionTo : to
        fromOrTo = fromOrTo === undefined ? transactionFromOrTo : fromOrTo
        console.log(`show transactions: hash: ${hash}, from: ${from} to: ${to} from or to: ${fromOrTo}`)
        setShowMenu('transactions')

        let query = ''
        query += hash == '' ? '' : `?hash=${hash}`
        query += from == '' ? '' : (query == '' ? '?' : '&') + `from=${from}`
        query += to == '' ? '' : (query == '' ? '?' : '&') + `to=${to}`
        query += fromOrTo == '' ? '' : (query == '' ? '?' : '&') + `fromOrTo=${fromOrTo}`

        await fetch(`/transaction${query}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
            if(data.status == 'success')
            {
                console.log(data.records)
                setTransactions(data.records)
            }
        }).catch(error => console.log(error))
    }

    const showTokens = async () => {
        console.log("show tokens")

        await fetch('/token', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data.status)
            if(data.status == 'success')
            {
                setTokens(data.records)
            }
        }).catch(error => console.log(error))
    }

    let userRows = []
    users.forEach((user, index) => {
        userRows.push({key: index, user: user})
    })

    let balanceRows = []
    balances.forEach((balance, index) => {
        balanceRows.push({key: index, balance: balance})
    })

    let tokensOfBalanceRows = []
    let index = 0
    for(let key in tokensOfBalance)
    {
        tokensOfBalanceRows.push({key: index, token: tokensOfBalance[key].name, amount: tokensOfBalance[key].amount})
        index++
    }

    let tokenRows = []
    tokens.forEach((token, index) => {
        tokenRows.push({key: index, token: token})
    })

    let transactionRows = []
    transactions.forEach((transaction, index) => {
        transactionRows.push({key: index, transaction: transaction})
    })

    return (
        <div className="App">
            <div className="addOrShowMenu">
                <Button type="submit" onClick={() => {setAddOrShowMenu('add')}}>DODAJ</Button>
                <Button type="submit" onClick={() => {setAddOrShowMenu('show')}}>POKAŻ</Button>
                {addOrShowMenu == 'add' &&
                    <div className="addSection">
                        <div className="addMenu">
                            <Button type="submit" onClick={() => {setAddMenu('user')}}>UŻYTKOWNIK</Button>
                            <Button type="submit" onClick={() => {setAddMenu('balance')}}>PORTFEL</Button>
                            <Button type="submit" onClick={() => {setAddMenu('transaction')}}>TRANSAKCJA</Button>
                            <Button type="submit" onClick={() => {setAddMenu('token')}}>TOKEN</Button>
                        </div>
                        {addMenu == 'user' &&
                            <div>
                                <div>
                                    <TextField
                                        label="Nazwa użytkownika"
                                        value={userName}
                                        onChange={event => setUserName(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" onClick={addUser}>Dodaj</Button>
                            </div>
                        }
                        {addMenu == 'balance' &&
                            <div>
                                <div>
                                    <TextField
                                        label="Nazwa użytkownika"
                                        value={userName}
                                        onChange={event => setUserName(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Adres portfela"
                                        value={balanceAddress}
                                        onChange={event => setBalanceAddress(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" onClick={addBalance}>Dodaj</Button>
                            </div>
                        }
                        {addMenu == 'transaction' &&
                            <div>
                                <div>
                                    <TextField
                                        label="Hash"
                                        value={transactionHash}
                                        onChange={event => setTransactionHash(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Od"
                                        value={transactionFrom}
                                        onChange={event => setTransactionFrom(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Do"
                                        value={transactionTo}
                                        onChange={event => setTransactionTo(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Token"
                                        value={transactionToken}
                                        onChange={event => setTransactionToken(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Ilość"
                                        value={transactionAmount}
                                        onChange={event => setTransactionAmount(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" onClick={addTransaction}>Dodaj</Button>
                            </div>
                        }
                        {addMenu == 'token' &&
                            <div>
                                <div>
                                    <TextField
                                        label="Nazwa tokenu"
                                        value={token}
                                        onChange={event => setToken(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" onClick={addToken}>Dodaj</Button>
                            </div>
                        }
                    </div>
                }
                {addOrShowMenu == 'show' &&
                    <div className="showSection">
                        <div className="showMenu">
                            <Button type="submit" onClick={() => {setShowMenu('user'); showUsers()}}>UŻYTKOWNICY</Button>
                            <Button type="submit" onClick={() => {setShowMenu('balancesOfUser')}}>PORTFELE UŻYTKOWNIKA</Button>
                            <Button type="submit" onClick={() => {setShowMenu('tokensOfBalance')}}>SALDO PORTFELA</Button>
                            <Button type="submit" onClick={() => {setShowMenu('transactions')}}>TRANSAKCJE</Button>
                            <Button type="submit" onClick={() => {setShowMenu('tokens'); showTokens()}}>TOKENY</Button>
                        </div>
                        {showMenu == 'user' &&
                            <table className='usersList'>
                                <thead>
                                    <tr>
                                        <th>Nazwa użytkownika</th>
                                        <th>Portfele</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userRows.map(row => {return <User
                                        key={row.key}
                                        name={row.user}
                                        balanceOnClick={() => {
                                            setOwnerOfBalances(row.user)
                                            showBalancesOfUser(row.user)
                                        }}
                                    />})}
                                </tbody>
                            </table>
                        }
                        {showMenu == 'balancesOfUser' &&
                            <div>
                                <div>
                                    <TextField
                                        label="Nazwa użytkownika"
                                        value={ownerOfBalances}
                                        onChange={event => setOwnerOfBalances(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" onClick={() => {showBalancesOfUser(undefined)}}>szukaj</Button>
                                <h3>Znaleziono {balanceRows.length} portfeli</h3>
                                <table className='balancesList'>
                                    <thead>
                                        <tr>
                                            <th>Adres</th>
                                            <th>Saldo</th>
                                            <th>Transakcje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balanceRows.map(row => {return <Balance
                                            key={row.key}
                                            address={row.balance}
                                            tokensOnClick={() => {
                                                showTokensOfBalance(row.balance)
                                            }}
                                            transactionsOnClick={() => {
                                                setTransactionHash('')
                                                setTransactionFrom('')
                                                setTransactionTo('')
                                                setTransactionFromOrTo(row.balance)
                                                setShowMenu('transactions')
                                                showTransactions('', '', '', row.balance)
                                            }}
                                            />})}
                                    </tbody>
                                </table>
                            </div>
                        }
                        {showMenu == 'tokensOfBalance' &&
                            <div>
                                <div>
                                    <TextField
                                        label="Adres"
                                        value={balanceAddress}
                                        onChange={event => setBalanceAddress(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" onClick={() => {showTokensOfBalance(undefined)}}>szukaj</Button>
                                <h3>Znaleziono {tokensOfBalanceRows.length} niezerowych pozycji</h3>
                                <table className='tokensOfBalanceList'>
                                    <thead>
                                        <tr>
                                            <th>Token</th>
                                            <th>Ilość</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokensOfBalanceRows.map(row => {return <TokenOfBalance
                                            key={row.key}
                                            name={row.token}
                                            amount={row.amount}
                                            />})}
                                    </tbody>
                                </table>
                            </div>
                        }
                        {showMenu == 'transactions' &&
                            <div>
                                <div>
                                    <div>
                                        <TextField
                                            label="Hash"
                                            value={transactionHash}
                                            onChange={event => setTransactionHash(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            label="Z adresu"
                                            value={transactionFrom}
                                            onChange={event => setTransactionFrom(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            label="Do adresu"
                                            value={transactionTo}
                                            onChange={event => setTransactionTo(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            label="Z lub do adresu"
                                            value={transactionFromOrTo}
                                            onChange={event => setTransactionFromOrTo(event.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" onClick={() => {showTransactions(undefined, undefined, undefined, undefined)}}>szukaj</Button>
                                </div>
                                <h3>Znaleziono {transactionRows.length} transakcji</h3>
                                <table className='transactionsList'>
                                    <thead>
                                        <tr>
                                            <th>Hash</th>
                                            <th>Z adresu</th>
                                            <th>Do adresu</th>
                                            <th>Token</th>
                                            <th>Ilość</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionRows.map(row => {return <Transaction
                                            key={row.key}
                                            transaction={row.transaction}
                                            fromOnClick={() => {
                                                showTokensOfBalance(row.transaction.from)
                                            }}
                                            toOnClick={() => {
                                                showTokensOfBalance(row.transaction.to)
                                            }}
                                            />})}
                                    </tbody>
                                </table>
                            </div>
                        }
                        {showMenu == 'tokens' &&
                            <table className='tokensList'>
                                <thead>
                                    <tr>
                                        <th>Nazwa tokenu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tokenRows.map(row => {return <Token
                                        key={row.key}
                                        name={row.token}
                                    />})}
                                </tbody>
                            </table>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default App;

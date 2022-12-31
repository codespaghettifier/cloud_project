const dbUtils = require('../neo4j/dbUtils')

const getTransactions = async(req, res) => {
    const session = dbUtils.getSession(req)
    try {
        // const query = `MATCH (user:User)-[:OWNS]->(balance:Balance) WHERE user.name = '${req.query.user}' RETURN balance.address`
        let query = `MATCH (transaction:Transaction),
            (transaction)-[:OF_TOKEN]->(token:Token),
            (transaction)-[:FROM]->(from:Balance),
            (transaction)-[:TO]->(to:Balance)`
        let wherePresent = false
        if(req.query.hash !== undefined)
        {
            query += ` WHERE transaction.hash = '${req.query.hash}'`
            wherePresent = true
        }
        if(req.query.from !== undefined)
        {
            query += wherePresent ? ` AND` : ` WHERE`
            query += ` from.address = '${req.query.from}'`
            wherePresent = true
        }
        if(req.query.to !== undefined)
        {
            query += wherePresent? ` AND` : ` WHERE`
            query += ` to.address = '${req.query.to}'`
            wherePresent = true
        }
        if(req.query.fromOrTo !== undefined)
        {
            query += wherePresent? ` AND` : ` WHERE`
            query += `(to.address = '${req.query.fromOrTo}' OR from.address = '${req.query.fromOrTo}')`
            wherePresent = true
        }
        query += ` RETURN transaction.hash, from.address, to.address, token.name, transaction.amount`
        const result = await session.writeTransaction(transaction => {
            return transaction.run(query)
        })

        if('records' in result)
        {
            records = []
            result.records.forEach(record => {
                records.push({
                    hash: record.get('transaction.hash'),
                    from: record.get('from.address'),
                    to: record.get('to.address'),
                    token: record.get('token.name'),
                    amount: record.get('transaction.amount')
                })
            })

            res.json({
                'status': 'success',
                'records': records
            })

            console.log("Found " + result.records.length + " records")
        }
        else res.json({'status': 'failure'})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    } finally {
        await session.close()
    }
}

const addTransaction = async(req, res) => {
    const session = dbUtils.getSession(req)
    console.log(req.body)
    try {
        const query = `CREATE (transaction:Transaction {hash: '${req.body.hash}', amount: '${req.body.amount}'}),
            (transaction)-[:OF_TOKEN]->(:Token {name: '${req.body.token}'}),
            (transaction)-[:FROM]->(:Balance {address: '${req.body.from}'}),
            (transaction)-[:TO]->(:Balance {address: '${req.body.to}'})
            RETURN transaction`
        const result = await session.writeTransaction(transaction => {
            return transaction.run(query)
        })

        if(result.records.length != 0) res.json({'status': 'success'})
        else res.json({'status': 'failure'})
        
        console.log(`Transaction: ${req.body.hash}, ${req.body.amount} ${req.body.token} from ${req.body.from} to ${req.body.to} created`)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    } finally {
        await session.close()
    }
}

module.exports = {
    getTransactions,
    addTransaction,
}
const dbUtils = require('../neo4j/dbUtils')

const getBalancesOfUser = async(req, res) => {
    const session = dbUtils.getSession(req)
    try {
        const query = `MATCH (user:User)-[:OWNS]->(balance:Balance) WHERE user.name = '${req.query.user}' RETURN balance.address`
        const result = await session.writeTransaction(transaction => {
            return transaction.run(query)
        })

        if('records' in result)
        {
            records = []
            result.records.forEach(record => {
                records.push(record.get('balance.address'))
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

const addBalace = async(req, res) => {
    const session = dbUtils.getSession(req)
    try {
        const query = `MATCH (user:User {name: '${req.body.user}'}) CREATE (user)-[:OWNS]->(balance:Balance {address: '${req.body.address}'}) RETURN balance`
        const result = await session.writeTransaction(transaction => {
            return transaction.run(query)
        })

        if(result.records.length != 0) res.json({'status': 'success'})
        else res.json({'status': 'failure'})
        
        console.log("Balance: " + req.body.user + ", " + req.body.address + " created")
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    } finally {
        await session.close()
    }
}

module.exports = {
    getBalancesOfUser,
    addBalace,
}
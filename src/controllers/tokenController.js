const dbUtils = require('../neo4j/dbUtils')


const getAllTokens = async(req, res) => {
    const session = dbUtils.getSession(req)
    try {
        const query = "MATCH (token:Token) RETURN token.name"
        const result = await session.writeTransaction(transaction => {
            return transaction.run(query)
        })

        if('records' in result)
        {
            records = []
            result.records.forEach(record => {
                records.push(record.get('token.name'))
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

const addToken = async(req, res) => {
    const session = dbUtils.getSession(req)
    try {
        const query = `CREATE (token:Token {name: '${req.body.name}'}) RETURN token`
        const result = await session.writeTransaction(transaction => {
            return transaction.run(query)
        })

        if(result.records.length == 1) res.json({'status': 'success'})
        else res.json({'status': 'failure'})
        
        console.log("Token: " + req.body.name + " created")
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    } finally {
        await session.close()
    }
}

module.exports = {
    getAllTokens,
    addToken,
}

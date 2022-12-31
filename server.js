const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.json());

app.use('/user', require('./src/routes/user'));
app.use('/balance', require('./src/routes/balance'));
app.use('/transaction', require('./src/routes/transaction'));
app.use('/token', require('./src/routes/token'));

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});



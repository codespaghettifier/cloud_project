const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000

app.use(express.json());

app.use('/user', require('./src/routes/user'));
app.use('/balance', require('./src/routes/balance'));
app.use('/transaction', require('./src/routes/transaction'));
app.use('/token', require('./src/routes/token'));


app.use(express.static(path.join(__dirname, 'cloud_project/build')));
if(process.env.NODE_ENV === 'production')
{ 
    app.use(express.static(path.join(__dirname, 'cloud_project/build')));
    app.get('*', (req, res) => {res.sendFile(path.join(__dirname = 'cloud_project/build/index.html'));  })
}

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});



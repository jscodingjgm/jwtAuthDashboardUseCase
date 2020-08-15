const express = require('express');
const userRouter = require('./routes/user');
const pageRouter = require('./routes/page');
//const bodyParser = require('body-parser');
const port = process.env.PORT;
require('./db/db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//app.use(express.json());
app.use('/page', pageRouter);
app.use('/api', userRouter);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
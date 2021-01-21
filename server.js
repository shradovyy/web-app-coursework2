const express = require("express");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const ObjectID = require('mongodb').ObjectID;

app.use(express.json());

app.use((req, res, next) => {
    console.log("Requested url: "+ req.url);
    next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});


// app.use((req, res, next) => {
//     console.log("image exists");
//     next();
// });


// connect to db
let db;
MongoClient.connect('mongodb+srv://root:superhardpassword@cluster0.lu2f0.mongodb.net/coursework2?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    db = client.db('coursework2');
});


app.param('collection', (req, res, next, collection) => {
    req.collection = db.collection(collection)
    return next();
});

// GET route to get all records from database
app.get('/api/:collection', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next();
        res.json(results);
    });
});

// POST route to add record to database
app.post('/api/:collection', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next();
        res.json(results.ops);
    });
});

// PUT route to update record in database
app.put('/api/:collection/:id', (req, res, next) => {
    req.collection.updateOne(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if(e || result.result.n !== 1) return next();
            res.json({ message: 'success' });
        });
});

// PUT route to reduce value of specified attribute of the record in database
app.put('/api/:collection/:id/reduce/:name/:value', (req, res, next) => {

    let value = -1 * parseInt(req.params.value);
    let name = req.params.name;

    const attr = {};
    attr[name] = value;

    req.collection.updateOne(
        { _id: new ObjectID(req.params.id) },
        { "$inc": attr },
        { safe: true, multi: false },
        (e, result) => {
            if(e || result.result.n !== 1) return next();
            res.json({ message: 'success' });
        });
});



let publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));


// 404 middleware
app.use((req, res) => {
    res.status(404).json({error: true, message: 'something went wrong'});
});

const port = process.env.PORT || 3000;

app.listen(port);



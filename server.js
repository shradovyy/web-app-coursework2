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

// app.use((req, res, next) => {
//     console.log("image exists");
//     next();
// });


// connect to db
let db;
MongoClient.connect('mongodb+srv://root:superhardpassword@cluster0.lu2f0.mongodb.net/coursework2?retryWrites=true&w=majority', (err, client) => {
    db = client.db('coursework2');
});


// GET route to get a list of lessons
app.get('/lessons', (req, res, next) => {
    db.collection('lessons').find({}).toArray((e, results) => {
        if (e) return next();
        res.json(results);
    });
});

// POST route to save an order
app.post('/order', (req, res, next) => {
    db.collection('orders').insert(req.body, (e, results) => {
        if (e) return next();
        res.send(results.ops);
    });
});



app.put('/decrease/:id', (req, res, next) => {

    let spaces = -1 * parseInt(req.body.spaces);
    db.collection('lessons').update({ "_id": new ObjectID(req.params.id) },
        { "$inc": { "availability": spaces } }, function (err, result) {
            if (err) return next();
            res.json({'message':'all is good'});
    });

});


app.use((req, res) => {
    res.status(404).json({'error': true, 'message': 'something went wrong'});
});

app.listen(3000);


// let publicPath = path.resolve(__dirname, 'public');
// app.use(express.static(publicPath));
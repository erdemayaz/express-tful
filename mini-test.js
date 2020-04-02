const express = require('express');
const exprestful = require('./index');

var app = express();

var exful = exprestful();

exful.api('/test1', true);
exful.api('/test2', false);
exful.api('/test3', "Agasdasd");
exful.api('/test4', 6543154654131316486464135168435138544135464153);
exful.api('/test5', -1 / 3);
exful.api('/test6', /w+/);

exful.api('/test7', {
    name: 'john',
    surname: 'doe'
}, (req, res, next) => {
    // make magic things...
    next();
});

exful.api('/test8', Promise.resolve("Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"));

exful.api('/test9', [{
    test: 1
}, {
    test: 4
}, 45, "asd"]);

exful.api('/test10', (req, res) => {
    res.send("Hobaa");
});

exful.api('/test11', {
    get: "Rotating black hole",
    post: {
        test: "Obj",
        test2: "QDDR"
    },
    put: Promise.resolve({
        test: "Obj",
        test2: 3.141
    }),
    delete: (req, res) => {
        res.json({
            O: "a"
        });
    }
});

app.use('/api', exful);

app.listen(3000, (err) => {
    console.log('listening 3000');
});
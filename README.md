# ExpRESTFUL

This project is a middleware of express.js framework. 


## Usage

Before initialize a express-tful.

    const  exprestful = require('express-tful');
    var exful = exprestful();

Then you can set the api. You can enter boolean, number, string, object, function or promise. And you can add middleware as 3. parameter.
Boolean:

    exful.api('/test1', true);
    exful.api('/test2', false);
String:

    exful.api('/test3', "Neque porro quisquam est qui dolorem");
Number:

    exful.api('/test4', 6543154654131316486464135168435138544135464153);
    exful.api('/test5', -1 / 3);
Regexp:

    exful.api('/test6', /w+/);
Object:

    exful.api('/test7',  { 
    name:  'john', 
    surname:  'doe'
    },  (req,  res,  next)  =>  { 
	    // make magic things...
	    next();
    });

Promise:

    exful.api('/test8',  Promise.resolve("Neque porro quisquam est qui dolorem"));
Array:

    exful.api('/test9',  [{test:  1},  {test:  4},  45,  "asd"]);
Function:

    exful.api('/test10',  (req,  res)  =>  {
	    res.send("Hobaa");
    });
And use all of them with methods:

    exful.api('/test11',  {
	    get: "Rotating black hole",
	    post: {test: "Obj", test2: "QDDR"},
	    put: Promise.resolve({test: "Obj", test2: 3.141}),
	    delete: (req,  res)  =>  { res.json({O: "a"}); }
    });

Finally you must mount to express with use:

    app.use('/api', exful);

You can visit the repository:

https://github.com/erdemayaz/express-tful
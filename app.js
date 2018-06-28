var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static('public'))//Public is the folder which has all the html,css&js files as a static resourse
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/meantest');//test is the DB
var db = mongoose.connection;//through this 'var db' we can comm. with Database

db.on('error', function () {
    console.log('Connection Failed!!');
});

db.on('open', function () {
    console.log('Connection is established!!');
    console.log(__dirname);
});

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required!"]
    },
    email: {    
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    isLoggedIn:{
        type: Boolean,
        default: false,
        required:true
    }
});

//Schema for Job Posting
var UserSchema1 = mongoose.Schema({
    jobtitle: {
        type: String,
        required: true
    },
    jobdescription: {
        type: String,
        required: [true, "Job Description is Required!"]
    },
    keywords: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true

    }
});


var User1 = mongoose.model('jobposting', UserSchema1);//User is the model name.

var User = mongoose.model('users', UserSchema);//User is the model name.


// var user1=new User({
// username:"admin",
// password:"420",
// email:"admin@gmail.com",
// location:"NJ",
// phone:"1345",
// usertype:"jobseeker"
// });
// user1.save();


// var user1=new User1({
//     jobtitle:"WebDeveloper",
//     jobdescription:"LALA",
//     keywords:"afcds",
//     location:"NJ",
// });
// user1.save();





// Put the data which sir gives here!
// var datArr =[
    
// ];

//Comment after 1 try of Insertion!

// for (let i = 0; i < datArr.length; i++) {
//     // const element = datArr[i];
//     var user1=new User(datArr[i]);
//     user1.save(); 

// }


// app.post('/createuser',function(req,res){
//     //When user fills the form this
//     //The data sent through post req from frontend is stored in req.body
//     console.log(req.body);
//     var user1=new User(req.body);
//     user1.save();

// });

app.post('/getUser', function(req, res){
    console.log(req.body);
   
    User.findOne({"isLoggedIn":true}, function(err, docs){
        console.log(docs);
if(!err){
    // res.send({'flg':'success', 'data':result});
    res.send({'flg':'success', "data":docs});
}
else{
    res.send({'flg':'fail', 'data':err})
}
    });
});

app.put('/logout',function(req,res){
console.log("Body:",req.body);
User.findOneAndUpdate({username:req.body.username},{"isLoggedIn":false},function(err,docs){
   
    if(!err){
        // res.send({'flg':'success', 'data':result});
        res.send({'flg':'success', "data":docs});
    }
    else{
        res.send({'flg':'fail', 'data':err})
    }
        });
    });
    



// app.post('/chkusername/',function(req,res){
//     console.log(req.body);
//     User.findOne({username:req.body.username},function(err,docs){
//                 docs.success=true;
//      })
// })

app.post('/login', function (req, res) {
    console.log(req.body);
    User.findOne({ username: req.body.username}, function (err, docs) {
        console.log(docs);

        if (!docs) {
            res.json({
                success: false,
                user: null,
                // isLoggedIn:false           //octomatics
            })
        } else {
            if (docs.password == req.body.password) {
                // docs[0].isLoggedIn=true;
                // console.log(docs[0].isLoggedIn);
                User.findOneAndUpdate({username:req.body.username},{$set:{'isLoggedIn':true}},function(err,data){
                    if(!err)
                    res.json({
                        success: true,
                        user: data,
                        // isLoggedIn:true
                    })
                })
                
              
            } else {
                res.json({
                    success: false,
                    user: null,
                    // isLoggedIn:false
                })
            }
        }
    })





    
})

app.put('/changeloginstatus',function(req,res){
    console.log('Inchange login status');
    console.log(req.body);
    User.findOneAndUpdate({ username: req.body.username},{"isLoggedIn":true}, function (err, docs) {
      res.send(docs);

        
    });
})


app.post('/post', function (req, res) {
    console.log(req.body);

    User1.find({ $or: [{ jobtitle: req.body.searchbytitle }, { keywords: req.body.keywords} , { location: req.body.location }] }, function (err, docs) {
        if (docs.length == 0) {
            console.log('null');
            res.json({
                success: false,
                user: null
               

            })
        } else {
            if (docs) {
                console.log(docs);
                res.json({
                    success: true,
                    user: docs
                })
            } else {
                console.log('Other error');
                res.json({
                    success: false,
                    user: null
                })
            }
        }


    });


});

app.post('/createuser', function (req, res) {
    //When user fills the form this
    //The data sent through post req from frontend is stored in req.body
    console.log(req.body);
    var user1 = new User(req.body);
    user1.save();

});

app.post('/postjob',function(req,res){
    //When user fills the form this
    //The data sent through post req from frontend is stored in req.body
    console.log(req.body);
    var user2=new User1(req.body);
    user2.save();

});



app.get('/', function (request, response) {
    response.sendFile(__dirname + 'public/index.html');
    console.log(__dirname);
})

app.get('/users', function (request, response) {//Every API has 1 req and 1 res in callback function
    // We created this API to send all users available in Database
    User.find({}, function (err, docs) {//docs is the collection
        if (err) {
            console.log('Bad DB Request');
        } else {
            // console.log('docs');
            response.json(docs); //this is what we send to frontend, frontend can access this docs as res.data
        }
    })
    // response.send('All users are displayed!');
});

// To get the job when the user will search!
app.get('/postjob', function (request, response) {//Every API has 1 req and 1 res in callback function
    // We created this API to send all users available in Database
    User1.find({}, function (err, docs) {//docs is the collection
        if (err) {
            console.log('Bad DB Request');
        } else {
            // console.log('docs');
            response.json(docs); //this is what we send to frontend, frontend can access this docs as res.data
        }
    })
    // response.send('All users are displayed!');
});


app.listen(8000, function () {
    console.log('Middleware/Express/Node/Backend is running on localhost:8000');
});

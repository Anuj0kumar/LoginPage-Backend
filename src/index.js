const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
//convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");  //use EJS  as view engine
app.use(express.static("public"));

app.engine('html',require('ejs').renderFile);
app.set("view engine", "html");  //use EJS  as view engine


app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/home", (req, res) => {
    res.render("home.ejs");
  });
  
  app.get("/home1", (req, res) => {
    res.render("home1.html");
  });

//resister User

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };
//chek if user already exists
const existingUser = await collection.findOne({name: data.name});
if (existingUser) {

    res.send("User already exists . please chose a different username. ");
   } else
   {
        // hash the password using bcrypt
    const saltRounds = 10;  //number of salt rounds 
    const hashedPassword = await bcrypt.hash(data.password,saltRounds);

    data.password = hashedPassword ; //replace the hash password with original password 
  const userdata = await collection.insertMany(data);
  console.log(userdata);
   
   res.render("login.ejs");   //after signup send user to login page 

          }
});




//login user
app.post("/login", async (req, res) => {
    try{
           const check = await collection.findOne({name : req.body.username});
           if(!check){
            res.send("username not found");
            }
            //compair hash password from the database with the plain text
            const isPasswordMatch = await bcrypt.compare(req.body.password,check.password);
            
            if(isPasswordMatch){
                res.render("home");
               }
            else
            {
                res.send("wrong password");
            }
    }
    catch
    {
         res.send("wrong Details");
    }

})

const port = 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
})

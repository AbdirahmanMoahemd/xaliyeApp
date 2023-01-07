const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const admin = require('../middlewares/admin');


const authRouter = express.Router(); 

// post Api
authRouter.post('/api/signup', async (req, res)=> {
    try {
        const { name, email, password,phone } = req.body;

    const userIsExists = await User.findOne({email});
    if(userIsExists){
        return res.status(400).json({msg:'user already exists'})
    }
    const hashedPassword = await bcryptjs.hash(password, 6);
    let user = new User({ 
        name, email, password:hashedPassword,phone
    });
    user = await user.save();
 
    res.json(user);
    } catch (e) {
        res.status(500).json({error:e.message})
    }
}) 

// Sign In Route
// Exercise
authRouter.post("/api/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "User with this email does not exist!" });
      }
  
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }
  
      const token = jwt.sign({ id: user._id }, "passwordKey");
      res.json({ token, ...user._doc });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
authRouter.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
      const verified = jwt.verify(token, "passwordKey");
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
      res.json(true);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
});
  
  // get user data
authRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
  });

authRouter.get("/users", admin, async (req, res) => {
    const users = await User.find();

    res.json(users);
  });
  
authRouter.get("/api/users/:id",auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id)

  
      if(user){
        res.json(user);
      }
  
      
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
});
  



authRouter.put("/api/update/profile/:id", auth, async (req, res) => {

  let user = await User.findById(req.params.id)
 
 

    if (user) {
        
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone = req.body.phone || user.phone
        user.address = req.body.address || user.address
        

        const updatedUser = await user.save() 
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            address: updatedUser.address,
            phone: updatedUser.phone,
        })
        
    }
    else {
        res.status(404)
        throw new Error ('User Not Found')
    }

})



authRouter.put("/api/update/profile/password/:id", auth, async (req, res) => {
  let user = await User.findById(req.params.id)
  const { password } = req.body;
 
 

    if (user) {
        
      const hashedPassword = await bcryptjs.hash(password, 6);
        
      user.password = hashedPassword || user.password  

      user = await user.save() 
        
      res.json(user)
        
    }
    
    else {
        res.status(404)
        throw new Error ('User Not Found')
    }

})



authRouter.post("/api/update/forgot/email", async (req, res) => {

  
  const { email, phone } = req.body;
 
 
    let  user = await User.findOne({ email,phone });
    if (user) {
        
        
      res.json(user)
        
    }
    else if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email and phone does not exist!" });
    }
    
    else {
        res.status(404)
        throw new Error ('User Not Found')
    }

})

authRouter.put("/api/update/forgot/password", async (req, res) => {
 
  const { password, email } = req.body;
 
  let user = await User.findOne({email})

    if (user) {
        
      const hashedPassword = await bcryptjs.hash(password, 6);
        
      user.password = hashedPassword || user.password  

      user = await user.save() 
        
      res.json(user)
        
    }
    
    else {
        res.status(404)
        throw new Error ('User Not Found')
    }

})


authRouter.put("/api/update/type/:id", admin, async (req, res) => {
    let user = await User.findById(req.params.id)
    const { type } = req.body;
   
   
  
      if (user) {
          
        
          
        user.type = type || user.type  
  
        user = await user.save() 
          
        res.json(user)
          
      }
      
      else {
          res.status(404)
          throw new Error ('User Not Found')
      }
  
})
  

module.exports = {authRouter}
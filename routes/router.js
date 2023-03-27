const express = require("express");
const router = express.Router();
const users = require("../models/userSchema");
const userslogin = require("../models/loginSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

// Signup user

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(422).json("plz fill the data");
  }

  try {
    const preuser = await userslogin.findOne({ username: username });
    if (preuser) {
      return res.status(422).json("this is user is already present");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

    const addsignup = new userslogin({
      username,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });
    await addsignup.save();

    const token = jwt.sign(
      { username: addsignup.username, id: addsignup._id },
      SECRET_KEY
    );
    res.status(201).json({ user: addsignup, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// login user

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await userslogin.findOne({ username: username });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentails" });
    }

    const token = jwt.sign(
      { username: existingUser.username, id: existingUser._id },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// register user

router.post("/register", verifyAuth, async (req, res) => {
  // console.log(req.body);
  const { name, email, age, mobile, work, add, desc } = req.body;

  if (!name || !email || !age || !mobile || !work || !add || !desc) {
    res.status(422).json("plz fill the data");
  }

  try {
    const preuser = await users.findOne({ email: email });
    console.log(preuser);

    if (preuser) {
      res.status(422).json("this is user is already present");
    } else {
      const adduser = new users({
        name,
        email,
        age,
        mobile,
        work,
        add,
        desc,
      });

      await adduser.save();
      res.status(201).json(adduser);
      console.log(adduser);
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

// get userdata

router.get("/getdata", verifyAuth, async (req, res) => {
  try {
    const userdata = await users.find();
    res.status(201).json(userdata);
    console.log(userdata);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get individual user

router.get("/getuser/:id", verifyAuth, async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const userindividual = await users.findById({ _id: id });
    console.log(userindividual);
    res.status(201).json(userindividual);
  } catch (error) {
    res.status(422).json(error);
  }
});

// update user data

router.patch("/updateuser/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const updateduser = await users.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log(updateduser);
    res.status(201).json(updateduser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// delete user
router.delete("/deleteuser/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletuser = await users.findByIdAndDelete({ _id: id });
    console.log(deletuser);
    res.status(201).json(deletuser);
  } catch (error) {
    res.status(422).json(error);
  }
});

function verifyAuth(req, res, next) {
  let token = req.headers.authorization;
  console.warn(token);
  if (token) {
    console.warn("middleware called if", token);
    jwt.verify(token, SECRET_KEY, (err, valid) => {
      if (err) {
        res.send("token error");
      } else {
        next();
      }
    });
  } else {
    res.send("token not found");
  }
}

module.exports = router;

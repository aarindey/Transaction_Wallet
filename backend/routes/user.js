const express = require("express");
const zod = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/config");
const authMiddleware = require("../middlewares/authMiddleware");
const Account = require("../models/Account");

const signupBody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const validatedBody = signupBody.safeParse(req.body);
  if (!validatedBody.success) {
    return res
      .status(411)
      .json({ message: "Error while logging in. Incorrect Inputs.." });
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(411).json({ message: "User already present.." });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  const userId = user._id;

  const account = await Account.create({
    userId: userId,
    balance: Math.random() * 10000,
  });

  const token = jwt.sign({ userId: userId }, JWT_SECRET);

  res.status(200).json({
    message: "User succesfully created!",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

// this is a protected route. Hence the authMiddleware..
router.post("/signin", authMiddleware, async (req, res) => {
  const validatedBody = signinBody.safeParse(req.body);
  if (!validatedBody.success) {
    res.status(411).json({ message: "Incorrect Inputs!" });
  }
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const userId = user._id;
    const token = jwt.sign({ userId: userId }.JWT_SECRET);
    res.status(200).json({
      message: "Login Successful!",
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in..",
  });
});

module.exports = router;

const updateBody = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});

//route to update the user information
router.put("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const validatedBody = updateBody.safeParse(req.body);
  if (!validatedBody.success) {
    res.status(403).json({
      message: "Error while updating information...",
    });
  }

  await User.updateOne({ _id: userId }, req.body);
});

// a get request to get the users with the given filter criteria
router.get("/bulk", async (req, res) => {
  const filter = req.params.filter || "";
  const users = await User.find({
    $or: [{ firstname: { $regex: filter } }, { lastname: { $regex: filter } }],
  });

  res.json({
    message: "Update Successful...",
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});

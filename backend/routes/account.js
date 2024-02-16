const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const Account = require("../models/Account");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const account = await Account.findOne({ userId: userId });
  if (!account) {
    res.status(403).json({
      message: "Error encountered while fetching account information...",
    });
  }

  res.status(200).json({
    balance: account.balance,
  });
});

// not working for some reason
// router.post("/transfer", authMiddleware, async (req, res) => {
//   const session = mongoose.startSession();
//   session.startTransaction();

//   const { to, amount } = req.body;
//   console.log(req.body);
//   const account = await Account.findOne({ userId: req.userId }).session(
//     session
//   );
//   if (!account || account.balance < amount || amount <= 0) {
//     await session.abortTransaction();
//     res.status(400).json({ message: "Account Missing/Insufficient Balance" });
//   }
//   const toAccount = await Account.findOne({ userId: to }).session(session);

//   if (!toAccount) {
//     await session.abortTransaction();
//     res.status(400).json({
//       message: "Account to transfer amount to not found!!",
//     });
//   }

//   //perform the transfer
//   await Account.updateOne(
//     { userId: req.userId },
//     { $inc: { balance: -amount } }
//   );
//   await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

//   //commit the transaction
//   await session.commitTransaction();

//   res.json({ message: "Transfer Successful" });
// });

router.post("/transfer", authMiddleware, async (req, res) => {
  const { amount, to } = req.body;

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (account.balance < amount || amount <= 0) {
    return res.status(400).json({
      message: "Insufficient balance/Can't send negative amount",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  });

  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  );

  res.json({
    message: "Transfer successful",
  });
});

module.exports = router;

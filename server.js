const bodyParser = require("body-parser");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const httpServer = createServer(app);

app.use(express.static(__dirname));
app.use(bodyParser.json());

const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

const io = new Server(httpServer, {});

const CONN_STR =
  "mongodb+srv://kewinchat:vKRngQ4FnLoG2Iie@cluster0.xetljo5.mongodb.net/";

app.get("/messages", (req, res) => {
  Message.find({}).then((messages) => {
    res.send(messages);
  });
});

app.post("/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    io.emit("new message", req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);
  }

  message
    .save()
    .then((savedDoc) => {
      io.emit("new message", req.body);
      res.sendStatus(200);
    })
    .catch((err) => {
      sendStatus(500);
    });
});

io.on("connection", (socket) => {
  console.log("user connected");
});

mongoose
  .connect(CONN_STR)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

httpServer.listen(3009, () => {
  console.log(`server is listening on port 3009`);
});

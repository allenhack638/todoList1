const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Cryptr = require('cryptr');
const dotenv = require("dotenv")
const cryptr = new Cryptr('myTotallySecretKey');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())

mongoose.set("strictQuery", false);
const url = process.env.CONNECTION_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to database successfully"))
    .catch(console.error)

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String
    }
});
const User = mongoose.model("User", userSchema)

const todosSchema = new mongoose.Schema({
    userId: String,
    todos: [{
        text: String
    }]
});
const Todos = mongoose.model("Todos", todosSchema);

app.post("/register", async (req, res) => {
    const { username, pass } = req.body;
    const encryptedPass = cryptr.encrypt(pass);
    const users = await User.findOne({ name: username });
    if (users) {
        res.status(500);
        res.json({
            message: "user already exsists",
        })
        return;
    }
    const user = new User({ name: username, password: encryptedPass });
    await user.save();
    res.json({
        message: "Registration Success",
    });
})

app.post("/login", async (req, res) => {
    const { username, pass } = req.body;
    const users = await User.findOne({ name: username });
    if (!users || cryptr.decrypt(users.password) !== pass) {
        res.status(403);
        res.json({
            message: "Invalid Login",
        })
        return;
    }
    res.json({
        message: "Login Success!!",
    })
})

app.post("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [username, pass] = token.split(":");
    const todoItems = req.body;
    const users = await User.findOne({ name: username })

    const decryptedPass = cryptr.decrypt(users.password);
    if (!users || decryptedPass !== pass) {
        res.status(403);
        res.json({
            message: "Invalid Login",
        })
        return;
    }
    const todos = await Todos.findOne({ userId: users._id });
    if (!todos) {
        await Todos.create({
            userId: users._id,
            todos: todoItems
        });
    } else {
        todos.todos = todoItems;
        await todos.save();
    }
    res.json({
        message: "Success"
    });
})

app.get("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [username, pass] = token.split(":");
    const users = await User.findOne({ name: username })

    const decryptedPass = cryptr.decrypt(users.password);
    if (!users || decryptedPass !== pass) {
        res.status(403);
        res.json({
            message: "Invalid Login",
        })
        return;
    }
    const available = await Todos.findOne({ userId: users._id });
    if (available !== null) {
        const { todos } = await Todos.findOne({ userId: users._id });
        res.json(todos);
    } else
        return;

})

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        function (err) {
            res.status(500).send(err);
        }
    );
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, (console.log("Port Successfully strated on port 5000")))
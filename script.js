const express = require("express");
const methodOverride = require("method-override");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const userRouter = require("./routes/users");
app.use("/users", userRouter);

app.get("/", (req, res) => res.redirect("/users"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port - ${PORT}`));

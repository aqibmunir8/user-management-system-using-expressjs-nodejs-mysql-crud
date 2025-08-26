const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { main } = require("../sql/sql");

// Home - list all users
router.get("/", async (req, res) => {
  try {
    const users = await main("SELECT * FROM users");
    res.render("index", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Show add form
router.get("/new", (req, res) => {
  res.render("add");
});

// Handle add
router.post("/", async (req, res) => {
  const userid = uuidv4();
  const { username, email, password } = req.body;
  try {
    await main(
      "INSERT INTO users (userid, username, email, password) VALUES (?, ?, ?, ?)",
      [userid, username, email, password]
    );
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Edit form
router.get("/:userid/edit", async (req, res) => {
  const { userid } = req.params;
  try {
    const results = await main("SELECT * FROM users WHERE userid = ?", [userid]);
    res.render("edit", { user: results[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Update
router.patch("/:userid", async (req, res) => {
  const { userid } = req.params;
  const { password: formPass, username: newUserName } = req.body;
  try {
    const results = await main("SELECT * FROM users WHERE userid = ?", [userid]);
    const user = results[0];
    if (!user) return res.send("User not found");
    if (formPass !== user.password) {
      return res.send("<h2 style='color:red'>Wrong Password</h2>");
    }
    await main("UPDATE users SET username=? WHERE userid=?", [newUserName, userid]);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Delete confirmation page
router.get("/:userid/delete", async (req, res) => {
  const { userid } = req.params;
  try {
    const results = await main("SELECT * FROM users WHERE userid=?", [userid]);
    res.render("delete", { user: results[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Handle delete
router.delete("/:userid", async (req, res) => {
  const { userid } = req.params;
  const { password: formPass } = req.body;
  try {
    const results = await main("SELECT * FROM users WHERE userid=?", [userid]);
    const user = results[0];
    if (!user) return res.send("User not found");
    if (formPass !== user.password) {
      return res.send("Wrong Password");
    }
    await main("DELETE FROM users WHERE userid=?", [userid]);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

module.exports = router;

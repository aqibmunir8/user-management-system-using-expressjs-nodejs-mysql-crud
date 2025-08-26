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
    res.status(500).send("Database error");
  }
});

// Show add form
router.get("/new", (req, res) => {
  res.render("add");
});

// Handle add
router.post("/", async (req, res) => {
  const id = uuidv4();
  const { username, email, password } = req.body;
  console.log(req.body)
  try {
    await main("INSERT INTO users (userid, username, email, password) VALUES (?, ?, ?, ?)",
      [id, username, email, password]);
    console.log("Yo")
    res.redirect("/users");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Edit form
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await main("SELECT * FROM users WHERE id = ?", [id]);
    res.render("edit", { user: results[0] });
  } catch  {
    res.status(500).send("DB Error");
  }
});

// Update
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { password: formPass, username: newUserName } = req.body;
  try {
    const results = await main("SELECT * FROM users WHERE id = ?", [id]);
    const user = results[0];
    if (formPass !== user.password) {
      return res.send("<h2 style='color:red'>Wrong Password</h2>");
    }
    await main("UPDATE users SET username=? WHERE id=?", [newUserName, id]);
    res.redirect("/users");
  } catch {
    res.status(500).send("DB Error");
  }
});

// Delete confirmation page
router.get("/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await main("SELECT * FROM users WHERE id=?", [id]);
    res.render("delete", { user: results[0] });
  } catch {
    res.status(500).send("DB Error");
  }
});

// Handle delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { password: formPass } = req.body;
  try {
    const results = await main("SELECT * FROM users WHERE id=?", [id]);
    const user = results[0];
    if (formPass !== user.password) {
      return res.send("<h2 style='color:red'>Wrong Password</h2>");
    }
    await main("DELETE FROM users WHERE id=?", [id]);
    res.redirect("/users");
  } catch {
    res.status(500).send("DB Error");
  }
});

module.exports = router;

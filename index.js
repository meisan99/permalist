import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

/**
 * @typedef {{ id: number, title: string }} Item
 */

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT)
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

/**
 * @returns { Promise<Item[]> }
 */
async function GetItems() {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  const items = result.rows.map(m => ({ id: parseInt(m.id), title: m.title }));

  return items;
}

app.get("/", async (req, res) => {
  const items = await GetItems();

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

});

app.post("/add", async (req, res) => {
  const itemId = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [itemId]);
  }
  catch (err) {
    console.error(err instanceof Error ? err.stack : err);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {

  try {
    const { updatedItemId, updatedItemTitle } = req.body;
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, updatedItemId]);
  }
  catch (err) {
    console.error(err instanceof Error ? err.stack : err);
  }

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  try {
    const itemId = req.body.deleteItemId;
    await db.query("DELETE FROM items WHERE id = $1", [itemId]);
  }
  catch (err) {
    console.error(err instanceof Error ? err.stack : err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

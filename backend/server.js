
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'myRoot@123',
  database: 'test',
});

app.get("/", (req,res) => {
    return res.json("testing")
})

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM transactions', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(3001, () => console.log('Server running on port 3001'));

require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/inhumans', async(req, res) => {
  const data = await client.query('SELECT * from inhumans');

  res.json(data);
});
// params are :id shit. and querys are ?anything=stuff
app.get('/inhumans/:id', async(req, res) => {
  const data = await client.query(`SELECT * from inhumans WHERE id=${req.params.id}`);

  res.json(data.rows[0]);
});

app.post('/create', async(req, res) => {

  try {
  
    const data = await client.query(
      `INSERT into inhumans (name, cool_factor, power, owner_id, is_royal)
      values ($1, $2, $3, $4, $5)
      RETURNING *`,
      [req.body.name, req.body.cool_factor, req.body.power, req.body.owner_id, req.body.is_royal]

    );
    res.json(data.rows[0]);
  } catch(e) {
console.log(e);
    res.json(e);

  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;

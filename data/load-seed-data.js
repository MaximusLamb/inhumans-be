const client = require('../lib/client');
// import our seed data:
const inhumans = require('./inhumans.js');
const usersData = require('./users.js');
const alignments = require('./alignments.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      alignments.map(alignment => {
        return client.query(`
                    INSERT INTO alignments (alignment)
                    VALUES ($1)
                `,
        [alignment.alignment]);
      })
    );

    await Promise.all(
      inhumans.map(inhumans => {
        return client.query(`
                    INSERT INTO inhumans (name, cool_factor, power, owner_id, is_royal, alignment_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `,
        [inhumans.name, inhumans.cool_factor, inhumans.power, user.id, inhumans.is_royal, inhumans.alignment_id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}

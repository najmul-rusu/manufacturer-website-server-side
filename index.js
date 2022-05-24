const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port =process.env.PORT || 5000;

// Middleware.
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0vic.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      console.log('Database Connected');
      




    } finally {

    }
  }
  run().catch(console.dir);

  
app.get('/', (req, res) => {
  res.send('EveDiva Server Side!');
})

app.listen(port, () => {
  console.log(`EveDiva listening on port ${port}`);
})
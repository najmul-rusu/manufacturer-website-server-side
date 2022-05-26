const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware.
app.use(cors());
app.use(express.json());

//? Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0vic.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//? Server Stablish
async function run() {
  try {
    await client.connect();

    const productCollection = client
      .db("evediva_manufacturer")
      .collection("products");

    //? get all product
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const Products = await cursor.toArray();
      res.send(Products);
    });

    //? get product item by id
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });



  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EveDiva Server Side!");
});

app.listen(port, () => {
  console.log(`EveDiva listening on port ${port}`);
});

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

    const userCollection = client
      .db("evediva_manufacturer")
      .collection("users");

    const reviewCollection = client
      .db("evediva_manufacturer")
      .collection("reviews");

    
    app.post("/create-payment-intent", verifyJWT, async (req, res) => {
      const product = req.body;
      const price = product.price;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    /* //? get all product
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

    // Add Products
    app.post("/addproduct", async (req, res) => {
      const newproduct = req.body;
      const result = await productCollection.insertOne(newproduct);
      res.send(result);
    });

    //? delete an product item
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.deleteOne(query);
      res.send(product);
    });

    //load all  user
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ result, token });
    });

    

    //user to make an  admin

    app.put("/user/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const requester = req.decoded.email;
      const requesterAccount = await userCollection.findOne({
        email: requester,
      });
      if (requesterAccount.role === "admin") {
        const filter = { email: email };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      } else {
        res.status(403).send({ message: "forbidden" });
      }
    });

    // admin access verify from db

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    }); */


    // get all product
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const Products = await cursor.toArray();
      res.send(Products);
  });

  // get product item by id
  app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const product = await productCollection.findOne(query);
      res.send(product);
  });


  app.get('/reviews', async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
  });


  app.post('/reviews', async (req, res) => {
      const reviews = req.body;
      const query = { name: reviews.name, email: reviews.email }
      const exists = await reviewCollection.findOne(query);
      if (exists) {
          return res.send({ success: false, reviews: exists })
      }
      const result = await reviewCollection.insertOne(reviews);
      return res.send({ success: true, result });
  })


  //load all  user
  app.get('/user', verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
  });


  //user info save krbo database e
  app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
          $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.send({ result, token });
  })


  //user to make an  admin
  app.put('/user/admin/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const requester = req.decoded.email;
      const requesterAccount = await userCollection.findOne({ email: requester });
      if (requesterAccount.role === 'admin') {
          const filter = { email: email };
          const updateDoc = {
              $set: { role: 'admin' },
          };
          const result = await userCollection.updateOne(filter, updateDoc);
          res.send(result);
      }
      else {
          res.status(403).send({ message: 'forbidden' });
      }

  })


  // admin access verify from db
  app.get('/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
  })


  // app.get('/profile/:email', async (req, res) => {
  //     const email = req.params.email;
  //     const Puser = await userCollection.findOne({ email: email });

  //     res.send(Puser)
  // })


  app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });

      res.send(user)
  })


  //add product
  app.post('/addproduct', async (req, res) => {
      const newitem = req.body;
      const result = await productCollection.insertOne(newitem);
      res.send(result);
  });

  //delete
  app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)
};
      const inventory = await productCollection.deleteOne(query);
      res.send(inventory);
  });



  /* function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "UnAuthorized access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verifyapp.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ result, token });
    }); */

    //jwt
    function verifyJWT(req, res, next) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          return res.status(401).send({ message: 'UnAuthorized access' });
      }
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
          if (err) {
              return res.status(403).send({ message: 'Forbidden access' })
          }
          req.decoded = decoded;
          next();
      });
  }



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

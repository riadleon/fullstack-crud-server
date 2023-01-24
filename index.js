const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.afq9fgb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const userCollection = client.db('fullstack').collection('users');




       

        app.post('/users', async (req, res) => {
            const store = req.body;
            const result = await userCollection.insertOne(store);
            res.send(result);
            console.log('Data added successfully...');
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const stored = await cursor.toArray();
            res.send(stored);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const store = await userCollection.findOne(query);
            res.send(store);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    first: user.first,
                    last: user.last,
                    ph:user.ph
                }
            };
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        });








    } finally {

    }
}



run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('fullstack-crud server is running')
})

app.listen(port, () => {
    console.log(`fullstack-crud server running on ${port}`);
})
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Middle
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjja2r0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        /*----------------------
            All Collection here
        -----------------------*/

        const classCollection = client.db('fllsDB').collection('classes');
        const selectedClassCollection = client.db('fllsDB').collection('selectedClasses');
        const userCollection = client.db('fllsDB').collection('users');


        /*--------------------------
            classes collection apis
        ----------------------------*/

        // get some data with email specific
        app.get('/classes', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { instructorEmail: req.query.email };
            }
            const result = await classCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/classes', async (req, res) => {
            const newClass = req.body;
            const result = await classCollection.insertOne(newClass);
            res.send(result);
        })

        /*--------------------------
            classes collection apis
        ----------------------------*/
        // get some data with email query
        app.get('/selectedClasses', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { userEmail: req.query.email };
            }
            const result = await selectedClassCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/selectedClasses', async (req, res) => {
            const selectedClass = req.body;
            const result = await selectedClassCollection.insertOne(selectedClass);
            res.send(result);
        })

        app.delete('/selectedClasses/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await selectedClassCollection.deleteOne(query);
            res.send(result);
        })


        /*--------------------------
            Users collection apis
        ----------------------------*/

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;

            const query = {email: user.email};
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exits' });
            }

            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Foreign Language Learning School is Running!!');
})

app.listen(port, () => {
    console.log(`Foreign Language Learning School is running on port: ${port}`);
})
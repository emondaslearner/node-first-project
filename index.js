
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const Object = require('mongodb').ObjectId;
const uri = 'mongodb+srv://mongodb:hellomongo@cluster0.9pksi.mongodb.net/data?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res) => {
  res.sendFile(__dirname+'/nodeProject/index.html');
})
client.connect(err => {
  const collection = client.db("data").collection("calldata");

  app.get('/update/:id',(req,res) => {
    collection.find({_id:Object(req.params.id)})
    .toArray((err,documents) => {
      res.send(documents[0]);
    })
  })
  app.patch('/productUpdate/:id',(req,res) => {
    collection.updateOne({_id:Object(req.params.id)},{
      $set:{quantity:req.body.productItem.quantity,prize:req.body.productItem.prize}
    })
    .then(result => {
      console.log('success');
    })
  })
  app.get('/products',(req,res) => {
    collection.find({})
    .toArray((err,documents) => {
      res.send(documents);
    })
  })

  app.delete('/delete/:id',(req,res) => {
    collection.deleteOne({_id:Object(req.params.id)})
    .then(result => {
      console.log(result);
    })
  })

  app.post('/add',(req,res) => {
    collection.insertOne(req.body)
    .then(result => {
      res.redirect('/');
    })
  })
});




app.listen(3200,() => console.log('listen will start in port 4000'))
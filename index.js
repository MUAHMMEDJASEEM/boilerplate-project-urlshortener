require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
const bodyParser = require('body-parser');
const uri = "mongodb+srv://mj:mj@cluster1.zdgfwuu.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
;
function getRandomInt() {
  return Math.floor(Math.random() * 10000);
}
const shortSchema = new mongoose.Schema({
  uri: String, _id: {
    type: Number
  }
})
const short = mongoose.model('short', shortSchema);

app.use(bodyParser.urlencoded({ extended: false }));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
app.post("/api/shorturl", (req, res) => {
  if (req.body.url.includes("http")) {
    var new_user = new short({
      uri: req.body.url, _id: getRandomInt()
    })

    new_user.save(function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result)
        res.json({ original_url: req.body.url, short_url: new_user._id })
      }

    })
  }
  else {
    res.json({ error: 'invalid url' })
  }
}
)
app.get("/api/shorturl/:id", (req, res) => {
  short.findById(parseInt(req.params.id), (err, data) => {
    if (err) console.log(err)
    console.log(data.uri)
    res.redirect(data.uri)
  })
})
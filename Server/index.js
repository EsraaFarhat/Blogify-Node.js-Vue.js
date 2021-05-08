const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const blogs = require('./routes/blogs');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}


mongoose.connect('mongodb://localhost/blogSite', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log("connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/blogs', blogs);
app.use('/api/users', users);
app.use('/api/auth', auth);


const port = process.env.PORT || 3000;
app.listen(3000, ()=> {
    console.log(`listening on port ${port}...`);
});

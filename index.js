const fs = require('fs');
const express = require('express');

const app = express();
app.listen(3000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: 'true' }));


// home page - redirects to users
app.get('/', (req, res) => {
  res.redirect('/users');
});


// users page - show all users
app.get('/users', (req, res) => {
  fs.readFile('./data/data.txt', (err, data) => {
    const users = JSON.parse(data.toString()).users;
    res.render('users', { users: users });
  })
});


// user page (get) - show the add user form
app.get('/user', (req, res) => {
  res.render('addUser');
});


// user page (post) - add the new user to data base and redirect to /users page
app.post('/user', (req, res) => {
  fs.readFile('./data/data.txt', (err, data) => {
    const users = JSON.parse(data.toString());
    const new_data = {
      "id": new Date(),
      "name": req.body.name,
      "college": req.body.college,
      "address": req.body.address
    }
    users.users.push(new_data);
    fs.writeFile('./data/data.txt', JSON.stringify(users), () => {
      res.redirect('/users');
    })
  })
});


// single user details
app.get('/user/:id', (req, res) => {
  fs.readFile('./data/data.txt', (err, data) => {
    const users = JSON.parse(data.toString()).users;
    const user = users.filter((user) => {
      if (user.id == req.params.id) {
        return user;
      }
    })
    res.render('user', { user: user[0] });
  })
})


//delete user
app.post('/user/:id', (req, res) => {
  fs.readFile('./data/data.txt', (err, data) => {
    const users = JSON.parse(data.toString());
    const new_users = users.users.filter((user) => {
      if (!(user.id == req.params.id)) {
        return user;
      }
    })
    users.users = new_users
    fs.writeFile('./data/data.txt', JSON.stringify(users), () => {
      res.redirect('/users');
    })
  })
})
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('body');
});

router.get('/dashboard', (req, res) => {
    var token = localStorage.getItem('authtoken');
    if (!token) {
        res.redirect('/page/login');
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            res.redirect('/page/login');
        }

        res.render('dashboard');
    });
});

router.get('/dashboard/admin', async (req, res) => {
    var token = localStorage.getItem('authtoken');
    if (!token) {
        res.redirect('/page/login');
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            res.redirect('/page/login');
        }

        res.render('admin/dashboard', {
            'showView' : 'shoppingList'
        });
    });
});

router.get('/dashboard/admin/addUser', async (req, res) => {
    var token = localStorage.getItem('authtoken');
    if (!token) {
        res.redirect('/page/login');
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            res.redirect('/page/login');
        }
        res.render('admin/dashboard', {
            'showView' : 'addUser'
        });
    });
});

router.get('/dashboard/admin/userList', async (req, res) => {
    var token = localStorage.getItem('authtoken');
    if (!token) {
        res.redirect('/page/login');
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
            res.redirect('/page/login');
        }
        const users = await User.findAllUsers();
        console.log('users>>>>>>>>', users);
        res.render('admin/dashboard', {
            'showView' : 'userList',
            'usersList' : users
        });
    });
});


module.exports = router
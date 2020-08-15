const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        if(typeof req.body.role == 'undefined' || req.body.role == ''){
            req.body.role = 'normal';
        }
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        localStorage.setItem('authtoken', token);
        if(req.body.role == 'normal'){
            res.redirect('/page/dashboard');
        }else{
            res.redirect('/page/dashboard/admin');
        }
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post('/admin/users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        localStorage.setItem('authtoken', token);
        res.redirect('/page/dashboard/admin/userList');
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken();
        localStorage.setItem('authtoken', token);
        if(user.role == 'admin'){
            res.redirect('/page/dashboard/admin');
        }else{
            res.redirect('/page/dashboard');
        }
    } catch (error) {
        res.status(400).send(error)
    }

});

router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
});

router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        });
        await req.user.save();
        localStorage.removeItem('authtoken');
        console.log('>>>>>>>>>>', )
        res.redirect('/page/login');
    } catch (error) {
        res.status(500).send(error)
    }
});

// router.post('/users/me/logoutall', auth, async(req, res) => {
//     // Log user out of all devices
//     try {
//         req.user.tokens.splice(0, req.user.tokens.length)
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send(error)
//     }
// });

module.exports = router
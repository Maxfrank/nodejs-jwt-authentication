const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', {expiresIn : '30m'}, (err, AuthData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                AuthData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'maxfrank',
        email: 'maf@gmail.com',
        roles: [
            'admin',
            'superuser'
        ]
    };
    jwt.sign({user: user}, 'secretkey', (err, token) => {
        res.json({
            token: token
        })
    });
});

// Format of token
// Authorization: Bearer <access_token>

// Verify token
function verifyToken(req, res, next) {
    // Get the auth header value
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // call the next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('Server started on port 5000'));
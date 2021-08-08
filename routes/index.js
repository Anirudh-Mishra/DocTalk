const express = require('express')
const router = express.Router();
const { det } = require('../config/dets');
const url = require('url');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});


// Welcome page
router.get('/', (req, res) => res.render('home'));
     
router.get('/users/chatroom/:room', (req, res) => {
    
    res.render('chatroom', { roomName : req.params.room, name: req.query.name });
})

module.exports = router;
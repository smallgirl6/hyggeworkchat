
const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
    res.render('index');
});
router.get('/profiles', (req, res) => {
res.render('profiles')
});
router.get('/chat', (req, res) => {
res.render('chat')
});
router.get('/document', (req, res) => {
res.render('document')
});

module.exports = router;
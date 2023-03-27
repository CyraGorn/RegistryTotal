const express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    // console.log(req.params.id);
    var id = req.query.id;
    res.send('router admin get ' + id)
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.send('router admin post ' + req.body)
});

module.exports = router;
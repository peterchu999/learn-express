const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.isAuthenticated())
    res.render('landing')
})


module.exports = router
const express = require('express')
const app = express()
const port = 3000
app.get('/', (req, res) => {
    res.send('Hi there!')
})

app.get('/req/:subdirect', (req, res) => {
    const {subdirect} = req.params
    res.send(`you're on sub of req which is ${subdirect}`)
})

app.get("*", (req, res) => {
    res.send("404 Not Found")
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
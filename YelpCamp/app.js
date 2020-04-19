const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const port = 3000

const Campground = require('./models/campground')
const Comment = require('./models/comment')
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true,  useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, datas) => {
        if (err) {
            console.log(`here is the error : ${err}`)
        } else {
            res.render('campgrounds', {campgrounds: datas})
        }
    })
})

app.get('/campgrounds/add', (req, res) => {
    res.render('add-camp')
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    try {
        const camp = await Campground.findById(id).populate('comments').exec()
        res.render('show', {campground: camp})  
    } catch (error) {
        res.send(`${error}`)
    }
    
})

app.post('/campgrounds', (req, res) => {
    const {campName, campImg, description} = req.body
    Campground.create({
        name: campName,
        image: campImg,
        description: description
    }, (err, data) => {
        if (err) {
            console.log(`here is the error : ${err}`)
        } else {
            console.log(`${data} success`)
        }
    })
    res.redirect('/campgrounds')
})

app.post('/campgrounds/:id/comments', (req, res) => {
    const {comment} = req.body
    const {id} = req.params
    Comment.create({text: comment, author: 'Author'},
    (err, createdComment) => {
        if (err) {
            console.log(err)
        } else {
            Campground.findById(id, (err, camp) => {
                if (err) {
                    console.log(`campground not found : ${camp}`)
                } else {
                    camp.comments.push(createdComment)
                    camp.save((err)=>{
                        console.log(`failed to save camp: ${err}`)
                    })
                }
            })
        }
    })
    res.redirect(`/campgrounds/${id}`)
})

app.listen(3000, () => {
    console.log(`Starting server at http://localhost:${port}`)
})
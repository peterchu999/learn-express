const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const Comment = require('../models/comment')


const isAuthor = (req, res, next) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.send(err)
        } else {
            if (campground.author.id.equals(req.user._id)){
                return next()
            } else {
                req.flash('error', 'You are not this campground author')
                return res.redirect('back')
            }
        }
        return res.redirect("back")
    })
}


router.get('/', (req, res) => {
    Campground.find({}, (err, datas) => {
        if (err) {
            console.log(`here is the error : ${err}`)
        } else {
            res.render('campgrounds', {campgrounds: datas})
        }
    })
})

router.get('/add', (req, res) => {
    res.render('add-camp')
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const camp = await Campground.findById(id).populate('comments').exec()
        res.render('show', {campground: camp, isAuthor:(camp.author.id.equals(req.user.id))})  
    } catch (error) {
        res.send(`${error}`)
    }
    
})

router.post('/',(req, res) => {
    const {campName, campImg, description} = req.body
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create({
        name: campName,
        image: campImg,
        description: description,
        author: author
    }, (err, data) => {
        if (err) {
            req.flash('error', 'Failed to add campground')
            console.log(`here is the error : ${err}`)
        } else {
            req.flash('success', 'succesfully add campground')
            console.log(`${data} success`)
        }
        res.redirect('/campgrounds')
    })
})

router.get('/:id/edit', isAuthor,async (req, res) => {
    const {id} = req.params
    try {
        const camp = await Campground.findById(id).populate('comments').exec()
        res.render('edit-camp', {campground: camp})  
    } catch (error) {
        res.send(`${error}`)
    }
})

router.put('/:id',isAuthor,async (req, res) => {
    const {id} = req.params
    const {campName, campImg, description} = req.body
    try {
        Campground.findByIdAndUpdate(id, {
            name: campName,
            image: campImg,
            description: description
        }, (err, data) => {
            if (err) {
                req.flash('error', 'Failed to edit campground')
                res.redirect('/campgrounds')
            } else {
                req.flash('success', 'success to edit campground')
                res.redirect(`/campgrounds/${id}`)
            }
        })
    } catch (error) {
        res.send(`${error}`)
    }
})

router.delete('/:id', isAuthor,async (req, res) => {
    const {id} = req.params
    Campground.findByIdAndRemove(id, (err) => {
        if (err) {
            req.flash('error', 'Failed to delete campground')
            res.redirect('/campgrounds')
        } else {
            req.flash('success', 'Success to delete campground')
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router
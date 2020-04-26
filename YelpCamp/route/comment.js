const express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require('../models/campground')
const Comment = require('../models/comment')

const commentAuthorMiddleware = (req, res, next) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            return res.send(err)
        } else {
            if (comment.author.id.equals(req.user._id)){
                return next()
            } else {
                return res.redirect('back')
            }
        }
    })
}

router.post('/', (req, res) => {
    const {comment} = req.body
    const {id} = req.params
    console.log(req.user)
    Comment.create({text: comment, author: {
        id: req.user._id,
        username: req.user.username
    }},
    (err, createdComment) => {
        if (err) {
            console.log(err)
        } else {
            Campground.findById(id, (err, camp) => {
                if (err) {
                    console.log(`campground not found : ${err}`)
                } else {
                    camp.comments.push(createdComment)
                    camp.save((err)=>{
                        console.log(`failed to save camp: ${err}`)
                    })
                }
                res.redirect(`/campgrounds/${id}`)
            })
        }
    })
})

router.get('/:comment_id/edit', commentAuthorMiddleware, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            res.redirect('back')
        } else {
            res.render('edit-comment',{ data: req.params, comment})
        }
    })
})

router.put('/:comment_id', commentAuthorMiddleware, (req, res) => {
    const {text} = req.body
    Comment.findByIdAndUpdate(req.params.comment_id,
        {text}, (err, item) => {
            if (err) {
                console.log(`edit err : ${err}`)
                res.redirect('back')
            } else {
                res.redirect(`/campgrounds/${req.params.id}`)
            }
        }
    )
})

router.delete('/:comment_id', commentAuthorMiddleware,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})



module.exports = router
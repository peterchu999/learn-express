const mongoose = require('mongoose')
const campground = require('./models/campground')
const comment = require('./models/comment')

mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true,  useUnifiedTopology: true })

const deleteAllCampground = async () => {
    try {
        await campground.deleteMany({})
        console.log("All Campgrounds have been removed")
    } catch (err) {
        console.log(err)
    } 
}

const deleteAllComment = async () => {
    try {
        await comment.deleteMany({})
        console.log("All Comments have been removed")
    } catch (err) {
        console.log(err)
    } 
}

const campSeed = [
    {
        name: 'Giruvegan',
        image: 'https://www.photosforclass.com/download/pixabay-440520?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e4d5464852b108f5d084609620367d1c3ed9e04e507441722d7ed2904fc2_1280.jpg&user=Fotocitizen',
        description: 'Giruvegan was the beautiful place on earth. one belive Giruvegan was place that fod reside',
    },
    {
        name: 'Nabudis',
        image: 'https://www.photosforclass.com/download/pixabay-1950873?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e9d0434255af14f6da8c7dda793f7f1636dfe2564c704c7d2879d1904fc559_1280.jpg&user=12019',
        description: 'A place with the great mist, the place that destroy by human',
    },
    {
        name: 'Bahamut',
        image: 'https://www.photosforclass.com/download/pixabay-659758?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F50e5dc444f5ab108f5d084609620367d1c3ed9e04e507441722d7ed39544c5_1280.jpg&user=ArtTower',
        description: 'Greatest weapon by human kind, the one make like tower of babel that intended to defy god'
    }
]

const seedCampAndComment = (async () => {
    await deleteAllCampground()
    await deleteAllComment()
    campSeed.forEach(camp => {
        campground.create(camp, (err, createdCamp) => {
            if (err) {
                console.log(`camp: ${err}`)
            } else {
                // comment.create({
                //     text: 'Great',
                //     author: `${camp.name}`
                // }, (err, comment) => {
                //     if (err) {
                //         console.log(`comment: ${err}`)
                //     } else {
                //         createdCamp.comments.push(comment)
                //         createdCamp.save((err) => {
                //             if (err) {
                //                 console.log(`failed to save ${err}`)
                //             }
                //         })
                //     }
                // })
            }
        })
    })
})()






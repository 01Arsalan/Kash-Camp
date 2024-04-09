// this file will be used to seed Data-Base and will run seperately from other files

const mongoose = require("mongoose")
const campGround = require("../models/campGround")
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")
const axios = require("axios")

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true //deprecated
})
    .then(() => {
        console.log("connected To DB.")
    })
    .catch((err) => {
        console.log("Connection To DB Failed,Error : ", err)
    })


// this function returns a random element form any array passed to it
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    //empytying collection
    await campGround.deleteMany({})
    //inserting 50 docs. into DB
    for (let i = 0; i < 20; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const camp = new campGround({
            author: "65f96fdcc388665a00b4c580",
            location: `${cities[rand1000].city},${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/didlzqvsh/image/upload/v1711544718/yelp-camp/nhwb2jmeyge2z4t9tafx.jpg',
                    filename: 'yelp-camp/nhwb2jmeyge2z4t9tafx',

                },
                {
                    url: 'https://res.cloudinary.com/didlzqvsh/image/upload/v1711544720/yelp-camp/sifc7rrniybdieducy2g.jpg',
                    filename: 'yelp-camp/sifc7rrniybdieducy2g',
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
            },
            discription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi exercitationem atque quia repellat autem consectetur esse tenetur nobis at! Porro facilis iusto quaerat, autem quas voluptas neque sunt nobis perspiciatis.",
            price: rand1000 + rand1000
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})


// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: '3ZZAAdPgYwyCmZKIF9YTqQo-8udOJ7BI7qVtdVwVgrA',
                collections: 1114848,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}
// image:await seedImg(),


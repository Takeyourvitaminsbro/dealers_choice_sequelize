const express = require('express');
const app = express();
const { syncAndSeed, models: { Character, House} } = require('./db');
const path = require('path');

app.use(express.static(path.join(__dirname, "public")));

//homepage
app.get('/', async (req, res, next) => {
    try {
        res.send(`
            <head>
            
            <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
            <h1>Dealers Choice Sequelize!</h1>
            <p>My project topic is still harry potter characters lol</p>
            <div>
                <a href='/chars'>Characters</a>
            </div>
            <div>
                <a href='/houses'>Houses</a>
            </div>
            </body>
        `)
    }
    catch (err) {
        console.log(err)
    }
})

// characters page
app.get('/chars', async (req, res, next) => {
    try {
        const chars = await Character.findAll({ include: House });
        // res.send(chars)
        res.send(`
        <head>
            
            <link rel="stylesheet" href="/style.css" />
            </head>
        <body>
            <h1>Some Harry Potter Characters</h1>
            <a href='/'>Homepage</a>

            ${chars.map(char => `
                <div>
                    <h3>${char.name}</h3>
                    <h5>House: ${char.house.name}</h5>
                </div>
            `).join('')}
        </body>`);
    } catch(err) {
        next(err);
    }
})

//houses page
app.get('/houses', async (req, res, next) => {
    try {
        const houses = await House.findAll({ include: Character });
        // res.send(houses)
        res.send(`
        <head>
            
            <link rel="stylesheet" href="/style.css" />
            </head>
        <body>
            <a href='/'>Homepage</a>
            ${houses.map(house => `
            <h3>${house.name}</h3>

            <p>Characters: ${house.characters.map(char => char.name).join(', ')}</p>
            `).join('')}
        </body>`);
    } catch(err) {
        next(err)
    }
})

//init
const init = async () => {
    await syncAndSeed();
    app.listen(3000);
}

init();
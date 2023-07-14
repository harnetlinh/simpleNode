// create a new express api server with get and post
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
// package to generate random quotes
const quote = require('find-quote');
// package to tranlate text from english to vietnamese
const translate = require('@vitalets/google-translate-api');
const { ProxyAgent } = require('proxy-agent');
const e = require('cors');
// create a proxy agent with random proxy
const agent = new ProxyAgent();

// use cors and body-parser middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getQuote() {
    const titles = ["Imagination", "FUTURE", "knowledge", "Death", "brave", "movie", "series", ""];
    // get a random string in array titles with more randomly
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    if (randomTitle == "movie") {
        return quote.getMovieQuote();
    } else if (randomTitle == "brave") {
        return quote.getQuoteWithSeriesName("brave").quote;
    } else if (randomTitle == "series") {
        return quote.getSeriesQuote();
    } else if (randomTitle == "knowledge") {
        return quote.getQuoteWithAuthor("knowledge").quote;
    } else if (randomTitle == "Death") {
        return quote.getQuoteWithMovieName("Death").quote;
    } else if (randomTitle == "") {
        return quote.getQuote();
    }
    return quote.getQuote(randomTitle);
}

// an async function to get a list quote
async function getListQuote(num) {
    let quote;
    var listQuote = [];
    for (let i = 0; i < num; i++) {
        quote = getQuote();
        await translate.translate(quote, { to: 'vi', fetchOptions: { agent } }).then(response => {
            // console.log(response.text);
            listQuote.push(response.text);
        }).catch(error => {
            // console.log(quote);
            listQuote.push(quote);
        });

    }
    return listQuote;
}

// create a get route
app.get('/get-quote', (req, res) => {
    const quote = getQuote();
    // send a response to the client with a json object, random quote on each request and translate to vietnamese
    translate.translate(quote, { to: 'vi', fetchOptions: { agent } }).then(response => {
        res.json({ quote: response.text });
    }).catch(error => {
        // sleep for 1 second
        setTimeout(() => {
            res.json({ quote: quote });
        }, 500);


    });
});

app.get('/get-list-quote', (req, res) => {
    let quote;
    let num = 1;
    if ((req.params.num || req.query.num) && (req.params.num > 0 || req.query.num > 0)) {
        num = req.params.num || req.query.num;
    }
    var listQuote = [];
    getListQuote(num).then(response => {
        listQuote = response;
        res.json(listQuote);
    });
});



// create a post route
app.post('/add-quote', (req, res) => {
    const quote = getQuote();
    // get the name from the request body then combine it with the quote and send it back to the client
    const name = req.body.name;
    translate.translate(quote, { to: 'vi', fetchOptions: { agent } }).then(response => {
        res.json({ message: `${name} nói rằng: ${response.text}` });
    }).catch(error => {
        setTimeout(() => {
            res.json({ message: `${name} spoke that: ${quote} ` });
        }, 500);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




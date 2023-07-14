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

// create a get route
app.get('/get-quote', (req, res) => {
    const quote = getQuote();
    // send a response to the client with a json object, random quote on each request and translate to vietnamese
    translate.translate(quote, { to: 'vi', fetchOptions: { agent } }).then(response => {
        res.json({ quote: response.text });
    }).catch(error => {
        res.json({ quote: quote });
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
        res.json({ message: `${name} spoke that: ${quote} ` });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




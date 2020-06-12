const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const { log, error } = console;

//launch:- initializing the Chromium instance and connecting the puppeteer if promise is resolved
//headless:true because we do not need Graphically interaction
puppeteer.launch({ headless: true }).then(async browser => {

    // Page is a class that represents a single tab in the browser.
    // the page class provides methods and events to interact with the page(such as selecting elements, retrieving information, waiting for elements, etc.).
    const page = await browser.newPage();

    //goto:- to Navigate the given flipkart's URL. 
    await page.goto("https://www.flipkart.com/realme-x2-pearl-green-64-gb/p/itm75023903eb431");

    //waitForSelector:- waits until the selected element is rendered within the page.
    await page.waitForSelector("body");

    let productInfo = await page.evaluate(() => {

        // /* Get product title */
        let title = document.body.querySelector('._35KyD6').innerText;

        /* Get review count */
        let rating = document.body.querySelector('.hGSR34').innerText;

        /* Get price */
        let price = document.body.querySelector('._3iZgFn').innerText;

        let productHighlight = document.body.querySelector('._3WHvuP').innerText;


        let product = {
            title: title,
            rating: rating,
            // Removing '₹' & ',' from price string then converting into Number
            price: Number([...price].filter(d => (d !== '₹' && d !== ',')).join('')), 
            productHighlight: productHighlight,

        };

        return product;

    });


    let job = new CronJob(
        '*/10 * * * * *', //'You will see the Product Notification every 10 seconds
        () => (
            productInfo.price < 17500 ? log(`hurry up!!!!! ${productInfo.price} ${productInfo.title}`) : log(productInfo)
        ),
        null,
        true,
        "Asia/Kolkata"
    );

    await browser.close();

}).catch(error => error(error));
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const fs = require('fs');

const resultDir = './results/'

nightmare
  .goto('https://www.gumtree.com')
  .wait('.search-bar .keyword-search-container input')
  .type('.search-bar .keyword-search-container input', 'n64 console')
  .click('.search-bar button[type="submit"]')
  .wait('#srp-results')
  .evaluate(() => {

    //get all ads on a page and filter out the non for sale ones
    let ads = [...document.querySelectorAll('li.natural')];
    let forSaleAds = ads.filter(ad=> ad.querySelector('.listing-price'));

    //loop through and extract info from each ad into an object
    let data = forSaleAds.map(ad => {
      let title = ad.querySelector('.listing-title').innerText;
      let price = Number.parseInt(ad.querySelector('.listing-price strong').innerText.slice(1));
      let location = ad.querySelector('.listing-location').innerText;
      let desc  = ad.querySelector('.listing-description').innerText;
			
      return {title, price, location, desc};
    });
    //return the array of objects
    return data;
  })
  .end()
  .then(data => {
    //convert to JSON and save as file
    data = JSON.stringify(data, null, 2);
    fs.writeFileSync(resultDir + 'gumtree.json', data);
  })
  .catch(error => {
    console.error('Scraping failed:', error)
  })
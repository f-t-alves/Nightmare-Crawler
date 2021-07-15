const puppeteer = require("puppeteer");
const fs = require("fs");

require("dotenv").config({ encoding: "utf8", debug: true });

console.log(process.env.PASSWORD.length);

const BASE_URL = "https://xpcorp.gama.academy/";
const PLAYLIST_URL = "aluno/playlist/372/2716";
const resultsPath = "./results/";

(async () => {
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  /* Go to the login page and wait for it to load */
  await page.goto(BASE_URL, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `${resultsPath}login.png` });

  // Login
  console.log("Typing");
  await page.type("#user_account_email", process.env.USER);
  await page.type("#user_account_password", process.env.PASSWORD);
  await page.screenshot({ path: `${resultsPath}typed.png` });
  console.log("Clicking");
  await page.click('input[type="submit"][name="commit"]');
  console.log("Clicked!");
  await page.screenshot({ path: `${resultsPath}logged.png` });

  // Go to playlist page and wait for it to load
  console.log("Navigating to playlist");
  await page.goto(BASE_URL + PLAYLIST_URL, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `${resultsPath}playlist.png` });

  /* Run javascript inside of the page */
  let data = await page.evaluate(() => {
    let list = document.getElementsByClassName("sidebar-brand toggled")[0];

    // Get list of links
    //let links = list.getElementsByTagName("A");
    let links = document.links;
    console.log(links);

    /*
    for (let link in links) {
        console.log(link.href());
    }
    */

    // Construct result object
    /*
    links.map((link, i) => {
      const linkURL = link.href();
      console.log(linkURL);
    });
    */

    /* Returning an object filled with the scraped data */
    return {
      links,
    };
  });
  /* Outputting what we scraped */
  console.log(data.links);
  for (let i = 0; i < data.links.length; i++) {
    console.log(data.links.item(i));
  }
  await browser.close();
})();

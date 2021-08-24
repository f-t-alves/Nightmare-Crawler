const puppeteer = require("puppeteer");
const fs = require("fs");

require("dotenv").config({ encoding: "utf8", debug: true });

console.log("Password length: ", process.env.PASSWORD.length);

/* PROD */
const BASE_URL = "https://xpcorp.gama.academy/";
const PLAYLIST_URL = "aluno/playlist/444/3673";
/* PROD */

/* LOCAL
const BASE_URL = "http://localhost:5500/";
const PLAYLIST_URL = "index.html";
/* LOCAL */

const resultsPath = "./results/";

(async () => {
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  /* Go to the login page and wait for it to load */
  await page.goto(BASE_URL, { waitUntil: "networkidle0" });

  /* WORKING */
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

  /* WORKING */

  // Go to playlist page and wait for it to load
  console.log("Navigating to playlist");
  await page.goto(BASE_URL + PLAYLIST_URL, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `${resultsPath}playlist.png` });

  // Run javascript inside of the page
  let data = await page.evaluate(() => {
    let list = document.getElementsByClassName("sidebar-brand toggled")[0];

    // Get list of links
    let links = Array.from(list.querySelectorAll("a")).map((anchor) => ({
      url: anchor.href,
      title: anchor.textContent,
    }));

    /* Returning an object filled with the scraped data */
    return {
      links,
    };
  });
  // Outputting links list
  //console.log(data.links);
  const size = Object.keys(data.links).length;
  console.log("Links list size: ", size);
  let videoList = await Promise.all(
    data.links.map(async (pair, i) => {
      console.log(pair.url);

      const linkPage = await browser.newPage();
      await linkPage.goto(pair.url, { waitUntil: "networkidle0" });
      await linkPage.screenshot({ path: `${resultsPath}link${i}.png` });

      // Extracting video URL
      const videoURL = await linkPage.evaluate(() => {
        const iframeList = Array.from(document.getElementsByTagName("iframe")); //.map((anchor) => anchor.src);

        return iframeList[0].src;
      });

      return {
        title: pair.title,
        URL: videoURL,
      };
    })
  );

  data = JSON.stringify(videoList, null, 2);
  fs.writeFileSync(resultsPath + "links.json", data);

  await browser.close();
})();

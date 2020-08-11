const puppeteer = require("puppeteer");

let page;

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--lang=ja"],
  });
  return browser.newPage();
}

exports.getMetaInfo = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  if (!req.query || !req.query.url) {
    res.status(400).send("Request Body Not Found");
    return;
  }

  if (!page) {
    page = await getBrowserPage();
  }

  console.log(req.query.url);
  await page.goto(req.query.url);

  const title = await page.evaluate(() => {
    return document.querySelector('[property="og:title"]').content;
  });

  const description = await page.evaluate(() => {
    return document.querySelector('[property="og:description"]').content;
  });

  const sumbnailUrl = await page.evaluate(() => {
    return document.querySelector('[property="og:image"]').content;
  });

  res.set("Content-Type", "application/json");
  res.send({ title, description, sumbnailUrl });
};

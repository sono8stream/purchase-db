const puppeteer = require("puppeteer");

let page;
const fetchers = [
  {
    domain: "https://ec.nintendo.com",
    nameSelector: ".o_c-page-title",
    market: "Nintendo",
    priceSelector: ".o_p-product-detail__price--price",
  },
  {
    domain: "https://www.nintendo.co.jp",
    nameSelector: ".soft-title-heading",
    market: "Nintendo",
    priceSelector: ".online-price-value",
  },
  {
    domain: "https://store.playstation.com",
    nameSelector: ".pdp__title",
    market: "PlayStation",
    priceSelector: ".price-display__price",
  },
  {
    domain: "https://store.steampowered.com",
    nameSelector: ".apphub_AppName",
    market: "Steam",
    priceSelector: ".game_purchase_price",
  },
  {
    domain: "https://www.amazon.co.jp",
    nameSelector: ".product-title-word-break",
    market: "amazon",
    priceSelector: "#priceblock_ourprice",
  },
];

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--lang=ja"],
  });
  return browser.newPage();
}

exports.getPrices = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Content-Type", "application/json");
    res.status(204).send("");
  } else {
    console.log(req.rawBody);
    if (!req.body || !req.body.urls) {
      res.status(400).send("Request Body Not Found");
      return;
    }

    if (!page) {
      page = await getBrowserPage();
    }

    const pages = [];

    for (const url of req.body.urls) {
      for (const fetcher of fetchers) {
        if (url.startsWith(fetcher.domain)) {
          await page.goto(url);

          const name = await page.evaluate((nameSelector) => {
            const elem = document.querySelector(nameSelector);

            if (elem) {
              return elem.textContent.trim();
            }

            return "";
          }, fetcher.nameSelector);

          const price = await page.evaluate((priceSelector) => {
            const elem = document.querySelector(priceSelector);

            if (elem) {
              return Number(elem.textContent.replace(/[^0-9]/g, ""));
            }

            return 0;
          }, fetcher.priceSelector);

          const market = fetcher.market;

          pages.push({ name, market, price });
          break;
        }
      }
    }

    res.set("Content-Type", "application/json");
    res.send({ pages });
  }
};

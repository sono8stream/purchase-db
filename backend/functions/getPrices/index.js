const puppeteer = require("puppeteer");

let page;
const fetchers = [
  {
    domain: "https://store-jp.nintendo.com",
    nameSelector: ".productDetail--headline__title",
    market: "Nintendo",
    priceSelectors:
      ".productDetail--detail__price, .productDetail--detail__pricePrice",
  },
  {
    domain: "https://www.nintendo.co.jp",
    nameSelector: ".soft-title-heading",
    market: "Nintendo",
    priceSelectors: ".online-price-value",
  },
  {
    domain: "https://store.playstation.com",
    nameSelector: ".pdp__title",
    market: "PlayStation",
    priceSelectors: ".price-display__price",
  },
  {
    domain: "https://store.steampowered.com",
    nameSelector: ".apphub_AppName",
    market: "Steam",
    priceSelectors: ".game_purchase_price,.discount_final_price",
  },
  {
    domain: "https://www.amazon.co.jp",
    nameSelector: ".product-title-word-break",
    market: "amazon",
    priceSelectors: "#priceblock_ourprice",
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
    console.log(req.body);
    if (!req.body || !req.body.urls) {
      res.status(400).send("Request Body Not Found");
      return;
    }

    if (!page) {
      page = await getBrowserPage();
    }

    const pages = [];

    for (const url of req.body.urls) {
      let isPushed = false;
      for (const fetcher of fetchers) {
        if (url.startsWith(fetcher.domain)) {
          await page.goto(url, { waitUntil: "networkidle2" });

          const name = await page.evaluate((nameSelector) => {
            const elem = document.querySelector(nameSelector);

            if (elem) {
              return elem.textContent.trim();
            }

            return "";
          }, fetcher.nameSelector);

          const price = await page.evaluate((priceSelectors) => {
            const elem = document.querySelectorAll(priceSelectors);

            if (elem[0]) {
              return Number(elem[0].textContent.replace(/[^0-9]/g, ""));
            }

            return 0;
          }, fetcher.priceSelectors);

          const market = fetcher.market;

          pages.push({ name, market, price });
          isPushed = true;
          break;
        }
      }
      if (!isPushed) {
        pages.push({ name: "", market: "", price: 0 });
      }
    }

    res.set("Content-Type", "application/json");
    res.send({ pages });
  }
};

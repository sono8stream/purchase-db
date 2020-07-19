const puppeteer = require('puppeteer');
const admin = require('firebase-admin');

let page;
const fetchers = [
  {
    domain: 'https://ec.nintendo.com',
    selector: '.o_p-product-detail__price--price',
  },
  {
    domain: 'https://www.nintendo.co.jp',
    selector: '.online-price-value',
  },
  {
    domain: 'https://store.playstation.com',
    selector: '.price-display__price',
  },
  {
    domain: 'https://store.steampowered.com',
    selector: '.game_purchase_price',
  },
  {
    domain: 'https://www.amazon.co.jp',
    selector: '#priceblock_ourprice',
  },
];

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--lang=ja'],
  });
  return browser.newPage();
}

exports.getPrices = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  if (!req.body || !req.body.urls) {
    res.status(400).send('Request Body Not Found');
    return;
  }

  if (!page) {
    page = await getBrowserPage();
  }

  const prices = [];

  for (const url of req.body.urls) {
    for (const fetcher of fetchers) {
      if (url.startsWith(fetcher.domain)) {
        await page.goto(url);

        const price = await page.evaluate((selector) => {
          const elem = document.querySelector(selector);

          if (elem) {
            return elem.textContent;
          }

          return '';
        }, fetcher.selector);

        prices.push(price);

        break;
      }
    }
  }

  res.set('Content-Type', 'application/json');
  res.send({ prices: prices });
};

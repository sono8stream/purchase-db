const puppeteer = require('puppeteer');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

let page;
const fetchers = [
  {
    domain: 'https://ec.nintendo.com',
    nameSelector: '.o_c-page-title',
    priceSelector: '.o_p-product-detail__price--price',
  },
  {
    domain: 'https://www.nintendo.co.jp',
    nameSelector: '.soft-title-heading',
    priceSelector: '.online-price-value',
  },
  {
    domain: 'https://store.playstation.com',
    nameSelector: '.pdp__title',
    priceSelector: '.price-display__price',
  },
  {
    domain: 'https://store.steampowered.com',
    nameSelector: '.apphub_AppName',
    priceSelector: '.game_purchase_price',
  },
  {
    domain: 'https://www.amazon.co.jp',
    nameSelector: '.product-title-word-break',
    priceSelector: '#priceblock_ourprice',
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
  if (!req.body || !req.body.id) {
    res.status(400).send('Request Body Not Found');
    return;
  }

  if (!page) {
    page = await getBrowserPage();
  }

  const docPath = `games/${req.body.id}`;
  const snapshot = await db.doc(docPath).get();
  const pages = snapshot.data().pages;

  const prices = [];

  for (const info of pages) {
    for (const fetcher of fetchers) {
      if (info.url.startsWith(fetcher.domain)) {
        await page.goto(info.url);

        const name = await page.evaluate((nameSelector) => {
          const elem = document.querySelector(nameSelector);

          if (elem) {
            return elem.textContent.trim();
          }

          return '';
        }, fetcher.nameSelector);

        const price = await page.evaluate((priceSelector) => {
          const elem = document.querySelector(priceSelector);

          if (elem) {
            return elem.textContent;
          }

          return '';
        }, fetcher.priceSelector);

        prices.push(price);

        info.name = name;
        info.price = price;

        break;
      }
    }
  }

  db.doc(docPath).update({ pages });

  res.set('Content-Type', 'application/json');
  res.send({ prices: prices });
};

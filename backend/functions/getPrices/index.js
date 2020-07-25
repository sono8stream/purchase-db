const puppeteer = require('puppeteer');

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
  if (!req.body || !req.body.urls) {
    res.status(400).send('Request Body Not Found');
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

          return '';
        }, fetcher.nameSelector);

        const price = await page.evaluate((priceSelector) => {
          const elem = document.querySelector(priceSelector);

          if (elem) {
            return elem.textContent;
          }

          return '';
        }, fetcher.priceSelector);

        pages.push({ name, price });
        break;
      }
    }
  }

  res.set('Content-Type', 'application/json');
  res.send({ pages });
};

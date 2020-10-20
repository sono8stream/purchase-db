const fetch = require("node-fetch");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const fetchUrl =
  "https://asia-northeast2-game-subscribe-db.cloudfunctions.net/getPrices";

exports.subscribeAllPrices = async (event, context) => {
  const date = new Date();
  const unixDate = Math.floor(date.getTime() / 1000);

  const gamesRef = db.collection("games");
  const gamesSnapshot = await gamesRef.get();

  const historyRef = db.collection("history");

  const allPages = [];
  const allUrls = [];
  gamesSnapshot.forEach((doc) => {
    const pages = doc.data().pages;
    if (pages.length > 0) {
      allPages.push({ id: doc.id, pages });
    }
    pages.forEach((page) => {
      allUrls.push(page.url);
    });
  });

  const pricesRes = await fetch(fetchUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: allUrls,
    }),
  });
  const pricesJson = await pricesRes.json();

  let docIdx = 0;
  let pageCnt = 0;

  for (const page of pricesJson.pages) {
    if (page.price) {
      allPages[docIdx].pages[pageCnt].price = page.price;
    }

    pageCnt++;
    if (pageCnt === allPages[docIdx].pages.length) {
      const id = allPages[docIdx].id;
      gamesRef.doc(id).update({ pages: allPages[docIdx].pages });

      const snapshot = await historyRef.doc(id).get();
      const data = snapshot.exists ? snapshot.data() : {};

      allPages[docIdx].pages.forEach((page) => {
        if (!(page.url in data)) {
          data[page.url] = [];
        }

        if (data[page.url].length === 0) {
          data[page.url].push({ date: unixDate, price: page.price });
        } else if (data[page.url][0].price !== page.price) {
          data[page.url].unshift(
            { date: unixDate, price: page.price },
            {
              date: unixDate,
              price: data[page.url][0].price,
            }
          );
        }
      });

      historyRef.doc(id).set(data);

      docIdx++;
      pageCnt = 0;
    }
  }
};

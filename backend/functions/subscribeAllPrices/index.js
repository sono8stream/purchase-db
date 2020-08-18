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

  gamesSnapshot.forEach((doc) => {
    const pages = doc.data().pages;

    const urls = pages.map((page) => page.url);
    fetch(fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urls,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        json.pages.forEach((page, idx) => {
          pages[idx].name = page.name;
          pages[idx].market = page.market;
          pages[idx].price = page.price;
        });

        gamesRef.doc(doc.id).update({ pages });

        historyRef
          .doc(doc.id)
          .get()
          .then((snapshot) => {
            const data = snapshot.exists ? snapshot.data() : {};

            pages.forEach((page) => {
              if (!(page.url in data)) {
                data[page.url] = [];
              }
              data[page.url].unshift({ date: unixDate, price: page.price });
            });

            historyRef.doc(doc.id).set(data);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

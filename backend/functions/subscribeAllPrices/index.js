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

  const allPages = {};
  const allUrls = [];
  gamesSnapshot.forEach((doc) => {
    const pages = doc.data().pages;
    if (pages.length > 0) {
      allPages[doc.id] = pages;
      pages.forEach((page) => allUrls.push(page.url));
    }
  });
  fetch(fetchUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: allUrls,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      const docKeys = Object.keys(allPages);
      let docIdx = 0;
      let pageIdx = 0;
      json.pages.forEach((page) => {
        const id = docKeys[docIdx];

        if (page.price) {
          allPages[id][pageIdx].price = page.price;
        }

        pageIdx++;
        if (pageIdx >= allPages[id].length) {
          gamesRef.doc(id).update({ pages: allPages[id] });

          historyRef
            .doc(id)
            .get()
            .then((snapshot) => {
              const data = snapshot.exists ? snapshot.data() : {};

              allPages[id].forEach((page) => {
                if (!(page.url in data)) {
                  data[page.url] = [];
                }
                data[page.url].unshift({ date: unixDate, price: page.price });
              });

              historyRef.doc(id).set(data);
            });

          docIdx++;
          pageIdx = 0;
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

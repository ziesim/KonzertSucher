const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrapeBand() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const ul = document.getElementById("ulSchweinfurt");
  const bands = JSON.parse(fs.readFileSync("./data_files/bands.json", "utf-8"));
  const urls = JSON.parse(fs.readFileSync("./data_files/urls.json", "utf-8"));
  const doms = JSON.parse(fs.readFileSync("./data_files/doms.json", "utf-8"));

  const urlsSchweinfurtLength = Object.keys(urls.schweinfurt).length;

  for (i = 0; i < urlsSchweinfurtLength; i++) {
    await page.goto(urls.schweinfurt[i], { waitUntil: "networkidle2" });

    let foundObjects = await page.evaluate(
      ({ bands, doms }) => {
        let result = [];

        // Schweinfurt

        let titles = document.querySelectorAll(
          `div[class="${doms.schweinfurt.titles}"]`
        );

        let dates = document.querySelectorAll(
          `div[class="${doms.schweinfurt.dates}"]`
        );

        let subpages = document.querySelectorAll(
          `div[class="${doms.schweinfurt.subpages}"] > a`
        );

        for (j = 0; j < titles.length; j++) {
          let title = titles[j].innerText;
          let checkTitle = title.toLowerCase();
          let date = dates[j].innerText;

          for (k = 0; k < bands.length; k++) {
            let index = checkTitle.indexOf(bands[k]);
            if (index === 0) {
              if (
                checkTitle.includes(bands[k]) &&
                !checkTitle.includes("verlegt") &&
                !checkTitle.includes("fällt aus")
              ) {
                return [`${title} : ${date}`, `${subpages[j]}`];
              }
            } else {
              continue;
            }
          }
        }
        // RETURN HERE !!
      },
      { bands, doms }
    );

    if (foundObjects != undefined) {
      const li = document.createElement("li");
      li.innerHTML = foundObjects[0];
      li.addEventListener("click", function (e) {
        if (e.target) {
          window.open(
            `${foundObjects[1]}`,
            "popup",
            "width=" + screen.width + ",height=" + screen.height
          );
        }
      });
      ul.append(li);
    }
  }

  await browser.close();
}

scrapeBand();

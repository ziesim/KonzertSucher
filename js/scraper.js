const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeBand() {
  let bands = JSON.parse(fs.readFileSync("./data_files/bands.json", "utf-8"));
  let urls = JSON.parse(fs.readFileSync("./data_files/urls.json", "utf-8"));
  let doms = JSON.parse(fs.readFileSync("./data_files/doms.json", "utf-8"));

  const url = [
    "https://stattbahnhof-sw.de/",
    "https://stattbahnhof-sw.de/?page=2",
    "https://stattbahnhof-sw.de/?page=3",
    "https://stattbahnhof-sw.de/?page=4",
    "https://stattbahnhof-sw.de/?page=5",
    "https://stattbahnhof-sw.de/?page=6",
    "https://stattbahnhof-sw.de/?page=7",
  ];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Schweinfurt
  for (i = 0; i < urls.schweinfurt.length; i++) {
    console.log(`Seite ${i + 1}:`);

    await page.goto(urls.schweinfurt[i], { waitUntil: "networkidle2" });

    let foundObjects = await page.evaluate(function () {
      let bands = [
        "adestria",
        "after the burial",
        "all that remains",
        "alpha wolf",
        "the amity affliction",
        "annisokay",
        "any given day",
        "architects",
        "as i lay dying",
        "asking alexandria",
        "atreyu",
        "attila",
        "august burns red",
        "aviana",
        "bad omens",
        "beartooth",
        "beeing as an ocean",
        "bleed from within",
        "born of osiris",
        "brand of sacrifice",
        "breakdown of sanity",
        "bring me the horizon",
        "bury tommorow",
        "caliban",
        "chelsea grin",
        "code orange",
        "convictions",
        "counterparts",
        "crown the empire",
        "crystal lake",
        "currents",
        "darkest hour",
        "darko us",
        "dayseeker",
        "a day to remember",
        "dealer",
        "deez nuts",
        "devil sold his soul",
        "the devil wears prada",
        "emmure",
        "erra",
        "eskimo callboy",
        "falling in reverse",
        "fit for a king",
        "fit for an autopsy",
        "for the likes of you",
        "for today",
        "from sorrow to serenity",
        "the ghost inside",
        "gideon",
        "heart of a coward",
        "heaven shall burn",
        "hollow front",
        "i killed the prom queen",
        "imminence",
        "infant annihilator",
        "in flames",
        "in hearts wake",
        "in search of solace",
        "invent animate",
        "i prevail",
        "killing the messenger",
        "landmvrks",
        "left to suffer",
        "like moths to flames",
        "loathe",
        "lorna shore",
        "lotus eater",
        "make them suffer",
        "memphis may fire",
        "misery signals",
        "miss may i",
        "monuments",
        "more than a thousand",
        "motionless in white",
        "mutiny within",
        "napoleon",
        "norma jean",
        "northlane",
        "novelists",
        "orbit culture",
        "our last night",
        "ov sulfur",
        "parkway drive",
        "phinehas",
        "the plot in you",
        "polaris",
        "reflections",
        "rvnt",
        "savage hands",
        "sea smile",
        "shadow of intent",
        "silent planet",
        "sion",
        "slaughter to prevail",
        "slipknot",
        "soilwork",
        "the sorrow",
        "spiritbox",
        "stick to your guns",
        "structures",
        "suicide silence",
        "system of a down",
        "termina",
        "terror",
        "texas in july",
        "three days grace",
        "thy art is murder",
        "trivium",
        "trove",
        "unearth",
        "vanna",
        "veil of maya",
        "wage war",
        "we came as romans",
        "while she sleeps",
        "whitechapel",
        "youth fountain",
      ];

      let titles = document.querySelectorAll(
        'div[class="title-header ic-title-header ic-float-left"]'
      );

      let dates = document.querySelectorAll(
        'div[class="nextdate ic-next-date ic-clearfix"]'
      );

      let subPages = document.querySelectorAll(
        'div[class="event ic-event ic-clearfix"] > a'
      );

      let results = [];

      for (i = 0; i < titles.length; i++) {
        let title = titles[i].innerText;
        let checkTitle = title.toLowerCase();
        let date = dates[i].innerText;

        for (j = 0; j < bands.length; j++) {
          let index = checkTitle.indexOf(bands[j]);
          if (index === 0) {
            if (
              checkTitle.includes(bands[j]) &&
              checkTitle.includes("verlegt")
            ) {
              results.push(`!!! ${title} !!!`);
              continue;
            } else if (checkTitle.includes(bands[j])) {
              results.push(`${title} : ${date}   >>>   ${subPages[i]}`);
              continue;
            }
          }
        }
      }

      if (results.length > 0) {
        return results;
      } else {
        return "- - - - - - - - -";
      }
    });

    console.log(foundObjects);
  }

  await browser.close();
}

scrapeBand();

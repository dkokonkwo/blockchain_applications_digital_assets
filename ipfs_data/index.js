const {
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
  existsSync,
  mkdirSync,
} = require("fs");

const picInfo = [
  "blue-bmw",
  "golfball",
  "grey-benz",
  "net",
  "red-mustang",
  "soccer-ball",
  "vintage-red",
  "vintage-yellow",
  "volleyball",
  "white-dodge",
];

function createMetaData(idx) {
  const meta = {
    name: picInfo[idx],
    description: `An image of ${picInfo[idx]}`,
    image: `${picInfo[idx]}.jpg`,
    attributes: [
      {
        type: picInfo[idx].includes("ball") ? "ball" : "car",
        rarity: 0.5,
      },
    ],
  };

  writeFileSync(`./images/${picInfo[idx]}.json`, JSON.stringify(meta, null, 2));
  console.log(picInfo[idx]);
}

// Create directory if not exists
if (!existsSync("./images")) {
  mkdirSync("./images");
}

// cleanup directory before each run
// readdirSync("./out").forEach((f) => rmSync(`./out/${f}`));

let idx = picInfo.length - 1;
do {
  createMetaData(idx);
  idx--;
} while (idx >= 0);

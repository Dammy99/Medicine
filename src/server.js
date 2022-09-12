const ws = require("ws");
const { output, randId, getId } = require("./utils");
const {
  login,
  registration,
  getMedicine,
  searchMedicine,
  getInformation,
  isMedicine,
  addMedicine,
  removeMedicine,
  myMedicine,
  ratingMedicine,
  sortMedicine,
} = require("./database.js");

const port = process.env.PORT || 3000;
const wss = new ws.Server(
  {
    port,
  },
  () => console.log(`Server started on ${port}\n`)
);

let users = {};

wss.on("connection", (ws) => {
  ws.onmessage = async (req) => {
    let resp = "";
    const data = JSON.parse(req.data);

    if (data.func === "login") {
      if (Object.keys(users).includes(data.login)) {
        resp = "Неможливо здійснити вхід, оскільки сесія вже триває!";
      } else {
        users[data.login] = ws;
        console.log(`User ${data.login} is connected.\n`);
        resp = await login(data.login, data.password);
      }
    }
    if (data.func === "registration") {
      resp = await registration(data.login, data.password);
    }
    if (data.func === "getMedicine") {
      resp = await getMedicine();
    }
    if (data.func === "searchMedicine") {
      resp = await searchMedicine(data.text, data.type);
    }
    if (data.func === "getInformation") {
      resp = await getInformation(data.id);
    }
    if (data.func === "isMedicine") {
      resp = await isMedicine(data.login, data.id);
    }
    if (data.func === "addMedicine") {
      resp = await addMedicine(data.login, data.id);
    }
    if (data.func === "removeMedicine") {
      resp = await removeMedicine(data.login, data.id);
    }
    if (data.func === "myMedicine") {
      resp = await myMedicine(data.login);
    }
    if (data.func === "ratingMedicine") {
      resp = await ratingMedicine(data.str);
    }
    if (data.func === "sortMedicine") {
      resp = await sortMedicine();
    }
    console.log(output(data));
    console.log(`Respond:\n${resp}\n`);
    ws.send(resp);
  };

  ws.onclose = () => {
    const login = getId(users, ws);
    if (login) {
      delete users[login];
      console.log(`User ${login} is disconnected.\n`);
    }
  };
});

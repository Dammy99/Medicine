const { getData, setData, removeData } = require("./firebase");
const { createStr, sortByRating, getId } = require("./utils");

async function login(login, password) {
  let response = "";
  const data = await getData(`Users/${login}`);
  if (data) {
    response = data.password === password ? "true" : "Пароль неправильний!";
  } else {
    response = "Користувач з даним логіном відсутній!";
  }
  return response;
}

async function registration(login, password) {
  let response = "";
  if (await getData(`Users/${login}`)) {
    response = "Користувач з даним логіном вже існує.";
  } else {
    let updates = {};
    updates[`Users/${login}/password`] = password;

    await setData(updates);
    response = "Реєстрація пройшла успішно!";
  }
  return response;
}

async function getMedicine() {
  let response = "";
  const data = await getData(`Medicine`);
  for (let id in data) {
    response += createStr(id, data[id]);
  }
  return response.trim();
}

async function searchMedicine(text, searchType = "") {
  let response = "";
  const data = await getData(`Medicine`);
  for (let id in data) {
    if (searchType === "name") {
      const name = data[id].name.toLowerCase();
      if (name.indexOf(text.toLowerCase()) !== -1)
        response += createStr(id, data[id]);
    } else {
      if (data[id].type === text) response += createStr(id, data[id]);
    }
  }
  return response.trim();
}

async function getInformation(id) {
  let response = "";
  const data = await getData(`Medicine/${id}`);
  const { name, price, type, from, dosage, taste, composition } = data;
  if (name) response += `Назва: ${name}\n`;
  if (price) response += `Ціна: ${price.toFixed(2)} грн\n`;
  if (type) response += `Категорія: ${type}\n`;
  if (from) response += `Форма випуску: ${form}\n`;
  if (dosage) response += `Дозування: ${dosage}\n`;
  if (taste) response += `Смак: ${taste}\n`;
  if (composition) response += `Склад:\n${composition.replace(/\s{2}/g, "\n")}`;
  return response;
}

async function isMedicine(login, id) {
  const data = (await getData(`Users/${login}/Medicine`)) || [];
  return data.includes(id).toString();
}

async function addMedicine(login, id) {
  const data = (await getData(`Users/${login}/Medicine`)) || [];
  data.push(id);
  let updates = {};
  updates[`Users/${login}/Medicine`] = data;
  await setData(updates);
  return "Ліки успішно добавлено!";
}

async function removeMedicine(login, id) {
  const data = (await getData(`Users/${login}/Medicine`)) || [];
  const index = data.indexOf(id);
  data.splice(index, 1);
  let updates = {};
  updates[`Users/${login}/Medicine`] = data;
  await setData(updates);
  return "Ліки успішно видалено!";
}

async function myMedicine(login) {
  let response = "";
  const user = (await getData(`Users/${login}/Medicine`)) || [];
  const data = await getData(`Medicine`);
  user.forEach((id) => {
    response += createStr(id, data[id]);
  });
  return response.trim();
}

async function ratingMedicine(str) {
  const arrId = str.split(" ");
  const data = await getData(`Medicine`);
  let updates = {};
  arrId.forEach((id) => {
    let rating = data[id].rating || 0;
    updates[`Medicine/${id}/rating`] = ++rating;
  });
  await setData(updates);
  return "Оплата здійснена!";
}

async function sortMedicine() {
  let response = "";
  const data = await getData(`Medicine`);
  const values = sortByRating(Object.values(data));
  for (let i = 0; i < 3; i++) {
    const id = getId(data, values[i]);
    response += createStr(id, values[i]);
  }
  return response.trim();
}

module.exports = {
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
};

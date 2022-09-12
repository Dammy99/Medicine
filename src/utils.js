function output(data) {
    console.log('New request:');
    for(let key in data) {
        if(!data[key]) delete data[key]
    }
    return data;
}

function randId(users, min, max) {
    const id = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    if(Object.values(users).includes(id)) return randKey(min, max);
    return id;
}

function createStr(id, medicine) {
    return `${id} ${medicine.name} ${medicine.form} - ${medicine.price.toFixed(2).replace(/\./g, ',')} грн\n`;
}

function sortByRating(object) {
    return object.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

function getId(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

module.exports = { output, randId, createStr, sortByRating, getId };
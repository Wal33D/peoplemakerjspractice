let people = [];
//Waleed Add overload constructor equivalent of js to this function so that you can pass params or a json obj to create 
//Basically in main after file read make this work   var gf = new Person(JSON.parse(stuff));
function Person(firstName, lastName, age, eyeColor, nickName = "N/A") {
    init();
    //Init from JSON String
    if (arguments.length <= 1) {
        nickName = arguments[0].nickName
        firstName = arguments[0].firstName
        lastName = arguments[0].lastName
        age = arguments[0].age
        eyeColor = arguments[0].eyeColor
    }

    this.nickName = nickName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.eyeColor = eyeColor;
    this.fullName = this.firstName + " " + this.lastName;

    this.setName = function(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
    };

    this.setNickname = function(nickName) {
        this.nickName = nickName;
    };

    this.getAll = function() {
        return '{"nickName":"' + this.nickName + '","firstName":"' + this.firstName + '","lastName":"' + this.lastName + '","age":' + this.age + ',"eyeColor":"' + this.eyeColor + '","fullName":"' + this.fullName + '"}'

    }
    if (people.find(element => element.fullName === this.fullName)) {
        return;
    }
    people.push(this)
    exportPeople("./people.json")
}

async function exportPeople(path) {
    const fs = require('fs').promises;
    try {
        await fs.writeFile(path, JSON.stringify(people));
        return people;
    } catch (error) {
        return error;
    }
}

async function importPeople(path) {
    const fs = require('fs').promises;
    try {
        const data = await fs.readFile(path);
        JSON.parse(data).forEach(element => new Person(element));

        return people;
    } catch (error) {
        return error;
    }
}
  async function init(path = "./people.json") {
        await importPeople(path)
    }
module.exports = {
     Person: function(firstName, lastName, age, eyeColor, nickName = "N/A"){
        Person(firstName, lastName, age, eyeColor, nickName);
     },
    
     close: async function(path = "./people.json") {
        await exportPeople(path)
    }
}
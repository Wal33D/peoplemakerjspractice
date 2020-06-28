//Waleed Add overload constructor equivalent of js to this function so that you can pass params or a json obj to create 
//Basically in main after file read make this work   var gf = new Person(JSON.parse(stuff));
function Person(firstName, lastName, age, eyeColor, nickName = "N/A", ) {
    this.nickName = nickName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.eyeColor = eyeColor;
    this.name = this.firstName + " " + this.lastName;

    this.setName = function(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = firstName + " " + lastName;
    };

    this.setNickname = function(nickName) {
        this.nickName = nickName;
    };
}

async function exportPeople(people, path) {
    const fs = require('fs').promises;
    try {
        await fs.writeFile('people.js', JSON.stringify(people));
        return people;
    } catch (error) {
        return error;
    }
}

async function importPeople(path) {
    const fs = require('fs').promises;
    try {
        const data = await fs.readFile(path);
        return data;
    } catch (error) {
        return error;
    }
}

const main = async() => {
    var myGirlfriend = new Person("Danni", "Washington", 28, "Brown");
    console.log(myGirlfriend.name);
    myGirlfriend.setNickname("Dano");
    await exportPeople(myGirlfriend, "./people.js")
    const stuff = await importPeople("./people.js")
    var gf = new Person(JSON.parse(stuff));
    console.log(gf);

}

main().catch(console.error);
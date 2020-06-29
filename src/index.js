const _ = require('lodash');

const {
    FlexLayout,
    QApplication,
    QCheckBox,
    QLabel,
    QLineEdit,
    QPlainTextEdit,
    QMainWindow,
    QPushButton,
    QPushButtonEvents,
    QWidget,
    QTableWidget,
    QTableWidgetItem
} = require('@nodegui/nodegui');
const NUMBERS = _.range(0, 10).map(num => num.toString());
const ALPHABET_LOWER = _.range(97, 123).map(chr => String.fromCharCode(chr));
const ALPHABET_UPPER = _.range(65, 91).map(chr => String.fromCharCode(chr));
const ALL_POSSIBLE_CHARS = _.range(33, 127).map(chr => String.fromCharCode(chr));
const CHARSETS = [ALL_POSSIBLE_CHARS, [...NUMBERS, ...ALPHABET_LOWER, ...ALPHABET_UPPER]];

let people = [];
//Waleed Add overload constructor equivalent of js to this function so that you can pass params or a json obj to create 
//Basically in main after file read make this work   var gf = new Person(JSON.parse(stuff));
function Person(firstName, lastName, age, eyeColor, nickName = "N/A") {
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

async function close(path = "./people.json") {
    await exportPeople(path)
}

const main = async() => {
    await init();


    const win = new QMainWindow();
    win.setWindowTitle('Password Generator');
    win.resize(600, 1000);

    // Root view
    const rootView = new QWidget();
    const rootViewLayout = new FlexLayout();
    rootView.setObjectName('rootView');
    rootView.setLayout(rootViewLayout);

    // Fieldset
    const fieldset = new QWidget();
    const fieldsetLayout = new FlexLayout();
    fieldset.setObjectName('fieldset');
    fieldset.setLayout(fieldsetLayout);

    // Number characters row
    const numCharsRow = new QWidget();
    const numCharsRowLayout = new FlexLayout();
    numCharsRow.setObjectName('numCharsRow');
    numCharsRow.setLayout(numCharsRowLayout);

    const numCharsLabel = new QLabel();
    numCharsLabel.setText('Number of characters in the password:');
    numCharsRowLayout.addWidget(numCharsLabel);

    const numCharsInput = new QLineEdit();
    numCharsInput.setObjectName('numCharsInput');
    numCharsRowLayout.addWidget(numCharsInput);

    const checkbox = new QCheckBox();
    checkbox.setText('Include special characters in password');

    // Generated password output
    const passOutput = new QPlainTextEdit();
    passOutput.setObjectName('passOutput');
    passOutput.setReadOnly(true);
    passOutput.setWordWrapMode(3);

    // Button row
    const buttonRow = new QWidget();
    const buttonRowLayout = new FlexLayout();
    buttonRow.setLayout(buttonRowLayout);
    buttonRow.setObjectName('buttonRow');

    // Buttons
    const generateButton = new QPushButton();
    generateButton.setText('Generate');
    generateButton.setObjectName('generateButton');

    const copyButton = new QPushButton();
    copyButton.setText('Copy to clipboard');

    // Clipboard
    const clipboard = QApplication.clipboard();
    //passOutput.setPlainText(people[0].getAll());
    let listWidget = new QTableWidget(people.length, 5);
    listWidget.setObjectName('listWidget');
    listWidget.setHorizontalHeaderLabels(['Last', 'First', 'Age', 'Eye Color', 'Nickname']);

    for (let i = 0; i < people.length; i++) {
        let lastName = new QTableWidgetItem();
        let firstName = new QTableWidgetItem();
        let age = new QTableWidgetItem();
        let eyeColor = new QTableWidgetItem();
        let nickName = new QTableWidgetItem();

        lastName.setText(people[i].lastName);
        listWidget.setItem(i, 0, lastName);
        firstName.setText(people[i].firstName);
        listWidget.setItem(i, 1, firstName);
        age.setText(people[i].age + " ");
        listWidget.setItem(i, 2, age);
        eyeColor.setText(people[i].eyeColor);
        listWidget.setItem(i, 3, eyeColor);
        nickName.setText(people[i].nickName);
        listWidget.setItem(i, 4, nickName);
    }
    listWidget.setColumnWidth(0, 125);
    listWidget.setColumnWidth(1, 125);
    listWidget.setColumnWidth(2, 60);
    listWidget.setColumnWidth(3, 120);
    listWidget.setColumnWidth(4, 120);

    // listWidget.setVerticalScrollBarPolicy(1);

    // Add the widgets to the respective layouts
    fieldsetLayout.addWidget(numCharsRow);
    fieldsetLayout.addWidget(checkbox);
    rootViewLayout.addWidget(fieldset);
    rootViewLayout.addWidget(passOutput);
    rootViewLayout.addWidget(listWidget);
    buttonRowLayout.addWidget(generateButton);
    buttonRowLayout.addWidget(copyButton);
    rootViewLayout.addWidget(buttonRow);
    // Logic
    function getCharSet(includeSpecialCharacters) {
        return includeSpecialCharacters ? CHARSETS[0] : CHARSETS[1];
    }

    function generatePassword(passwordLength, charSet) {
        return _.range(passwordLength).map(() => _.sample(charSet)).join('');
    }

    // Event handling
    generateButton.addEventListener('clicked', async() => {
        const passwordLength = numCharsInput.text();
        const includeSpecialChars = checkbox.isChecked();
        const charSet = getCharSet(includeSpecialChars);
        init();
   rootViewLayout.removeWidget(listWidget);
    buttonRowLayout.removeWidget(generateButton);
    buttonRowLayout.removeWidget(copyButton);
    rootViewLayout.removeWidget(buttonRow);

        await new Person("dfgfdghghghghffh", "fgjfff", 28, "Brown", "sdf")
  listWidget = new QTableWidget(people.length, 5);
    listWidget.setObjectName('listWidget');
    listWidget.setHorizontalHeaderLabels(['Last', 'First', 'Age', 'Eye Color', 'Nickname']);

    for (let i = 0; i < people.length; i++) {
        let lastName = new QTableWidgetItem();
        let firstName = new QTableWidgetItem();
        let age = new QTableWidgetItem();
        let eyeColor = new QTableWidgetItem();
        let nickName = new QTableWidgetItem();

        lastName.setText(people[i].lastName);
        listWidget.setItem(i, 0, lastName);
        firstName.setText(people[i].firstName);
        listWidget.setItem(i, 1, firstName);
        age.setText(people[i].age + " ");
        listWidget.setItem(i, 2, age);
        eyeColor.setText(people[i].eyeColor);
        listWidget.setItem(i, 3, eyeColor);
        nickName.setText(people[i].nickName);
        listWidget.setItem(i, 4, nickName);
    }
        listWidget.setColumnWidth(0, 125);
    listWidget.setColumnWidth(1, 125);
    listWidget.setColumnWidth(2, 60);
    listWidget.setColumnWidth(3, 120);
    listWidget.setColumnWidth(4, 120);
   rootViewLayout.addWidget(listWidget);
    buttonRowLayout.addWidget(generateButton);
    buttonRowLayout.addWidget(copyButton);
    rootViewLayout.addWidget(buttonRow);
    });
  

    copyButton.addEventListener('clicked', () => {
        clipboard.setText(passOutput.toPlainText(), 0);
    });

    // Styling
    const rootStyleSheet = `
  #rootView {
    padding: 5px;
  }
  #fieldset {
    padding: 10px;
    border: 2px ridge #bdbdbd;
    margin-bottom: 4px;
  }
  #numCharsRow, #buttonRow {
    flex-direction: row;
  }
  #numCharsRow {
    margin-bottom: 5px;
  }
  #numCharsInput {
    width: 40px;
    margin-left: 2px;
  }
  #listWidget {
    height: 585px;
    margin-bottom: 4px;
  }
  #buttonRow{
    margin-bottom: 5px;
  }
  #generateButton {
    width: 120px;
    margin-right: 3px;
  }
  #copyButton {
    width: 120px;
  }
`;

    rootView.setStyleSheet(rootStyleSheet);

    win.setCentralWidget(rootView);
    win.show();

    global.win = win;

}

main().catch(console.error);
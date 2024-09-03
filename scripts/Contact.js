const BaseUrl = "https://join-317-default-rtdb.europe-west1.firebasedatabase.app/";
let charContactArray = [];
let emailsArray = [];
let contactNameArray = [];
let PhonenumberArray = [];
let colorPalette = [];
let currentWindowWidth = window.innerWidth;

let editDeleteChoiceID = ['MenuEditDeleteOptionsID', 'MenuEditDeleteOptionsID', 'editDeleteChoiceButton']
let editDeleteChoiceAdd = ['SlideinWindowDW1', 'MenuEditDeleteOptionsSmall', 'none']
let editDeleteChoiceRemove = ['SlideinWindowDW2', 'none', 'MenuEditDeleteButton']

let editDeleteWindowID = ['ContactfieldInfodiv', 'ContactfieldInfodiv', 'ContactfieldInfodiv', 'MenuEditDeleteOptionsID']
let editDeleteWindowRemove = ['Slideinright', 'Slideinleft', 'SlideinBottomNew', 'SlideinWindowDW1']

contactLoad();

/**
 * Fetches the data from the database and converts it into a json.
 * Fills several arrays with the corresponding information using a for loop.
 * 
 * @param {*} name
 */
function contactLoad() {
    cleanarray();
    let contactAllArray = JSON.parse(localStorage.getItem('contactAllArray')) || [];
    for (let key in contactAllArray) {  
        contactNameArray.push(contactAllArray[key].name);
        emailsArray.push(contactAllArray[key].email);
        PhonenumberArray.push(contactAllArray[key].phone);
        charContactArray.push({ key: key, name: contactAllArray[key].name, email: contactAllArray[key].email, phone: contactAllArray[key].phone });
        colorPalette.push(contactAllArray[key].color);
    }
    contactloadchar(contactNameArray);
}


/**
 * Several arrays are emptied.
 * 
 */
function cleanarray(){
    contactNameArray = [];
    emailsArray = [];
    PhonenumberArray = [];
    charContactArray = [];
    colorPalette = [];
}


/**
 * 
 * charContactArray is filled, and then the array is sorted alphabetically by initials and then by name.
 * 
 * @param {*} contactNameArray 
 */
function contactloadchar(contactNameArray){
    contactNameArray.forEach((name, index) => {
        let email = emailsArray[index];
        let [firstName, lastName] = name.split(" ");
        let initials = `${firstName[0]}${lastName[0]}`;
        charContactArray[index].initial = firstName[0].toUpperCase();
        charContactArray[index].initials = initials;
    });
    charContactArray.sort((a, b) => {
        if (a.initial === b.initial) {
            return a.name.localeCompare(b.name);
        }
        return a.initial.localeCompare(b.initial);
    });
    contactloadcontainer();
}


/**
 * A div container is created here and extensive functions are called up.
 * 
 */
function contactloadcontainer(){
    let container = document.createElement('div');
    let currentInitial = '';
    charContactArray.forEach((obj) => {
        contactloadcontainer1(obj, currentInitial, container)
    });
    contactLoadTargetid(container);
}


/**
 * Each element of charContactArray is selected and checked to see if the initials match.
 * If not, a new initial is displayed. A horizontal line is also created.
 * 
 * @param {*} obj 
 * @param {*} currentInitial 
 * @param {*} container 
 */
function contactloadcontainer1(obj, currentInitial, container){
    if (obj.initial !== currentInitial) {
        currentInitial = obj.initial;
        let initialExists = Array.from(container.children).some(child => 
            child.classList.contains('initial-span') && child.textContent === currentInitial);
        if (!initialExists) {
            let span = document.createElement('span');
            span.textContent = currentInitial;
            span.classList.add('initial-span');
            container.appendChild(span);
            let lineDiv = document.createElement('div');
            lineDiv.classList.add('gray-line');
            container.appendChild(lineDiv);
        }
    }
    contactloadcontainer2(container, obj);
}


/**
 * 
 * The buttons are created and assigned an ID based on the Firebase key.
 * 
 * @param {*} container 
 * @param {*} obj 
 */
function contactloadcontainer2(container, obj){
    let button = document.createElement('button');
    button.classList.add('person-button');
    button.id = `contact-button-${obj.key}`;
    button.classList.add('Backgroundgray');
    contactloadcontainer3(container, obj, button);
}


function contactInfoIDControl(){
    let windowSize = window.innerWidth;
    if(windowSize < 900){
        return 'ContactSmallSize'
    }
    else{
        return 'ContactsInfoSection'
    }
}


/**
 * 
 * The circle element for the initials is created here and equipped with the appropriate color contained in the colorPalette array.
 * A div container is created from name and e-mail
 * 
 * @param {*} container 
 * @param {*} obj 
 * @param {*} button 
 */
function contactloadcontainer3(container, obj, button) {
    let circleDiv = document.createElement('div');
    circleDiv.textContent = obj.initials;
    circleDiv.classList.add('initial-circle');
    let colorIndex = obj.key; 
    let color = colorPalette[colorIndex % colorPalette.length]; 
    circleDiv.style.backgroundColor = color;
    button.appendChild(circleDiv);
    let nameEmailDiv = document.createElement('div');
    nameEmailDiv.classList.add('name-email');
    contactloadcontainer4(container, nameEmailDiv, button, obj);
}


/**
 * 
 * A div container is created from name and e-mail
 * 
 * @param {*} container 
 * @param {*} nameEmailDiv 
 * @param {*} button 
 * @param {*} obj 
 */
function contactloadcontainer4(container, nameEmailDiv, button, obj){
    let nameDiv = document.createElement('div');
    nameDiv.textContent = obj.name;
    nameDiv.classList.add('person-name');
    nameEmailDiv.appendChild(nameDiv);
    let emailDiv = document.createElement('div');
    emailDiv.textContent = obj.email;
    emailDiv.classList.add('person-email');
    nameEmailDiv.appendChild(emailDiv);
    button.appendChild(nameEmailDiv);
    contactloadcontainer5(container, button);
}


/**
 * 
 * Event listener for buttons to change the background color. In addition, classes are removed and added based on the behavior of the listener.
 * 
 * @param {*} container 
 * @param {*} button 
 */
function contactloadcontainer5(container, button){
    button.addEventListener('click', function() {
        document.querySelectorAll('.person-button').forEach(btn => {
            btn.classList.remove('button-active');
            btn.classList.add('Backgroundgray');
        });
        button.classList.add('button-active');
        button.classList.remove('Backgroundgray');
        let clickedButtonId = event.currentTarget.id;
        let buttonColor = event.currentTarget.querySelector('.initial-circle').style.backgroundColor;
        contactloadcontainer6(buttonColor, clickedButtonId)
    });
    container.appendChild(button);
}


/**
 * The If condition checks whether the Px width is below 900 and, depending on this, the following functions are executed.
 * 
 * @param {} buttonColor 
 * @param {*} clickedButtonId 
 */
function contactloadcontainer6(buttonColor, clickedButtonId){
    let currentWindowWidth = window.innerWidth;
    if(currentWindowWidth < 900){
        
        showContactWindow()
        contactInfo(clickedButtonId, buttonColor, true);

    }else{
        contactInfo(clickedButtonId, buttonColor, false);
        let ChangeZIndex =document.getElementById('ContactsInfoSection')
        ChangeZIndex.style.zIndex = '5'
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinright')
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinleft')
        
    }
}


function editDeleteWindowBack(){
    for(let i = 0; i < editDeleteWindowID.length;i++){
        document.getElementById(`${editDeleteWindowID[i]}`).classList.remove(`${editDeleteWindowRemove[i]}`)
    }
    document.getElementById('MenuEditDeleteOptionsID').classList.add('SlideinWindowDW2');
    document.getElementById('ContactfieldInfodiv').classList.add('SlideinTopNew');
    setTimeout(() => {
        document.getElementById('MenuEditDeleteOptionsID').classList.add('none')
        document.getElementById('MenuEditDeleteOptionsID').classList.remove('MenuEditDeleteOptionsSmall')
        document.getElementById('editDeleteChoiceButton').classList.remove('none')
        document.getElementById('editDeleteChoiceButton').classList.add('MenuEditDeleteButton')
    }, 200);
    
}

function showContactWindow(){
    document.getElementById('EveryContact').classList.add('none')
    document.getElementById('AddContactNewButton').classList.add('none')
    document.getElementById('AddContactNewButton').classList.remove('MenuEditDeleteButton')
    document.getElementById('ArrowBackClick').classList.add('StyleBackarrowClick')
    document.getElementById('MenuEditDeleteButtonID').classList.remove('none')
    document.getElementById('editDeleteChoiceButton').classList.remove('none')
    document.getElementById('editDeleteChoiceButton').classList.add('MenuEditDeleteButton')
    let ChangeRightSection = document.getElementById('RightsectionheadlineID')
    ChangeRightSection.style.display = 'flex'
    let ChangeZIndex =document.getElementById('ContactsInfoSection')
    ChangeZIndex.style.zIndex = '5'
    isButtonClicked = true;
    let ContactSectionField = document.getElementById('ContactsInfoSection');
    ContactSectionField.onclick = editDeleteWindowBack;
}


function goBackToContacts(){
    document.getElementById('EveryContact').classList.remove('none')
    document.getElementById('AddContactNewButton').classList.remove('none')
    document.getElementById('AddContactNewButton').classList.add('MenuEditDeleteButton')
    document.getElementById('ArrowBackClick').classList.remove('StyleBackarrowClick')
    document.getElementById('editDeleteChoiceButton').classList.add('none')
    document.getElementById('editDeleteChoiceButton').classList.remove('MenuEditDeleteButton')
    document.getElementById('MenuEditDeleteButtonID').classList.add('none')
    let windowsize = window.innerWidth;
    if(windowsize < 900){
        let ChangeZIndex =document.getElementById('ContactsInfoSection')
        ChangeZIndex.style.zIndex = '-1'
    }
    isButtonClicked = false;
}

function editDeleteWindow(){
    for(let i = 0; i < editDeleteChoiceID.length;i++){
        document.getElementById(`${editDeleteChoiceID[i]}`).classList.add(`${editDeleteChoiceAdd[i]}`)
    }
    for(let i = 0; i < editDeleteChoiceID.length;i++){
        document.getElementById(`${editDeleteChoiceID[i]}`).classList.remove(`${editDeleteChoiceRemove[i]}`)
    }    
}
let isButtonClicked = false;

function clickContactBack(){
    const editWindow = document.getElementById('EditContactIDWIn');
    editWindow.classList.remove('Slideinright');
    editWindow.classList.add('Slideinleft');
    setTimeout(() => {
        editWindow.classList.add("none");
        editWindow.classList.remove("EditContactWindow");
    }, 400); 
    document.getElementById('editDeleteChoiceButton').classList.remove('none');
    document.getElementById('editDeleteChoiceButton').classList.add('MenuEditDeleteButton');
    document.getElementById("MenuEditDeleteButtonID").classList.remove("none");
}

window.addEventListener('resize', function() {
    const windowWidth = window.innerWidth;
    let ChangeZIndex =document.getElementById('ContactsInfoSection')
    if (isButtonClicked) {
        if (windowWidth < 900) {ChangeZIndex.style.zIndex = '5'} 
        else {ChangeZIndex.style.zIndex = '10'}
    }
    else{
        if (windowWidth < 900) {ChangeZIndex.style.zIndex = '-1'} 
        else {ChangeZIndex.style.zIndex = '10'}
    }
});




/**
 * 
 * The key is extracted from the ID. The corresponding object in the array is also filtered out. 
 * ZUsätzlich wird überprüft ob die px breite kleiner als 900 ist, falls das so ist wird eine class hinzugefügt und eine entfernt.
 * 
 * @param {*} clickedButtonId 
 * @param {*} buttonColor 
 */
function contactInfo(clickedButtonId, buttonColor, boolean){
    let key = clickedButtonId.split('-').pop(); 
    let contact = charContactArray.find(obj => obj.key === key);
    if (contact) {
        let { initials, name, email, phone } = contact;
        contactInfoHtml(initials, name, email, phone, buttonColor, key, boolean);
        let windowSize = window.innerWidth
        if(windowSize > 900){
            document.getElementById('MenuEditDeleteOptionsID').classList.add('hidden')
            document.getElementById('MenuEditDeleteOptionsID').classList.remove('MenuEditDeleteOptionsSmall')
        }
        booleanForContact(boolean)
    }
}


/**
 * The destination ID where they should be located is specified here.
 * 
 * @param {*} container 
 */
function contactLoadTargetid(container){
    document.getElementById('EveryContact').innerHTML= ``;
    let targetElement = document.getElementById('EveryContact'); 
    if (targetElement) {
        targetElement.appendChild(container);
    }
}


/**
 * Es wird überprüft ob der boolean wahr oder falsch ist und je nach dem werden Klassen ausgeführt.
 * 
 * @param {*} boolean 
 * @returns 
 */
function booleanForContact(boolean){
    if(boolean == true){
        document.getElementById('ContactEditDeleteID').classList.add('none')
        document.getElementById('ArrowBackClick').classList.remove('none')
    }
    else{
        document.getElementById('ContactEditDeleteID').classList.remove('none')
        document.getElementById('ArrowBackClick').classList.add('none')
    }
}




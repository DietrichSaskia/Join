const BaseUrl = "https://join-317-default-rtdb.europe-west1.firebasedatabase.app/";

let charContactArray = [];
let emailsArray = [];
let contactNameArray = [];
let PhonenumberArray = [];
let usedColors = {}; 
const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', 
    '#33FFF2', '#FF9A33', '#FF5733', '#A1FF33', '#33FF9A'
];

contactLoad();
loadUsedColors();


/**
 * holt die daten aus der datenbank und wandelt es in einen json um.
 * 
 * @param {*} name
 */
async function contactLoad() {
    contactNameArray = [];
    emailsArray = [];
    PhonenumberArray = [];
    charContactArray = [];
    let pathcontact = 'contactall';
    let contactall = await fetch(BaseUrl + pathcontact + '.json');
    let contactallshow = await contactall.json();
    
    for (let key in contactallshow) {  // Verwende "for...in", um die Keys durchzugehen
        contactNameArray.push(contactallshow[key].name);
        emailsArray.push(contactallshow[key].email);
        PhonenumberArray.push(contactallshow[key].phone);
        charContactArray.push({ key: key, name: contactallshow[key].name, email: contactallshow[key].email, phone: contactallshow[key].phone });
    }
    
    contactloadchar(contactNameArray);
}

/**
 * charContactArray wird befüllt, und anschließend wird das Array alphabetisch nach den Initialen und dann nach den Namen sortiert.
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
 * Jedes Element von charContactArray wird ausgewählt und überprüft, ob die Initialen übereinstimmen.
 * Falls nicht, wird eine neue Initiale angezeigt.
 */
function contactloadcontainer(){
    let container = document.createElement('div');
    let currentInitial = '';
    charContactArray.forEach((obj) => {
        if (obj.initial !== currentInitial) {
            currentInitial = obj.initial;
            // Füge die Initialen und die horizontale Linie hinzu
            let span = document.createElement('span');
            span.textContent = currentInitial;
            span.classList.add('initial-span');
            container.appendChild(span);

            let lineDiv = document.createElement('div');
            lineDiv.classList.add('gray-line');
            container.appendChild(lineDiv);
        }
        contactloadcontainer2(container, obj);
    });
    contactLoadTargetid(container);
}

/**
 * Die Buttons werden erstellt und ihnen eine ID zugewiesen, die auf dem Firebase-Key basiert.
 * 
 * @param {*} container 
 * @param {*} obj 
 */
function contactloadcontainer2(container, obj){
    let button = document.createElement('button');
    button.classList.add('person-button');
    button.id = `contact-button-${obj.key}`;  // Verwende den Key als Teil der ID
    button.classList.add('Backgroundgray');
    
    contactloadcontainer3(container, obj, button);
}

/**
 * Hier wird das Kreis-Element für die Initialen erstellt und eine Farbe ausgewählt.
 * Name und E-Mail werden ebenfalls hinzugefügt.
 * 
 * @param {*} container 
 * @param {*} obj 
 * @param {*} button 
 */
function contactloadcontainer3(container, obj, button){
    let circleDiv = document.createElement('div');
    circleDiv.textContent = obj.initials;
    circleDiv.classList.add('initial-circle');
    // Verwende addOrUpdateColorForContact, um die richtige Farbe zu erhalten
    let color = addOrUpdateColorForContact(obj);
    circleDiv.style.backgroundColor = color;
    button.appendChild(circleDiv);

    // Name und E-Mail in einem div erstellen
    let nameEmailDiv = document.createElement('div');
    nameEmailDiv.classList.add('name-email');

    contactloadcontainer4(container, nameEmailDiv, button, obj);
}

/**
 * Der Name und die E-Mail werden in ein Div eingefügt.
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
 * Event Listener für Buttons, um die Hintergrundfarbe zu ändern und Details anzuzeigen.
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
        contactInfo(clickedButtonId, buttonColor);
    });
    container.appendChild(button);
}

function contactInfo(clickedButtonId, buttonColor){
    let key = clickedButtonId.split('-').pop();  // Extrahiere den Key aus der ID

    // Finde das entsprechende Objekt im Array
    let contact = charContactArray.find(obj => obj.key === key);
    if (contact) {
        let { initials, name, email, phone } = contact;
        contactInfoHtml(initials, name, email, phone, buttonColor, key);
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinright');
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinleft');
    }
}


/**
 * Hier wird die Ziel Id angegeben wo sie sich befinden sollen.
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
 * Hier wird entweder eine vor definierte Farbe verwendet oder es wird eine neue generiert.
 * 
 * @returns 
 */

// Entfernt die Farbe, wenn ein Kontakt gelöscht wird
function removeColorForContact(contactName) {
    if (usedColors[contactName]) {
        delete usedColors[contactName];
        saveUsedColors(); // Speichere den Zustand nach dem Löschen
    }
}

// Speichert das `usedColors` Objekt im LocalStorage
function saveUsedColors() {
    localStorage.setItem('usedColors', JSON.stringify(usedColors));
}

// Lädt das `usedColors` Objekt aus dem LocalStorage
function loadUsedColors() {
    const savedColors = localStorage.getItem('usedColors');
    if (savedColors) {
        usedColors = JSON.parse(savedColors);
    } else {
        usedColors = {};
    }
}


// Fügt eine neue Farbe für den Kontakt hinzu oder aktualisiert sie
function addOrUpdateColorForContact(obj) {
    
    console.log(usedColors[obj.key])
    // Falls dem Kontakt bereits eine Farbe zugewiesen wurde, behalte sie bei
    if (usedColors[obj.name]) {
        return usedColors[obj.name];
    }
    
    // Verwende eine verfügbare Farbe oder generiere eine neue
    let color = getNextAvailableColor(obj);
    usedColors[obj.name] = color;
    saveUsedColors(); // Speichere den Zustand nach jeder Änderung
    return color;
}

// Gibt die nächste verfügbare Farbe zurück
function getNextAvailableColor(obj) {
    // Überprüfen, ob diesem Kontakt bereits eine Farbe zugewiesen wurde
    if (usedColors[obj.name]) {
        return usedColors[obj.name];
    }

    // Wenn noch nicht alle Farben vergeben sind, verwende eine aus dem colorPalette-Array
    for (let color of colorPalette) {
        if (!Object.values(usedColors).includes(color)) {
            return color;
        }
    }

    // Wenn alle Farben vergeben sind, generiere eine zufällige Farbe
    let generatedColor = generateRandomColor();
    return generatedColor;
}

// Generiert eine zufällige Farbe
function generateRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


let IMGPfadon = ['deleteBlue','editBlue']
let IMGPfadof = ['delete',  'edit']

function onmouse(id){
        let pfadextra;
        if(id == 'ContactEditChange'){
            pfadextra = IMGPfadon[1]
        }
        else{
            pfadextra = IMGPfadon[0]
        }
        document.getElementById(id).innerHTML=`
        <img class="ContactDeleteEdit" src="/assets/icons/${pfadextra}.png"></img>
        `;
}

function outmouse(id){
    let pfadextra;
        if(id == 'ContactEditChange'){
            pfadextra = IMGPfadof[1]
        }
        else{
            pfadextra = IMGPfadof[0]
        }
        document.getElementById(id).innerHTML=`
        <img class="ContactDeleteEdit" src="/assets/icons/${pfadextra}.png"></img>
        `;
}

function onmouseClose(id){
    if(id == 'XCloseID'){
        document.getElementById(id).innerHTML=`
        <img id="XCloseother" class="ImgCloseStyle2" src="/assets/icons/closeBlue.png">
    `;
    }
}

function outmouseClose(id){
    if(id == 'XCloseID'){
        document.getElementById(id).innerHTML=`
        <img id="XClose" class="ImgCloseStyle2" src="/assets/icons/close.png">
    `;
    }
}




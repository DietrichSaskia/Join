

async function contactLoad() {
    cleanarray()
    let pathcontact = 'contactall';
    let contactall = await fetch(BaseUrl + pathcontact + '.json');
    let contactallshow = await contactall.json();
    for (let key in contactallshow) {  
        contactNameArray.push(contactallshow[key].name);
        emailsArray.push(contactallshow[key].email);
        PhonenumberArray.push(contactallshow[key].phone);
        charContactArray.push({ key: key, name: contactallshow[key].name, email: contactallshow[key].email, phone: contactallshow[key].phone });
        colorPalette.push(contactallshow[key].color)
    }
    contactloadchar(contactNameArray);
}

function cleanarray(){
    contactNameArray = [];
    emailsArray = [];
    PhonenumberArray = [];
    charContactArray = [];
    colorPalette = [];
}

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

function contactloadcontainer(){
    let container = document.createElement('div');
    let currentInitial = '';
    charContactArray.forEach((obj) => {
        contactloadcontainer1(obj, currentInitial, container)
    });
    contactLoadTargetid(container);
}

function contactloadcontainer1(obj, currentInitial, container){
    if (obj.initial !== currentInitial) {
        currentInitial = obj.initial;
        let span = document.createElement('span');
        span.textContent = currentInitial;
        span.classList.add('initial-span');
        container.appendChild(span);
        let lineDiv = document.createElement('div');
        lineDiv.classList.add('gray-line');
        container.appendChild(lineDiv);
    }
    contactloadcontainer2(container, obj);
}

function contactloadcontainer2(container, obj){
    let button = document.createElement('button');
    button.classList.add('person-button');
    button.id = `contact-button-${obj.key}`;
    button.classList.add('Backgroundgray');
    contactloadcontainer3(container, obj, button);
}

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
    let key = clickedButtonId.split('-').pop(); 
    let contact = charContactArray.find(obj => obj.key === key);
    if (contact) {
        let { initials, name, email, phone } = contact;
        contactInfoHtml(initials, name, email, phone, buttonColor, key);
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinright');
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinleft');
    }
}

function contactLoadTargetid(container){
    document.getElementById('EveryContact').innerHTML= ``;
    let targetElement = document.getElementById('EveryContact'); 
    if (targetElement) {
        targetElement.appendChild(container);
    }
}
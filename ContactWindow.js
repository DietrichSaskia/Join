

function editNewContact(initials, name, email, phone, buttonColor, index) {
  document.getElementById("EditContactIDWIn").classList.remove("none");
  document.getElementById("EditContactIDWIn").classList.add("EditContactWindow");
  editNewContactHtml2(initials, name, email, phone, buttonColor, index, true);
}

function editNewContactSave(name, email, phone, index) {
  // Apply focus and blur event listeners directly
  let nameelement = document.getElementById("editNameInput").value
  let emailelement = document.getElementById("editEmailInput").value
  let phoneelement = document.getElementById("editPhoneInput").value
  if(nameelement === ''){
    validateName("editNameInput")
  }
  if(emailelement === ''){
    validateEmail("editEmailInput")
  }
  if(phoneelement === ''){
    validatePhone("editPhoneInput")
  }
  applyFocusAndValidation("editNameInput", name, validateName);
  applyFocusAndValidation("editEmailInput", email, validateEmail);
  applyFocusAndValidation("editPhoneInput", phone, validatePhone);
  editNewContactSave2(index)
}

function editNewContactSave2(index) {
    // Form validation and submission handling
    document.getElementById("editContactForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent actual form submission
  
        // Hole die aktuellen Werte aus den Eingabefeldern
        const nameValue = document.getElementById("editNameInput").value;
        const emailValue = document.getElementById("editEmailInput").value;
        const phoneValue = document.getElementById("editPhoneInput").value;
        // Validierung des Telefonnummerformats
        const phoneRegex = /^\+\d{2} \d{4} \d{3} \d{2} \d{1}$/;
        if (!phoneRegex.test(phoneValue)) {
          console.log('Telefonnummer-Format ungültig');
          return;
        } else {
          // Übergebe die aktuellen Werte an die editNewContactChange Funktion
          editNewContactChange(nameValue, emailValue, phoneValue, index);
        }
    });
}

function editNewContactHtml2(initialsValue, nameValue, emailValue, phoneValue, buttonColorValue, index, showValues = true) {
    console.log('initialsValue:', initialsValue);
    console.log('nameValue:', nameValue);
    console.log('emailValue:', emailValue);
    console.log('phoneValue:', phoneValue);
    console.log('buttonColorValue:', buttonColorValue);
    console.log('index:', index);
    const name = showValues && nameValue ? nameValue : '';  
    const email = showValues && emailValue ? emailValue : '';
    const phone = showValues && phoneValue ? phoneValue : '';
    const buttonColor = showValues && buttonColorValue ? buttonColorValue : '';
    const initials = showValues && initialsValue ? initialsValue : '';
    editNewContactHtml(initials, name, email, phone, buttonColor, index);
}

let contactDetails = {};

function setContactDetails(initials, name, email, phone, buttonColor, index) {
    contactDetails = { initials, name, email, phone, buttonColor, index };
}

function editNewContactHtmlChange() {
    editContactShowWindow();
    editNewContactHtml2(contactDetails.initials, contactDetails.name, contactDetails.email, contactDetails.phone, contactDetails.buttonColor, contactDetails.index, false);
    document.getElementById('EditWindowAddText1Change').innerHTML='Add contact';
    document.getElementById('EditWindowAddText2Change').innerHTML='Tasks are better with a team!';
    document.getElementById('EditWindowDeleteSaveID1').classList.remove('EditWindowDeleteSave')
    document.getElementById('EditWindowDeleteSaveID1').classList.add('none')
    document.getElementById('EditWindowDeleteSaveID2').classList.add('EditWindowDeleteSave')
    document.getElementById('EditWindowDeleteSaveID2').innerHTML=`
    <button onclick="editContactCloseWindow()" onmouseover="onmouseClose('XCloseID')" onmouseout="outmouseClose('XCloseID')" id="CloseButtonID" type="button" class="EditWindowDeleteButton">Cancel 
        <div class="XButtonCloseStyle" id="XCloseID">
            <img  class="ImgCloseStyle2" src="/assets/icons/close.png">
        </div>
    </button>
    <button onclick="createNewContact()" class="EditWindowSaveButton">Create contact <img class="EditSaveCheck" src="/assets/icons/checkWhite.png"></button>
    `;
}

async function createNewContact() {
    let pathcontact = 'contactall';
    let response = await fetch(BaseUrl + pathcontact + '.json');
    let contactallshow = await response.json();
    
    // Hole die Werte aus den Input-Feldern
    const name = document.getElementById('editNameInput').value.trim();
    const email = document.getElementById('editEmailInput').value.trim();
    const phone = document.getElementById('editPhoneInput').value.trim();

    // Bestimme die Länge der Kontaktliste und setze den neuen Schlüssel basierend darauf
    let contactKey = contactallshow ? Object.keys(contactallshow).length : 0;

    // Erstelle ein neues Kontakt-Objekt
    let newContact = {
        "name": name,
        "email": email,
        "phone": phone
    };

    try {
        // Speichern des neuen Kontakts in der Firebase-Datenbank unter dem dynamischen Schlüssel
        let putResponse = await fetch(`${BaseUrl}${pathcontact}/${contactKey}.json`, {
            method: 'PUT', // Verwende PUT, um das Objekt unter einem bestimmten Schlüssel zu erstellen
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newContact)
        });

        if (putResponse.ok) {
            console.log(`Neuer Kontakt erfolgreich unter dem Schlüssel ${contactKey} erstellt:`, newContact);
            editContactCloseWindow(); // Schließe das Fenster nach dem Erstellen des Kontakts
            contactLoad()
        } else {
            console.error("Fehler beim Erstellen des Kontakts:", putResponse.statusText);
        }
    } catch (error) {
        console.error("Fehler bei der Anfrage:", error);
    }
}





async function deleteContactList(index,name) {
    let pathcontact = 'contactall';
    // 1. Abrufen des aktuellen contactall-Arrays aus der Datenbank
    let response = await fetch(BaseUrl + pathcontact + '.json');
    let contactallshow = await response.json();
    // Überprüfung, ob der Index gültig ist
    let Oldname = name
    removeColorForContact(Oldname)
    if (index >= 0 && index < contactallshow.length) {
        // 2. Löschen des Objekts am angegebenen Index
        contactallshow.splice(index, 1);
        // 3. Aktualisiertes Array in die Datenbank zurückspeichern
        await fetch(BaseUrl + pathcontact + '.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactallshow)
        });
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinright')
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinleft')
        contactLoad()
    } else {
        console.error('Ungültiger Index');
    }
}

function editContactCloseWindow() {
    const editWindow = document.getElementById('EditContactIDWIn');
    
    // Starte die Slide-out-Animation
    editWindow.classList.remove('Slideinright');
    editWindow.classList.add('Slideinleft');
    
    // Warte, bis die Animation abgeschlossen ist, bevor du das Element ausblendest
    setTimeout(() => {
        editWindow.classList.add("none");
        editWindow.classList.remove("EditContactWindow");
    }, 400); // 400ms entspricht der Dauer der Animation in deiner CSS (0.4s)
}


function editContactShowWindow() {
    const editWindow = document.getElementById('EditContactIDWIn');
    
    // Zeige das Element an
    editWindow.classList.remove("none");
    editWindow.classList.add("EditContactWindow");
    
    // Starte die Slide-in-Animation
    editWindow.classList.add('Slideinright');
    editWindow.classList.remove('Slideinleft');
}

async function editNewContactChange(name, email, phone, index) {
    let pathcontact = 'contactall';
    // 1. Abrufen des aktuellen contactall-Arrays aus der Datenbank
    let response = await fetch(BaseUrl + pathcontact + '.json');
    let contactallshow = await response.json();
    // 2. Überprüfung, ob ein Kontakt mit den gleichen Werten bereits existiert
    let duplicate = contactallshow.some(contact => 
        contact.name === name && 
        contact.email === email && 
        contact.phone === phone
    );
    console.log(index)
    let Oldname = name
    removeColorForContact(Oldname)
    if (index >= 0 && index < contactallshow.length) {
        // 3. Löschen des Objekts am angegebenen Index
        contactallshow.splice(index, 1);

        // 4. Neues Objekt erstellen
        let newContact = {
            "email": `${email}`,
            "name": `${name}`,
            "phone": `${phone}`
        };

        // 5. Einfügen des neuen Objekts an der gleichen Stelle
        contactallshow.splice(index, 0, newContact);

        // 6. Aktualisiertes Array in die Datenbank zurückspeichern
        await fetch(BaseUrl + pathcontact + '.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactallshow)
        });

        console.log('Kontakt erfolgreich aktualisiert');
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinright')
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinleft')
        contactLoad()
        document.getElementById('EditContactIDWIn').classList.add('none')
    }
}

function validateName(inputFieldId, originalValue) {
    const nameInput = document.getElementById(inputFieldId);
    const parentDiv = nameInput.closest(".EditWindowInput");

    // Regex, um sicherzustellen, dass mindestens ein Vor- und ein Nachname vorhanden sind
    const nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/;

    // Überprüfe, ob das Feld leer ist
    if (nameInput.value.trim() === '') {
        parentDiv.style.border = "1px solid #29ABE2";  // Setze die Border auf blau, wenn das Feld leer ist
        return false;
    } else if (!nameRegex.test(nameInput.value)) {
        parentDiv.style.border = "1px solid red";  // Setze die Border auf rot, wenn nur ein Vorname oder ungültige Eingabe vorhanden ist
        return false;
    } else {
        parentDiv.style.border = "1px solid green";  // Setze die Border auf grün, wenn sowohl Vor- als auch Nachname vorhanden sind
        return true;
    }
}

  
  function validateEmail(inputFieldId, originalValue) {
    const emailInput = document.getElementById(inputFieldId);
    const parentDiv = emailInput.closest(".EditWindowInput");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        parentDiv.style.border = "1px solid #29ABE2";  // Setze die Border auf rot, wenn das Feld leer ist
        return false;
    }else if (!emailRegex.test(emailInput.value)) {
      parentDiv.style.border = "1px solid red";
      return false;
    } else {
      parentDiv.style.border = "1px solid green";
      return true;
    }
  }
  
  function validatePhone(inputFieldId, originalValue) {
    const phoneInput = document.getElementById(inputFieldId);
    const parentDiv = phoneInput.closest(".EditWindowInput");

    // Event-Listener für focus hinzufügen, um das + Zeichen hinzuzufügen
    phoneInput.addEventListener('focus', function() {
        if (!phoneInput.value.startsWith('+')) {
            phoneInput.value = '+';
        }
    });

    // Telefonnummer formatieren, bevor sie validiert wird, aber nur wenn das + bereits vorhanden ist
    if (phoneInput.value.startsWith('+')) {
        phoneInput.value = formatPhoneNumber(phoneInput.value);
    }

    const phoneRegex = /^\+\d{2} \d{4} \d{3} \d{2} \d{1}$/;

    if (phoneInput.value.trim() === '') {
        parentDiv.style.border = "1px solid #29ABE2";  // Setze die Border auf blau, wenn das Feld leer ist
        return false;
    } else if (!phoneRegex.test(phoneInput.value)) {
        parentDiv.style.border = "1px solid red";  // Setze die Border auf rot, wenn das Format nicht passt
        return false;
    } else {
        parentDiv.style.border = "1px solid green";  // Setze die Border auf grün, wenn das Format passt
        return true;
    }
}


  

function applyFocusAndValidation(inputFieldId,originalValue,validationFunction) {
  const inputField = document.getElementById(inputFieldId);
  inputField.addEventListener("focus", function () {
    this.style.border = "none";
    this.style.outline = "none";
    if (this.value === originalValue) {
      this.value = "";
      validateName("editNameInput")
      validateEmail("editEmailInput")
      validatePhone("editPhoneInput")
    }
  });
  inputField.addEventListener("input", function () {
    validationFunction(inputFieldId, originalValue);
  });

  inputField.addEventListener("blur", function () {
    if (this.value === "") {
      this.value = originalValue;
     
    }
    validationFunction(inputFieldId, originalValue);
  });
}

function formatPhoneNumber(value) {
    // Entfernen von allem außer Ziffern und dem Pluszeichen
    value = value.replace(/[^\d+]/g, "");
  
    // Format +XX 1111 111 11 1 erlaubt insgesamt 17 Zeichen
    if (value.startsWith("+") && value.length > 3) {
        value = value.replace(
            /^\+(\d{2})(\d{0,4})(\d{0,3})(\d{0,2})(\d{0,1}).*/,
            "+$1 $2 $3 $4 $5"
        );
    } else if (!value.startsWith("+")) {
        value = "+";
    }

    // Begrenzen Sie die Länge auf das Format +XX 1111 111 11 1
    if (value.length > 17) {
        value = value.slice(0, 17);
    }
  
    return value.trim();
}

  

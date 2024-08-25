
const BaseUrl = "https://join-317-default-rtdb.europe-west1.firebasedatabase.app/";
let SignUpWindowArrayIDs = ['LoginWindow', 'SignUpWindow', 'SignUpButtondisabled', 'SignUpButtonWindow']
let SignUpWindowArrayAdd = ['none', 'SignUpMain', 'ButtonAddDisabled', 'none']
let SignUpWindowArrayRemove = ['LoginPageMain', 'none', 'ButtonRemoveDisabled', 'LoginPageSignUp']
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
window.submitToFirebase = submitToFirebase;
window.backToLogin = backToLogin;
window.signUpWindow = signUpWindow;
window.addInputListeners = addInputListeners;
window.guestLogIN = guestLogIN;
window.loginUser = loginUser;
window.togglePasswordVisibility = togglePasswordVisibility;
window.userInformationPopUp = userInformationPopUp;
const firebaseConfig = {
    apiKey: "AIzaSyDuQ-YTG7ylolHkh5lihoSAimNoSlyAfCk",
    authDomain: "join-317.firebaseapp.com",
    databaseURL: "https://join-317-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "join-317",
    storageBucket: "join-317.appspot.com",
    messagingSenderId: "514484898509",
    appId: "1:514484898509:web:3c382924483fd16cf9b784"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


/**
 * Öffnet das SignUp Fenster und das Login Fenster wird ausgeblendet.
 */
function signUpWindow(){
    singUpWindowHtml();
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.add(`${SignUpWindowArrayAdd[i]}`);
    }    
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.remove(`${SignUpWindowArrayRemove[i]}`);
    }
    document.getElementById('SignUpButtondisabled').disabled = true;
    SignUpLoad()
}


/**
 * Schließt das SingUp Fenster und öffnet das Login Fenster.
 */
function backToLogin(){
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.remove(`${SignUpWindowArrayAdd[i]}`);
    }    
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.add(`${SignUpWindowArrayRemove[i]}`);
    }
}

/**
 * Überprüft bei jedem Inputfield ob es geklickt wurde und falls das zutrifft wird eine Funktion ausgeführt.
 */
function SignUpLoad(){
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");
    const checkbox = document.getElementById("checkboxInput");
    nameInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    emailInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    SignUpLoad2(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox)
}

function SignUpLoad2(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox){
    passwordInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    
    confirmPasswordInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    checkbox.addEventListener('change', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
}


export function submitToFirebase(event) {
    event.preventDefault();

    // Eingabewerte abrufen
    const emailInput = document.getElementById("emailInput").value;
    const nameInput = document.getElementById("nameInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    const newUser = {name: nameInput, email: emailInput, password: passwordInput};

    // Verweis auf den `users`-Pfad in der Datenbank
    const usersRef = ref(database, 'users');

    // Überprüfen, ob die E-Mail-Adresse bereits existiert
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const emailExists = Object.values(usersData).some(user => user.email === emailInput);

            if (emailExists) {
                userInformationPopUp('Diese Email wird bereits verwendet !')
                return; // Abbrechen, wenn die E-Mail-Adresse bereits existiert
            }

            // Bestimme den nächsten Index für den neuen Benutzer
            const existingKeys = Object.keys(usersData).map(key => parseInt(key, 10));
            const nextIndex = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 0;

            // Speichere den neuen Benutzer
            const newUserRef = child(usersRef, nextIndex.toString());
            set(newUserRef, newUser)
            .then(userInformationPopUp('Benutzer erfolgreich registriert !'))
            .catch(userInformationPopUp('Benutzer konnte nicht registriert werden !'));
            backToLogin();

        } else {
            // `users`-Objekt existiert nicht, der erste Benutzer wird erstellt
            set(ref(database, 'users/0'), newUser)
            .then(userInformationPopUp('Benutzer erfolgreich registriert !'))
            .catch(userInformationPopUp('Benutzer konnte nicht registriert werden !'));
            backToLogin();
        }
    })
}

function userInformationPopUp(text){
    setTimeout(() => {
        document.getElementById('UserInfoPopUp').classList.remove('none')
        document.getElementById('UserInfoPopUp').classList.add('UserInforWindow')
        userInformationPopUpHTML(text)
    }, 3000);
    document.getElementById('UserInfoPopUp').classList.add('none')
    document.getElementById('UserInfoPopUp').classList.remove('UserInforWindow')
}

// Funktion zum Validieren der E-Mail (angepasst für den Container)
function SignUpvalidateEmail() {
    const emailInputElement = document.getElementById("emailInput");
    const emailContainer = emailInputElement.closest(".LoginInputIcon");

    const emailInput = emailInputElement.value;
    const usersRef = ref(database, 'users');

    if (emailInput.trim() === '') {
        emailContainer.style.border = '1px solid black'; // Schwarz, wenn das Feld leer ist
        matchingUser = null;
        return;
    }

    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            matchingUser = Object.values(usersData).find(user => user.email === emailInput);

            if (matchingUser) {
                emailContainer.style.border = '1px solid black'; // Blau, wenn die E-Mail korrekt ist
            } else {
                emailContainer.style.border = '1px solid red'; // Rot, wenn die E-Mail nicht korrekt ist
            }
        } else {
            emailContainer.style.border = '1px solid red'; // Rot, wenn keine Benutzer gefunden werden
        }
    }).catch((error) => {
        userInformationPopUp('Fehler beim Abrufen der Benutzerdaten!');
        emailContainer.style.border = '1px solid red'; 
    });
    
}

// Funktion zum Validieren des Passworts (angepasst für den Container)
function SignUpvalidatePassword() {
    const passwordInputElement = document.getElementById("passwordInput1");
    const passwordContainer = passwordInputElement.closest(".LoginInputIcon");
    const passwordInput = passwordInputElement.value;

    if (passwordInput.trim() === '') {
        passwordContainer.style.border = '1px solid black'; // Schwarz, wenn das Feld leer ist
        return;
    }

    if (matchingUser && matchingUser.password === passwordInput) {
        passwordContainer.style.border = '1px solid #29ABE2'; // Blau, wenn das Passwort korrekt ist
    } else {
        passwordContainer.style.border = '1px solid red'; // Rot, wenn das Passwort nicht korrekt ist
    }
}

// Funktion zum Hinzufügen von Event Listenern
function addInputListeners() {
    // Event Listener für das E-Mail-Feld
    const emailInputElement = document.getElementById("emailInput");
    emailInputElement.addEventListener('input', SignUpvalidateEmail);
    emailInputElement.addEventListener('blur', resetEmailBorderOnBlur);

    // Event Listener für das Passwort-Feld
    const passwordInputElement = document.getElementById("passwordInput1");
    passwordInputElement.addEventListener('input', SignUpvalidatePassword);
    passwordInputElement.addEventListener('blur', resetPasswordBorderOnBlur);
}

// Funktion zum Zurücksetzen des E-Mail-Feld-Borders bei Fokusverlust
function resetEmailBorderOnBlur() {
    const emailInputElement = document.getElementById("emailInput");
    const emailContainer = emailInputElement.closest(".LoginInputIcon");
    emailContainer.style.border = '1px solid black'; // Schwarz bei Fokusverlust
}

// Funktion zum Zurücksetzen des Passwort-Feld-Borders bei Fokusverlust
function resetPasswordBorderOnBlur() {
    const passwordInputElement = document.getElementById("passwordInput1");
    const passwordContainer = passwordInputElement.closest(".LoginInputIcon");
    passwordContainer.style.border = '1px solid black'; // Schwarz bei Fokusverlust
}

function loginUser() {
    const emailInputElement = document.getElementById("emailInput");
    const passwordInputElement = document.getElementById("passwordInput1");
    const rememberMeChecked = document.getElementById("rememberMe").checked;

    // Hole die Werte der Eingabefelder
    const emailInput = emailInputElement.value;
    const passwordInput = passwordInputElement.value;
    // Wenn "Remember me" angekreuzt ist, speichere die Daten
    if (rememberMeChecked) {
        localStorage.setItem('rememberedEmail', emailInput); // Speichert die E-Mail
        localStorage.setItem('rememberedPassword', encryptPassword(passwordInput)); // Verschlüsselt und speichert das Passwort
        localStorage.setItem('rememberMeChecked', 'true'); // Speichert, dass "Remember me" angeklickt war
    } else {
        // Entferne die Daten, wenn "Remember me" nicht angekreuzt ist
        localStorage.removeItem('rememberedEmail'); // Entfernt die gespeicherte E-Mail
        localStorage.removeItem('rememberedPassword'); // Entfernt das gespeicherte Passwort
        localStorage.setItem('rememberMeChecked', 'false'); // Setzt "Remember me" auf false
    }

    const usersRef = ref(database, 'users');
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const matchingUser = Object.values(usersData).find(user => 
                user.email === emailInput
            );
            if (matchingUser) {
                if (matchingUser.password === passwordInput) {
                    alert('Login erfolgreich!');
                    localStorage.removeItem('CurrentUser');
                    let decodedName = decodeURIComponent(matchingUser.name);
                    localStorage.setItem('CurrentUser', JSON.stringify(decodedName));
                    window.location.href = `/htmls/summary.html`;
                } else {
                    alert('Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.');
                }
            } else {
                alert('E-Mail existiert nicht. Bitte überprüfen Sie Ihre Eingaben.');
            }
        } else {
            alert('Keine Benutzer gefunden.');
        }
    }).catch((error) => {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    });
}

// Einfache Verschlüsselung des Passworts mit Base64
function encryptPassword(password) {
    try {
        return btoa(password); // Konvertiert das Passwort in Base64
    } catch (e) {
        console.error('Fehler bei der Verschlüsselung des Passworts:', e);
        return password; // Als Fallback, falls die Verschlüsselung fehlschlägt
    }
}

// Einfache Entschlüsselung des Passworts mit Base64
function decryptPassword(encryptedPassword) {
    try {
        const decodedPassword = atob(encryptedPassword); // Konvertiert das Base64-kodierte Passwort zurück in Klartext
        return decodedPassword;
    } catch {
        return ''; 
    }
}


function loadRememberedData() {
    // Abrufen der gespeicherten Werte aus localStorage
    const rememberedEmail = localStorage.getItem('rememberedEmail'); // Holt die gespeicherte E-Mail
    const rememberedPassword = localStorage.getItem('rememberedPassword'); // Holt das gespeicherte Passwort
    const rememberMeChecked = localStorage.getItem('rememberMeChecked'); // Holt den Zustand der Checkbox

    if (rememberedEmail) {
        document.getElementById('emailInput').value = rememberedEmail;
    }
    
    if (rememberedPassword) {
        try {
            document.getElementById('passwordInput').value = decryptPassword(rememberedPassword);
        } catch {}
    }

    if (rememberMeChecked === 'true') {
        document.getElementById('rememberMe').checked = true;
    }
}

function togglePasswordVisibility(id, PasswortID) {
    // Zugriff auf das Passwortfeld und das Icon
    const passwordInput = document.getElementById(PasswortID);
    const toggleIcon = document.getElementById(id);

    // Überprüfen, ob das Passwortfeld derzeit im Text- oder Passwort-Modus ist
    if (passwordInput.type === 'password') {
        // Zeige das Passwort an
        passwordInput.type = 'text';
        // Ändere das Icon zu einem "Auge" oder einem anderen Symbol
        toggleIcon.src = "/assets/icons/visibilityOff.png"; // Pfad zum "sichtbar"-Symbol
    } else {
        // Verberge das Passwort
        passwordInput.type = 'password';
        // Ändere das Icon zurück zu einem "Schloss"
        toggleIcon.src = '/assets/icons/lock.png'; // Pfad zum "versteckt"-Symbol
    }
}

function guestLogIN(){
    let matchingUser = 'Guest'
    localStorage.removeItem('CurrentUser');
    localStorage.setItem('CurrentUser', JSON.stringify(matchingUser));
    window.location.href = `/htmls/summary.html?name=${encodeURIComponent(matchingUser)}`;
}

// Initialisierung der Event Listener beim Laden der Seite
window.onload = function() {
    logInAnimation()
    loadRememberedData();
    addInputListeners();
};

let matchingUser;

function validateValue(input, container, pattern) {
    if (input.value.trim() === '') {
        container.style.border = '1px solid black';
        return false;
    } else if (!pattern.test(input.value)) {
        container.style.border = '1px solid red';
        return false;
    } else {
        container.style.border = '1px solid #29ABE2';
        return true;
    }
}

function validateConfirmPassword(confirmPasswordInput, confirmPasswordContainer, passwordInput) {
    if (confirmPasswordInput.value.trim() === '') {
        confirmPasswordContainer.style.border = '1px solid black';
        return false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordContainer.style.border = '1px solid red';
        return false;
    } else {
        confirmPasswordContainer.style.border = '1px solid #29ABE2';
        return true;
    }
}

function validateCheckbox(checkbox) {
    return checkbox.checked;
}

function validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox) {
    const signUpButton = document.getElementById("SignUpButtondisabled");
    const nameContainer = document.getElementById('SignInputIconfirst');
    const emailContainer = document.getElementById('SignInputIconsecond');
    const passwordContainer = document.getElementById('SignInputIconthird');
    const confirmPasswordContainer = document.getElementById('SignInputIconfourth');
    const namePattern = /^[A-Z][a-z]*\s[A-Z][a-z]*$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isNameValid = validateValue(nameInput, nameContainer, namePattern);
    const isEmailValid = validateValue(emailInput, emailContainer, emailPattern);
    const isPasswordValid = validateValue(passwordInput, passwordContainer, passwordPattern);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPasswordInput, confirmPasswordContainer, passwordInput);
    validateForm2(isNameValid, isEmailValid, isPasswordValid, isConfirmPasswordValid, checkbox, signUpButton)
}

function validateForm2(isNameValid, isEmailValid, isPasswordValid, isConfirmPasswordValid, checkbox, signUpButton){
    const isCheckboxChecked = validateCheckbox(checkbox);
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isCheckboxChecked) {
        signUpButton.disabled = false; // Button aktivieren
        signUpButton.classList.remove('ButtonAddDisabled');
        signUpButton.classList.add('ButtonRemoveDisabled');
    } else {
        signUpButton.disabled = true; // Button deaktivieren
        signUpButton.classList.add('ButtonAddDisabled');
        signUpButton.classList.remove('ButtonRemoveDisabled');
    }
}

function logInAnimation(){
    const logo = document.querySelector('.JoinLogoStyle');
    const body = document.body;

    // Starte die Animation nach dem Laden der Seite
    setTimeout(() => {
        // Verschiebe das Logo nach links oben
        logo.classList.add('logo-move');

        // Fange an, den Rest der Seite einzublenden, während sich das Logo bewegt
        setTimeout(() => {
            body.classList.add('show-content');
            body.style.overflow = 'auto'; // Ermöglicht das Scrollen wieder
        }, 1000); // Startet das Einblenden 1 Sekunde nach dem Start der Logo-Animation
    }, 400); // Optional: Warte eine halbe Sekunde nach dem Laden der Seite
}

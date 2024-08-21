

let SignUpWindowArrayIDs = ['LoginWindow', 'SignUpWindow', 'SignUpButtondisabled', 'SignUpButtonWindow']
let SignUpWindowArrayAdd = ['none', 'SignUpMain', 'ButtonAddDisabled', 'none']
let SignUpWindowArrayRemove = ['LoginPageMain', 'none', 'ButtonRemoveDisabled', 'LoginPageSignUp']


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

function backToLogin(){
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.remove(`${SignUpWindowArrayAdd[i]}`);
    }    
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.add(`${SignUpWindowArrayRemove[i]}`);
    }   
}

function signUpContact(){
    backToLogin()
}

function SignUpLoad(){
        console.log('Bin im DOm')
        // Input-Felder und Checkbox abrufen
        const nameInput = document.getElementById("nameInput");
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput");
        const confirmPasswordInput = document.getElementById("confirmPasswordInput");
        const checkbox = document.getElementById("checkboxInput");
        const signUpButton = document.getElementById("SignUpButtondisabled");
    
        // Container der Input-Felder abrufen
        const nameContainer = document.getElementById('SignInputIconfirst');
        const emailContainer = document.getElementById('SignInputIconsecond');
        const passwordContainer = document.getElementById('SignInputIconthird');
        const confirmPasswordContainer = document.getElementById('SignInputIconfourth');
    
        // Validierung für Name (Vorname und Nachname, erste Buchstaben groß)
        const namePattern = /^[A-Z][a-z]*\s[A-Z][a-z]*$/;
    
        function validateName() {
            if (nameInput.value.trim() === '') {
                nameContainer.style.border = '1px solid black';
                return false;
            } else if (!namePattern.test(nameInput.value)) {
                nameContainer.style.border = '1px solid red';
                return false;
            } else {
                nameContainer.style.border = '1px solid green';
                return true;
            }
        }
    
        // Validierung für Email
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
        function validateEmail() {
            if (emailInput.value.trim() === '') {
                emailContainer.style.border = '1px solid black';
                return false;
            } else if (!emailPattern.test(emailInput.value)) {
                emailContainer.style.border = '1px solid red';
                return false;
            } else {
                emailContainer.style.border = '1px solid green';
                return true;
            }
        }
    
        // Validierung für Passwort
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        function validatePassword() {
            if (passwordInput.value.trim() === '') {
                passwordContainer.style.border = '1px solid black';
                return false;
            } else if (!passwordPattern.test(passwordInput.value)) {
                passwordContainer.style.border = '1px solid red';
                return false;
            } else {
                passwordContainer.style.border = '1px solid green';
                return true;
            }
        }
    
        // Validierung für Confirm Password
        function validateConfirmPassword() {
            if (confirmPasswordInput.value.trim() === '') {
                confirmPasswordContainer.style.border = '1px solid black';
                return false;
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                confirmPasswordContainer.style.border = '1px solid red';
                return false;
            } else {
                confirmPasswordContainer.style.border = '1px solid green';
                return true;
            }
        }
    
        // Checkbox Überprüfung
        function validateCheckbox() {
            return checkbox.checked;
        }
    
        // Funktion zur Überprüfung, ob alle Felder gültig sind
        function validateForm() {
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            const isConfirmPasswordValid = validateConfirmPassword();
            const isCheckboxChecked = validateCheckbox();
    
            if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isCheckboxChecked) {
                signUpButton.disabled = false; // Button aktivieren
                console.log('andere Seite')
                document.getElementById('SignUpButtondisabled').classList.remove('ButtonAddDisabled')
                document.getElementById('SignUpButtondisabled').classList.add('ButtonRemoveDisabled')
            } else {
                signUpButton.disabled = true; // Button deaktivieren
                console.log('Hier')
            }
        }
    
        // Event Listener hinzufügen
        nameInput.addEventListener('input', validateForm);
        emailInput.addEventListener('input', validateForm);
        passwordInput.addEventListener('input', validateForm);
        confirmPasswordInput.addEventListener('input', validateForm);
        checkbox.addEventListener('change', validateForm);
    
    
}
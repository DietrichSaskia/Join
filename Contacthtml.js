
function  contactInfoHtml(initials, name, email, phone, buttonColor, index){
    document.getElementById('Contenttext').innerHTML= `
      <div id="ContactfieldInfodiv" class="ContactfieldInfo">
            <div class="ContactCircleName">
                <header class="ContactSection">
                    <div class="CircleInitial" style="background-color: ${buttonColor}">
                        ${initials}
                    </div>

                </header>
                <section class="NameEditDelete">
                    <div class="ContactName">${name}</div>
                    <div class="ContactEditDelete">
                        <button onclick="editNewContact('${initials}', '${name}', '${email}', '${phone}', '${buttonColor}', '${index}'), editContactShowWindow()" class="ContactEditButton" onmouseover="onmouse('ContactEditChange')" onmouseout="outmouse('ContactEditChange')"> 
                            <div id="ContactEditChange">
                                 <img class="ContactDeleteEdit" src="/assets/icons/edit.png">
                            </div>
                            <span class="ContactDeleteEditText">Edit</span>
                        </button>
                        <button class="ContactDeleteButton" onclick="deleteContactList(${index})" onmouseover="onmouse('ContactDeleteChange')" onmouseout="outmouse('ContactDeleteChange')">   
                            <div id="ContactDeleteChange">
                                <img class="ContactDeleteEdit" src="/assets/icons/delete.png">
                            </div>
                            <span class="ContactDeleteEditText">Delete</span>
                        </button>
                    </div>
                </section>
            </div>  
            <div class="ContactInformationBorder">
                <span class="ContactInformationText">Contact Information</span>
            </div>
            <div class="ContactEmailPhone">
                <div class="ContactInfoContainer">
                    <span class="ContactEmailText1">Email</span>
                    <span class="ContactEmailText2">${email}</span>
                </div>
           
                <div class="ContactInfoContainer">
                    <span class="ContactEmailText1">Phone</span>
                    <span class="ContactPhoneText2">${phone}</span>
                </div>
            </div>
            
        </div>
    `;
}

function editNewContactHtml(initials, name, email, phone, buttonColor, index) {
    document.getElementById('EditContactIDWIn').innerHTML = `
    <div class="EditWindowNew">
        <section class="EditWindowLeftArea">
            <div class="EditLeftTopStyle">
                <img class="EditJoinLogo" src="/assets/icons/logoWhite.png">
                <div class="EditWindowAddText1Con">
                    <span id="EditWindowAddText1Change" class="EditWindowAddText1">Edit contact</span>
                </div>
                <span id="EditWindowAddText2Change" class="EditWindowAddText2"></span>
                <div class="EditWindowAddxline"></div>
            </div>
        </section>
        <section class="EditWindowRightArea">
            <header class="EditCloseWindow">
                <button onclick="editContactCloseWindow()" class="EditContactCloseWindow">
                    <img class="ImgCloseStyle" src="/assets/icons/close.png">
                </button>
            </header>
            <section class="CircleInputstyle">
                <div class="EditCircleStyle" style="background: ${buttonColor}">
                    <div class="EditCircleInitials">${initials}</div>
                </div>
                <form id="editContactForm">
                    <div class="EditwindowInputDeleteSave">
                        <div class="EditwindowInputfield">
                            <div class="EditWindowInput">
                                <input id="editNameInput" placeholder="First and Last Name" pattern="^[a-zA-Z]+(?: [a-zA-Z]+)+$" title="Please enter your first and last name, separated by a space." required class="InputfieldEditStyle" value="${name}" type="text">
                                <div>
                                    <img class="InputfieldIcon" src="/assets/icons/person.png">
                                </div>
                            </div>
                            <div class="EditWindowInput">
                                <input id="editEmailInput" required class="InputfieldEditStyle" value="${email}" type="email" placeholder="Email">
                                <div>
                                    <img class="InputfieldIcon" src="/assets/icons/mail.png">
                                </div>
                            </div>
                            <div class="EditWindowInput">
                                <input id="editPhoneInput" pattern="^\\+\\d{2}\\s\\d{4}\\s\\d{3}\\s\\d{2}\\s\\d{1}$" title="Please enter a valid phone number in the format +XX 1111 111 11" required class="InputfieldEditStyle" value="${phone}" type="tel" placeholder="Phone">
                                <div> 
                                    <img class="InputfieldIcon" src="/assets/icons/call.png">
                                </div>
                            </div>
                        </div>
                        <div class="EditWindowDeleteSave" id="EditWindowDeleteSaveID1">
                            <button onclick="deleteContactList(${index}, '${name}'); editContactCloseWindow();" type="button" class="EditWindowDeleteButton">Delete</button>
                            <button type="submit" class="EditWindowSaveButton">Save <img class="EditSaveCheck" src="/assets/icons/checkWhite.png"></button>
                        </div>
                        <div id="EditWindowDeleteSaveID2"></div>
                    </div>
                </form>
            </section>   
        </section>
    </div>
    `;

    editNewContactSave(name, email, phone, index);
}
 
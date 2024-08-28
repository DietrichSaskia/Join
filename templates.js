function renderHeader(id) {
    document.getElementById(id).innerHTML = /*html*/`
    <section onclick="hideBurgerMenu()" class="headerOverlay" id="headerOverlay"></section>
        <section class="sideBar">
        <img class="sideBarLogo" src="../assets/icons/logoWhite.png">
        <div class="sideBarMenu">
            <a id="sideBarsummary" href="../htmls/summary.html"><img id="picsummary" class="sideBarPic" src="../assets/icons/summary.png">Summary</a>
            <a id="sideBaraddTask" href="../htmls/addTask.html"><img id="picaddTask" class="sideBarPic" src="../assets/icons/addTask.png">Add Task</a>
            <a id="sideBarboard" href="../htmls/board.html"><img id="picboard" class="sideBarPic" src="../assets/icons/board.png">Board</a>
            <a id="sideBarcontacts" href="../htmls/contacts.html"><img id="piccontacts" class="sideBarPic" src="../assets/icons/contacts.png">Contacts</a>
        </div>
        <div class="sideBarLegal">
            <a id="sideBarprivacyPolicy" class="sideBarLegalLink" href="../htmls/privacyPolicy.html">Privacy Policy</a>
            <a id="sideBarlegalNotice" class="sideBarLegalLink" href="../htmls/legalNotice.html">Legal Notice</a>
        </div>
    </section>

    <div class="header">
        <div class="headerDiv"></div>
        <div class="headerBtns">
            <div class="HeaderJoinLogoSmall"><img class="HeaderJoinLogoSmallStyle" src="/assets/icons/logo.png"></div>
            <div class="headerText">Kanban Project Management Tool</div>
            <div class="headerBtns">
                <a class="HelpButtonRemove" href="../htmls/help.html"><img class="headerHelpBtn" src="../assets/icons/help.png"></a>
                <a id="headerProfile" onclick="toggleBurgerMenu()"><div>??</div></a>
            </div>
        </div>
        <div id="burgerMenu" class="dNone">
            <a href="../htmls/legalNotice.html">Legal Notice</a>
            <a href="../htmls/privacyPolicy.html">Privacy Policy</a>
            <a href="../index.html" onclick="resetUser()">Log out</a>
        </div>
        <div class="seperator"></div>

    </div>
    `
}

async function showUser() {
    let i = await checkUser();
    document.getElementById('headerProfile').innerHTML = /*html*/`
        <div>${i}</div>
    `
}
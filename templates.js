function renderHeader(id) {
    document.getElementById(id).innerHTML = /*html*/`
        <section class="sideBar">
        <img class="sideBarLogo" src="../assets/icons/logoWhite.png">
        <div class="sideBarMenu">
            <a id="SideBarSummary" href="../htmls/summary.html"><img class="sideBarPic" src="../assets/icons/summary.png">Summary</a>
            <a id="SideBarAddTask" href="../htmls/addTask.html"><img class="sideBarPic" src="../assets/icons/addTask.png">Add Task</a>
            <a id="SideBarBoard" href="../htmls/board.html"><img class="sideBarPic" src="../assets/icons/board.png">Board</a>
            <a id="SideBarContacts" href="../htmls/contacts.html"><img class="sideBarPic" src="../assets/icons/contacts.png">Contacts</a>
        </div>
        <div class="sideBarLegal">
            <a class="sideBarLegalLink" href="../htmls/privacyPolicy.html">Privacy Policy</a>
            <a class="sideBarLegalLink" href="../htmls/legalNotice.html">Legal Notice</a>
        </div>
    </section>

    <div class="header">
        <div class="headerDiv"></div>
        <div class="headerBtns">
            <div class="headerText">Kanban Project Management Tool</div>
            <div class="headerBtns">
                <a href="../htmls/help.html"><img class="headerHelpBtn" src="../assets/icons/help.png"></a>
                <a href="../htmls/summary.html" id="headerProfile"><div>SM</div></a>
            </div>
        </div>
        <div class="seperator"></div>

    </div>
    `
}
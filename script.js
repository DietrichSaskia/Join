function init(id) {
    renderHeader(id);
    checkCurrentPage();
    showUser();
}

function checkCurrentPage() {
    let i = window.location.href;
    currentPageHTML = i.substring(i.lastIndexOf('/')).replace('/', "");
    currentPage = currentPageHTML.split('.')[0];
    if (currentPage == 'privacyPolicy' || currentPage == 'legalNotice') {
        document.getElementById('sideBar' + currentPage).classList.add('sideBarLegalActiveSite');
    }
    else if(currentPage == 'summary' || currentPage == 'addTask' || currentPage == 'board' || currentPage == 'contacts') {   
        document.getElementById('pic' + currentPage).src = "../assets/icons/" + currentPage + "White.png";
        document.getElementById('sideBar' + currentPage).classList.add('sideBarMenuActiveSite');
    }
}

function goBack() {
    window.history.back();
}

async function checkUser() {
    let response = await fetch("https://join-317-default-rtdb.europe-west1.firebasedatabase.app/" + ".json");
    let json = await response.json();
    let user = json.contactall[0].name
    let nameParts = user.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}

function toggleBurgerMenu() {
    if(document.getElementById('burgerMenu').classList.contains("dNone")) {
        showBurgerMenu();
    }
    else {
        hideBurgerMenu();
    }
}

function showBurgerMenu() {
    document.getElementById('burgerMenu').classList.remove('dNone');
    document.getElementById('headerOverlay').classList.add('showHeaderOverlay');
}

function hideBurgerMenu() {
        document.getElementById('burgerMenu').classList.add('dNone');
        document.getElementById('headerOverlay').classList.remove('showHeaderOverlay');
}
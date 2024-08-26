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
    else if (currentPage == 'summary' || currentPage == 'addTask' || currentPage == 'board' || currentPage == 'contacts') {
        document.getElementById('pic' + currentPage).src = "../assets/icons/" + currentPage + "White.png";
        document.getElementById('sideBar' + currentPage).classList.add('sideBarMenuActiveSite');
    }
}


function goBack() {
    window.history.back();
}


async function checkUser() {
    let name;
    let Currentname = localStorage.getItem('CurrentUser');
    if (Currentname) {
        name = JSON.parse(Currentname);
    }
    let nameParts = name.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    if (initials.length === 1) {
        document.getElementById('headerProfile').classList.add('guestLogin');
        return initials;
    }
    else {
        return initials;
    }
}


function toggleBurgerMenu() {
    if (document.getElementById('burgerMenu').classList.contains("dNone")) {
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


function resetUser() {
    let UserAsText = JSON.stringify(null);
    localStorage.setItem('CurrentUser', UserAsText);
}
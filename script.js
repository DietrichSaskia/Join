function init(id) {
    renderHeader(id);
    checkCurrentPage();
    checkUser()
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
    let initials;
    if (Currentname == 'null') {
        initials = checkUser3();
    } else {
        initials = checkUser2(Currentname, name);
    }
    document.getElementById('headerProfile').innerHTML = /*html*/`
    <div>${initials}</div>
    `;   
}

function checkUser2(Currentname, name) {
    name = JSON.parse(Currentname);
    let nameParts = name.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    if (initials.length === 1) {
        document.getElementById('headerProfile').classList.add('guestLogin');
    }
    return initials;
}

function checkUser3() {
    document.getElementById('burgerMenu').classList.add('dNone');
    document.getElementById('HelpSideOpen').classList.add('dNone');
    document.getElementById('SidebarMenuFourButtons').classList.add('dNone');
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
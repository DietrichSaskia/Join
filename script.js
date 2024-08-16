function init(id) {
    renderHeader(id);
    checkCurrentPage();
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
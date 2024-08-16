function init(id) {
    renderHeader(id);
    checkCurrentPage();
}

function checkCurrentPage() {
    let i = window.location.href;
    currentPageHTML = i.substring(i.lastIndexOf('/')).replace('/', "");
    currentPage = currentPageHTML.split('.')[0];
    console.log(currentPage);
    document.getElementById('SideBar' + currentPage).classList.add('sideBarMenuActiveSite');
}

function goBack() {
    window.history.back();
}
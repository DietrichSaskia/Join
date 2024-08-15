function init() {
    renderHeader();
    checkCurrentPage();
}

function checkCurrentPage() {
    let i = window.location.href;
    currentPage = i.substring(i.lastIndexOf('/'));
    console.log(currentPage);
    if(currentPage == '/index.html')
        document.getElementById('SideBarSummary').classList.add('sideBarMenuActiveSite');
}
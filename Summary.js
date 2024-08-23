const BaseUrl = "https://join-317-default-rtdb.europe-west1.firebasedatabase.app/";
let SectionTypArray = []
let SectionPrioArray = []
let SectionPrioDateArray = []
let highCount = 0;
let highIndices = [];
let inProgressCount = 0;
let awaitFeedbackCount = 0;
let doneCount = 0;
let toDoCount = 0;
let SectionTypLength = 0;
let GoodMorningName = '';

summaryLoad()

async function summaryLoad() {
    // Lösche alte Arrays aus dem localStorage
    localStorage.removeItem('taskAllArray');       // Entferne das alte 'taskAllArray'
    localStorage.removeItem('contactAllArray');    // Entferne das alte 'contactAllArray'

    // Initialisiere die neuen Arrays
    SectionTypArray = [];
    SectionPrioArray = [];
    SectionPrioDateArray = [];

    // Setze die Pfade für die Firebase-Abfragen
    let pathcontact1 = 'tasksAll';
    let pathcontact2 = 'contactall';

    // Lade die Daten von tasksAll
    let Summaryall = await fetch(BaseUrl + pathcontact1 + '.json');
    let Summaryallshow = await Summaryall.json();

    // Lade die Daten von contactall
    let Contactall = await fetch(BaseUrl + pathcontact2 + '.json');
    let Contactallshow = await Contactall.json();

    // Speichere die Daten lokal in Arrays
    let taskAllArray = [];
    let contactAllArray = [];

    // Iteriere durch die empfangenen Daten und fülle taskAllArray
    for (let key in Summaryallshow) {
        taskAllArray.push(Summaryallshow[key]);
    }

    // Iteriere durch die empfangenen Daten und fülle contactAllArray
    for (let key in Contactallshow) {
        contactAllArray.push(Contactallshow[key]);
    }

    // Speichere die Arrays im localStorage
    localStorage.setItem('taskAllArray', JSON.stringify(taskAllArray));
    localStorage.setItem('contactAllArray', JSON.stringify(contactAllArray));

    // Extrahiere Daten aus taskAllArray, falls erforderlich
    for (let item of taskAllArray) {
        SectionTypArray.push(item.section);
        SectionPrioDateArray.push(item.date);
        SectionPrioArray.push(item.prioName);
    }
    summarySectionCheck();
}




function summarySectionCheck(){
    SectionTypArray.forEach(type => {
        switch(type) {
            case "inProgress":
                inProgressCount++;
                break;
            case "awaitFeedback":
                awaitFeedbackCount++;
                break;
        }
    });
    summarySectionCheck2()
}

function summarySectionCheck2(){
    SectionTypArray.forEach(type => {
        switch(type) {
            case "done":
                doneCount++;
                break;
            case "toDo":
                toDoCount++;
                break;
        }
    });
    SectionTypLength = SectionTypArray.length
    summarySectionCheck3(SectionTypLength)
}

function summarySectionCheck3(SectionTypLength){
    document.getElementById('SummaryTaskProgressCount').innerHTML=`${inProgressCount}`;
    document.getElementById('SummaryBoardCount').innerHTML=`${SectionTypLength}`;
    document.getElementById('SummaryAwaitFeedbackCount').innerHTML=`${awaitFeedbackCount}`;
    document.getElementById('SummaryToDoCount').innerHTML=`${toDoCount}`;
    document.getElementById('SummaryDoneCount').innerHTML=`${doneCount}`;
    SectionPrioArray.forEach((value, index) => {
        if (value === "Medium") {
            highCount++;
            highIndices.push(index); 
        }
        
    });
    
    // 3. Filtere die entsprechenden Datumswerte heraus und konvertiere sie
    let filteredDates = highIndices
        .map(index => convertDateFormat(SectionPrioDateArray[index]))
        .filter(date => date !== null);  // Filtere alle null-Werte heraus
    
    // 4. Sortiere die Datumswerte in aufsteigender Reihenfolge (frühestes Datum zuerst)
    filteredDates.sort((a, b) => new Date(a) - new Date(b));
    if (filteredDates.length > 0) {
        
        const earliestDate = filteredDates[0]; // Das früheste Datum
    
        // 6. Filtere alle Datumswerte, die nicht mit dem frühesten Datum übereinstimmen
        filteredDates = filteredDates.filter(date => date === earliestDate);
        document.getElementById('SummaryCount').innerHTML=`${filteredDates.length}`
        // 7. Formatieren des frühesten Datums im gewünschten Format (Oktober 16, 2022)
        const dateToDisplay = new Date(earliestDate);
        if (!isNaN(dateToDisplay)) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateToDisplay.toLocaleDateString('de-DE', options);
    
            // 8. Einfügen des formatierten Datums in das Element mit der ID 'currentDate'
            document.getElementById('currentDate').textContent = formattedDate;
        } else {
            console.error('Ungültiges Datum:', earliestDate);
        }
    }
    console.log(filteredDates)
    LoginGoodMorning()
    
}
function convertDateFormat(dateString) {
    // Prüfen, ob der Datumsstring das erwartete Format hat
    if (!dateString || !dateString.includes(".") && !dateString.includes("/")) {
        console.error('Ungültiges Datumsformat:', dateString);
        return null; // Gebe null zurück, wenn das Datum ungültig ist
    }
    
    // Teile das Datum anhand von "." oder "/"
    const parts = dateString.includes(".") ? dateString.split(".") : dateString.split("/");

    // Teile in der richtigen Reihenfolge anordnen (Tag, Monat, Jahr)
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    // Rückgabe im Format "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
}

function toDoChangeOn(id){
    if(id == 'ChangeIcon1'){
        document.getElementById(id).innerHTML= `<img  class="SummaryCircleDark" src="/assets/icons/editCircle.png"> `;
    }
    if(id == 'ChangeIcon2'){
        document.getElementById(id).innerHTML= `<img class="SummaryCircleDark"  src="/assets/icons/checkCircle.png">`;
    }
}

function toDoChangeOut(id){
    if(id == 'ChangeIcon1'){
        document.getElementById(id).innerHTML= `<img class="SummaryCircleDark" src="/assets/icons/editCircleDark.png"></img>`;
    }
    if(id == 'ChangeIcon2'){
        document.getElementById(id).innerHTML= `<img class="SummaryCircleDark" src="/assets/icons/checkCircleDark.png">`;
    }
}



function getUserNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const userName = params.get('name');
    return decodeURIComponent(userName);
}

function LoginSummary(){
    const userName = getUserNameFromURL();
    localStorage.removeItem('CurrentUser');
    localStorage.setItem('CurrentUser', JSON.stringify(userName));
    init('headerContact')
    
    
}

function LoginGoodMorning(){
    console.log('drin', GoodMorningName)
    document.getElementById('UserLogGoodMorning').innerHTML=`${GoodMorningName}`; 
}



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


summaryLoad()
setTimeBasedGreeting();
checkWidthAndExecute();

function summaryLoad() {
    
    SectionTypArray = [];
    SectionPrioArray = [];
    SectionPrioDateArray = [];
    // Extrahiere Daten aus taskAllArray, falls erforderlich
    let taskAllArray = JSON.parse(localStorage.getItem('taskAllArray')) || [];

    // Durchlaufe das taskAllArray und pushe die Daten in die entsprechenden Arrays
    for (let item of taskAllArray) {
        SectionTypArray.push(item.section);         // Pushe den Abschnitt in SectionTypArray
        SectionPrioDateArray.push(item.date);       // Pushe das Datum in SectionPrioDateArray
        SectionPrioArray.push(item.prioName);       // Pushe die Priorität in SectionPrioArray
    }
    summarySectionCheck();
}


function setTimeBasedGreeting() {
    const element = document.getElementById('Timewelcome');
    const now = new Date();
    const hour = now.getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning,";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }

    element.textContent = greeting;
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
        if (value === "High") {
            highCount++;
            highIndices.push(index); 
            console.log(SectionPrioArray, value, index)
        }
        
    });
    
    // 3. Filtere die entsprechenden Datumswerte heraus und konvertiere sie
    let filteredDates = highIndices
        .map(index => convertDateFormat(SectionPrioDateArray[index]))
        .filter(date => date !== null);  // Filtere alle null-Werte heraus
    
    // 4. Sortiere die Datumswerte in aufsteigender Reihenfolge (frühestes Datum zuerst)
    filteredDates.sort((a, b) => new Date(a) - new Date(b));
    console.log(filteredDates.length)
    if (filteredDates.length > 0) {
        
        const earliestDate = filteredDates[0]; // Das früheste Datum
    
        // 6. Filtere alle Datumswerte, die nicht mit dem frühesten Datum übereinstimmen
        filteredDates = filteredDates.filter(date => date === earliestDate);
        console.log(filteredDates.length)
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
        document.getElementById(id).innerHTML= `<img  class="SummaryCircleDark" src="/assets/icons/Frame 59.png"> `;
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

function LoginGoodMorning(){
    let GoodMorningName = '';
    let Currentname = localStorage.getItem('CurrentUser');
    if (Currentname) {
        GoodMorningName = JSON.parse(Currentname);
    }
    document.getElementById('UserLogGoodMorning').innerHTML=`${GoodMorningName}`; 
}


function checkWidthAndExecute() {
    // Überprüfen der aktuellen Breite des Fensters
    const viewportWidth = window.innerWidth;

    if (viewportWidth < 1400) {
        // Wenn die Breite unter 1400px liegt, setTimeout ausführen
        setTimeout(() => {
            document.getElementById('SummaryRightSectionNone').style.display='none'
            document.getElementById('SummaryheaderheadlineNone').style.display='flex'
            document.getElementById('SummaryLeftToDoNone').style.display='flex'
        }, 1000); // Timeout auf 1000ms (1 Sekunde) setzen
        
    }
}

// Füge einen Event-Listener für das resize-Event hinzu
window.addEventListener('resize', checkWidthAndExecute);

// Initiale Überprüfung, falls die Seite bereits unter 1400px geladen wurde


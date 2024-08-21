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

summaryLoad()

async function summaryLoad() {
    SectionTypArray = [];
    SectionPrioArray = []
    SectionPrioDateArray = []
    let pathcontact = 'tasksAll';
    let Summaryall = await fetch(BaseUrl + pathcontact + '.json');
    let Summaryallshow = await Summaryall.json();
    for (let key in Summaryallshow) {  
        SectionTypArray.push(Summaryallshow[key].section);
        SectionPrioDateArray.push(Summaryallshow[key].date);
        SectionPrioArray.push(Summaryallshow[key].prioName);
    }
    console.log(SectionPrioArray)
    console.log(SectionPrioDateArray)
    summarySectionCheck()
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
    console.log(SectionPrioArray);
    SectionPrioArray.forEach((value, index) => {
        if (value == "High") {
            highCount++;
            highIndices.push(index); 
        }
    });
    let filteredDates = highIndices.map(index => SectionPrioDateArray[index]);
    console.log("Anzahl von 'High': " + highCount);
    console.log("Indizes von 'High': " + highIndices);
    console.log("Gefilterte Daten: " + filteredDates);
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
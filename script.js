init()

async function init() {
    renderHeader();
    let i = await fetch("https://join-317-default-rtdb.europe-west1.firebasedatabase.app/" + ".json")
    let pokemon = await i.json();
    console.log(pokemon);

}

let users = [
    {
        'email': 'test123@gmx.net',
        'password': 'password123',
        'contacts': '',
    }, 
]
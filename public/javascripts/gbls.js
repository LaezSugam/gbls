async function setScreen(){
    var response = await fetch('/screen');
    var data = await response.json();
    
    console.log(data);
    console.log(data.Image);
    console.log(data.Deck);
    document.getElementById("main").style.backgroundImage = "url('" + data.Image + "')";
    document.getElementById("name").innerHTML = data.Name + "&nbsp;";
    document.getElementById("deck").innerHTML = data.Deck;
}


async function startLoadingScreen(){
    nextScreen();
}

async function nextScreen(){
    await setScreen();

    return setTimeout(nextScreen, 10000);
}
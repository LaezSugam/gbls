var data;
var nameElement;
var deckElement;
var dataArray = [];
var isFillDataRunning;


async function startLoadingScreen(){
    fillData();
    nextScreen();
}

async function nextScreen(){
    await setScreen();

    return setTimeout(nextScreen, 10000);
}

async function retrieveData(){
    
    console.log("Array length: " + dataArray.length);

    if(dataArray.length <= 10 && !isFillDataRunning)
    {
        fillData();
    }

    if(dataArray.length > 0)
    {
        return dataArray.shift();
    }
    else
    {
        var response = await fetch('/screen');

        if(response.ok)
        {
            return await response.json();
        }
        else{
            return await retrieveData();
        }
        
    }
}

async function fillData(){

    isFillDataRunning = true;
    console.log("Fill data starting.")

    while(dataArray.length < 20){
        console.log("Array length: " + dataArray.length);
        var response = await fetch('/screen');
        var tempData = await response.json();
        dataArray.push(tempData);
    }

    console.log("Fill data ending.")
    isFillDataRunning = false;
}

async function setScreen(){
    data = await retrieveData();
    nameElement = document.getElementById("name");
    deckElement = document.getElementById("deck");
    
    console.log(data);
    console.log(data.Image);
    console.log(data.Deck);

    var currentPosition = 0;

    var id = setInterval(frame, 10);

    function frame(){
        if(currentPosition == -100){
            clearInterval(id);
            setScreen2();
        }
        else{
            currentPosition--;
            nameElement.style.left = currentPosition + "%";
            deckElement.style.bottom = currentPosition + "%";
        }
    }
}


function setScreen2(){
    document.getElementById("main").style.backgroundImage = "url('" + data.Image + "')";
    nameElement.innerHTML = data.Name + "&nbsp; <img src='../images/favicon.ico'/>";
    deckElement.innerHTML = data.Deck;

    var currentPosition = -100;

    var id = setInterval(frame, 10);

    function frame(){
        if(currentPosition == 0){
            clearInterval(id);
        }
        else{
            currentPosition++;
            nameElement.style.left = currentPosition + "%";
            deckElement.style.bottom = currentPosition + "%";
        }
    }
}
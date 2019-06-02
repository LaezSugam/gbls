var data;
var nameElement;

async function setScreen(){
    var response = await fetch('/screen');
    data = await response.json();
    nameElement = document.getElementById("name");
    
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
        }
    }
}


async function startLoadingScreen(){
    nextScreen();
}

async function nextScreen(){
    await setScreen();

    return setTimeout(nextScreen, 10000);
}

function setScreen2(){
    document.getElementById("main").style.backgroundImage = "url('" + data.Image + "')";
    nameElement.innerHTML = data.Name + "&nbsp; <img src='../images/favicon.ico'/>";
    document.getElementById("deck").innerHTML = data.Deck;

    var currentPosition = -100;

    var id = setInterval(frame, 10);

    function frame(){
        if(currentPosition == 0){
            clearInterval(id);
        }
        else{
            currentPosition++;
            nameElement.style.left = currentPosition + "%";
        }
    }
}
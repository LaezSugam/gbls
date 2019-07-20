var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('gbls.html', {root: path.join(__dirname, '../public')});
});

router.get('/screen', async function(req, res, next){
  var screen = await getLoadingScreen();
  res.send(screen);
})

module.exports = router;


class Category{
  constructor(singular, plural){
      this.Singular = singular;
      this.Plural = plural;
  }
}

class LoadingScreen{
  constructor(name, image, deck){
    this.Name = name;
    this.Image = image;
    this.Deck = deck;
  }
}

const fetch = require('node-fetch');

const categories = [
  new Category("accessory", "accessories"),
  new Category("character", "characters"),
  new Category("concept", "concepts"),
  new Category("dlc", "dlcs"),
  new Category("franchise", "franchises"),
  new Category("game", "games"),
  new Category("genre", "genres"),
  new Category("location", "locations"),
  new Category("object", "objects"),
  new Category("person", "people"),
  new Category("platform", "platforms"),
  new Category("theme", "themes"),
  new Category("video", "videos"),
  // new Category("video_category", "video_categories"),
  new Category("video_show", "video_shows")
]

const getLoadingScreen = async () => {
  // const response = await fetch('https://www.giantbomb.com/api/characters/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json&limit=1');
  // const myJson = await response.json();
  // // const results = await JSON.parse(myJson);

  // console.log(myJson);
  var catNumber = Math.floor(Math.random() * categories.length);
  var category = categories[catNumber];

  // fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json&limit=1")
  //     .then((response) => {
  //         return response.json();
  //     })
  //     .then((data) => {
  //         var itemNumber = Math.floor(Math.random() * (data.number_of_total_results + 1));

  //         fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json&limit=1&offset=" + itemNumber)
  //             .then((response2) => {
  //                 return response2.json();
  //             }) 
  //             .then((data2) => {
  //                 console.log(data2.results[0]);
  //                 fetch("https://www.giantbomb.com/api/images/" + data2.results[0].guid + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json")
  //                     .then((imageResponse) => {
  //                         return imageResponse.json();
  //                     })
  //                     .then((imageData) => {
  //                         console.log(imageData.results.length);
  //                         console.log(imageData.results);
  //                     })
  //             })
          
  //     })

  var response = await fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json"); //limit 1 works with every category except shows, using it with shows leave total number of results at 1
  var data = await response.json();

  console.log("Results: " + data.number_of_total_results);
  
  var itemNumber = Math.floor(Math.random() * (data.number_of_total_results));
  var response2 = await fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json&limit=1&offset=" + itemNumber);
  var data2 = await response2.json();
  console.log(data2.results)

  var imageUrl;
  var name = data2.results[0].name;
  var deck = data2.results[0].deck;

  if(name == null || name == undefined || name == "")
  {
    name = data2.results[0].title;
  }

  console.log("Category: " + category.Singular);

  if(["video", "video_show", "video_category"].includes(category.Singular))
  {
    imageUrl = data2.results[0].image.super_url;
  }
  else
  {
    var imageResponse = await fetch("https://www.giantbomb.com/api/images/" + data2.results[0].guid + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json");
    var imageData = await imageResponse.json();
  
    console.log("image results: " + imageData.results.length);
  
    if(imageData.results.length < 1){
      return getLoadingScreen();
    }
  
    var imageNumber = Math.floor(Math.random() * (imageData.results.length));
  
    console.log(imageData.results);
    console.log(imageData.results[imageNumber].super_url);
  
    imageUrl = imageData.results[imageNumber].super_url;
  }

  var screen = new LoadingScreen(name, imageUrl, deck);

 

  return screen;
}
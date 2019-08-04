var express = require('express');
var router = express.Router();
var path = require('path');
const fetch = require('node-fetch');
var _loadingScreenHelper;

module.exports = router;


class Category {
  constructor(singular, plural) {
    this.Singular = singular;
    this.Plural = plural;
    this.Size = 0;
  }
}

class LoadingScreen {
  constructor(name, image, deck) {
    this.Name = name;
    this.Image = image;
    this.Deck = deck;
  }
}

class LoadingScreenHelper{
  constructor(categories = [], totalResults = 0){
    this.Categories = categories;
    this.TotalResults = totalResults;
    this.AreCategoriesInitialized = false;
  }

  async initCategories() {

    for(var i = 0; i < this.Categories.length; i++){
  
      var category = this.Categories[i];

      var response;

      try{
        response = await fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json");
      }
      catch{
        i--;
        continue;
      }
      
      if(response.ok){
        var data = await response.json();
        category.Size = parseInt(data.number_of_total_results, 10);
        this.TotalResults += category.Size;
      }
      else{
        i--;
      }      
    };

    this.AreCategoriesInitialized = true;
  }

  async getLoadingScreen(){

    var catNumber;
    var category;
    var response;
    var result;

    if(this.AreCategoriesInitialized){
      catNumber = Math.floor(Math.random() * this.TotalResults) + 1;

      var position = 0;

      for(var i = 0; i < this.Categories.length; i++){

        category = this.Categories[i];

        if(catNumber <= position + category.Size){

          var itemNumber;
          var response;

          do{
            itemNumber = catNumber - position;
            response = await fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json&limit=1&offset=" + itemNumber);  
          }
          while(!response.ok)
          break;
        }
        else{
          position += category.Size;
        }        
      }

      var data = await response.json();

      result = data.results[0];

    }
    else{
      do {
        catNumber = Math.floor(Math.random() * this.Categories.length);
        category = this.Categories[catNumber];
        response = await fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json"); //limit 1 works with every category except shows, using it with shows leave total number of results at 1
      }
      while (!response.ok);
    
      var data = await response.json();
    
      console.log("Results: " + data.number_of_total_results);
    
      var itemNumber;
      var response2;
    
      do {
        itemNumber = Math.floor(Math.random() * (data.number_of_total_results));
        response2 = await fetch("https://www.giantbomb.com/api/" + category.Plural + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json&limit=1&offset=" + itemNumber);
      }
      while (!response2.ok);
    
      var data2 = await response2.json();
      console.log(data2.results)
      result = data2.results[0];
    }
  
  
    var imageUrl = "https://www.giantbomb.com/api/image/scale_large/3026329-gb_default-16_9.png";
    var name = result.name;
    var deck = result.deck;
  
    if (name == null || name == undefined || name == "") {
      name = result.title;
    }
  
    if (deck == null || deck == undefined || deck == "") {
      deck = result.name;
    }
  
    if (result.image != null) {
      imageUrl = result.image.super_url;
    }
  
    console.log("Category: " + category.Singular);
  
    if (!["video", "video_show", "video_category"].includes(category.Singular)) {
  
      var imageResponse = await fetch("https://www.giantbomb.com/api/images/" + result.guid + "/?api_key=121aa0789ad0e36deb7c4ff3feeeb2f46f9ac6b3&format=json");
      var imageData;
  
      if (imageResponse.ok) {
        imageData = await imageResponse.json();
  
        console.log("image results: " + imageData.results.length);
  
        if (imageData.results.length > 0) {
          var imageNumber = Math.floor(Math.random() * (imageData.results.length));
  
          console.log(imageData.results);
          console.log(imageData.results[imageNumber].super_url);
  
          imageUrl = imageData.results[imageNumber].super_url;
        }
  
      }
    }
  
    var screen = new LoadingScreen(name, imageUrl, deck);
  
    return screen;
  }
}



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
  // new Category("person", "people"), //This category is pretty empty in terms of images and decks
  new Category("platform", "platforms"),
  new Category("theme", "themes"),
  new Category("video", "videos"),
  // new Category("video_category", "video_categories"),
  new Category("video_show", "video_shows")
]


/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  _loadingScreenHelper = new LoadingScreenHelper(categories);
  _loadingScreenHelper.initCategories();
  res.sendFile('gbls.html', { root: path.join(__dirname, '../public') });
});

router.get('/screen', async function (req, res, next) {
  var screen = await getLoadingScreen();
  res.send(screen);
})


const getLoadingScreen = async () => {

  return await _loadingScreenHelper.getLoadingScreen();

}
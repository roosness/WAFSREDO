var template = (function(){

    var create = function(data, route, location){

    	var location = document.querySelector(location);
		var source = document.querySelector("#"+route+"-template").innerHTML;
		var template = Handlebars.compile(source);
		location.innerHTML = template(data);
		
		var menu = document.querySelector('nav ul');
		var icon = document.querySelector('.icon');
		menu.classList.remove('open');
		icon.classList.remove('open');
    }
    var favorites = function () {
    	var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
		template.create({data: favorites, result: favorites.length}, 'favorites', 'main')

    }
    var beerList = function (query) {
    	var url = api.createURL('beers?availableId=1&p=' + query + '&');
    	api.request(url).then(function(response) {
    		console.log('finish request');

    		template.create({data: response.data}, 'beers', 'main')
    	})
    }
    var beerDetail = function (query) {
    	var aside = document.querySelector('aside');
		aside.innerHTML = '';
		console.log(query)
		var url = api.createURL('beer/' + query + '?withBreweries=Y&' )

		api.request(url).then(function(response) {
			
			var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
			var index = -1;
			index = methods.itemInObject(favorites, response.data.id);

			var bool = false;
			if(index > -1) {
				bool = true;
			}
			console.log(bool)

			 template.create({data: response.data, favorite: bool}, 'detail', 'main');
			 favorite.push();

			 
			}, function(error) {
			  console.log("Failed!", error);
		});

    }
    var categories = function () {
    	var url = api.createURL('categories?');
			
		api.request(url, true).then(function(response) {
			 template.create({data: response.data, type:'category'}, 'filters', 'aside')
			 
			 behaviour.filterCat();
			}, function(error) {
			  console.log("Failed!", error);
		});
			
    }
    var styles = function () {
    	var url = api.createURL('styles?')
		api.request(url, true).then(function(response) {
			var newData = _.filter(response.data, function (set) {
					
					return set.categoryId === parseInt(dataset.cat.id);
				});
			template.create({data: newData, title: dataset.cat.name, type: 'style'}, 'filters', 'aside')
			behaviour.filterStyle();
			
			}, function(error) {
			  console.log("Failed!", error);
		});
    }
    var filteredList = function (query) {
    	var url = api.createURL('beers?availableId=1&styleId=' + query + '&');

    	api.request(url).then(function(response) {
				
				 template.create({data: response.data}, 'beers', 'main')
				}, function(error) {
				  console.log("Failed!", error);
			});

    }
    var amsterdam = function () {
    	document.querySelector('aside').innerHTML = ''
		var url = api.createURL('search?q=amsterdam&')
		api.request(url).then(function(response) {

			 response.data.typeBool = false;
			for(var i = 0; i < response.data.length; i++) {
				if(response.data[i].type === 'beer') {
					response.data[i].typeBool = true;
				}
			}
			 template.create({data: response.data}, 'amsterdam', 'main')
			}, function(error) {
			  console.log("Failed!", error);
		});
	}
    
    
    return {
        create : create,
        favorites: favorites,
        beerList: beerList,
        beerDetail: beerDetail,
        categories: categories,
        styles: styles,
        filteredList: filteredList,
        amsterdam: amsterdam
    }
    
}())
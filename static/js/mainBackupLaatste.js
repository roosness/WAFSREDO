(function() {
	'use strict'
	// bronnen: api async promise request : http://www.html5rocks.com/en/tutorials/es6/promises/ , http://joshuawoehlke.com/js-promises-in-five-quick-dirty-and-insufficient-minutes/

	var launcher = {
		init: function() {
			
			router.init();
		}
	};
	var dataset = {};

	var router = {
		init: function() {

			routie({
				'': function () {
					template.create({}, 'home', 'main')
				},
				'beers-:page' : function () {
					dataset.cat = {
						id: false,
						name: false
					};

					var page = window.location.hash.replace('#beers-', '');
					template.beerList(page);
					template.categories(page)
				},
				'favorites' : function () {
					template.favorites();
				},

				'amsterdam' : function () {
					template.amsterdam();
				},
				':id' : function () {
					template.beerDetail(window.location.hash.replace('#', ''));
					
				},

			})
		}
	};
	var api = {
		get: function(url, cat) {
			if(!cat){
				template.create({}, 'loading', 'main')
			}
		  // Return a new promise.
		  return new Promise(function(resolve, reject) {
		    
		    var request = new XMLHttpRequest();
		    request.open('GET', url);

		    request.onload = function() {
		      if (request.status == 200) {
		      	var data = JSON.parse(request.response)
		        resolve(data);
		      }
		      else {
		        reject(Error(request.statusText));
		      }
		    };
		    request.onerror = function() {
		      reject(Error("Network Error"));
		    };
		    request.send();
		  });
		}
	}
	
	var template = {
		create: function (data, route, location) {
			var location = document.querySelector(location);
			var source = document.querySelector("#"+route+"-template").innerHTML;
			var template = Handlebars.compile(source);
			location.innerHTML = template(data);
			
			var menu = document.querySelector('nav ul');
			var icon = document.querySelector('.icon');
			menu.classList.remove('open');
			icon.classList.remove('open');

		},
		favorites : function (query) {
			var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
			var result = false
			if(favorites.length > 0) {
				result = true
			}
			
			template.create({data: favorites, result: result}, 'favorites', 'main')
		},
		beerList: function(query){
			var url = methods.createQuery('beers?availableId=1&p=' + query + '&')
			api.get(url).then(function(response) {
				console.log('request is done')
				var dataObj = {
						currentPage: response.currentPage,
						numberOfPages: response.numberOfPages,
						totalResults: response.totalResults,
				};
				if(response.currentPage === 1) {
					dataObj.prevPage === false;
					dataObj.nextPage = response.currentPage + 1;
				}
				else if (response.currentPage >= response.totalResults) {
					dataObj.nextPage === false;
					dataObj.prevPage = response.currentPage - 1;
				}
				else {
					dataObj.nextPage = response.currentPage + 1;
					dataObj.prevPage = response.currentPage - 1;
				}
				

				 template.create({data: response.data, pagination: dataObj}, 'beers', 'main');
				 
				}, function(error) {
				  console.log("Failed!", error);
			});
		},
		beerDetail: function(query) {
			
			var aside = document.querySelector('aside');
			aside.innerHTML = '';
			
			var url = methods.createQuery('beer/' + query + '?withBreweries=Y&' )

			api.get(url).then(function(response) {
				
				var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
				var index = -1;
				index = methods.itemInObject(favorites, response.data.id);
				var favorite = false;
				if(index > -1) {
					favorite = true;
				}

				 template.create({data: response.data, favorite: favorite}, 'detail', 'main');
				 behaviour.favorite();
				}, function(error) {
				  console.log("Failed!", error);
			});
		},
		categories: function (query) {
			var url = methods.createQuery('categories?');
			
			api.get(url).then(function(response) {
				 template.create({data: response.data, type:'category'}, 'filters', 'aside')
				 
				 behaviour.filterCat();
				}, function(error) {
				  console.log("Failed!", error);
			});
			
		},
		styles: function (query) {
			var url = methods.createQuery('styles?categoryId=1&')
			var q = query;
			api.get(url, true).then(function(response) {
				var newData = _.filter(response.data, function (set) {
						
						return set.categoryId === parseInt(dataset.cat.id);
					});
				template.create({data: newData, title: dataset.cat.name, type: 'style'}, 'filters', 'aside')
				behaviour.filterStyle();
				
				}, function(error) {
				  console.log("Failed!", error);
			});
		},
		filteredList: function (query) {
			var url = methods.createQuery('beers?availableId=1&styleId=' + query + '&')
			api.get(url).then(function(response) {
				console.log('request is done');
				console.log(response.data);
				document.querySelector('main').classList.remove('hide');
				 template.create({data: response.data}, 'beers', 'main')
				}, function(error) {
				  console.log("Failed!", error);
			});
		},
		amsterdam: function () {
			document.querySelector('aside').innerHTML = ''
			var url = methods.createQuery('search?q=amsterdam&')
			api.get(url).then(function(response) {
				
				 template.create({data: response.data}, 'amsterdam', 'main')
				}, function(error) {
				  console.log("Failed!", error);
			});
		}

	}


	var methods = {
		itemInObject : function (object, item) {
			var index = -1;
			
			for(var i = 0;i < object.length; i++) {

					if(object[i].id === item) {
						index = i;
						break;
					}
				}
			
			return index;

		},
		createQuery: function(query) {
			var baseURL = "https://api.brewerydb.com/v2/";
			var apiKEY= "c242e13bd62778ab51790bf22fd04269";
			var url = baseURL + query + 'key=' +  apiKEY + '&format=json';
			console.log(url)
			return url
		},
		createUniqueData : function (data) {
			var count = 1;
			var dataObj = {};
				dataObj.categories = [];

			for(var i  = 0; i < data.length; i ++) {
				if(data[i].categoryId === count) {
					dataObj.categories.push(data[i]);
					count++
				}
			}
			return dataObj
		}
	}
	var behaviour = {
		gestures : function () {
			var element = document.querySelector('body')
			var hammertime = new Hammer(element, {});
			hammertime.on('swiperight', function(ev) {
				console.log('right')
				behaviour.changeMenu(true, false)
			});
			hammertime.on('swipeleft', function(ev) {
				console.log('left')
				behaviour.changeMenu(false, true)
			});
		},

		menu: function () { 
			var menu = document.querySelector('nav ul');
			var icon = document.querySelector('.icon');
			icon.classList.remove('open');
			menu.classList.remove('open');
			
			icon.addEventListener('click', function(e)  {
				e.preventDefault();
				console.log('click')
				icon.classList.toggle('open');
				menu.classList.toggle('open');
			});
		},
		changeMenu  : function (start, stop) {
			var menu = document.querySelector('nav ul');
			var icon = document.querySelector('.icon');
			if(start) {
				icon.classList.add('open');
				menu.classList.add('open');
			}
			if(stop) {
				icon.classList.remove('open');
				menu.classList.remove('open');
			}
		},
		showFilters: function (styles) {
			var button = document.querySelector('#showFilters');
			var filters = document.querySelector('ul.filters');
			
			if(styles) {
				filters.classList.add('open')
			}
			
			button.addEventListener('click', function (e) {
				e.preventDefault();
				console.log('click showfilter')
				
				button.classList.toggle('open');
				filters.classList.toggle('open');
				

			})
		},

		favorite: function () {
			var message = document.querySelector('.message');

			document.querySelector('.favorite').addEventListener('click', function (e) {
				var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
				var beer = {
					id : window.location.hash.replace('#', ''),
					name : document.getElementById('beerName').outerText
				}
				var index = -1;
				index = methods.itemInObject(favorites, beer.id);
				
				if(index === -1) {
					favorites.push(beer);
					message.innerHTML = "You're holding this beer" 
				}
				else {
					favorites.splice(favorites.indexOf(beer.id), 1);
					
					message.innerHTML = "You're no longer holding this beer"
				}
				
				localStorage.setItem('favorites', JSON.stringify(favorites));

			})
		},
		filterCat: function (data) {
			behaviour.showFilters(false);
			var links = document.querySelectorAll('.category-item');

			for(var i = 0; i < links.length; i++) {
				
				links[i].addEventListener('click', function (e) {
					console.log('click cat links')
					dataset.cat.id = e.target.id;
					dataset.cat.name = e.target.outerText;
					template.styles(e.target.id)
				})
			}
			behaviour.unfilter();
			
		},
		filterStyle: function () {
			var links = document.querySelectorAll('.style-item');
			behaviour.showFilters(true);
			for(var i = 0; i < links.length; i++) {
				links[i].addEventListener('click', function (e) {
					for(var x = 0; x < links.length; x++) {
						if(links[x].classList.contains('selectedStyle') & !(links[x].id === e.target.id) ) {
							links[x].classList.remove('selectedStyle')
						}
					}
					if(e.target.classList.contains('selectedStyle')) {
						e.target.classList.remove('selectedStyle');
						template.beerList(1);

					}
					else {
						e.target.classList.add('selectedStyle')
						template.filteredList(e.target.id);
						document.querySelector('#showFilters').classList.remove('open');
						document.querySelector('.filters').classList.remove('open');


					}
				})
			}
		},
		unfilter: function () {
			var link  = document.querySelector('#catTitle');
			
			link.addEventListener('click', function (e) {
				template.beerList(1);
			})
		}
	}
	behaviour.gestures();
	behaviour.menu();

	launcher.init();
})();
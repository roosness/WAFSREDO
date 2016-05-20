(function() {
	'use strict'
	var dataset = {}
	var launcher = {
		init: function() {
			router.init();
			document.getElementById("result").innerHTML = JSON.parse(localStorage.getItem('favorites'))
		}
	}
	var methods = {
		addToQuery(id) {
		
		}
	}
	
	var router = {
		init: function () {
			dataset.filteredId = false;
			routie({
				'beers-:page' : function () {
					var query = window.location.hash.replace('#beers-', '');
					console.log(dataset.filteredId)
					if(dataset.filteredId) {
						api.request('beers', "beers?styleId=" + dataset.filteredId + "&p=" + query + '&key=', false, true);
					}
					else {
						api.request('beers', "beers?availableId=1&p=" + query + '&key=', false, false);
					}
					
				},
				'result-:id' : function () {
					var query = window.location.hash.replace('#result-', '');
					api.request('detail', "beer/" + query + "?withBreweries=Y" + '&key=', false, false, true)
				},
				'favorites' : function () {
					var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
					
					template.get('favorites', favorites, false, false, false, true)
				},
				'*' : function () {
					
				}
			})
		}
	}
	var template = {
		get: function (route, data, aside, filtered, detail, favorites) {

			console.log(route, data, aside, filtered, detail, favorites)
			var main = document.querySelector("main");
			var sidebar = document.querySelector('aside');
			var source = document.querySelector("#"+route+"-template").innerHTML;
			var template = Handlebars.compile(source);
			var favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
			var dataObj = {
						currentPage: data.currentPage,
						numberOfPages: data.numberOfPages,
						totalResults: data.totalResults,
					}
					if(data.currentPage === 1) {
						dataObj.prevPage === false;
						dataObj.nextPage = data.currentPage + 1
					}
					else if (data.currentPage >= data.totalResults) {
						dataObj.nextPage === false;
						dataObj.prevPage = data.currentPage - 1
					}
					else {
						dataObj.nextPage = data.currentPage + 1
						dataObj.prevPage = data.currentPage - 1
					}

			if(detail) {
				console.log(data)
				var favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
				var index = methods.itemInObject(favoriteData, data.data.id);
				
				if(index === -1) {
					var add = false
				}
				else {
					var add = true;
				}
				main.innerHTML = template({beer : data.data, info: dataObj, favorite: add});
				favorite.add();
			}
			else {
				if(favorites) {
					console.log(data[0].id)
					if(data.length === 0) {
						var dataThere = false;
					}
					else {
						var dataThere = true;
					}
					console.log(favoriteData.length);
					console.log(dataThere)

					main.innerHTML = template({data : data, dataThere: dataThere, name: 'data[0].id'});
					console.log(main)

				}
				if(aside) {
				if(filtered) {
					sidebar.innerHTML = template({data : data.categories, styles: data.filteredStyles, filteredData: true });
				}
				else {
					sidebar.innerHTML = template({data : data.categories, filteredData: false});
				}
				behaviour.filtersCat();
				
			}
			else {
				if(filtered) {
					main.innerHTML = template({data : data.data, info: dataObj});
				
				}
				else {
					main.innerHTML = template({data : data.data, info: dataObj});
					api.getFilters('styles');
				}
				
			}
			
			}
			
			
		}
	}
	var api = {
		request : function (route, query, aside, filtered, detail) {
			
			var baseURL = "https://api.brewerydb.com/v2/";
			var apiKEY= "a241009253148c57ca2a08943027e2e5";
			var url = baseURL + query  + apiKEY + '&format=json';
			console.log(url)
			microAjax(url, function (res) {
				var data = JSON.parse(res);
				template.get(route,data , aside, filtered, detail);
				
			})
		},
		getFilters: function (query) {
			
			var baseURL = "https://api.brewerydb.com/v2/";
			var apiKEY= "a241009253148c57ca2a08943027e2e5";
			var url = baseURL + query + '?key=' + apiKEY + '&format=json';
			
			console.log(url)
			microAjax(url, function (res) {
				var data = JSON.parse(res);
				
				var dataObj = {};
					dataObj.categories = [];
				var count = 1;
				for(var i = 0; i < data.data.length; i++) {
					if(data.data[i].categoryId === count) {
						
						dataObj.categories.push(data.data[i]);
						count++;
					}
				}
				dataObj.styles = data.data;
				dataset = dataObj;
				template.get('filters', dataset, true)
				
				
			})
		},
		getStyles: function (query) {
			
			var baseURL = "https://api.brewerydb.com/v2/";
			var apiKEY= "a241009253148c57ca2a08943027e2e5";
			var url = baseURL + query + '?key=' + apiKEY + '&format=json';


			console.log(url)
			microAjax(url, function (res) {
				var main = document.querySelector("main");
			var sidebar = document.querySelector('aside');
			var source = document.querySelector("#"+'filters'+"-template").innerHTML;
			var template = Handlebars.compile(source);
			var data = JSON.parse(res).data
			sidebar.innerHTML = template({styles : data});
			for(var i = 0; i<data.length; i++) {
				
			}
			
			})

		}
	}


	var favorite = {
		add: function() {
			var message = document.querySelector('.message')
			document.querySelector('.favorite').addEventListener('click', function() {
				
				var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
				console.log(favorites)
				var beer = {
					id : window.location.hash.replace('#result-', ''),
					name : document.getElementById('beerName').outerText
				}
				
				var number = -1;
				number = methods.itemInObject(favorites, beer.id);
				console.log(number);
				if(number === -1) {
					favorites.push(beer);
					console.log(favorites)
					
					message.innerHTML = 'Item is added to your favorites!'
				}
				else {
					favorites.splice(favorites.indexOf(beer.id), 1);
					message.innerHTML = 'Item is removed from your favorites'
				}
				console.log(favorites instanceof Array)
				localStorage.setItem('favorites', JSON.stringify(favorites));

			})
		}

	}
	var methods = {
		itemInObject : function (object, item) {
			var index = -1;
			for(var i = 0;i < object.length; i++) {

					if(object[i].id === item) {
						console.log(i)
						index = i;
						break;
					}
				}
			console.log(index);
			return index;

		},
		changeDisplay : function(array, labelArray, changeTo, target) {
			
			for(var i = 0; i < array.length; i++) {
				if(!(array[i] === target)) {
					array[i].style.display = changeTo;
					labelArray[i].style.display = changeTo;
				}
			}
		}
		
	}
	var behaviour = {
		filtersCat: function () {
			var categories = document.querySelectorAll('.category-item');
			for(var i = 0; i < categories.length; i++) {
				categories[i].addEventListener('click', function(e) {
					var newData = _.filter(dataset.styles, function (set) {
						
						return set.categoryId === parseInt(e.target.id);
					});
					
					dataset.filteredStyles = newData;
					template.get('filters', dataset, true, true);
					behaviour.filtersStyles();
					behaviour.unfilter();
				})
			}
		},
		filtersStyles: function () {
			var styles = document.querySelectorAll('.style-item');
			
			for(var i = 0; i < styles.length; i++) {
				styles[i].addEventListener('click', function (e) {
					
					for(var x = 0; x < styles.length; x++) {
						if(styles[x].classList.contains('selectedStyle') & !(styles[x].id === e.target.id) ) {
							styles[x].classList.remove('selectedStyle')
						}
					}

					
					if(e.target.classList.contains('selectedStyle')) {
						window.location.hash += 'stylesId=' + e.target.id
						e.target.classList.remove('selectedStyle');
						api.request('beers', 'beers?availableId=1'+ '&key=', false, true)
					}
					else {
						
						e.target.classList.add('selectedStyle');
						
						dataset.filteredId = e.target.id;
						console.log(dataset)
						api.request('beers', 'beers?styleId='+e.target.id + '&key=', false, true)
					}
					
				
				})
			}
		},
		unfilterStyle: function () {

		},
		unfilter: function () {
			var category = document.querySelector('#selectedCategory');
			category.addEventListener('click', function (e) {
				
				dataset.filterdStyles = [];
				template.get('filters', dataset, true, false);

			})
		}
		
	}


	launcher.init();
})();
(function() {
	'use strict'
	
	var launcher = {
		init: function() {
		document.getElementById("result").innerHTML = localStorage.getItem("favorites");
			routie({
				'list' : function () {
					beer.list();

				},
				':id' : function () {
					template.pick(id)
				},
				'*' : function () {
					template.pick('home')
				}
			})
		}
	}

	var template = {
		pick: function (route, context) {
			var main = document.querySelector("main");
			console.log(context);
			var source = document.querySelector("#"+route+"-template").innerHTML;
			var template = Handlebars.compile(source);
			main.innerHTML = template({data : context});
			behaviour.favorites();
			behaviour.search();
		}
	}
	
	var beer = {
		

		list : function () {
			request.get('beers?availableId=1', 'list');
		},
		search: function (value) {
			request.get(value, 'search')
		}

	}

	var request = {
		get: function (query, template) {
			var baseURL = "https://api.brewerydb.com/v2/";
			var apiKEY= "c242e13bd62778ab51790bf22fd04269";
			var url = baseURL + query + '&key=' + apiKEY + '&format=json';
			var request = new XMLHttpRequest();
			var data = '';
			https://api.brewerydb.com/v2/search?q=Amsterdam&key=a241009253148c57ca2a08943027e2e5&format=json"
			request.onreadystatechange = function() {
				if(request.readyState === 4) {
					
					if(request.status === 200) {
						
					}
					else {
						console.log(request.status, request.statusText);
					}
				}
			}
			request.onload = function () {
				
				template.pick(template, JSON.parse(request.response).data)

			}
			request.open('GET', url);

			request.send();

			
		}
	}
	var routes = {
		init: function () {
			console.log('routes')
			window.addEventListener('hashchange', function (){
				var location = window.location.hash.split("#")[1];
				sections.toggle(location)
			})

		}	
	}

	var sections = {
		toggle: function (route) {
			console.log('toggle')
			var sections = document.querySelectorAll('section');
			for(var i = 0; i < sections.length;i++) {
				if(sections[i].classList.contains(route)) {
					sections[i].classList.add('active')
				}
				else {
					sections[i].classList.remove('active');
				}
				
			}
			
		}
	}
	var behaviour = {
		favorites : function () {
			var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
			
			for(var i = 0; i<favorites.length;i++) {
				document.getElementById(favorites[i].id).className = 'fav';
			}
			document.querySelector('.beerList').addEventListener('click', function (e) {
				var beer = {
					id: e.target.id,
					name: e.target.outerText
				}

			
				if(favorites.indexOf(beer.id) == -1) {
					favorites.push(beer);
					e.target.classList.add('fav');
				}
				else{
					favorites.splice(favorites.indexOf(beer.id), 1);
					e.target.classList.remove('fav');
				}
				localStorage.setItem('favorites', JSON.stringify(favorites));
				
			})
			console.log(localStorage.getItem('favorites'))
		},
		search: function () {
			console.log('search')
			document.querySelector('form.search').addEventListener('submit', function (e) {
				e.preventDefault();
				var value = 'search?q=' + e.target.elements[0].value;
				beer.search(value)
				
			})
		}
	}
	

	launcher.init();
})();

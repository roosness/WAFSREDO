var favorite = (function(){
	var push = function() {
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
	}

	return {
		push : push
	}
}())
var router = (function(){

    var init = function(){

        routie ({
            '': function() {
                template.create({}, 'home', 'main')
            },
            'beers-:page': function(page) {
            	
            	dataset.cat = {
            		id: false, 
            		name: false
            	};
            	
				template.beerList(page);
				template.categories(page)
            },
            'favorites': function() {
                template.favorites();
            },
            'amsterdam': function() {
                template.amsterdam();
            },    
            ':id': function(id) {
                template.beerDetail(id);
            }
        });
    }
    
    return {
        init : init
    }
    
}())
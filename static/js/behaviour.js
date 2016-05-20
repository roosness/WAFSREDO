var behaviour = (function(){
    var init = function () {
        behaviour.menuToggle();
        behaviour.gesture();
    };
    var gesture = function () {
        var element    = document.querySelector('body')
        var hammertime = new Hammer(element, {});

        hammertime.on('swiperight', function(ev) {
            console.log('right')
            behaviour.menuChange('start')
        });
        hammertime.on('swipeleft', function(ev) {
            console.log('left')
            behaviour.menuChange('stop')
        });
    }
    var filterCat = function () {
        behaviour.filterShow();
        behaviour.filterRemove()
        var links = document.querySelectorAll('.category-item');

        for(var i = 0; i < links.length; i++) {
            
            links[i].addEventListener('click', function (e) {
                dataset.cat.id = e.target.id;
                dataset.cat.name = e.target.outerText;
                template.styles(e.target.id)
            })
        }
    };
    var filterShow = function(styles) {
        var button = document.querySelector('#showFilters span');
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
    }
    var filterRemove = function() {
        var button = document.querySelector('#cross');
        var filters = document.querySelector('ul.filters');
        
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('remove showfilter')
            
            button.classList.remove('open');
            filters.classList.remove('open');
            var page = window.location.hash.replace('#beers-', '');
            template.beerList(page);
            template.categories();
        })

    }
    var filterStyle = function () {
        var links = document.querySelectorAll('.style-item');
        behaviour.filterRemove();
        behaviour.filterShow(true);
        for(var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function (e) {
                template.filteredList(e.target.id);
                document.querySelector('#showFilters span').classList.remove('open')
                document.querySelector('ul.filters').classList.remove('open');
            })
        }
    }
    var menuToggle = function () { 
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
    }
    var menuChange = function (action) {
        var menu = document.querySelector('nav ul');
        var icon = document.querySelector('.icon');

        if(action === 'start') {
            icon.classList.add('open');
            menu.classList.add('open');
        }
        if(action === 'stop') {
            icon.classList.remove('open');
            menu.classList.remove('open');
        }
    }
    return {
        init: init,
        filterCat : filterCat,
        filterShow: filterShow,
        filterRemove: filterRemove,
        menuToggle: menuToggle,
        menuChange: menuChange,
        filterStyle: filterStyle,
        gesture: gesture
    }
    
}())
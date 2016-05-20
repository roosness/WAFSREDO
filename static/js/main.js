// bronnen: api async promise request : http://www.html5rocks.com/en/tutorials/es6/promises/ , http://joshuawoehlke.com/js-promises-in-five-quick-dirty-and-insufficient-minutes/
var dataset = {};

var launcher = (function(){
    var init = function() {
      router.init();
      behaviour.init();

    }
    
    return {
        init: init
    }
}())

launcher.init();
var methods = (function(){
    var itemInObject = function (object, item) {
        var index = -1;
        
        for(var i = 0;i < object.length; i++) {

                if(object[i].id === item) {
                    index = i;
                    break;
                }
            }
        return index;
    }
    return {
        itemInObject : itemInObject
    }
    
}())
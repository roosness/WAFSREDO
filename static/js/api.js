var api = (function(){
	var request = function (url, cat) {
		if(!cat) {
			template.create({}, 'loading', 'main')
		}
		else {
			template.create({}, 'loading', 'aside')
		}
		
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

	};
    var createURL =  function(query) {
            var baseURL = "https://api.brewerydb.com/v2/";
            var apiKEY= "c242e13bd62778ab51790bf22fd04269";
            var url = baseURL + query + 'key=' +  apiKEY + '&format=json';
            
            return url
        };
    return {
    	request: request,
        createURL : createURL
    };
    
}())
/*
 * Andrew ID: jiaqiz
 */

(function() {
	"use strict";

		/*
		 * Create a new XMLHttpRequest instance.
		 */
		var xhr = new XMLHttpRequest();
		
		/*
		 * There are events on the object that we can listen to in order
		 * to take appropriate actions as needed.
		 */
		xhr.onreadystatechange = function() {
			console.log("Ready State: " + xhr.readyState);
			if(xhr.readyState === XMLHttpRequest.DONE) {
				/*
				 * Check the HTTP response code to make sure it was successful.
				 */
				if( ( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304 ) {
					/*
					 * HTML will be returned from this AJAX request.
					 */
					 var stringJSON = xhr.responseText;
					 var optionData = JSON.parse(stringJSON);
					 var selectBreed = document.querySelector("select[name='choosebreed']");
					 for (var i = 0; i < optionData.length; i++) {
					 	var option = document.createElement("option");
					 	option.setAttribute("value", optionData[i].id);
					 	option.innerHTML = optionData[i].name;
					 	selectBreed.appendChild(option);
					 }
					 //select the first choice as the default value and load the information
					 selectBreed.options[0].selected = true;
					 doAjax.call();
				} else {
					alert("Error: " + xhr.status);
				}
				xhr = null;
			}
		};

		/*
		 * Specify the HTTP method, URL, and whether it should be asynchronous
		 */
		xhr.open("GET", "http://csw08724.appspot.com/breeds.ajax", true);
  		xhr.send();

  		document.querySelector("select[name='choosebreed']").addEventListener("change", doAjax, false);

  		function doAjax() {
  			var selector = document.querySelector("select[name='choosebreed']");
  			var index = selector.selectedIndex;
  			var id = selector.options[index].value;

  			/*
			 * Create a new XMLHttpRequest instance.
			 */
			var xhr = new XMLHttpRequest();
			
			/*
			 * There are events on the object that we can listen to in order
			 * to take appropriate actions as needed.
			 */
			xhr.onreadystatechange = function() {
				console.log("Ready State: " + xhr.readyState);
				if(xhr.readyState === XMLHttpRequest.DONE) {
					/*
					 * Check the HTTP response code to make sure it was successful.
					 */
					if( ( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304 ) {
						/*
						 * HTML will be returned from this AJAX request.
						 */
						var stringJSON = xhr.responseText;
						var properties = JSON.parse(stringJSON);
						document.querySelector("#breadname h2").innerHTML = properties.name;
						document.getElementById("description").innerHTML = properties.description;
						document.getElementById("origins").innerHTML = properties.origins;
						document.getElementById("rightforyou").innerHTML = properties.rightForYou;
						var imgUrl = "http://csw08724.appspot.com/" + properties.imageUrl;
						document.getElementById("img").src = imgUrl;
						
					} else {
						alert("Error: " + xhr.status);
					}
					xhr = null;
				}
	  		}
	  		xhr.open("GET", "http://csw08724.appspot.com/breed.ajax?id=" + id, true);
  			xhr.send();
	  	}
})();

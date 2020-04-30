function setupCamera(video, callback) {
	/*
	navigator.getUserMedia = navigator.getUserMedia || 
			         navigator.webkitGetUserMedia || 
			         navigator.mozGetUserMedia || 
			         navigator.msGetUserMedia;

	function onMediaStream(stream) {
	    window.URL = window.URL || window.webkitURL;
 		//video.src = window.URL.createObjectURL(stream);
		video.srcObject = stream;
		localMediaStream = stream;
		video.onloadedmetadata = function(e) { 
			callback(null, stream);
		};
	}

	function onMediaFail(e) {
		callback(e, null);
	}

	navigator.getUserMedia({video:true}, onMediaStream, onMediaFail);
	*/

	var constraints = {
// 		video: {
// 			deviceId: { 
// 				exact: videoSelect.value 
// 			}
// 		}
		video: true
	};
	
	navigator.mediaDevices.getUserMedia(constraints)
		.then(onMediaStream).catch(onMediaFail);
	
	function onMediaStream(stream) {
		window.URL = window.URL || window.webkitURL;
		video.srcObject = stream;
		localMediaStream = stream;
		video.onloadedmetadata = function(e) {
			callback(null, stream);
		};
	}

	function onMediaFail(e) {
		callback(e, null);
	}
}

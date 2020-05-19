function setupCamera(video, callback) {
	let constraints = {
	  	video: { width: 1280 }
	};

	if (navigator.mediaDevices === undefined || navigator.mediaDevices.getUserMedia === undefined)
		onMediaFail('Camera may not be accesible from your browser. If using an iPhone, try Safari.');
	else
		navigator.mediaDevices.getUserMedia(constraints)
			.then(onMediaStream).catch(onMediaFail);

	function onMediaStream(stream) {
	  	window.URL = window.URL || window.webkitURL;
	  	video.srcObject = stream;
	  	video.onloadedmetadata = (e) => { callback(null, stream); };
	}

	function onMediaFail(e) {
	  	callback(e, null);
	}
}
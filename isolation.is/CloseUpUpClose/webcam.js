function setupCamera(video, deviceID, callback) {
	let constraints = {
		deviceId: { exact: deviceID },
		video: { width: 1280 }
	};

	if (navigator.mediaDevices === undefined || navigator.mediaDevices.getUserMedia === undefined) {
		let msg = 'Camera may not be accesible from your browser. If using an iPhone, try Safari.';
		onMediaFail(msg);
	}
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

function discoverCameras(callback) {
	navigator.mediaDevices.enumerateDevices()
		.then(gotDevices).then(getStream).catch(onMediaFail);

	function gotDevices(deviceInfos) {
		for (let i = 0; i !== deviceInfos.length; ++i) {
			let deviceInfo = deviceInfos[i];
			if (deviceInfo.kind === 'videoinput') 
				callback(null, { 'label':deviceInfo.label, 'id':deviceInfo.deviceId });
		}
	}

	function onMediaFail(e) {
		callback(e, null);
  	}
}
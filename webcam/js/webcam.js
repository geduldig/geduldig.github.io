function setupCamera(video, deviceID, callback) {
	let constraints = {
		video: {
			deviceId: { exact: deviceID },
			width: 1280
		}
	};

	if (navigator.mediaDevices === undefined || navigator.mediaDevices.getUserMedia === undefined) {
		let msg = 'Camera may not be accesible from your browser. If using an iPhone, try Safari.';
		onMediaFail(msg);
	}
	else
		navigator.mediaDevices.getUserMedia(constraints)
			.then(onMediaStream)
			.catch(onMediaFail);

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
	if (navigator.mediaDevices === undefined || navigator.mediaDevices.enumerateDevices === undefined) 
		callback(null, { 'label':'default camera', 'id':null });
	else 
		navigator.mediaDevices.enumerateDevices()
			.then(onMediaDevices)
			.catch(onMediaFail);

	function onMediaDevices(deviceInfos) {
		for (let i = 0; i !== deviceInfos.length; i++) {
			let deviceInfo = deviceInfos[i];
			if (deviceInfo.kind === 'videoinput') {
				let label = deviceInfo.label ? deviceInfo.label : 'Camera ' + (i+1);
				callback(null, { 'label':label, 'id':deviceInfo.deviceId });
			}
		}
	}

	function onMediaFail(e) {
		callback(e, null);
  	}
}
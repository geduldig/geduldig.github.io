function findCameras(videoSelect, video, callback) {
	videoSelect.onchange = getStream;
	navigator.mediaDevices.enumerateDevices()
		.then(gotDevices).then(getStream).catch(onMediaFail);

	function gotDevices(deviceInfos) {
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			const option = document.createElement('option');
			option.value = deviceInfo.deviceId;
			if (deviceInfo.kind === 'videoinput') {
				option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
				videoSelect.appendChild(option);
			} 
		}
	}
	
	function getStream() {
		setupCamera(video, videoSelect.value, callback);
	}
	
	function setupCamera(video, deviceID, callback) {
		let constraints = {
			video: {
				deviceId: { exact: deviceID+'x' },
				width: 1280
			}
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
	}

	function onMediaFail(e) {
		callback(e, null);
	}
}

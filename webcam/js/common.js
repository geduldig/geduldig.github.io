const isMobileDevice = 
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i);

// DOM elements

const menu = document.querySelector('#menu');
const videoSelect = document.querySelector('select#videoSource');
const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const image = document.querySelector('#image');
const vs = document.querySelector('#vshader').textContent;
const fs = document.querySelector('#fshader').textContent;

// -- Setup shader program and variables  

const gl = canvas.getContext('webgl', { preserveDrawingBuffer:true });
const program = createProgram(gl, vs, fs);
const width = gl.getUniformLocation(program, 'width');
const height = gl.getUniformLocation(program, 'height');
const sampler = gl.getUniformLocation(program, 'sampler0');
const position = gl.getAttribLocation(program, 'position');
const texture = createTexture(gl);
const vertexBuffer = webglScreenQuad(gl);
gl.uniform1i(sampler, 0);
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

let videoScale = 1.0;
let animID = undefined;

// -- UI events --

document.addEventListener('DOMContentLoaded', function(event) {
    if (isMobileDevice)
        document.querySelector('#snapshot').style.display = 'none';

    if (document.querySelector('#presets').childElementCount === 0)
        document.querySelector('#presets-label').style.display = 'none';

    setupCamera(video, {video:true}, (err, stream) => {
        discoverCameras((err, {label, id}) => {
            const option = document.createElement('option');
            option.value = id;
            option.text = label;
            videoSelect.appendChild(option);
            if (videoSelect.length === 1 || option.text.indexOf('Built-in') !== -1) {
                option.setAttribute('selected', 'selected');
                videoSelect.dispatchEvent(new Event('change'));
            }
        });
    });
});

videoSelect.onchange = () => {
    const constraints = {
		video: { 
			deviceId: videoSelect.value ? { exact:videoSelect.value } : null,
		}
    };

    setupCamera(video, constraints, (err, stream) => {
        if (err)
            alert('WEBCAM FAILED: ' + JSON.stringify(err));
        else {
            showControls();
            resizeCanvas(videoScale);
            startAnimation();
            showMenu();
        }
    });
};

// Tasks

function showMenu() {
    menu.style.display = 'block';
}

function hideMenu() {
    menu.style.display = 'none';
}

function toggleMenu() {
    menu.style.display === 'none' ? showMenu() : hideMenu();;
}

function showControls() {
    const controls = document.querySelector('.controls');
    for (let i=0; i < controls.length; i++)
        controls[i].style.display = '';
}

function resizeCanvas(scale) {
    videoScale = scale;
    if (video.videoWidth / video.videoHeight > window.innerWidth / window.innerHeight) {
        canvas.width = window.innerWidth * videoScale;
        canvas.height = canvas.width * video.videoHeight / video.videoWidth;
    }
    else {
        canvas.height = window.innerHeight * videoScale;
        canvas.width = canvas.height * video.videoWidth / video.videoHeight;
    }

    gl.uniform1f(width, canvas.width);
    gl.uniform1f(height, canvas.height);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function startAnimation() {
    window.cancelAnimationFrame(animID);
    animID = window.requestAnimationFrame(function loop() {
        updateTexture(gl, texture, vertexBuffer, video);
        animID = window.requestAnimationFrame(loop);
    });
}

function saveSnapshot() {
    const now = new Date();
    const stamp = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
    const img = document.querySelector('#snapshot-img');
    const link = document.querySelector('#snapshot-link');
    img.src = canvas.toDataURL();
    link.download = `webcam-${stamp}.png`;
    link.href = img.src;
    link.click();
}

function CreateSlider(id, name, min, max, step, oninput) {
    const slider = document.createElement('div');
    slider.id = id;
    slider.className = 'd-flex flex-row bd-highlight mb-3';
    const label = document.createElement('div');
    label.className = 'p-2 bd-highlight flex-nowrap right-label';
    label.for = id;
    label.innerText = name;
    const input = document.createElement('input');
    input.className = 'col-sm-10 custom-range';
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.step = step
    input.oninput = oninput;
    slider.appendChild(input);
    slider.appendChild(label);
    document.querySelector('#sliders').appendChild(slider);
    return (val) => { 
        input.value = val;
        input.oninput();
    };
}

function createPreset(name, onclick) {
    const preset = document.createElement('button');
    preset.className = 'presets btn btn-primary';
    preset.innerText = name;
    preset.onclick = onclick;
    document.querySelector('#presets').appendChild(preset);
    return preset;
}
const scene = new THREE.Scene();
const background = new THREE.TextureLoader().load("bg.jpg");
scene.background = background;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const clickRaycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const spaceWrapper = document.getElementById("space-content");

spaceWrapper.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

const footer = document.getElementById("footer");
const footerDefaultText = "click on an object, whydoncha";

const color = 0xFFFFFF;
const intensity = 1;
const gravitationalAcceleration = 0.01;

const fullLight = new THREE.AmbientLight(color, 0.8);
scene.add(fullLight);

var hoveringOn = null;

camera.position.z = 5;


function onPointerMove(event) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onClick(event) {
    switch (hoveringOn) {
        case "album":
            document.location.href = "/album.html";
            break;
        case "spotify":
            document.location.href = "https://open.spotify.com/user/6sgo9vkln5v4yn527mibclq5i";
            break;
        case "<div style='font-family: serif; display: inline;'>Orpheum</div>":
            document.location.href = "/videos.html";
            break;
        case "instagram":
            document.location.href = "https://www.instagram.com/bf7002_/";
            break;
        case "credits":
            document.location.href = "/credits.html";
            break;
        default:
            break;
    }
}

const light = new THREE.DirectionalLight(color, intensity);
light.position.set(10, 10, 0);
light.target.position.set(0, 0, 0);
const orbitingGroup = new THREE.Group();
orbitingGroup.add(light);
scene.add(orbitingGroup);
orbitingGroup.position.set(0, -1, -10);
orbitingGroup.rotation.x = 0.5;

var loaded = 0;
const toLoad = 3

var face;
var faceScale = 5;
const loader = new THREE.GLTFLoader();
loader.load("/face.glb", function(face) {
    face.scene.rotation.set(-0.1, 0.9, 0)
    face.scene.scale.set(faceScale, faceScale, faceScale);
    console.log("Loaded benjamin's face")
    face = face.scene;
    scene.add(face);
    face.position.set(0, -3, -10);
    loaded++;
}, undefined, function(error) {
    console.error(error);
})

loader.load("/gallery.glb", function(obj) {
    obj.scene.rotation.set(0, 4, 0)
    obj.scene.scale.set(0.02, 0.02, 0.02);
    orbitingGroup.add(obj.scene);
    obj.scene.position.set(2, 2, -4);
    loaded++;
}, undefined, function(error) {
    console.error(error);
})

loader.load("/spotify_logo.glb", function(obj) {
    obj.scene.rotation.set(2, 2, 4)
    obj.scene.scale.set(1, 1, 1);
    orbitingGroup.add(obj.scene);
    obj.scene.position.set(4, 1, 4);
    loaded++;
}, undefined, function(error) {
    console.error(error);
})

loader.load("/instagram_3d-icon.glb", function(obj) {
    obj.scene.rotation.set(-2, 2, 2)
    obj.scene.scale.set(1, 1, 1);
    orbitingGroup.add(obj.scene);
    obj.scene.position.set(-2, 4, 4);
    loaded++;
}, undefined, function(error) {
    console.error(error);
})

loader.load("/hangman.glb", function(obj) {
    obj.scene.rotation.set(0, 0, 0)
    obj.scene.scale.set(0.5, 0.5, 0.5);
    orbitingGroup.add(obj.scene);
    obj.scene.name = "hangman"
    obj.scene.position.set(-2, 2, -3);
    loaded++;
}, undefined, function(error) {
    console.error(error);
})

loader.load("film.glb", function(obj) {
    obj.scene.rotation.set(2, 2, 4)
    obj.scene.scale.set(10, 10, 10);
    orbitingGroup.add(obj.scene);
    obj.scene.position.set(-4, -4, 0);
    loaded++;
}, undefined, function(error) {
    console.error(error);
})

function animate() {
    clickRaycaster.setFromCamera( pointer, camera );

    if (loaded >= toLoad) {
        document.getElementById("loader").style.display = "none";
        loaded = 0;
    }

	// calculate objects intersecting the picking ray
	const intersects = clickRaycaster.intersectObjects( orbitingGroup.children, true);

    if (intersects.length > 0) {
        hoveringOn = intersects[0].object.name;

        console.log(hoveringOn);

        if (hoveringOn.startsWith("album")) {
            hoveringOn = "album"
        } else if (hoveringOn.startsWith("Cylinder")) {
            hoveringOn = "spotify"
        } else if (hoveringOn.startsWith("pCylinder") || hoveringOn.startsWith("cam") || hoveringOn.startsWith("lens")  || hoveringOn.startsWith("rivet") || hoveringOn.startsWith("dial") || hoveringOn.startsWith("plate")) {
            hoveringOn = "<div style='font-family: serif; display: inline;'>Orpheum</div>"
        }
        else if (hoveringOn.startsWith("Object_16")) {
            hoveringOn = "credits";
        }
        else if (hoveringOn.startsWith("Object")) {
            hoveringOn = "instagram";
        }
        } else {
            hoveringOn = null;
        }
        

    if (hoveringOn) {
        footer.innerHTML = ("click to go to the " + hoveringOn);
        document.body.style.cursor = "pointer";
    } else {
        footer.innerText = footerDefaultText;
        document.body.style.cursor = "";
    }

    renderer.render(scene, camera);
    orbitingGroup.rotation.x += 0.0001;
    orbitingGroup.rotation.y += 0.01;
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick)


renderer.setAnimationLoop(animate);
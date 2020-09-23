var scene, camera,ocamera, renderer, car;

var objectMidpoints=[];
var d_Objects=[];
var asl=[];
var count =0;
var tracer=0;
var inc=0.001;
var onecount=0;
var lightD= 35;
var lightb= 12;
var energyDemand;
//var solar= mouseX/30;
var spheres= [];
var functionCluster;
var controls2;
//frustrumdata
const SHOW_FRUSTUM_PLANES =true;
var controls;
var spacesID= [];



// this material is used for normal object state
var defaultMaterial = new THREE.MeshPhongMaterial({ color: 0x90a090 });
// this material is used for selected object state
var selectedMaterial = new THREE.MeshPhongMaterial({  color: 0x20ff20});
// this material is used for building function object state
var materialFunction = new THREE.MeshPhongMaterial({  color: 0x606020});
// this material is used for cluster building object state
var materialCluster = new THREE.MeshPhongMaterial({  color: 0x009090});

var mat_office= new THREE.MeshPhongMaterial({  color: 0x202020});
var mat_retail= new THREE.MeshPhongMaterial({  color: 0xffffff});
var mat_residential= new THREE.MeshPhongMaterial({  color: 0xff3333});

var mat_cluster_A= new THREE.MeshPhongMaterial({  color: 0x000099});
var mat_cluster_B= new THREE.MeshPhongMaterial({  color: 0x990000});
var mat_cluster_C= new THREE.MeshPhongMaterial({  color: 0x009900});
var mat_cluster_D= new THREE.MeshPhongMaterial({  color: 0x992299});


//reading json
async function getMyFile() {
  let response = await fetch('energyDemand.json')
   energyDemand = await response.json()
   //console.log(energyDemand.standardMetricHeating);
    return energyDemand
}

getMyFile()  //call json
init();
//dataSetup();  // make spheres visualisation
Dgui();   //run gui settings  in sepperate js file
buildingMesh2Data();  //
//updateClusterData();


function init(){
  
  

   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.3, 2000);
   scene.background = new THREE.Color(0xffffff);
  camera.position.x = 5;
  camera.position.y = 891;
  camera.position.z = 216;
  camera.lookAt(0, 0, 0);
  
  
  renderer = new THREE.WebGLRenderer({    antialias: true  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color(0xf9f9f9));
  document.body.appendChild(renderer.domElement);







 // this camera is used to render selection ribbon
 // ocamera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
  ocamera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.3, 2000);
  scene.add(ocamera);
  
  ocamera.position.x = 0;
  ocamera.position.y = 0;
  ocamera.position.z = 100; // this does not matter, just far away
  
  ocamera.lookAt(0, 0, 0);
  // IMPORTANT, camera and ribbon are in layer#1,
  // Here we render by layers, from two different cameras
  ocamera.layers.set(1);
  
  ////////////////SELECTION CODE TEMP
  
 
  var pointColor = "#ff5808";
  var directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(-2, lightD, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 2;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -1000;
  directionalLight.shadow.camera.right = 1000;
  directionalLight.shadow.camera.top = 1000;
  directionalLight.shadow.camera.bottom = -1000;

  directionalLight.distance = 1000;
  directionalLight.intensity = 0.8;
  directionalLight.shadow.mapSize.height = 3024;
  directionalLight.shadow.mapSize.width = 3024;
  //directionalLight.shadow.mapSize.height = 600;
 // directionalLight.shadow.mapSize.width = 1000;


  scene.add(directionalLight);

  var hemiLight = new THREE.HemisphereLight(0x000000, 0xffffff, 0.4);
  hemiLight.position.set(0, 000, 660);
  scene.add(hemiLight);
  
////////////////SELECTION   CODE TEMP




  

  

  controls2 = new THREE.OrbitControls( camera, renderer.domElement );
  controls2.target.set(0,0,0);
  controls2.update();
  

 
              
  


 // controls= new THREE.DragControls(d_Objects, camera, renderer.domElement)
 // controls= new THREE.DragControls(d_Objects, camera );





console.log("midpoints array:");
console.log(objectMidpoints);
console.log(scene.children);
console.log(scene.getObjectByName( "Scene", true));



//console.log(scene.getObjectByProperty("id", 12));



  var geo = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
  var mat = new THREE.MeshStandardMaterial({
    emissive: 0x708090,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.13,
    shading: THREE.FlatShading
  });
  var plane = new THREE.Mesh(geo, mat);
  plane.receiveShadow = true;
  plane.rotation.setFromVector3(new THREE.Vector3( Math.PI/2,Math.PI, 0 ));
  //plane.translateZ(0.02);
  
  scene.add(plane);

  
  


  
  window.addEventListener( 'resize', resize, false);
  
 // update();
 ////////////////////////////////////selector frustrum code
// selection ribbon
var material = new THREE.LineBasicMaterial({
  color: 0x900090
});
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-1, -1, 0));
geometry.vertices.push(new THREE.Vector3(-1, 1, 0));
geometry.vertices.push(new THREE.Vector3(1, 1, 0));
geometry.vertices.push(new THREE.Vector3(1, -1, 0));
geometry.vertices.push(new THREE.Vector3(-1, -1, 0));
var line = new THREE.Line(geometry, material);
line.layers.set(1); // IMPORTANT, this goes to layer#1, everything else remains in layer#0 by default
line.visible = false;
scene.add(line);

let frustum = new THREE.Frustum();

// this helpers will visualize frustum planes,
// I keep it here for debug reasons
if (SHOW_FRUSTUM_PLANES) {
  let helper0 = new THREE.PlaneHelper(frustum.planes[0], 1, 0xffff00);
  scene.add(helper0);
  let helper1 = new THREE.PlaneHelper(frustum.planes[1], 1, 0xffff00);
  scene.add(helper1);
  let helper2 = new THREE.PlaneHelper(frustum.planes[2], 1, 0xffff00);
  scene.add(helper2);
  let helper3 = new THREE.PlaneHelper(frustum.planes[3], 1, 0xffff00);
  scene.add(helper3);
  let helper4 = new THREE.PlaneHelper(frustum.planes[4], 1, 0xffff00);
  scene.add(helper4);
  let helper5 = new THREE.PlaneHelper(frustum.planes[5], 1, 0xffff00);
  scene.add(helper5);
}

let pos0, pos1; // mouse coordinates

// You find the code for this class here: https://github.com/nmalex/three.js-helpers
var mouse = new RayysMouse(renderer, camera, controls);

// subscribe my helper class, to receive mouse coordinates
// in convenient format
mouse.subscribe(
  function handleMouseDown(pos, event, sender) {
  	// make selection ribbon visible
    line.visible = true;

		// update ribbon shape verts to match the mouse coordinates
    for (let i = 0; i < line.geometry.vertices.length; i++) {
      line.geometry.vertices[i].x = sender.rawCoords.x;
      line.geometry.vertices[i].y = sender.rawCoords.y;
    }
    geometry.verticesNeedUpdate = true;

		// remember where we started
    pos0 = pos.clone();
    pos1 = pos.clone();
    
    // update frustum to the current mouse coordinates
    updateFrustrum(camera, pos0, pos1, frustum);
    
    // try to select/deselect some objects
    selectObjects(d_Objects, frustum);
  },
  function handleMouseMove(pos, event, sender) {
    if (sender.mouseDown && count !=0) {   // gui  tracks count function
      line.geometry.vertices[1].y = sender.rawCoords.y;
      line.geometry.vertices[2].x = sender.rawCoords.x;
      line.geometry.vertices[2].y = sender.rawCoords.y;
      line.geometry.vertices[3].x = sender.rawCoords.x;

      geometry.verticesNeedUpdate = true;

			// pos0 - where mouse down event occurred,
      // pos1 - where the mouse was moved
      pos1.copy(pos);
      
      // update frustum to the current mouse coordinates
      updateFrustrum(camera, pos0, pos1, frustum);
      
      // try to select/deselect some objects
      selectObjects(d_Objects, frustum);
    }
  },
  function handleMouseUp(pos, event, sender) {
  	// hide selection ribbon
    line.visible = false;
  }
);
 ////////////////////////////////////end selector frusdtrum code
  
}














var animate = function() {
  requestAnimationFrame(animate);
  
  renderer.render(scene, camera);
  renderer.autoClear = false;

  //renderer.render(scene, ocamera);  // is the other renderer
 // renderer.autoClear = true;




};


animate();




  


function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
 // camera.aspect = CANVAS_WIDTH , CANVAS_HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  //renderer.setSize( CANVAS_WIDTH , CANVAS_HEIGHT );
}





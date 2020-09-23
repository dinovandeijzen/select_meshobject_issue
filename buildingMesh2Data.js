
function buildingMesh2Data(){
   






  //Load meshes here
  const loader = new THREE.GLTFLoader();
  loader.load('district_2.gltf', function(object){

    object.scene.traverse( function ( child ) {
      
                  if ( child.isMesh ) {

                   //console.log(object);
                      
                      child.material =  new THREE.MeshPhongMaterial({ 
                      transparent : false ,
                      opacity : 0.5,
                      emissive: 0x000000,
                     // emissiveIntensity: 0.5,
                      color:  0xffffff,
                      //roughness: 0.9,
                      //metalness: 0.1,
                      specular: 0.9,
                      shininess: 0.1,
                      //shading: THREE.FlatShading
                   });
                   


                   //TIJDELIJKE FUNCTIE VAN GEOMETRIE BEPALEN
                   const hc=0.3  //is rescale height temp to realistic value
                   const ac=0.3*0.7  //is rescale area and bruto netto temp to realistic value
                   var temp_h=getArea(child).z*hc;  //rescale
                   var temp_a= (getArea(child).x * getArea(child).y)*ac;
                   var h_set=65*hc;   //need correction here too
                   var a_set= 15000*ac;
                   let floorheight=25 *hc;  //is guess 2.5 meters
                   

                   if(  temp_h > h_set   ){
                    child.buildingFunction="office";
                    child.material= mat_office; 
                    child.colorFunction= mat_office;

                    child.floors=temp_h/floorheight;   // 25=2.5meters  temp guess
                    child.usageArea= temp_a*(temp_h/floorheight);
                    child.energyHeatingDemand= energyDemand.standardMetricHeating.map(te => Math.floor( te*child.usageArea));
                    child.energyHeatingfrequency= energyDemand.demands[44].heatingDemand; //is actual time frequency
                    child.totalHeatingDemand= energyDemand.demands[44].totalHeatingDemand*Math.floor( child.usageArea);

                    child.energyCoolingDemand= energyDemand.standardMetricCooling.map(te => Math.floor( te*child.usageArea)); //te is the i of the array that gets mapped
                    child.energyCoolingfrequency= energyDemand.demands[44].coolingDemand; //is actual time frequency
                    child.totalCoolingDemand= energyDemand.demands[44].totalCoolingDemand*Math.floor(child.usageArea);
                    
                    
                    child.colorCluster= mat_cluster_A;  // giving it additional properties
                    child.cluster='cluster_A';
                    
                 
                  
                  
                   }
                
                     else if(temp_a < a_set && temp_h <= h_set ){
                       
                       child.buildingFunction="residential"; 
                       child.material=mat_residential;
                       child.colorFunction= mat_residential;
                       
                       child.usageArea= temp_a*(temp_h/floorheight);  
                       child.floors=temp_h/floorheight;
                       child.energyHeatingDemand= energyDemand.standardMetricHeating.map(te => Math.floor( te*child.usageArea));
                       child.energyHeatingfrequency= energyDemand.demands[66].heatingDemand; //is actual time frequency
                       child.totalHeatingDemand= energyDemand.demands[66].totalHeatingDemand*Math.floor( child.usageArea);
   
                       child.energyCoolingDemand= energyDemand.standardMetricCooling.map(te => Math.floor( te*child.usageArea));
                       child.energyCoolingfrequency= energyDemand.demands[66].coolingDemand; //is actual time frequency
                       child.totalCoolingDemand= energyDemand.demands[66].totalCoolingDemand*Math.floor( child.usageArea);
                       
                       
                       child.cluster='cluster_B';
                       child.colorCluster= mat_cluster_B;  // giving it additional properties
                       


                     }
                      else if (temp_a > a_set && temp_h <= h_set){
                        
                        child.buildingFunction="retail";
                        child.colorFunction= mat_retail;
                        child.material=mat_retail;

                        child.floors=temp_h/floorheight;
                        child.usageArea= temp_a*(temp_h/floorheight);  
                        child.energyHeatingDemand= energyDemand.standardMetricHeating.map(te => Math.floor( te*child.usageArea));
                        child.energyHeatingfrequency= energyDemand.demands[43].heatingDemand; //is actual time frequency
                        child.totalHeatingDemand= energyDemand.demands[43].totalHeatingDemand*Math.floor( child.usageArea);;
    
                        child.energyCoolingDemand= energyDemand.standardMetricCooling.map(te => Math.floor( te*child.usageArea));
                        child.energyCoolingfrequency= energyDemand.demands[43].coolingDemand; //is actual time frequency
                        child.totalCoolingDemand= energyDemand.demands[43].totalCoolingDemand*Math.floor( child.usageArea);
                         
                        child.cluster='cluster_D';
                        child.colorCluster= mat_cluster_D;  // giving it additional properties
                        

                      }
                      

                      

                      child.castShadow = true;
                      child.receiveShadow = true;
                    //child.scale.set(0.30,0.20,0.20);
                      child.position.x=-90;    // HERE WE DO A TRANSFORMATION MIGHT NEED ADJUSTMENT FOR LATER
                      child.position.Z=-90;




                    objectMidpoints.push(getCenterPoint(child));
                    d_Objects.push(child);

                    scene.add( object.scene );
                   
                   
                  }
                
                
                } );
}
  );


  


}








function updateClusterData(){
    var cluster_A= new Cluster('cluster_A');
    var cluster_B= new Cluster('cluster_B');
    var cluster_C= new Cluster('cluster_C');
    var cluster_D= new Cluster('cluster_D');

    console.log("geeft ie o?");
    console.log(  cluster_D.areaOffice );
    
    console.log("clusterdata_updated");
    for (let i=0; i<d_Objects.length ; i++) {
        
       
         if (d_Objects[i].cluster== 'cluster_A') {
             cluster_A.areaOffice = cluster_A.areaOffice + d_Objects[i].usageArea;
           
            console.log(cluster_A.areaOffice);
         } 
         if (d_Objects[i].cluster== 'cluster_B') {
            cluster_B.areaOffice = cluster_B.areaOffice + d_Objects[i].usageArea;
           
        }
        if (d_Objects[i].cluster== 'cluster_C') {
            cluster_C.areaOffice = cluster_C.areaOffice + d_Objects[i].usageArea;
           
        }
        if (d_Objects[i].cluster== 'cluster_D') {
            cluster_D.areaOffice = cluster_D.areaOffice + d_Objects[i].usageArea;
           
        }







    }
console.log("clusterA_area :"+ cluster_A.areaOffice)
console.log("clusterB_area :"+ cluster_B.areaOffice)
console.log("clusterC_area :"+ cluster_C.areaOffice)
console.log("clusterD_area :"+ cluster_D.areaOffice)


}



function getCenterPoint(mesh) {
    var middle = new THREE.Vector3();
    var geometry = mesh.geometry;
  
    geometry.computeBoundingBox();
  
    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
  
    mesh.localToWorld( middle );
    return middle;
  }
  
  
  function getArea(mesh) {
    var netto_size = new THREE.Vector3();
    var a_netto;
    var geometry = mesh.geometry;
  
    geometry.computeBoundingBox();
  
    netto_size.x = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) ;
    netto_size.z = Math.abs(geometry.boundingBox.max.y ) ;  //flipped axi
    netto_size.y = (geometry.boundingBox.max.z-geometry.boundingBox.min.z );
    mesh.localToWorld( netto_size );
    
    return netto_size;
  }






  

  
  
  function dataSetup(){
    
    // energy use visual
    console.log("energy demand:");
   // console.log(scene.getObjectByName( "Scene").child[44].totalCoolingDemand);
   //console.log(scene.getObjectByName( "Scene", true));
   // console.log(scene.children.child[44].totalCoolingDemand);
    var groupSpheres = new THREE.Group();
      ///48 picked now as not init yet
      for ( var i = 0; i < 63; i ++ ) {  //manual now, needs better solution
        var temp_e= 3;
        var temp_r=temp_e;
        var geometry4 = new THREE.SphereGeometry( temp_r, 32, 32 );
        var material4 = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var sphere4 = new THREE.Mesh( geometry4, material4 );
      // var rt= Math.random(6);
        //sphere4.scale.set(rt,rt,rt);
  
        //child.totalHeatingDemand
      // sphere4.position.set(0,0,0);
      // sphere4.rotation.setFromVector3(new THREE.Vector3( Math.PI/2,Math.PI, 0 ));
      
      
      spheres.push(sphere4);
      groupSpheres.add(sphere4);
      
      //scene.add( sphere4 );
      }
  
      
      scene.add(groupSpheres);
  
  
  }
  
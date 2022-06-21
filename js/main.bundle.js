!function(){"use strict";var e,t={941:function(){},178:function(e,t,i){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.App=void 0;const o=i(232),n=s(i(79)),a=i(46),r=i(818),h=i(373),c=i(923),l=i(897),p=i(800);class d{constructor(){this._pointerlockCallback=this.pointerlockCallback.bind(this),this.crosshairBehaviour=new r.CrosshairBehaviour,this.targetInfo=new l.TargetInfo;const e=document.getElementById("start-normal");null==e||e.addEventListener("click",this.startNormal.bind(this))}pointerlockCallback(){document.pointerLockElement===this.renderer.domElement?document.addEventListener("mousemove",this.player.onMouseMove,!1):document.removeEventListener("mousemove",this.player.onMouseMove,!1)}startNormal(){const e=document.getElementById("main");e&&(e.style.display="none");const t=document.getElementById("points");t&&(t.style.display="flex"),this.clock=new o.Clock,this.stats=new n.default,this.container=document.getElementById("app"),this.initRenderer(),this.initSky(),this.initLights(),this.initScene(),this.player=new p.Player(this.camera,this.scene,this.renderer,this.targetInfo),this.onWindowResize(),document.addEventListener("pointerlockchange",this._pointerlockCallback,!1),window.onfocus=()=>{this.renderer.domElement.requestPointerLock()},this.renderer.domElement.requestPointerLock(),this.animate()}setupGame(){}initScene(){this.crosshair=new a.Crosshair(this.renderer,this.uiScene,this.camera.aspect),this.levelGen=new h.LevelGenerator,this.levelGen.init(this.scene,this.renderer);let e=this.levelGen.getSpawnLocation();this.camera.position.copy(e);const t=(new o.CubeTextureLoader).load(["images/textures/posx.jpg","images/textures/negx.jpg","images/textures/posy.jpg","images/textures/negy.jpg","images/textures/posz.jpg","images/textures/negz.jpg"]);t.encoding=o.sRGBEncoding,this.scene.background=t}initLights(){const e=Math.PI/4,t=new o.SpotLight(16777215,100,5e3,e,.5,1);t.castShadow=!0,t.shadow.bias=-1e-5,t.shadow.mapSize.width=4096,t.shadow.mapSize.height=4096,t.shadow.camera.near=1,t.shadow.camera.far=100,t.position.set(2500,2500,0),t.lookAt(0,0,0),this.scene.add(t);const i=new o.HemisphereLight(16777088,8421504,.5);i.color.setHSL(.6,1,.6),i.groundColor.setHSL(.095,1,.75),i.position.set(0,400,0),this.scene.add(i)}initRenderer(){this.renderer=new o.WebGLRenderer({antialias:!1}),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=o.PCFSoftShadowMap,this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.physicallyCorrectLights=!0,this.renderer.outputEncoding=o.sRGBEncoding,this.container.appendChild(this.renderer.domElement),window.addEventListener("resize",this.onWindowResize.bind(this),!1);const e=1920/1080;this.camera=new o.PerspectiveCamera(60,e,1,1e5),this.camera.position.set(0,150,0),this.scene=new o.Scene,this.uiCamera=new o.OrthographicCamera(-1,1,e,-1*e,1,1e3),this.uiScene=new o.Scene}loadMaterial(e,t){const i=new o.TextureLoader,s=this.renderer.capabilities.getMaxAnisotropy(),n=i.load("images/textures/"+e+"metallic.png");n.anisotropy=s,n.wrapS=o.RepeatWrapping,n.wrapT=o.RepeatWrapping,n.repeat.set(t,t);const a=i.load("images/textures/"+e+"albedo.png");a.anisotropy=s,a.wrapS=o.RepeatWrapping,a.wrapT=o.RepeatWrapping,a.repeat.set(t,t),a.encoding=o.sRGBEncoding;const r=i.load("images/textures/"+e+"normal.png");r.anisotropy=s,r.wrapS=o.RepeatWrapping,r.wrapT=o.RepeatWrapping,r.repeat.set(t,t);const h=i.load("images/textures/"+e+"roughness.png");return h.anisotropy=s,h.wrapS=o.RepeatWrapping,h.wrapT=o.RepeatWrapping,h.repeat.set(t,t),new o.MeshStandardMaterial({metalnessMap:n,map:a,normalMap:r,roughnessMap:h})}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.uiCamera.left=-this.camera.aspect,this.uiCamera.right=this.camera.aspect,this.uiCamera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}animate(){requestAnimationFrame((e=>{this.render(),this.animate()}))}render(){this.stats.update();const e=this.clock.getDelta();this.targetInfo.update(this.camera,this.scene),this.crosshairBehaviour.update(this.crosshair,this.targetInfo),this.player.update(e),this.levelGen.update(this.scene,this.renderer),this.renderer.autoClear=!0,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!1,this.renderer.render(this.uiScene,this.uiCamera)}initSky(){this.sky=new c.Sky,this.sky.scale.setScalar(45e6),this.scene.add(this.sky),this.sun=new o.Vector3;const e=this.sky.material.uniforms;e.turbidity.value=10,e.rayleigh.value=3,e.mieCoefficient.value=.005,e.mieDirectionalG.value=.7;const t=o.MathUtils.degToRad(88),i=o.MathUtils.degToRad(180);this.sun.setFromSphericalCoords(1,t,i),e.sunPosition.value.copy(this.sun)}}t.App=d,new d},32:function(e,t){Object.defineProperty(t,"__esModule",{value:!0})},830:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.CrosshairBehaviour=void 0;const s=i(232);t.CrosshairBehaviour=class{constructor(){this.colorNeutral=new s.Color(16777215),this.colorCanAttach=new s.Color(2726432)}update(e,t){e.material.color=t.canAttach?this.colorCanAttach:this.colorNeutral}}},818:function(e,t,i){var s=this&&this.__createBinding||(Object.create?function(e,t,i,s){void 0===s&&(s=i);var o=Object.getOwnPropertyDescriptor(t,i);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,s,o)}:function(e,t,i,s){void 0===s&&(s=i),e[s]=t[i]}),o=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||Object.prototype.hasOwnProperty.call(t,i)||s(t,e,i)};Object.defineProperty(t,"__esModule",{value:!0}),o(i(32),t),o(i(830),t)},785:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Crosshair=void 0;const s=i(232);class o extends s.Sprite{constructor(e,t,i){const o=e.capabilities.getMaxAnisotropy(),n=(new s.TextureLoader).load("images/textures/crosshair.png");n.anisotropy=o,super(new s.SpriteMaterial({map:n,color:16777215,fog:!1,depthTest:!1,depthWrite:!1})),this.scale.set(.15,.15*i,1),this.position.set(0,0,-10),t.add(this)}}t.Crosshair=o},46:function(e,t,i){var s=this&&this.__createBinding||(Object.create?function(e,t,i,s){void 0===s&&(s=i);var o=Object.getOwnPropertyDescriptor(t,i);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,s,o)}:function(e,t,i,s){void 0===s&&(s=i),e[s]=t[i]}),o=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||Object.prototype.hasOwnProperty.call(t,i)||s(t,e,i)};Object.defineProperty(t,"__esModule",{value:!0}),o(i(785),t)},104:function(e,t,i){var s=this&&this.__createBinding||(Object.create?function(e,t,i,s){void 0===s&&(s=i);var o=Object.getOwnPropertyDescriptor(t,i);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,s,o)}:function(e,t,i,s){void 0===s&&(s=i),e[s]=t[i]}),o=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||Object.prototype.hasOwnProperty.call(t,i)||s(t,e,i)};Object.defineProperty(t,"__esModule",{value:!0}),o(i(666),t),o(i(23),t)},800:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Player=void 0;const s=i(232),o=i(23),n=i(666);t.Player=class{constructor(e,t,i,n){this.keyState={moveForward:!1,moveBackward:!1,moveLeft:!1,moveRight:!1,mouseLeft:!1,mouseRight:!1,jump:!1},this.raycaster=new s.Raycaster,this.mouseDragOn=!1,this.phi=0,this.phiSpeed_=8,this.theta=0,this.thetaSpeed_=5,this.viewHalfX=0,this.viewHalfY=0,this._onMouseDown=this.onMouseDown.bind(this),this._onMouseUp=this.onMouseUp.bind(this),this._onKeyDown=this.onKeyDown.bind(this),this.onMouseMove=this._onMouseMove.bind(this),this._onKeyUp=this.onKeyUp.bind(this),this.points=0;const a=document.getElementById("counter");if(!a)throw new Error("Counter not found");this.counterDiv=a,this.counterDiv.innerText=`${this.points}`,this.initialPosition=e.position.clone(),this.initialRotation=e.rotation.clone(),this.initialQuaternion=e.quaternion.clone(),this.camera=e,this.scene=t,this.targetInfo=n,this.cameraDirection=new s.Vector3,this.camera.rotation.order="YXZ",this.velocity=new s.Vector3,this.nextVelocity=new s.Vector3,this.nextPosition=new s.Vector3,this.down=new s.Vector3(0,-1,0),this.gravity=28,this.height=100,this.mouseSensitivity=.0012,this.walkSpeed=5,this.airwalkSpeed=.3,this.jumpStrength=16,this.grounded=!1,this.onRope=!1,this.ropeLength=0,this.ropeTarget=new s.Vector3,this.positionOnEndOfRope=new s.Vector3,this.ropePositionDifference=new s.Vector3,this.ropeObject=new o.Rope(t),i.domElement.addEventListener("mousedown",this._onMouseDown),i.domElement.addEventListener("mouseup",this._onMouseUp),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.renderer=i,this.handleResize()}reset(){this.counterDiv.innerText="0",this.points=0,this.scene.children.forEach((e=>{if(!e.userData)return;const t=e.userData;t.tags&&t.tags.includes(n.WorldObjectTags.Platform)&&(t.isCollected=!1)})),this.camera.position.copy(this.initialPosition),this.camera.rotation.copy(this.initialRotation),this.camera.quaternion.copy(this.initialQuaternion),this.velocity.multiplyScalar(0),this.grounded=!1,this.onRope=!1,this.phi=0,this.theta=0,this.keyState={moveForward:!1,moveBackward:!1,moveLeft:!1,moveRight:!1,mouseLeft:!1,mouseRight:!1,jump:!1}}handleResize(){this.viewHalfX=this.renderer.domElement.offsetWidth/2,this.viewHalfY=this.renderer.domElement.offsetHeight/2}onKeyDown(e){switch(e.code){case"ArrowUp":case"KeyW":this.keyState.moveForward=!0;break;case"ArrowLeft":case"KeyA":this.keyState.moveLeft=!0;break;case"ArrowDown":case"KeyS":this.keyState.moveBackward=!0;break;case"ArrowRight":case"KeyD":this.keyState.moveRight=!0;break;case"Space":this.keyState.jump=!0;break;case"KeyR":this.reset()}}onKeyUp(e){switch(e.code){case"ArrowUp":case"KeyW":this.keyState.moveForward=!1;break;case"ArrowLeft":case"KeyA":this.keyState.moveLeft=!1;break;case"ArrowDown":case"KeyS":this.keyState.moveBackward=!1;break;case"ArrowRight":case"KeyD":this.keyState.moveRight=!1;break;case"Space":this.keyState.jump=!1}}onMouseDown(e){switch(e.button){case 0:if(this.keyState.mouseLeft=!0,this.onRope)break;if(this.camera.getWorldDirection(this.cameraDirection),!this.targetInfo.canAttach)break;this.ropeTarget.copy(this.targetInfo.target),this.ropeLength=this.targetInfo.targetDistance,this.onRope=!0,this.ropeObject.set(this.position,this.ropeLength);break;case 2:this.keyState.mouseRight=!0}this.mouseDragOn=!0}onMouseUp(e){switch(e.button){case 0:this.keyState.mouseLeft=!1,this.onRope=!1,this.ropeObject.hide();break;case 2:this.keyState.mouseRight=!1}this.mouseDragOn=!1}get position(){return this.camera.position}update(e){this.velocity.y-=this.gravity*e,this.onRope&&this.swing(),this.move(e),this.checkOnBoundaries(),this.onRope&&this.updateRope()}updateRope(){if(this.onRope){let e=this.position.clone();e.y-=5,this.ropeObject.update(e,this.ropeTarget.clone())}}swing(){if(this.ropeTarget.distanceToSquared(this.position)>this.ropeLength*this.ropeLength){this.positionOnEndOfRope.subVectors(this.position,this.ropeTarget),this.positionOnEndOfRope.setLength(this.ropeLength),this.positionOnEndOfRope.add(this.ropeTarget),this.ropePositionDifference.subVectors(this.position,this.positionOnEndOfRope);let e=Math.abs(this.positionOnEndOfRope.clone().normalize().dot(this.ropePositionDifference.clone().normalize()));this.ropePositionDifference.multiplyScalar(1-.3*e),this.velocity.sub(this.ropePositionDifference),this.position.copy(this.positionOnEndOfRope)}}move(e){let t=this.getKeyInput();this.nextVelocity.copy(this.velocity).add(t),this.nextPosition.copy(this.position).add(this.nextVelocity),this.raycastNextPosition(),this.position.copy(this.nextPosition),this.velocity.copy(this.nextVelocity),!this.onRope&&this.grounded?(this.velocity.x*=.8,this.velocity.y*=.99,this.velocity.z*=.8):(this.velocity.x*=.9995,this.velocity.y*=.9995,this.velocity.z*=.9995),this.keyState.jump&&this.grounded&&(this.grounded=!1,this.velocity.y=this.jumpStrength),this.position.add(this.velocity.clone().multiplyScalar(e))}_onMouseMove(e){const t=e.movementX/window.innerWidth,i=e.movementY/window.innerHeight;this.phi+=-t*this.phiSpeed_,this.theta=s.MathUtils.clamp(this.theta+-i*this.thetaSpeed_,-Math.PI/3,Math.PI/3);const o=new s.Quaternion;o.setFromAxisAngle(new s.Vector3(0,1,0),this.phi);const n=new s.Quaternion;n.setFromAxisAngle(new s.Vector3(1,0,0),this.theta);const a=new s.Quaternion;a.multiply(o),a.multiply(n),this.camera.quaternion.copy(a)}rotateInput(e){let t=new s.Euler(0,this.camera.rotation.y,0,"YXZ");return e.normalize().applyEuler(t)}getKeyInput(){let e=this.getKeyBoardInput();return this.grounded?this.onRope?e.multiplyScalar(.2*this.walkSpeed):e.multiplyScalar(this.walkSpeed):e.multiplyScalar(this.airwalkSpeed),e}getKeyBoardInput(){let e=new s.Vector3;return this.keyState.moveForward?e.z-=1:this.keyState.moveBackward&&(e.z+=1),this.keyState.moveLeft?e.x-=1:this.keyState.moveRight&&(e.x+=1),this.rotateInput(e)}raycastNextPosition(){let e=!1;this.scene.children.forEach((t=>{var i;if(!t.userData)return;const o=t.userData.tags;if(!o||!o.includes(n.WorldObjectTags.Collision))return;if((new s.Box3).setFromObject(t).distanceToPoint(this.nextPosition)<100){let a=this.collide(t,this.nextPosition,this.down);if(a&&a.distance<this.height)this.nextVelocity.y*=-.25,this.nextPosition.copy(a.point),this.nextPosition.add(this.scene.up.clone().multiplyScalar(this.height+.2)),e=!0,!t.userData.isCollected&&o&&o.includes(n.WorldObjectTags.Platform)&&(this.points++,t.userData.isCollected=!0,this.counterDiv.innerText=`${this.points}`);else{let a=this.collide(t,this.nextPosition,this.nextVelocity.clone().normalize());if(a&&a.distance<this.height){const r=(new s.Vector3).subVectors(a.point,this.nextPosition).normalize(),h=null===(i=a.face)||void 0===i?void 0:i.normal;if(h){const e=(new s.Matrix3).getNormalMatrix(a.object.matrixWorld);h.applyMatrix3(e).normalize(),this.nextVelocity.reflect(h).multiplyScalar(.4)}this.nextPosition.copy(a.point),this.nextPosition.add(r.multiplyScalar(-(this.height+.2))),e=!0,!t.userData.isCollected&&o&&o.includes(n.WorldObjectTags.Platform)&&(this.points++,t.userData.isCollected=!0,this.counterDiv.innerText=`${this.points}`)}}}})),this.grounded=e}collide(e,t,i){if(!e)return;this.raycaster.set(t,i);let s=this.raycaster.intersectObject(e,!0);return s.length>0?s[0]:void 0}collideBlocks(e,t){this.raycaster.set(e,t);let i=this.raycaster.intersectObjects(this.scene.children,!0);if(i.length>0)return i[0]}checkOnBoundaries(){this.position.y<-8e3&&!this.onRope&&this.reset()}}},23:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Rope=void 0;const s=i(232),o=i(370);class n extends o.IK{constructor(e){let t=new s.TextureLoader,i=new s.MeshStandardMaterial({map:t.load("images/textures/ropeTexture/ropeDiff.png"),displacementMap:t.load("images/textures/ropeTexture/ropeDisplacement.png"),metalnessMap:t.load("images/textures/ropeTexture/ropeMetalic.png"),normalMap:t.load("images/textures/ropeTexture/ropeNormal.png"),roughnessMap:t.load("images/textures/ropeTexture/ropeRoughness.png"),color:"rgb( 50, 50, 50)",side:s.DoubleSide});i.map&&(i.map.wrapT=i.map.wrapS=s.RepeatWrapping),i.displacementMap&&(i.displacementMap.wrapT=i.displacementMap.wrapS=s.RepeatWrapping),i.displacementScale=.05,i.metalnessMap&&(i.metalnessMap.wrapT=i.metalnessMap.wrapS=s.RepeatWrapping),i.normalMap&&(i.normalMap.wrapT=i.normalMap.wrapS=s.RepeatWrapping),i.roughnessMap&&(i.roughnessMap.wrapT=i.roughnessMap.wrapS=s.RepeatWrapping),super(i,e),this.hide()}update(e,t){this.base.copy(e),this.pointSegments(t),this.translateToBase(),this.show()}set(e,t){this.base.copy(e),this.segments[this.segments.length-1].follow(e),this.setLength(.8*t)}hide(){for(let e=0;e<this.segments.length;e++)this.segments[e].hide()}}t.Rope=n},666:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.WorldObjectTags=void 0,function(e){e[e.Attachable=0]="Attachable",e[e.Collision=1]="Collision",e[e.Platform=2]="Platform"}(t.WorldObjectTags||(t.WorldObjectTags={}))},373:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.LevelGenerator=t.DebugPos=t.SpawnChallenge=t.CornerSwingChallenge=t.NSwingChallenge=t.SimpleSwingChallenge=void 0;const s=i(232),o=i(104),n={},a=(e,t,i)=>{const o=`${e}_${t}`;if(o in n)return n[o];const a=new s.TextureLoader,r=i.capabilities.getMaxAnisotropy(),h=a.load("images/textures/"+e+"metallic.png");h.anisotropy=r,h.wrapS=s.RepeatWrapping,h.wrapT=s.RepeatWrapping,h.repeat.set(t,t);const c=a.load("images/textures/"+e+"albedo.png");c.anisotropy=r,c.wrapS=s.RepeatWrapping,c.wrapT=s.RepeatWrapping,c.repeat.set(t,t),c.encoding=s.sRGBEncoding;const l=a.load("images/textures/"+e+"normal.png");l.anisotropy=r,l.wrapS=s.RepeatWrapping,l.wrapT=s.RepeatWrapping,l.repeat.set(t,t);const p=a.load("images/textures/"+e+"roughness.png");p.anisotropy=r,p.wrapS=s.RepeatWrapping,p.wrapT=s.RepeatWrapping,p.repeat.set(t,t);const d=new s.MeshStandardMaterial({metalnessMap:h,map:c,normalMap:l,roughnessMap:p});return n[o]=d,d};class r{init(e,t,i){this.renderer=t,void 0===r.material&&(r.material=a("vintage-tile1_",.2,t));const n=new s.Mesh(new s.BoxGeometry(2e3,2e3,4e3),r.material);n.position.copy(i),n.position.y-=1e3,n.position.z-=8e3,n.castShadow=!0,n.receiveShadow=!0;const h={tags:[o.WorldObjectTags.Collision,o.WorldObjectTags.Platform]};n.userData=h,e.add(n);const c=i.clone();c.z-=1800,c.y+=2500;const l=new s.Mesh(new s.BoxGeometry(400,400,400),r.material);l.position.copy(c),l.castShadow=!0,l.receiveShadow=!0,l.userData={tags:[o.WorldObjectTags.Attachable,o.WorldObjectTags.Collision]},e.add(l);const p=i.clone();return p.z-=1e4,[p,h]}}t.SimpleSwingChallenge=r;class h{init(e,t,i){const n=Math.floor(5*Math.random())+1;this.renderer=t,void 0===h.material&&(h.material=a("vintage-tile1_",.2,t));const r=new s.Mesh(new s.BoxGeometry(2e3,2e3,4e3),h.material),c=6e3*n;r.position.copy(i),r.position.y-=1e3,r.position.z-=c+2e3,r.castShadow=!0,r.receiveShadow=!0;const l={tags:[o.WorldObjectTags.Collision,o.WorldObjectTags.Platform]};r.userData=l,e.add(r);const p=i.clone();p.y+=2500;for(let t=0;t<Math.max(n-1,1);t++){p.z-=c/(1===n?3:n)-200;const t=new s.Mesh(new s.BoxGeometry(400,400,400),h.material);t.position.copy(p),t.castShadow=!0,t.receiveShadow=!0,t.userData={tags:[o.WorldObjectTags.Attachable,o.WorldObjectTags.Collision]},e.add(t)}const d=i.clone();return d.z-=c+4e3,[d,l]}}t.NSwingChallenge=h;class c{init(e,t,i){this.renderer=t,void 0===c.material&&(c.material=a("vintage-tile1_",.2,t));const n=c.isLeft,r=new s.Mesh(new s.BoxGeometry(4e3,2e3,2e3),c.material),h=6e3;r.position.copy(i),r.position.y-=1e3,r.position.z-=8e3,r.position.x=n?r.position.x-8e3:r.position.x+8e3,r.castShadow=!0,r.receiveShadow=!0;const l={tags:[o.WorldObjectTags.Collision,o.WorldObjectTags.Platform]};r.userData=l,e.add(r);const p=a("concrete3-",4,t),d=new s.Mesh(new s.BoxGeometry(4e3,1e4,100),p),u=i.clone();u.z-=6900,u.x=n?u.x-8e3:u.x+8e3,d.position.copy(u),d.castShadow=!0,d.receiveShadow=!0,d.userData={tags:[o.WorldObjectTags.Collision]},e.add(d);const g=new s.Mesh(new s.BoxGeometry(100,1e4,4e3),p),m=i.clone();m.z-=8e3,m.x=n?m.x-10060:m.x+10060,g.position.copy(m),g.castShadow=!0,g.receiveShadow=!0,g.userData={tags:[o.WorldObjectTags.Collision]},e.add(g);const w=i.clone();w.z-=4800,w.y+=2500;const y=new s.Mesh(new s.BoxGeometry(400,400,400),c.material);y.position.copy(w),y.castShadow=!0,y.receiveShadow=!0,y.userData={tags:[o.WorldObjectTags.Attachable,o.WorldObjectTags.Collision]},e.add(y);const f=new s.Mesh(new s.BoxGeometry(100,1e4,h),p),v=i.clone();v.z-=3e3,v.x=n?v.x-400:v.x+400,f.position.copy(v),f.castShadow=!0,f.receiveShadow=!0,f.userData={tags:[o.WorldObjectTags.Collision]},e.add(f);const b=i.clone();return b.z-=9e3,b.x=n?b.x-8e3:b.x+8e3,c.isLeft=!c.isLeft,[b,l]}}t.CornerSwingChallenge=c,c.isLeft=!0;class l{init(e,t,i){this.renderer=t,void 0===l.material&&(l.material=a("vintage-tile1_",.2,t));const n=new s.Mesh(new s.BoxGeometry(2e3,2e3,4e3),l.material);n.position.copy(i),n.position.y-=1e3,n.castShadow=!0,n.receiveShadow=!0;const r={tags:[o.WorldObjectTags.Collision]};n.userData=r,e.add(n);const h=i.clone();return h.z-=2e3,[h,r]}}t.SpawnChallenge=l;class p{init(e,t,i){const o=new s.Mesh(new s.BoxGeometry(100,100,100),new s.MeshStandardMaterial({color:new s.Color(16711701)}));return o.position.copy(i),o.castShadow=!0,o.receiveShadow=!0,e.add(o),[i.clone(),{}]}}t.DebugPos=p;t.LevelGenerator=class{constructor(){this.spawn=new s.Vector3(0,150,0),this.simpleSwingChallenge=new r,this.cornerSwingChallenge=new c,this.nSwingChallenge=new h,this.allChallenges=[this.simpleSwingChallenge,this.cornerSwingChallenge,this.cornerSwingChallenge,this.nSwingChallenge],this.nextPos=this.spawn.clone(),this.lastPlatformUserData=[]}getSpawnLocation(){return this.spawn}init(e,t){this.renderer=t,this.scene=e;new p;const i=new l;this.nextPos.y=0;const[s,o]=i.init(e,t,this.nextPos);this.nextPos=s,this.render10Challenges(e,t)}update(e,t){-1!==this.lastPlatformUserData.findIndex((e=>e.isCollected))&&(this.lastPlatformUserData.length=0,this.render10Challenges(e,t))}render10Challenges(e,t){new p;for(let i=0;i<10;i++){const s=Math.floor(Math.random()*this.allChallenges.length),[o,n]=this.allChallenges[s].init(e,t,this.nextPos);this.nextPos=o,i>6&&this.lastPlatformUserData.push(n)}}}},387:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.IK=void 0;const s=i(232),o=i(467);t.IK=class{constructor(e,t){this.rnd=.2+999*Math.random(),this.base=new s.Vector3,this.direction=new s.Vector3,this.segmentCount=6,this.length=this.segmentCount,this.segmentLength=this.length/this.segmentCount,this.segments=[],this.initSegments(e,t)}initSegments(e,t){this.segments[0]=new o.Segment(this.base,this.direction,this.segmentLength,e,t);for(let i=1;i<this.segmentCount;i++)this.segments[i]=new o.Segment(this.segments[i-1].pointB,this.direction,this.segmentLength,e,t)}pointSegments(e){this.segments[this.segments.length-1].follow(e);for(let e=this.segments.length-2;e>=0;e--)this.segments[e].follow(this.segments[e+1].pointA)}translateToBase(){this.segments[0].setA(this.base);for(let e=1;e<this.segments.length;e++)this.segments[e].setA(this.segments[e-1].pointB)}setLength(e){this.length=e,this.segmentLength=this.length/this.segmentCount,this.segments.forEach((e=>{e.setLength(this.segmentLength)}))}show(){this.segments.forEach((e=>{e.show()}))}}},370:function(e,t,i){var s=this&&this.__createBinding||(Object.create?function(e,t,i,s){void 0===s&&(s=i);var o=Object.getOwnPropertyDescriptor(t,i);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,s,o)}:function(e,t,i,s){void 0===s&&(s=i),e[s]=t[i]}),o=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||Object.prototype.hasOwnProperty.call(t,i)||s(t,e,i)};Object.defineProperty(t,"__esModule",{value:!0}),o(i(467),t),o(i(387),t)},467:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Segment=void 0;const s=i(232);t.Segment=class{constructor(e,t,i,o,n){var a,r,h,c;this.scene=n,this.length=i,this.direction=t.clone(),this.direction.setLength(this.length),this.target=new s.Vector3,this.pointA=e.clone(),this.pointB=new s.Vector3,this.pointB.copy(this.pointA),this.pointB.add(this.direction),null===(a=o.roughnessMap)||void 0===a||a.repeat.set(2,50*i),null===(r=o.normalMap)||void 0===r||r.repeat.set(2,50*i),null===(h=o.metalnessMap)||void 0===h||h.repeat.set(2,50*i),null===(c=o.map)||void 0===c||c.repeat.set(2,100*i),this.object=new s.Mesh(new s.CylinderBufferGeometry(.1,.1,1,8,16,!0),o),this.object.geometry.translate(0,.5,0),this.object.visible=!0,this.object.frustumCulled=!1,this.object.updateMatrixWorld(),n.add(this.object)}follow(e){this.target.copy(e),this.pointB.copy(this.target),this.direction.copy(this.pointB),this.direction.sub(this.pointA),this.direction.setLength(this.length),this.pointA.subVectors(this.pointB,this.direction)}calculateB(){this.pointB.copy(this.pointA),this.pointB.add(this.direction)}setA(e){this.pointA.copy(e),this.calculateB()}setLength(e){var t,i,s,o,n;this.length=e,this.direction.setLength(this.length),null===(t=this.object.material.roughnessMap)||void 0===t||t.repeat.set(2,.75*e),null===(i=this.object.material.normalMap)||void 0===i||i.repeat.set(2,.75*e),null===(s=this.object.material.metalnessMap)||void 0===s||s.repeat.set(2,.75*e),null===(o=this.object.material.displacementMap)||void 0===o||o.repeat.set(2,.75*e),null===(n=this.object.material.map)||void 0===n||n.repeat.set(2,.75*e)}show(){this.object.scale.y=this.length,this.object.position.copy(this.pointA.clone()),this.object.quaternion.setFromUnitVectors(this.scene.up,this.direction.clone().normalize()),this.object.visible=!0}hide(){this.object.visible=!1,this.object.scale.y=1}}},897:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.TargetInfo=void 0;const s=i(232),o=i(104);t.TargetInfo=class{constructor(){this.canAttach=!1,this.isAttached=!1,this.target=new s.Vector3,this.targetDistance=0}update(e,t){if(this.isAttached)return;let i=!1;const n=new s.Raycaster;n.setFromCamera(new s.Vector3,e);for(const s of t.children){const t=s.userData;if(!(t.tags&&t.tags.includes(o.WorldObjectTags.Attachable)))continue;const a=n.intersectObject(s);if(a.length>0){this.target.copy(a[0].point),this.targetDistance=e.position.distanceTo(this.target),i=!0;break}}this.canAttach=i}}}},i={};function s(e){var o=i[e];if(void 0!==o)return o.exports;var n=i[e]={exports:{}};return t[e].call(n.exports,n,n.exports,s),n.exports}s.m=t,e=[],s.O=function(t,i,o,n){if(!i){var a=1/0;for(l=0;l<e.length;l++){i=e[l][0],o=e[l][1],n=e[l][2];for(var r=!0,h=0;h<i.length;h++)(!1&n||a>=n)&&Object.keys(s.O).every((function(e){return s.O[e](i[h])}))?i.splice(h--,1):(r=!1,n<a&&(a=n));if(r){e.splice(l--,1);var c=o();void 0!==c&&(t=c)}}return t}n=n||0;for(var l=e.length;l>0&&e[l-1][2]>n;l--)e[l]=e[l-1];e[l]=[i,o,n]},s.d=function(e,t){for(var i in t)s.o(t,i)&&!s.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e={179:0};s.O.j=function(t){return 0===e[t]};var t=function(t,i){var o,n,a=i[0],r=i[1],h=i[2],c=0;if(a.some((function(t){return 0!==e[t]}))){for(o in r)s.o(r,o)&&(s.m[o]=r[o]);if(h)var l=h(s)}for(t&&t(i);c<a.length;c++)n=a[c],s.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return s.O(l)},i=self.webpackChunkcity_swing=self.webpackChunkcity_swing||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}(),s.O(void 0,[499],(function(){return s(178)}));var o=s.O(void 0,[499],(function(){return s(941)}));o=s.O(o)}();
let scene, camera, renderer, controls;
let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
  // ===== SAHNE =====
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1026);


  // ===== KAMERA =====
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 1.6, 5);

  // ===== RENDERER =====
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // ===== FPS KONTROL =====
  controls = new THREE.PointerLockControls(camera, document.body);
  document.body.addEventListener("click", () => controls.lock());
  scene.add(controls.getObject());

  // ===== IŞIK =====
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 10, 0);
  scene.add(light);

  // ===== ZEMİN =====
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // ===== 🌌 YILDIZ GÖKYÜZÜ (10 OCAK 00:00) =====
  const starTexture = new THREE.TextureLoader().load("10ocak00.00.png");

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1000, 64, 64),
    new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide
    })
  );
  scene.add(sky);

  // ===== KONTROLLER =====
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onWindowResize);
}

function onKeyDown(event) {
  if (event.code === "KeyW") moveForward = true;
  if (event.code === "KeyS") moveBackward = true;
  if (event.code === "KeyA") moveLeft = true;
  if (event.code === "KeyD") moveRight = true;
}

function onKeyUp(event) {
  if (event.code === "KeyW") moveForward = false;
  if (event.code === "KeyS") moveBackward = false;
  if (event.code === "KeyA") moveLeft = false;
  if (event.code === "KeyD") moveRight = false;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  velocity.x -= velocity.x * 0.1;
  velocity.z -= velocity.z * 0.1;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) velocity.z -= direction.z * 0.4;
  if (moveLeft || moveRight) velocity.x -= direction.x * 0.4;

  controls.moveRight(-velocity.x);
  controls.moveForward(-velocity.z);

  renderer.render(scene, camera);
}

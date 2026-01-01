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
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.PointerLockControls(camera, document.body);

  document.body.addEventListener('click', () => {
    controls.lock();
  });

  scene.add(controls.getObject());

  /* ========== IŞIK ========== */
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 10, 0);
  scene.add(light);

  /* ========== ZEMİN ========== */
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /* =================================================
     🌌 YILDIZ HARİTASI – 10 OCAK 00:00 (BALIKESİR)
     ================================================= */
  const starTexture = new THREE.TextureLoader().load("10ocak00.00.png");

  const starGeometry = new THREE.SphereGeometry(800, 64, 64);
  const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide
  });

  const starSky = new THREE.Mesh(starGeometry, starMaterial);
  scene.add(starSky);
  /* ================================================= */

  /* ========== TUŞLAR ========== */
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  window.addEventListener('resize', onWindowResize);
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
  }
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

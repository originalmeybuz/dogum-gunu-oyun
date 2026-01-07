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
    document.body.addEventListener('click', () => {
  controls.lock();

  const hint = document.getElementById("gameHint");
  if (hint) hint.style.display = "none";
});


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

  // ===== GÖKYÜZÜ =====
const starTexture = new THREE.TextureLoader().load("10ocak00.00.png");

const skyGeometry = new THREE.SphereGeometry(1000, 64, 64);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: starTexture,
  side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);
    // ===== ORION =====
const orionStars = [
  { x: 200, y: 150, z: -800 }, // Betelgeuse
  { x: 260, y: 50,  z: -820 }, // Bellatrix
  { x: 220, y: -50, z: -820 }, // Alnilam
  { x: 200, y: -100,z: -830 }, // Mintaka
  { x: 180, y: -180,z: -840 }, // Saiph
  { x: 240, y: -200,z: -850 }  // Rigel
];

const orionLines = [
  [0,1],
  [1,2],
  [2,3],
  [3,4],
  [4,5]
];

drawConstellation(orionStars, orionLines);


    function drawConstellation(points, lines) {
  // yıldızlar
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  points.forEach(p => {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(3, 8, 8),
      starMaterial
    );
    star.position.set(p.x, p.y, p.z);
    scene.add(star);
  });

  // çizgiler
  lines.forEach(l => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(
        points[l[0]].x,
        points[l[0]].y,
        points[l[0]].z
      ),
      new THREE.Vector3(
        points[l[1]].x,
        points[l[1]].y,
        points[l[1]].z
      )
    ]);

    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  });
}


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

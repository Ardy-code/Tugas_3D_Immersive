// ============================================================
//  LUFFY 3D — Three.js r160, ES Modules
//  Karakter dibentuk dari geometri primitif (Box, Sphere,
//  Cylinder, Torus, Cone) sesuai rubrik tugas mandiri
// ============================================================

// ── 1. IMPORT dari esm.sh CDN (bukan three.min.js) ──────────
import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// ── 2. SETUP DASAR ──────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  100,
);
camera.position.set(0, 3, 9);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("c"),
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true; // aktifkan shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;

// ── 3. ORBIT CONTROLS ───────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // gerakan smooth
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2; // kamera tidak bisa di bawah lantai
controls.minDistance = 3;
controls.maxDistance = 20;

// ── 4. LIGHTING ─────────────────────────────────────────────
// AmbientLight: cahaya dasar, tidak ada arah
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// DirectionalLight: cahaya berarah seperti matahari, bisa cast shadow
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// ── 5. LANTAI ───────────────────────────────────────────────
const lantai = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    roughness: 0.9,
    metalness: 0.1,
  }),
);
lantai.rotation.x = -Math.PI / 2; // putar jadi horizontal
lantai.position.y = -2;
lantai.receiveShadow = true;
scene.add(lantai);

// ── 6. HELPER: buat mesh dengan MeshStandardMaterial ────────
function buatMesh(geometry, color, roughness = 0.7, metalness = 0.1) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ── 7. BANGUN KARAKTER LUFFY ─────────────────────────────────
//
//  Susunan bagian tubuh (semua posisi relatif ke Y=0 di kaki):
//
//   [topi jerami]  ← Torus + Cone
//       [kepala]   ← SphereGeometry
//       [badan]    ← CylinderGeometry
//     [tgn kiri]   ← CylinderGeometry (kecil)
//     [tgn kanan]  ← CylinderGeometry (kecil)
//      [kaki kiri] ← CylinderGeometry
//      [kaki kanan]← CylinderGeometry
//   [buah iblis]   ← SphereGeometry kecil (Gomu Gomu no Mi)
//       [lambang]  ← TorusGeometry (tengkorak stilasi)
//   [musuh]        ← BoxGeometry (untuk variasi)
//
// Semua bagian ditambahkan ke group agar mudah digerakkan

const luffy = new THREE.Group();

// -- KEPALA (SphereGeometry) ----------------------------------
const kepala = buatMesh(
  new THREE.SphereGeometry(0.75, 32, 32),
  0xf5cba7, // warna kulit
  0.6,
  0.0,
);
kepala.position.y = 3.5;
kepala.userData = {
  nama: "Kepala Luffy",
  keter: "SphereGeometry — Monkey D. Luffy\nKapten Bajak Laut Topi Jerami 🏴‍☠️",
};
luffy.add(kepala);

// -- TOPI JERAMI (TorusGeometry) ------------------------------
const topiPinggir = buatMesh(
  new THREE.TorusGeometry(0.9, 0.18, 16, 60),
  0xd4a017, // kuning jerami
  0.9,
  0.0,
);
topiPinggir.position.y = 4.1;
topiPinggir.rotation.x = Math.PI / 2;
topiPinggir.userData = {
  nama: "Topi Jerami",
  keter:
    "TorusGeometry — Topi legendaris\nWarisan dari Shanks si Rambut Merah 🎩",
};
luffy.add(topiPinggir);

const topiAtas = buatMesh(
  new THREE.CylinderGeometry(0.55, 0.9, 0.4, 32),
  0xd4a017,
  0.9,
  0.0,
);
topiAtas.position.y = 4.35;
luffy.add(topiAtas);

// -- PITA MERAH DI TOPI (CylinderGeometry tipis) --------------
const pita = buatMesh(
  new THREE.CylinderGeometry(0.92, 0.92, 0.12, 32),
  0xe74c3c, // merah
  0.5,
  0.1,
);
pita.position.y = 4.1;
pita.userData = {
  nama: "Pita Merah",
  keter: "CylinderGeometry — Pita merah ikon\npada topi jerami Luffy 🔴",
};
luffy.add(pita);

// -- BADAN (CylinderGeometry) ---------------------------------
const badan = buatMesh(
  new THREE.CylinderGeometry(0.6, 0.55, 1.4, 32),
  0xe74c3c, // baju merah
  0.7,
  0.05,
);
badan.position.y = 2.2;
badan.userData = {
  nama: "Badan Luffy",
  keter: "CylinderGeometry — Baju rompi merah\nLuffy setelah time-skip ⚡",
};
luffy.add(badan);

// -- TANGAN KIRI (CylinderGeometry kecil) ---------------------
const tanganKiri = buatMesh(
  new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16),
  0xf5cba7,
  0.6,
  0.0,
);
tanganKiri.position.set(-1.0, 2.3, 0);
tanganKiri.rotation.z = Math.PI / 5; // agak miring
tanganKiri.userData = {
  nama: "Tangan Kiri",
  keter: "CylinderGeometry — Tangan karet\nbisa memanjang tanpa batas! 👊",
};
luffy.add(tanganKiri);

// -- TANGAN KANAN (CylinderGeometry kecil) --------------------
const tanganKanan = buatMesh(
  new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16),
  0xf5cba7,
  0.6,
  0.0,
);
tanganKanan.position.set(1.0, 2.3, 0);
tanganKanan.rotation.z = -Math.PI / 5;
tanganKanan.userData = {
  nama: "Tangan Kanan",
  keter: "CylinderGeometry — Tangan karet\nbisa memanjang tanpa batas! 👊",
};
luffy.add(tanganKanan);

// -- KAKI KIRI (CylinderGeometry) -----------------------------
const kakiKiri = buatMesh(
  new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16),
  0x2c3e50, // celana gelap
  0.8,
  0.0,
);
kakiKiri.position.set(-0.3, 0.9, 0);
kakiKiri.userData = {
  nama: "Kaki Kiri",
  keter: "CylinderGeometry — Celana pendek\nciri khas Luffy di awal cerita 👟",
};
luffy.add(kakiKiri);

// -- KAKI KANAN (CylinderGeometry) ----------------------------
const kakiKanan = buatMesh(
  new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16),
  0x2c3e50,
  0.8,
  0.0,
);
kakiKanan.position.set(0.3, 0.9, 0);
kakiKanan.userData = {
  nama: "Kaki Kanan",
  keter: "CylinderGeometry — Celana pendek\nciri khas Luffy di awal cerita 👟",
};
luffy.add(kakiKanan);

// Tambahkan seluruh group Luffy ke scene
luffy.position.y = -2;
scene.add(luffy);

// ── 8. OBJEK TAMBAHAN (memenuhi variasi geometri) ───────────

// Gomu Gomu no Mi — BoxGeometry (buah iblis)
const buahIblis = buatMesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  0x8e44ad, // ungu
  0.4,
  0.3,
);
buahIblis.position.set(2.5, -1.5, 0);
buahIblis.userData = {
  nama: "Gomu Gomu no Mi",
  keter:
    "BoxGeometry — Buah Iblis milik Luffy\nMemberi kekuatan tubuh karet! 🍇",
};
scene.add(buahIblis);

// Sunny Go — ConeGeometry (mewakili layar kapal)
const layarKapal = buatMesh(
  new THREE.ConeGeometry(0.5, 1.2, 4),
  0xf39c12, // oren keemasan
  0.5,
  0.2,
);
layarKapal.position.set(-2.8, -0.5, 0);
layarKapal.userData = {
  nama: "Layar Thousand Sunny",
  keter: "ConeGeometry — Kapal Bajak Laut\nTopi Jerami, Thousand Sunny ⛵",
};
scene.add(layarKapal);

// Tiang kapal — CylinderGeometry
const tiangKapal = buatMesh(
  new THREE.CylinderGeometry(0.08, 0.08, 2.0, 12),
  0x7f5539, // coklat kayu
  0.9,
  0.0,
);
tiangKapal.position.set(-2.8, -1.0, 0);
scene.add(tiangKapal);

// ── 9. DAFTAR OBJEK YANG BISA DIKLIK (raycasting) ───────────
const objects = [
  kepala,
  topiPinggir,
  pita,
  badan,
  tanganKiri,
  tanganKanan,
  kakiKiri,
  kakiKanan,
  buahIblis,
  layarKapal,
];

// PointLight untuk efek cahaya hover & klik
// intensity 0 dulu, dinyalakan saat hover/klik
const hoverLight = new THREE.PointLight(0xffa500, 0, 4); // oranye saat hover
const clickLight = new THREE.PointLight(0x00ffcc, 0, 4); // cyan saat klik
scene.add(hoverLight);
scene.add(clickLight);

// ── 10. RAYCASTING (hover + klik) ───────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoDiv = document.getElementById("info");
const infoNama = document.getElementById("info-nama");
const infoKeter = document.getElementById("info-keter");

let selected = null;
let hovered = null;

// Hover — cursor pointer + nyalakan hoverLight di posisi objek
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  if (hits.length > 0) {
    document.body.style.cursor = "pointer";
    const obj = hits[0].object;
    // Pindahkan hoverLight ke posisi objek yang dihover
    hoverLight.position.copy(obj.getWorldPosition(new THREE.Vector3()));
    hoverLight.intensity = 2.5; // nyalakan lampu oranye
    hovered = obj;
  } else {
    document.body.style.cursor = "default";
    hoverLight.intensity = 0; // matikan lampu hover
    hovered = null;
  }
});

// Klik — pilih objek, nyalakan clickLight, tampilkan info
window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  // Deselect objek lama
  if (selected) {
    selected.scale.setScalar(1);
    selected = null;
    clickLight.intensity = 0; // matikan lampu klik
    infoDiv.style.display = "none";
  }

  if (hits.length > 0) {
    const obj = hits[0].object;
    if (obj.userData && obj.userData.nama) {
      selected = obj;
      selected.scale.setScalar(1.15);

      // Pindahkan clickLight ke posisi objek yang diklik
      clickLight.position.copy(obj.getWorldPosition(new THREE.Vector3()));
      clickLight.intensity = 3.0; // nyalakan lampu cyan

      // Tampilkan nama & keterangan di #info
      infoNama.textContent = obj.userData.nama;
      infoKeter.textContent = obj.userData.keter;
      infoDiv.style.display = "block";
    }
  }
});

// ── 11. RESIZE HANDLER ──────────────────────────────────────
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix(); // wajib setelah ubah aspect
  renderer.setSize(innerWidth, innerHeight);
});

// ── 12. WEBXR ───────────────────────────────────────────────
const vrBtn = document.getElementById("vrBtn");

async function checkXRSupport() {
  if (!("xr" in navigator)) {
    vrBtn.innerText = "WebXR tidak tersedia";
    vrBtn.disabled = true;
    return;
  }
  const ok = await navigator.xr.isSessionSupported("immersive-vr");
  if (!ok) {
    vrBtn.innerText = "VR tidak didukung";
    vrBtn.disabled = true;
    return;
  }
  vrBtn.innerText = "Masuk VR";
}

vrBtn.addEventListener("click", async () => {
  try {
    const session = await navigator.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor"],
    });
    await renderer.xr.setSession(session);
    vrBtn.innerText = "VR Aktif";
    session.addEventListener("end", () => {
      vrBtn.innerText = "Masuk VR";
    });
  } catch (e) {
    console.error(e);
  }
});

checkXRSupport();

// ── 13. ANIMATION LOOP ──────────────────────────────────────
// Pakai setAnimationLoop, bukan requestAnimationFrame
renderer.setAnimationLoop(() => {
  // Luffy goyang kepala kiri-kanan
  kepala.rotation.y = Math.sin(Date.now() * 0.001) * 0.3;

  // Luffy berputar pelan
  luffy.rotation.y += 0.005;

  // Tangan naik-turun (efek melambai)
  tanganKiri.rotation.z = Math.PI / 5 + Math.sin(Date.now() * 0.002) * 0.3;
  tanganKanan.rotation.z = -Math.PI / 5 - Math.sin(Date.now() * 0.002) * 0.3;

  // Buah iblis berputar
  buahIblis.rotation.y += 0.02;
  buahIblis.rotation.x += 0.01;

  // Layar kapal goyang
  layarKapal.rotation.y += 0.01;

  // Wajib dipanggil karena enableDamping = true
  controls.update();

  renderer.render(scene, camera);
});

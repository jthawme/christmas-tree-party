import * as THREE from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { deg2rad, mapRange } from "./utils";
import AssetManager from "./assets";
import { Mesh } from "three";

const materialDictionary = {};
const meshDictionary = {};

const getMaterial = (key, create) => {
  if (materialDictionary[key]) {
    return materialDictionary[key];
  }

  materialDictionary[key] = create();

  return materialDictionary[key];
};

const getMesh = (key, create) => {
  if (meshDictionary[key]) {
    return meshDictionary[key].clone();
  }

  meshDictionary[key] = create();

  return meshDictionary[key].clone();
};

const getCone = (radius, height, segments = 8) => {
  const geo = new THREE.ConeBufferGeometry(radius, height, segments);
  geo.translate(0, -(height / 2), 0);
  geo.rotateX(deg2rad(180));

  return geo;
};

const getTrunk = (radius, height, segments) => {
  const geo = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    segments,
    segments
  );
  const mat = getMaterial("trunk-mat", () => {
    return new THREE.MeshStandardMaterial({
      color: 0x964b00,
    });
  });

  const mesh = new THREE.Mesh(geo, mat);

  return mesh;
};

export const getTree = (radius = 20, amt = 5) => {
  return getMesh(`tree`, () => {
    const outerGroup = new THREE.Group();

    const cones = [];
    for (let i = 0; i < amt; i++) {
      const size = mapRange(i, 0, amt, radius / 2, radius);
      const cone = getCone(size, size);
      cone.translate(0, mapRange(i, 0, amt, 0, radius * 1.5), 0);

      cones.push(cone);
    }

    const singleGeometry = mergeBufferGeometries(cones);

    const mat = getMaterial("cone-mat", () => {
      return new THREE.MeshStandardMaterial({
        color: 0x388e3c,
      });
    });

    const mesh = new THREE.Mesh(singleGeometry, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var box = new THREE.Box3().setFromObject(mesh);
    const height = box.max.y - box.min.y;
    mesh.position.y -= height;

    mesh.name = "leaves";

    outerGroup.add(mesh);
    outerGroup.receiveShadow = true;
    outerGroup.castShadow = true;

    const trunk = getTrunk(radius * 0.2, radius * 0.5);
    // trunk.position.y = ;
    outerGroup.add(trunk);

    const pivot = new THREE.Object3D();
    pivot.add(outerGroup);

    return pivot;
  });
};

export const getBauble = (radius, color, colorKey) => {
  return getMesh(`bauble-${colorKey}`, () => {
    const geo = new THREE.SphereGeometry(radius, 5, 5);
    const mat = getMaterial(
      `bauble-${colorKey}`,
      () => new THREE.MeshStandardMaterial({ color })
    );

    return new THREE.Mesh(geo, mat);
  });
};

export const getFloor = (size, color) => {
  const geo = new THREE.PlaneBufferGeometry(size, size);
  const mat = getMaterial(
    "floor",
    () => new THREE.MeshStandardMaterial({ color })
  );

  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;

  return mesh;
};

export const getCar = (size = 1) => {
  return AssetManager.loadGLTF(
    `car-${size}`,
    "/models/car/car.gltf",
    (gltf) => {
      gltf.scale.set(size, size, size);
      gltf.castShadow = true;
      gltf.traverse(function (child) {
        child.castShadow = true;
        if (child.material) {
          child.material = getMaterial("basic-red", () => {
            return new THREE.MeshStandardMaterial({
              color: 0x26c6da,
            });
          });
        }
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  );
};

export const getCash = (size = 1) => {
  return AssetManager.loadGLTF(
    `cash-${size}`,
    "/models/cash/cash.gltf",
    (gltf) => {
      gltf.scale.set(size, size, size);
      gltf.castShadow = true;
      gltf.traverse(function (child) {
        child.castShadow = true;
        if (child.material) {
          child.material = getMaterial("basic-gold", () => {
            return new THREE.MeshStandardMaterial({
              color: 0xffd700,
            });
          });
        }
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  );
};

export const getTank = (size = 1) => {
  return AssetManager.loadGLTF(
    `tank-${size}`,
    "/models/tank/scene.gltf",
    (gltf) => {
      gltf.scale.set(size / 60, size / 60, size / 60);
      gltf.castShadow = true;
      gltf.traverse(function (child) {
        child.castShadow = true;
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  );
};

export const getPresent = (size = 1, color = 0xff0000) => {
  return AssetManager.loadGLTF(
    `present-${size}`,
    "/models/present/scene.gltf",
    (gltf) => {
      gltf.scale.set(size / 1, size / 1, size / 1);
      gltf.castShadow = true;
      gltf.traverse(function (child) {
        child.castShadow = true;
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  );
};

export const getGlasses = (size = 1) => {
  return AssetManager.loadGLTF(
    `glasses-${size}`,
    "/models/glasses/scene.gltf",
    (gltf) => {
      gltf.scale.set(size / 8, size / 8, size / 8);
      gltf.castShadow = true;
      gltf.traverse(function (child) {
        child.castShadow = true;
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  );
};

export const getRainbow = (size = 1) => {
  return AssetManager.loadGLTF(
    `rainbow-${size}`,
    "/models/rainbow/scene.gltf",
    (gltf) => {
      gltf.scale.set(size / 0.5, size / 0.5, size / 0.5);
      gltf.castShadow = true;
      gltf.traverse(function (child) {
        child.castShadow = true;
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  );
};

const getBannerLeg = (size = 1, height = 10) => {
  const geo = new THREE.CylinderGeometry(size, size, height, 6);
  const mat = getMaterial("trunk-mat", () => {
    return new THREE.MeshStandardMaterial({
      color: 0x964b00,
    });
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y += height / 2;

  return mesh;
};

const getBannerPaper = (width = 20, height = 5) => {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = width * 10;
  ctx.canvas.height = height * 10;
  const texture = new THREE.CanvasTexture(ctx.canvas);

  const geo = new THREE.BoxGeometry(width, height, 1);
  const mat = getMaterial("banner-paper", () => {
    return new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: texture,
    });
  });

  const mesh = new THREE.Mesh(geo, mat);

  return { mesh, ctx, texture };
};

export const getBanner = (width = 20, height = 20) => {
  const group = new THREE.Group();

  const leg1 = getBannerLeg(1, height);
  const leg2 = getBannerLeg(1, height);
  leg1.position.x -= width / 2;
  leg2.position.x += width / 2;

  const { mesh: paper, ctx, texture } = getBannerPaper(width, height * 0.2);
  paper.position.y = height - height * 0.2 * 0.6;
  paper.name = "paper";

  group.add(leg1);
  group.add(leg2);
  group.add(paper);
  group.castShadow = true;
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return { group, ctx, texture };
};

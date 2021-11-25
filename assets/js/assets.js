import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { timer } from "./utils";

const STORE_STATE = {
  PENDING: "pending",
  STORED: "stored",
};

const assets = {};

class AssetManager {
  static safeguard(key, retry) {
    if (assets[key] && assets[key].state === STORE_STATE.STORED) {
      return Promise.resolve(assets[key].data);
    } else if (assets[key] && assets[key].state === STORE_STATE.PENDING) {
      return timer(50).then(retry);
    }

    return false;
  }

  static loadGLTF(key, url, transform = (mesh) => mesh) {
    const check = AssetManager.safeguard(key, () =>
      AssetManager.loadGLTF(key, url, transform)
    );

    if (check) {
      return check;
    }

    const loader = new GLTFLoader();

    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath("/draco/");
    // loader.setDRACOLoader(dracoLoader);

    AssetManager.store(key, STORE_STATE.PENDING);

    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          transform(gltf.scene);

          AssetManager.store(key, STORE_STATE.STORED, gltf.scene);

          resolve(gltf.scene);
        },
        null,
        (err) => {
          AssetManager.remove(key);
          reject(err);
        }
      );
    });
  }

  static loadTexture(key, url) {
    const check = AssetManager.safeguard(key, () =>
      AssetManager.loadTexture(key, url)
    );

    if (check) {
      return check;
    }

    const loader = new THREE.TextureLoader();

    AssetManager.store(key, STORE_STATE.PENDING);

    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (texture) => {
          AssetManager.store(key, STORE_STATE.STORED, texture);

          resolve(texture);
        },
        null,
        (err) => reject(err)
      );
    });
  }

  static store(key, state, data) {
    assets[key] = {
      state,
      data,
    };
  }

  static remove(key) {
    delete assets[key];
  }
}

export const get = (key) => {
  if (!assets[key] || !assets[key].state === STORE_STATE.PENDING) {
    return null;
  }

  return assets[key].data;
};

export default AssetManager;

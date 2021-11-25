import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import { nanoid } from "nanoid";
import Loop from "raf-loop";
import { deg2rad } from "./utils";

class MainEngine {
  constructor(debug = false, zoom = 1, perspective = true) {
    this.debug = debug;
    this.zoom = zoom;
    this.perspective = perspective;

    this._renderCb = [];
    this.meshes = [];

    // RAF Loop
    this.engine = new Loop(this.update.bind(this));

    if (this.debug) {
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    }
  }

  setup(canvas, initialWidth, initialHeight) {
    // Underlying canvas element
    this.el = canvas;

    if (this.debug) {
      document.body.appendChild(this.stats.dom);
    }

    this.width = initialWidth;
    this.height = initialHeight;

    this._threeSetup();

    this.resize(initialWidth, initialHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    if (this.debug) {
      this._setupControls();
    }
  }

  _threeSetup() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.el,
      alpha: true,
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this._setupCamera();

    if (!this.perspective) {
      this.group.scale.set(4, 4, 4);
    }
  }

  _setupCamera() {
    if (!this.perspective) {
      this.camera = new THREE.OrthographicCamera(
        -(this.width * 0.5),
        this.width * 0.5,
        -(this.height * 0.5),
        this.height * 0.5,
        -1000,
        1000
      );
    } else {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        1,
        1000
      );
    }

    // this.camera.zoom = 1;
    this.camera.zoom = this.zoom;
  }

  _setupControls(autoRotate) {
    if (!this.controls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.autoRotate = autoRotate;
      this.controls.target = new THREE.Vector3(0, 3, 0);
    }
  }

  start() {
    this.engine.start();
  }

  resize(width, height) {
    if (!this.perspective) {
      this.camera.right = width;
      this.camera.bottom = height;
    } else {
      this.camera.aspect = width / height;
    }
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);

    this.width = width;
    this.height = height;

    this.renderer.render(this.scene, this.camera);
  }

  /**
   *
   */
  update() {
    // this._updatePhysics();
    this._render();
  }

  /**
   * Register a function to be ran on the render loop
   *
   * @param {function} cb
   */
  render(cb = () => false) {
    const id = nanoid();

    this._renderCb.push({
      id,
      cb,
    });

    return () => this.removeRender(id);
  }

  removeRender(id) {
    const idx = this._renderCb.findIndex((item) => item.id === id);

    this._renderCb.splice(idx, 1);
  }

  _render() {
    if (this.debug) this.stats.begin();
    this._renderCb.forEach((item) => item.cb());
    this.renderer.render(this.scene, this.camera);
    if (this.debug) this.stats.end();
  }

  move(obj, xPerc, yPerc) {
    obj.position.set(this.width * xPerc, this.height * yPerc, 0);
  }

  addObject(obj) {
    this.group.add(obj);
  }

  removeObject(obj) {
    this.group.remove(obj);
  }

  destroy() {
    this.engine.stop();
    this.renderer.dispose();

    const cleanMaterial = (material) => {
      material.dispose();

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === "object" && "minFilter" in value) {
          value.dispose();
        }
      }
    };

    this.scene.traverse((object) => {
      if (!object.isMesh) return;

      object.geometry.dispose();

      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material);
      }
    });
  }

  scale(num) {
    this.group.scale.set(num, num, num);
  }
}

export { MainEngine };

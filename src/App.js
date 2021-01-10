import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App extends Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initLights();
        this.initObject();
        this.mount.appendChild(this.renderer.domElement);
        this.start();
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    // stop() {
    //     cancelAnimationFrame(this.frameId);
    // }

    animate() {
        // console.log('called');
        this.renderer.render(this.scene, this.camera);
        this.frameId = window.requestAnimationFrame(this.animate);
    };

    // renderer settings
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // initialize camera
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.set(5, 0, 0);

        // this.light = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5);
        // this.light.position.set(-1.25, 1, 1.25);
        // this.scene.add(this.light);
    }

    // initalize orbit control settings
    initControls() {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.enablePan = false;
        this.controls.addEventListener('change', () =>
            this.renderer.render(this.scene, this.camera)
        );
    }

    initLights() {
        var lights = [];
        // main blue lighting
        lights[0] = new THREE.PointLight(0x2987cd, 1);
        lights[0].position.set(1, 1, 2);
        // red lighting
        lights[1] = new THREE.PointLight(0xff0047, 0.75);
        lights[1].position.set(1, 2, -2);
        // sky blue lighting
        lights[2] = new THREE.PointLight(0x34e2eb, 1);
        lights[2].position.set(-1.5, 2, 2);
        // blue blending lighting
        lights[3] = new THREE.PointLight(0xffffff, 1);
        lights[3].position.set(4, 2, 4);
        // x light
        lights[4] = new THREE.PointLight(0x2677a6, 0.5);
        lights[4].position.set(1.5, 0, 0);
        // ambient light
        lights[5] = new THREE.AmbientLight(0xffffff, 0.1);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
        this.scene.add(lights[3]);
        this.scene.add(lights[4]);
        this.scene.add(lights[5]);
    }

    initHalo() {
        let haloGeometry = new THREE.PlaneGeometry(20, 20);
        let haloMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: new THREE.Color('red'),
                },
                color2: {
                    value: new THREE.Color('purple'),
                },
                bboxMin: {
                    value: haloGeometry.boundingBox.min,
                },
                bboxMax: {
                    value: haloGeometry.boundingBox.max,
                },
            },
            vertexShader: `
            
              varying vec2 vUv;
          
              void main() {
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
              }
            `,
            fragmentShader: `
                  
              uniform vec3 color1;
              uniform vec3 color2;
            
              varying vec2 vUv;
              
              void main() {
                
                vec2 uv = vUv * 2. - 1.;
                
                vec2 r=abs(uv.xy);
                float s=max(r.x,r.y);
                
                gl_FragColor = vec4(mix(color1, color2, s), 1.0);
              }
            `,
        });

        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        // halo.scale.multiplyScalar(1.15);
        // halo.rotateX(Math.PI * 0.03);
        // halo.rotateY(Math.PI * 0.03);
        halo.position.set(-5, 0, 0);
        this.scene.add(halo);
    }

    // build three.js object
    initObject() {
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4842ab,
            specular: 0x050505,
            shininess: 10,
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, 0);
        this.scene.add(sphere);

        var axes = new THREE.AxisHelper(10);
        this.scene.add(axes);
    }

    render() {
        return (
            <div
                ref={(mount) => {
                    this.mount = mount;
                }}></div>
        );
    }
}

export default App;

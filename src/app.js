import * as THREE from 'three'
import { addPass, useCamera, useGui, useRenderSize, useScene, useTick } from './render/init.js'
// import postprocessing passes
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import vertexPars from './shaders/vertex_pars.glsl'
import vertexMain from './shaders/vertex_main.glsl'

import fragmentPars from './shaders/fragment_pars.glsl'
import fragmentMain from './shaders/fragment_main.glsl'


const startApp = () => {
  const scene = useScene()
  const camera = useCamera()
  const gui = useGui()
  const { width, height } = useRenderSize()

  // settings
  const MOTION_BLUR_AMOUNT = 0.725

  // lighting
  const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
  dirLight.position.set(2, 2, 2)

  const ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
  scene.add(dirLight, ambientLight)











  // meshes
  const geometry = new THREE.IcosahedronGeometry(1, 300)
  const material = new THREE.MeshStandardMaterial({
    onBeforeCompile: (shader) => {
      // storing a reference to a shader object
      material.userData.shader = shader;

      // uniforms
      shader.uniforms['uTime'] = { value: 0 }

      const parsVertexString = `#include <displacementmap_pars_vertex>`
      shader.vertexShader = shader.vertexShader.replace(parsVertexString,
        parsVertexString + vertexPars)

      const mainVertexString = `#include <displacementmap_vertex>`
      shader.vertexShader = shader.vertexShader.replace(mainVertexString,
        mainVertexString + vertexMain)

      const mainFragmentString = `#include <normal_fragment_maps>`
      shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString,
        mainFragmentString + fragmentMain)

      const parsFragmentString = `#include <bumpmap_pars_fragment>`
      shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString,
        parsFragmentString + fragmentPars)
    },
  })


  const ico = new THREE.Mesh(geometry, material)
  scene.add(ico)










  // GUI
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'z', 0, 10)
  cameraFolder.open()

  //postprocessing
  addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.7, 0.4, 0.4))

  useTick(({ timestamp, timeDiff }) => {
    const time = timestamp / 10000;

    material.userData.shader.uniforms['uTime'].value = time;
  })
}

export default startApp

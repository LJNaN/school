import { API } from './API.js'
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'
import router from '@/router/index'

let container

export const sceneOnLoad = ({ domElement, callback }) => {
  container = new Bol3D.Container({
    publicPath: STATE.PUBLIC_PATH,
    container: domElement,
    viewState: 'orbit',
    bloomEnabled: false,
    cameras: {
      orbitCamera: {
        position: [STATE.initialState.position.x, STATE.initialState.position.y, STATE.initialState.position.z],
        near: 1,
        far: 100000,
        fov: 45
      }
    },
    renderer: {
      alpha: true, // 开启/关闭背景透明（默认为false）
      logarithmicDepthBuffer: true, // 解决z精度造成的重叠闪面（默认true）
      antialias: true, // 抗锯齿，默认开启
      precision: 'highp', // shader浮点精度，默认highp
    },
    controls: {
      orbitControls: {
        autoRotate: false,
        autoRotateSpeed: 1,
        target: [STATE.initialState.target.x, STATE.initialState.target.y, STATE.initialState.target.z],
        // minDistance: 0,
        // maxDistance: 2500,
        maxPolarAngle: Math.PI,
        minPolarAngle: -Math.PI,
        enableDamping: true,
        dampingFactor: 0.05,
      }
    },
    lights: {
      directionLights: [],
      ambientLight: {
        color: '#ffffff',
        intensity: 2.5
      }
    },
    filterEnabled: true, // 默认为关闭，关闭后filter pass 不生效
    filter: {
      hue: 0,  // 色调
      saturation: 1, // 饱和度
      vibrance: 0, // 自然饱和度
      brightness: 0, // 亮度
      contrast: 1 // 对比度
    },
    background: {
      type: 'panorama',
      value: ['/img/skybox2.jpg'],
      options: {
        scale: 1,
        rotation: [0, Math.PI / 2, 0],
        fog: false, // 天空盒受雾影响 默认值为false
      }
    },
    modelUrls: [
      // '/model/xxdx-v1.glb',
      // '/model/xxfc-v2.glb',
      // '/model/xxfz-v3.glb',
      '/model/cj-kj.glb',
      '/model/classroom/309.glb',
      // '/model/classroom/310.glb',
      '/model/classroom/311.glb',
      // '/model/classroom/312.glb',
      // '/model/classroom/316.glb',
      // '/model/classroom/317.glb',
      // '/model/classroom/318.glb',
      // '/model/classroom/319.glb'
    ],
    // hdrUrls: ['/hdr/HDR.hdr'],
    enableShadow: true,
    antiShake: false,
    // fog: {
    //   color: '#010108',
    //   intensity: 0.00272
    // },
    toneMapping: {
      toneMappingExposure: 0.596
    },
    outlineEnabled: true,
    outline: {
      edgeStrength: 10,
      edgeGlow: 0,
      edgeThickness: 1,
      pulsePeriod: 0,
      visibleEdgeColor: '#1a67d3',
      hiddenEdgeColor: '#190a05'
    },
    dofEnabled: false,
    msaa: {
      supersampling: false
    },
    gammaEnabled: true,
    stats: true,
    loadingBar: {
      show: true,
      type: 10
    },

    onProgress: (model) => {

      if (['309', '310', '311', '312', '316', '317', '318', '319'].includes(model.name)) {
        STATE.sceneList[model.name] = model
        model.scale.set(40, 40, 40)
        model.visible = false
      }

      if (model.name === 'cj-kj') {
        model.traverse(child => {
          if (child.isMesh) {
            child.material.transparent = true
          }

          if (child.name === 'zhizaojituan_201') {
            child.name = 'peilou'
            API.getWorldState(child)
            STATE.sceneList.peilou.add(child.clone())
            container.attach(STATE.sceneList.peilou)
            child.visible = false

          } else if (child.name === 'Plane001') {
            child.name = 'floor'
            API.getWorldState(child)
            STATE.sceneList.floor = child.clone()
            container.attach(STATE.sceneList.floor)
            child.visible = false

          } else if (child.name === 'dx10') {
            child.name = 'road'
            API.getWorldState(child)
            STATE.sceneList.road = child.clone()
            container.attach(STATE.sceneList.road)
            child.visible = false

          } else {
            if (child.isMesh) {
              let isFind = false

              for (let i = 0; i < STATE.floorList.length; i++) {
                if (STATE.floorList[i].model.includes(child.name)) {
                  child.userData.floor = STATE.floorList[i].floor
                  child.userData.type = '主楼'
                  API.getWorldState(child)
                  STATE.sceneList.mainBuilding.add(child.clone())
                  child.visible = false
                  isFind = true
                  break
                }
              }

              if (!isFind) {
                API.getWorldState(child)
                STATE.sceneList.school.add(child.clone())
                child.visible = false
              }
            }
          }
        })
        container.attach(STATE.sceneList.mainBuilding)
        container.attach(STATE.sceneList.school)

        STATE.sceneList.mainBuilding.children.forEach(e => {
          STATE.outLineObjects.push(e)
          STATE.outClickObjects.push(e)
        })
      }
    },

    onLoad: (evt) => {
      router.push("/")

      CACHE.container = evt
      window.container = evt
      CACHE.container.outlineObjects = STATE.outLineObjects
      CACHE.container.clickObjects = STATE.outClickObjects
      CACHE.container.loadingBar.style.visibility = 'hidden'


      // API.loadGUI()
      // API.initFloor()
      // API.initShaderBox.initShaderBoxFunc()


      API.render()
      API.dbRightClick()
      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.ondbclick = (e) => {

    if (e.objects.length) {
      const firstObject = e.objects[0].object

      // 在外场景点到主楼
      if (firstObject.userData.type === '主楼' && STATE.currentScene === 'out') {
        STATE.currentScene = 'mainBuilding'
        API.initMainBuilding()

      // 在主楼点到具体单楼层
      } else if (firstObject.userData.type === '主楼' && STATE.currentScene === 'mainBuilding') {
        STATE.currentScene = firstObject.userData.floor
        API.initInnerFloor(firstObject.userData.floor)
      }
    }
  }

  events.onhover = (e) => { }
}

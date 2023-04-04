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
        maxDistance: 1000,
        maxPolarAngle: 90 * Math.PI / 180,
        minPolarAngle: 0  * Math.PI / 180,
        enableDamping: true,
        dampingFactor: 0.5,
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
      '/model/xxshu.glb',
      '/model/xxfc.glb',
      '/model/xxdx.glb',
      '/model/xxfz.glb',
      '/model/xxgd.glb',
      '/model/xxxt.glb',
      // '/model/cj-kj.glb',
      '/model/classroom/309.glb',
      '/model/classroom/310.glb',
      // '/model/classroom/311.glb',
      // '/model/classroom/312.glb',
      // '/model/classroom/316.glb',
      // '/model/classroom/317.glb',
      // '/model/classroom/318.glb',
      // '/model/classroom/319.glb'
    ],
    bloomEnabled: true, // 需要开启，默认为false
    bloom: {
      bloomStrength: 1.5, // 强度
      threshold: 0.1, // 阈值
      bloomRadius: 0.1, // 半径
    },
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

      // 教室
      if (['309', '310', '311', '312', '316', '317', '318', '319'].includes(model.name)) {
        STATE.sceneList[model.name] = model
        model.scale.set(40, 40, 40)
        model.visible = false
      }

      if (model.name === 'xxshu') { // 树
        model.traverse(child => {
          if (child.isMesh) {
            const worldState = API.getWorldState(child)
            child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
            child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
            child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)

            // STATE.sceneList.tree.add(child.clone())

            // 线框
            const edges = new Bol3D.EdgesGeometry(child.geometry.clone());
            const line = new Bol3D.LineSegments(edges, new Bol3D.LineBasicMaterial({ color: 0xff8502 }));
            line.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
            line.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
            line.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)
            line.material.transparent = true
            line.material.opacity = 0.05
            STATE.sceneList.tree.add(line)
            STATE.bloomList.push(line)


            child.visible = false
          }
        })
        container.attach(STATE.sceneList.tree)

      } else if (model.name === 'xxdx') { // 地面 配楼
        model.traverse(child => {
          if (child.isMesh) {
            if (child.name === 'Plane001') {
              // 地面
              const worldState = API.getWorldState(child)
              child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
              child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
              child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)

              STATE.sceneList.floor = child.clone()

              child.visible = false

            } else {
              // 配楼
              const worldState = API.getWorldState(child)
              child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
              child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
              child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)

              STATE.sceneList.peilou.add(child.clone())
              child.material.transparent = true
              child.visible = false


            }
          }
        })


        // 主教学楼
      } else if (model.name === 'xxfc') { // 交互主楼
        model.traverse(child => {
          if (child.isMesh) {
            for (let i = 0; i < STATE.floorList.length; i++) {
              if (STATE.floorList[i].model.includes(child.name)) {
                child.userData.floor = STATE.floorList[i].floor
                child.userData.type = '主楼'
                const worldState = API.getWorldState(child)
                child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
                child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
                child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)

                const meshClone = child.clone()
                if (meshClone.name.includes('boli')) {
                  meshClone.material.color = new Bol3D.Color(0.2, 0.2, 0.2)
                  STATE.bloomList.push(meshClone)

                }

                STATE.sceneList.mainBuilding.add(meshClone)
                child.visible = false
                break
              }
            }
          }
        })

        STATE.sceneList.mainBuilding.children.forEach(e => {
          // STATE.outLineObjects.push(e)
          STATE.outClickObjects.push(e)
        })
        container.attach(STATE.sceneList.mainBuilding)

      } else if (model.name === 'xxfz') { // 路 多余的路 学校主体
        model.traverse(child => {
          if (child.isMesh) {
            if (child.name === 'lu') {

              // 路
              const worldState = API.getWorldState(child)
              child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
              child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
              child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)

              STATE.sceneList.road = child.clone()
              child.visible = false

              // 多余的路
            } else if (child.name === 'dx10') {
              child.visible = false

              // 主体橙色光带
            } else if (child.name === 'dx02') {
              const meshClone = child.clone()
              STATE.bloomList.push(meshClone)
              STATE.sceneList.school.add(meshClone)
              child.visible = false

            } else { // 学校主体
              const worldState = API.getWorldState(child)
              child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
              child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
              child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)

              const childClone = child.clone()

              // 玻璃
              const boliList = ['jz28', 'jz37', '对象031', '对象039', '对象047', 'jz291', 'jz304', 'jz82', 'jz77', 'jz264', 'jz65', 'jz57', 'jz131', 'jz57', 'jz139', 'jz258', 'jz231', 'jz245', 'jz212', 'jz226', 'jz193', 'jz207', 'jz159', 'jz173', 'jz149', 'jz117', 'jz103', 'jz16']
              if (boliList.includes(childClone.name)) {
                childClone.material.aoMap = null
                childClone.material.color = new Bol3D.Color(0.8, 0.8, 0.8)
                STATE.bloomList.push(childClone)
              }
              childClone.material.transparent = false
              STATE.sceneList.school.add(childClone)
              child.visible = false
            }
          }
        })
        container.attach(STATE.sceneList.school)
      } else if (model.name === 'xxgd') { // 管道
        const tube = new Bol3D.Group()
        model.traverse(child => {
          if (child.isMesh) {
            const childClone = child.clone()
            childClone.position.y = -20
            if (['Wcj-gd-00', 'Wcj-gd-01', 'Wcj-gd-04'].includes(child.name)) {
              childClone.material.color.set(0x231207)
            } else {
              childClone.material.color.set(0x141414)
            }
            STATE.bloomList.push(childClone)
            tube.add(childClone)
            child.visible = false
          }
        })
        STATE.sceneList.tube = tube
        tube.renderOrder = -1
        tube.name = 'tube'
      } else if (model.name === 'xxxt') { // 院墙
        model.traverse(child => {
          if (child.isMesh) {
            const worldState = API.getWorldState(child)
            child.position.set(worldState.position.x, worldState.position.y, worldState.position.z)
            child.scale.set(worldState.scale.x, worldState.scale.y, worldState.scale.z)
            child.quaternion.set(worldState.quaternion.x, worldState.quaternion.y, worldState.quaternion.z, worldState.quaternion.w)
            child.scale.y = child.scale.y * 8
            STATE.sceneList.school.add(child)
            child.name = 'weiqiang'
            API.shader.school.initShader(child)

          }
        })
      }
    },

    onLoad: (evt) => {
      container.attach(STATE.sceneList.floor)
      container.attach(STATE.sceneList.road)
      container.attach(STATE.sceneList.peilou)
      container.attach(STATE.sceneList.peilouLine)
      container.attach(STATE.sceneList.tube)

      evt.sceneList = STATE.sceneList
      CACHE.container = evt
      window.container = evt
      CACHE.container.outlineObjects = STATE.outLineObjects
      CACHE.container.clickObjects = STATE.outClickObjects
      CACHE.container.loadingBar.style.visibility = 'hidden'


      // 学校主体边框 + 辉光
      const schoolEdge = API.edge(STATE.sceneList.school)
      schoolEdge.visible = false
      CACHE.container.attach(schoolEdge)
      STATE.sceneList.schoolEdge = schoolEdge
      schoolEdge.children.forEach(e => {
        STATE.bloomList.push(e)
      })
      
      // 主楼主体边框 + 辉光
      const mainBuildingEdge = API.edge(STATE.sceneList.mainBuilding)
      mainBuildingEdge.visible = false
      CACHE.container.attach(mainBuildingEdge)
      STATE.sceneList.mainBuildingEdge = mainBuildingEdge
      mainBuildingEdge.children.forEach(e => {
        if(e.name != 'weiqiang')
        STATE.bloomList.push(e)
      })


      // icon
      API.initIcon()


      // API.loadGUI()
      // API.initFloor()

      API.shader.peilou.initShader()
      API.flyLines.initFlyLines()
      // API.tubes.showTube(true)




      STATE.bloomList.forEach(e => {
        CACHE.container.addBloom(e)
      })

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

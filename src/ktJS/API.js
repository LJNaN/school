import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'
import router from '@/router/index'
import Shader from './shader'
import { BufferGeometryUtils } from '../assets/BufferGeometryUtils'

/**
 * 相机动画（传指定state）
 * @param {cameraState, callback, delayTime, duration}  
 */
function cameraAnimation({ cameraState, callback, delayTime = 0, duration = 800 }) {
  const targetPos = new Bol3D.Vector3()
  const pos = new Bol3D.Vector3()
  targetPos.set(cameraState.target.x, cameraState.target.y, cameraState.target.z)
  pos.set(cameraState.position.x, cameraState.position.y, cameraState.position.z)

  if (targetPos.distanceTo(CACHE.container.orbitControls.target) < 0.1 && pos.distanceTo(CACHE.container.orbitControls.object.position) < 0.1) {
    callback && callback()
    return
  }

  if (STATE.isAnimating) return
  STATE.isAnimating = true

  CACHE.container.orbitControls.enabled = false

  let count = 0

  const t1 = new Bol3D.TWEEN.Tween(CACHE.container.orbitCamera.position)
    .to(
      {
        x: cameraState.position.x,
        y: cameraState.position.y,
        z: cameraState.position.z
      },
      duration
    )
    .onUpdate(() => { })
    .onComplete(() => {
      count++

      if (count == 2) {
        CACHE.container.orbitControls.enabled = true
        STATE.isAnimating = false
        callback && callback()
      }
    })

  const t2 = new Bol3D.TWEEN.Tween(CACHE.container.orbitControls.target)
    .to(
      {
        x: cameraState.target.x,
        y: cameraState.target.y,
        z: cameraState.target.z
      },
      duration
    )
    .onUpdate(() => { })
    .onComplete(() => {
      count++
      if (count == 2) {
        CACHE.container.orbitControls.enabled = true
        STATE.isAnimating = false
        callback && callback()
      }
    })

  t1.delay(delayTime).start()
  t2.delay(delayTime).start()
}

/**
 * 加载GUI
 */
function loadGUI() {
  // gui
  const gui = new dat.GUI()
  // default opts
  const deafultsScene = { distance: 8000, }
  // scenes
  const scenesFolder = gui.addFolder('场景')
  // toneMapping
  scenesFolder.add(CACHE.container.renderer, 'toneMappingExposure', 0, 10).step(0.001).name('exposure')
  scenesFolder.add(CACHE.container.ambientLight, 'intensity').step(0.1).min(0).max(10).name('环境光强度')
  scenesFolder.add(CACHE.container.gammaPass, 'enabled').name('gamma校正')

  const tubeColor = {
    color1: `#${STATE.sceneList.tube.children[0].material.color.getHexString()}`,
    color2: `#${STATE.sceneList.tube.children[16].material.color.getHexString()}`
  }
  scenesFolder
    .addColor(tubeColor, 'color1')
    .onChange((val) => {
      for (let i = 0; i < 3; i++) {
        STATE.sceneList.tube.children[i].material.color.set(val)
      }
    })
    .name('管线颜色')

  scenesFolder
    .addColor(tubeColor, 'color2')
    .onChange((val) => {
      for (let i = 3; i < 34; i++) {
        STATE.sceneList.tube.children[i].material.color.set(val)
      }
    })
    .name('管线颜色')
  // scenesFolder
  //   .addColor(CACHE.container.attrs.lights.directionLights[0], 'color')
  //   .onChange((val) => {
  //     CACHE.container.directionLights[0].color.set(val)
  //   })
  //   .name('平行光颜色')
  // scenesFolder.add(CACHE.container.directionLights[0].position, 'x')
  // scenesFolder.add(CACHE.container.directionLights[0].position, 'y')
  // scenesFolder.add(CACHE.container.directionLights[0].position, 'z')
  // scenesFolder.add(deafultsScene, 'distance').onChange((val) => {
  //   CACHE.container.directionLights[0].shadow.camera.left = -val
  //   CACHE.container.directionLights[0].shadow.camera.right = val
  //   CACHE.container.directionLights[0].shadow.camera.top = val
  //   CACHE.container.directionLights[0].shadow.camera.bottom = -val
  //   CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
  //   CACHE.container.directionLights[0].shadow.needsUpdate = true
  // })
  // scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'far').onChange(() => {
  //   CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
  //   CACHE.container.directionLights[0].shadow.needsUpdate = true
  // })
  // scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'near').onChange(() => {
  //   CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
  //   CACHE.container.directionLights[0].shadow.needsUpdate = true
  // })
  // scenesFolder
  //   .add(CACHE.container.directionLights[0].shadow, 'bias')
  //   .step(0.0001)
  //   .onChange(() => {
  //     CACHE.container.directionLights[0].shadow.needsUpdate = true
  //   })
  // scenesFolder.add(CACHE.container.directionLights[0], 'intensity').step(0.1).min(0).max(10)

  // filter pass
  const filterFolder = gui.addFolder('滤镜')
  const defaultsFilter = {
    hue: 0,
    saturation: 1,
    vibrance: 0,
    brightness: 0,
    contrast: 1
  }
  filterFolder.add(CACHE.container.filterPass, 'enabled')
  filterFolder
    .add(defaultsFilter, 'hue')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.hue.value = val
    })
  filterFolder
    .add(defaultsFilter, 'saturation')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.saturation.value = val
    })
  filterFolder
    .add(defaultsFilter, 'vibrance')
    .min(0)
    .max(10)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.vibrance.value = val
    })

  filterFolder
    .add(defaultsFilter, 'brightness')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.brightness.value = val
    })
  filterFolder
    .add(defaultsFilter, 'contrast')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.contrast.value = val
    })


}

/**
 * 加载地面
 */
function initFloor() {
  const floorGeo = new Bol3D.PlaneGeometry(20000, 20000)
  const floorM = CACHE.container.sceneList.floor.material.clone()
  const floor = new Bol3D.Mesh(floorGeo, floorM);
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1
  CACHE.container.attach(floor)
  CACHE.container.sceneList.plane = floor
}

/**
 * shader
 */
const shader = Shader


/**
 * 进入主楼
 * @param {string} backFloor 是否是右键双击返回的,如果有值是从哪个楼返回的
 */
function initMainBuilding(backFloor = '') {
  let callback = null

  if (!backFloor) {
    callback = () => {
      STATE.sceneList.mainBuilding.traverse(child => {
        if (child.isMesh) {
          if (STATE.floorList[1].model.includes(child.name)) {
            new Bol3D.TWEEN.Tween(child.position)
              .to({
                y: child.position.y + 3
              }, 500)
              .start()
          } else if (STATE.floorList[2].model.includes(child.name)) {
            new Bol3D.TWEEN.Tween(child.position)
              .to({
                y: child.position.y + 6
              }, 500)
              .start()
          } else if (STATE.floorList[3].model.includes(child.name)) {
            new Bol3D.TWEEN.Tween(child.position)
              .to({
                y: child.position.y + 9
              }, 500)
              .start()
          } else if (STATE.floorList[4].model.includes(child.name)) {
            new Bol3D.TWEEN.Tween(child.position)
              .to({
                y: child.position.y + 12
              }, 500)
              .start()
          }
        }
      })
    }
  } else {
    callback = () => {
      STATE.sceneList.mainBuilding.traverse(child => {
        if (child.isMesh) {
          child.visible = true
          const floor = STATE.floorList.find(e => e.floor === backFloor)
          if (floor && !floor.model.includes(child.name)) {
            child.material.opacity = 0
            child.material.transparent = true
          }

          new Bol3D.TWEEN.Tween(child.material)
            .to({
              opacity: 1
            }, 500)
            .start()
            .onComplete(() => {
              child.material.transparent = false
            })
        }
      })
      // outscene1.traverse(child => {
      //   if (child.isMesh) {
      //     child.material.opacity = 0
      //     new Bol3D.TWEEN.Tween(child.material)
      //       .to({
      //         opacity: 1
      //       }, 500)
      //       .start()
      //   }
      // })
      // outscene2.traverse(child => {
      //   if (child.isMesh) {
      //     child.material.opacity = 0
      //     new Bol3D.TWEEN.Tween(child.material)
      //       .to({
      //         opacity: 1
      //       }, 500)
      //       .start()
      //   }
      // })
    }
  }

  const cameraState = {
    position: { x: -55.08483765224679, y: 32.670608008474204, z: -3.13171 },
    target: { x: -55.265641587822714, y: 20, z: -39.6371590 }
  }
  cameraAnimation({ cameraState, callback })
}

/**
 * 进入单楼
 * @param {string} floor 楼层名字 3f 4f...
 * @param {number} duration 动画时间
 */
function initInnerFloor(floor, duration = 800) {
  const singleFloor = STATE.floorList.find(e => e.floor === floor)
  STATE.sceneList.mainBuilding.traverse(child => {
    if (child.isMesh && !singleFloor.model.includes(child.name)) {
      child.visible = false
    } else {
      child.visible = true
    }
  })


  const cameraState = {
    position: { x: -56.14742099558634, y: 40.95011072324698, z: -33.5855 },
    target: { x: -56.12479392225676, y: 20, z: -48.3605 }
  }
  cameraAnimation({ cameraState, duration })

  // 初始化时，也有可能是从教室返回到这里，所以要对一些场景的属性做初始化
  STATE.sceneList.peilou.visible = true
  STATE.sceneList.peilouLine.visible = true
  STATE.sceneList.school.visible = true
  STATE.sceneList.road.visible = true
  STATE.sceneList.tree.visible = true
  STATE.sceneList.flyLine.visible = true
  STATE.sceneList.carLine.visible = true

  const classRoomList = ['309', '310', '311', '312', '316', '317', '318', '319']
  classRoomList.forEach(e => {
    const classRoom = STATE.sceneList[e]
    if (classRoom) classRoom.visible = false
  })

  removeAllPopup()

  // 点击的是3楼
  if (singleFloor.floor === '3f') {
    // 创建popup
    for (let i = 0; i < STATE.classRoomPopup.length; i++) {
      const popup = new Bol3D.POI.Popup({
        position: STATE.classRoomPopup[i].position,
        value: `<p style="margin:0;color: #ffffff;line-height:30px;text-align:center">${STATE.classRoomPopup[i].name}</p>`,
        className: '',
        style: `background: rgba(1, 19, 67, 0.8);` + `border: 2px solid #00a1ff;` + `border-radius: 8px;` + `width: 80px;height: 30px;` + `pointer-events: all;` + `cursor: pointer`,
        closeVisible: 'hidden'
      })
      // 双击进入教室
      popup.element.addEventListener("dblclick", () => {
        enterClassRoom(STATE.classRoomPopup[i].name)
        STATE.currentScene = STATE.classRoomPopup[i].name
      })

      container.attach(popup)
      STATE.popupList.push(popup)
    }
  }

}

/** 
* 清除所有classRoomPopup弹窗
* @param {string} name 弹窗名
*/
function removeAllPopup(name) {
  STATE.popupList.forEach(e => {
    if (name) {
      if (e.name === name) {
        CACHE.container.remove(e)
      }
    } else {
      CACHE.container.remove(e)
    }
  })
}

/** 
* 双击进入教室
* @param {string} classRoomName 教室名
*/
function enterClassRoom(classRoomName) {
  new Bol3D.TWEEN.Tween(CACHE.container.ambientLight)
    .to({
      intensity: 5
    }, 500)
    .start()

  removeAllPopup()
  STATE.sceneList.mainBuilding.visible = false

  const classRoomModel = STATE.sceneList[classRoomName]

  classRoomModel.visible = true

  const enterState = STATE.classRoomInfo.find(e => e.name == classRoomName).model.enterState
  CACHE.container.orbitCamera.position.set(enterState.position.x, enterState.position.y, enterState.position.z)
  CACHE.container.orbitControls.target.set(enterState.target.x, enterState.target.y, enterState.target.z)


  classRoom.hiddenRoof(classRoomName)

  STATE.sceneList.peilou.visible = false
  STATE.sceneList.peilouLine.visible = false
  STATE.sceneList.school.visible = false
  STATE.sceneList.road.visible = false
  STATE.sceneList.tree.visible = false
  STATE.sceneList.flyLine.visible = false
  STATE.sceneList.carLine.visible = false

  router.push("/SmartEducationInner?id=" + classRoomName)
}

/**
 * 返回至初始界面
 */
function backToOut() {
  icon.show()
  STATE.outLineObjects = []
  STATE.sceneList.mainBuilding.traverse(child => {
    if (child.isMesh) {
      // STATE.outLineObjects.push(child)
      if (STATE.floorList[1].model.includes(child.name)) {
        new Bol3D.TWEEN.Tween(child.position)
          .to({
            y: child.position.y - 3
          }, 500)
          .start()
      } else if (STATE.floorList[2].model.includes(child.name)) {
        new Bol3D.TWEEN.Tween(child.position)
          .to({
            y: child.position.y - 6
          }, 500)
          .start()
      } else if (STATE.floorList[3].model.includes(child.name)) {
        new Bol3D.TWEEN.Tween(child.position)
          .to({
            y: child.position.y - 9
          }, 500)
          .start()
      } else if (STATE.floorList[4].model.includes(child.name)) {
        new Bol3D.TWEEN.Tween(child.position)
          .to({
            y: child.position.y - 12
          }, 500)
          .start()
      }
    }
  })

  // CACHE.container.outlineObjects = STATE.outLineObjects
  const cameraState = STATE.initialState
  cameraAnimation({ cameraState })
}

/**
 * 绘制飞线
 * @param {*} path 三维点路径
 * @param {*} imgUrl 贴图路径
 * @param {*} speed 速度
 * @param {*} cut 分段数
 * @param {*} radius 管道半径
 * @param {*} repeat 重复次数
 */
function createFlyLines({ path = [], imgUrl = '', flowDirection = 'x', cut = 200, speed = 0.01, radius = 1, repeat = 1, type = 'fly' }) {
  const textureTest = new Bol3D.TextureLoader().load(imgUrl); // 流动材质
  const curveArr = []
  for (let i = 0, len = path.length; i < len; i += 3) {
    const temp = new Bol3D.Vector3(path[i], path[i + 1], path[i + 2])
    curveArr.push(temp)
  }

  const curve = new Bol3D.CatmullRomCurve3(curveArr, false, 'catmullrom', 0.0)
  curve.arcLengthDivisions = 3


  const tubeGeometry = new Bol3D.TubeGeometry(curve, 64, radius);
  textureTest.wrapS = Bol3D.RepeatWrapping;
  textureTest.wrapT = Bol3D.RepeatWrapping;
  const tubeMaterial = new Bol3D.MeshBasicMaterial({
    alphaToCoverage: true,
    map: textureTest,
    transparent: true,
    side: 2
  });

  tubeMaterial.map.repeat[flowDirection] = repeat

  const tube = new Bol3D.Mesh(tubeGeometry, tubeMaterial);
  tube.userData = { path, imgUrl, flowDirection, cut, radius, repeat, speed, type }



  return tube
}

/**
 * 加载飞线
 */
const flyLines = {
  flyLines: [],
  initFlyLines() {
    const flyLineGroup = new Bol3D.Group()
    const carLineGroup = new Bol3D.Group()
    for (let i = 0; i < STATE.flyLineConfig.length; i++) {
      const flyLine = createFlyLines(STATE.flyLineConfig[i])
      this.flyLines.push(flyLine)

      if (STATE.flyLineConfig[i].type === 'fly') {
        flyLineGroup.add(flyLine)
      } else if (STATE.flyLineConfig[i].type === 'car') {
        carLineGroup.add(flyLine)
      }
      STATE.bloomList.push(flyLine)
    }

    STATE.sceneList.flyLine = flyLineGroup
    STATE.sceneList.carLine = carLineGroup
    CACHE.container.attach(STATE.sceneList.flyLine)
    CACHE.container.attach(STATE.sceneList.carLine)

    STATE.sceneList.carLine.position.y += 10


  },
  animation() {
    for (let i = 0; i < this.flyLines.length; i++) {
      const direction = this.flyLines[i].userData.flowDirection
      const speed = this.flyLines[i].userData.speed
      this.flyLines[i].material.map.offset[direction] -= speed
    }
  }
}


/** 
* 自定义鼠标右键双击事件
*/
function dbRightClick() {
  //为window绑定鼠标事件，用闭包防止变量全局污染
  window.addEventListener('mouseup', (function (e) {
    let count = 0
    let timer = null
    return function (e) {
      //判断是鼠标右键点击
      if (e.button === 2) {
        if (!timer) {
          timer = setTimeout(() => {
            count = 0
            timer = null
          }, 600)
        }
        count++
        if (count === 2) {

          //逻辑代码 
          if (STATE.currentScene === 'mainBuilding') {
            STATE.currentScene = 'out'
            backToOut()

          } else if (['1f', '2f', '3f', '4f', 'roof'].includes(STATE.currentScene)) {
            removeAllPopup()
            initMainBuilding(STATE.currentScene)
            STATE.currentScene = 'mainBuilding'

          } else if (['309', '310', '311', '312', '316', '317', '318', '319'].includes(STATE.currentScene)) {
            new Bol3D.TWEEN.Tween(CACHE.container.ambientLight)
              .to({
                intensity: 2.5
              }, 500)
              .start()
            STATE.currentScene = '3f'
            initInnerFloor('3f', 0)
            router.push("/")
          }

          count = 0
          clearTimeout(timer)
          timer = null
        }
      }
    }
  })())
}


/**
 * 获取世界坐标的状态
 * @param {object} obj 模型
 */
function getWorldState(obj) {
  const scale = obj.getWorldScale(new Bol3D.Vector3())
  const position = obj.getWorldPosition(new Bol3D.Vector3())
  const quaternion = obj.getWorldQuaternion(new Bol3D.Quaternion())
  return { position, scale, quaternion }
}


/**
 * 教室的状态和信息
 */

const classRoom = {
  currentClassRoomName: '',
  info: {},

  // 隐藏屋顶  窗户透明  外墙透明
  hiddenRoof: function (classRoomName) {
    icon.show(false)
    const info = STATE.classRoomInfo.find(e => e.name === classRoomName)
    this.info = info


    STATE.sceneList[classRoomName].traverse(child => {
      if (child.isMesh) {

        CACHE.container.clickObjects.push(child)
        if (info.model.roof.includes(child.name)) {
          child.visible = false
        } else if (info.model.light.includes(child.name)) {
          child.material.transparent = true
          child.material.opacity = 0.5
        } else if (info.model.wall.includes(child.name)) {
          child.material.transparent = true
          child.material.opacity = 0.5
        } else if (info.model.window.includes(child.name)) {
          child.material.transparent = true
          child.material.opacity = 0.1
        } else if (classRoomName == '309' && info.model.table.includes(child.name)) {
          if (['309jiaoshi23_1', '309jiaoshi24_1'].includes(child.name)) {
            child.userData.rgb = 0.1
            child.material.color.set(0x161616)
          } else {
            child.userData.rgb = 0.2
            child.material.color.set(0x323232)
          }
        }
      }
    })
  },

  // 窗帘
  curtain: function (isOpen) {
    STATE.sceneList[this.currentClassRoomName].traverse(child => {
      if (child.isMesh) {
        if (this.info.model.curtain.includes(child.name)) {
          new Bol3D.TWEEN.Tween(child.scale)
            .to({
              z: isOpen ? this.info.model.curtainScale[0] : this.info.model.curtainScale[1]
            }, 500)
            .start()
        }
      }
    })
  },

  // 屏幕
  screen: function (isOpen) {
    STATE.sceneList[this.currentClassRoomName].traverse(child => {
      if (child.isMesh) {
        if (this.info.model.screen.includes(child.name)) {
          child.material.color.r = isOpen ? 1 : 0
          child.material.color.g = isOpen ? 1 : 0
          child.material.color.b = isOpen ? 1 : 0
        }
      }
    })
  },

  // 亮度
  brightness: function (val) {
    STATE.sceneList[this.currentClassRoomName].traverse(child => {
      if (child.isMesh) {
        if (!this.info.model.screen.includes(child.name)) {
          if (child.userData.rgb) {
            child.material.color.r = val * 0.01 * child.userData.rgb
            child.material.color.g = val * 0.01 * child.userData.rgb
            child.material.color.b = val * 0.01 * child.userData.rgb
          } else {
            child.material.color.r = val * 0.01
            child.material.color.g = val * 0.01
            child.material.color.b = val * 0.01
          }
        }
      }
    })
  },

  // 门
  door: function (isOpen) {
    STATE.sceneList[this.currentClassRoomName].traverse(child => {
      if (child.isMesh) {
        if (this.info.model.door.includes(child.name)) {
          new Bol3D.TWEEN.Tween(child.rotation)
            .to({
              z: isOpen ? -Math.PI / 2 : 0
            }, 500)
            .start()
        }
      }
    })
  }
}

/**
  * 管线系统
  */
const tubes = {
  flowTube: null,

  showTube(isTubeShow) {
    // 1 是要隐藏的  2是要显示的  
    const opacityAnimationArr = [
      { name: 'floor', type: 1 },
      { name: 'road', type: 1 },
      { name: 'school', type: 1 },
      { name: 'peilouLine', type: 1 },
      { name: 'peilou', type: 1 },
      { name: 'mainBuilding', type: 1 },
      { name: 'carLine', type: 1 },
      { name: 'schoolEdge', type: 2 },
      { name: 'mainBuildingEdge', type: 2 },
      { name: 'tube', type: 2 }
    ]

    if (isTubeShow) {
      STATE.currentScene = 'tube'
      new Bol3D.TWEEN.Tween(STATE.sceneList.plane.position)
        .to({
          y: -25
        }, 100)
        .start()

      cameraAnimation({
        cameraState: STATE.showTubeState, callback: (() => {
          CACHE.container.orbitControls.maxPolarAngle = Math.PI
          CACHE.container.orbitControls.minPolarAngle = 0
        })
      })

      STATE.sceneList.schoolEdge.visible = true
      STATE.sceneList.mainBuildingEdge.visible = true
      STATE.sceneList.tube.visible = true

      for (let i = 0; i < opacityAnimationArr.length; i++) {
        STATE.sceneList[opacityAnimationArr[i].name].traverse(e => {
          if (e.isMesh) {
            e.material.transparent = true
            e.material.opacity = opacityAnimationArr[i].type === 1 ? 1 : 0
            new Bol3D.TWEEN.Tween(e.material)
              .to({
                opacity: opacityAnimationArr[i].type === 1 ? 0 : 1
              }, 500)
              .start()
          }
        })
      }
    } else {

      new Bol3D.TWEEN.Tween(STATE.sceneList.plane.position)
        .to({
          y: -1
        }, 500)
        .start()
      cameraAnimation({
        cameraState: STATE.initialState, callback: (() => {
          CACHE.container.orbitControls.maxPolarAngle = 1.4
          CACHE.container.orbitControls.minPolarAngle = 0.3
        })
      })


      for (let i = 0; i < opacityAnimationArr.length; i++) {
        STATE.sceneList[opacityAnimationArr[i].name].traverse(e => {
          if (e.isMesh) {
            e.material.transparent = true
            e.material.opacity = opacityAnimationArr[i].type === 1 ? 0 : 1
            new Bol3D.TWEEN.Tween(e.material)
              .to({
                opacity: opacityAnimationArr[i].type === 1 ? 1 : 0
              }, 500)
              .start()
              .onComplete(() => {
                if (opacityAnimationArr[i].name === 'tube') {
                  STATE.sceneList.schoolEdge.visible = false
                  STATE.sceneList.mainBuildingEdge.visible = false
                  STATE.sceneList.tube.visible = false
                  STATE.currentScene = 'out'
                }
                e.material.transparent = false
              })
          }
        })
      }
    }
  },

  /**
   * 管道流动
   */
  animation() {
    if (!this.flowTube) {
      this.flowTube = STATE.sceneList.tube.children.find(e => e.name === 'Wcj-gd-04')
      const textureTest = new Bol3D.TextureLoader().load('./assets/3d/img/tube.png'); // 流动材质
      textureTest.wrapS = Bol3D.RepeatWrapping;
      textureTest.wrapT = Bol3D.RepeatWrapping;
      this.flowTube.material.map = textureTest
      this.flowTube.material.alphaToCoverage = true
      this.flowTube.material.transparent = true
      this.flowTube.material.side = 2

    } else if (STATE.currentScene === 'tube') {
      this.flowTube.material.map.offset.x -= 0.01
    }
  }
}


/**
 * 边框
 */
function edge(model, color = 0x113a5f) {
  const group = new Bol3D.Group()
  const edgeMatieral = new Bol3D.LineBasicMaterial({ color })
  model.traverse(child => {
    if (child.isMesh) {
      const { position, scale, quaternion } = getWorldState(child)
      const edges = new Bol3D.EdgesGeometry(child.geometry.clone())
      const line = new Bol3D.LineSegments(edges, edgeMatieral)
      line.position.set(position.x, position.y, position.z)
      line.scale.set(scale.x, scale.y, scale.z)
      line.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)

      line.material.transparent = true
      line.material.opacity = 0.5
      group.add(line)

    }
  })
  return group
}


/**
 * 图标
 */
const icon = {
  iconMoveList: [],

  /**
   * 显示隐藏
   */
  show(boo = true) {
    STATE.sceneList.icon.visible = boo
  },

  /**
   * 加载icon
   */
  initIcon() {
    STATE.sceneList.icon = new Bol3D.Group()

    for (let i = 0; i < STATE.iconList.length; i++) {
      const item = STATE.iconList[i]

      if (item.name.includes('监控')) {
        const icon = new Bol3D.POI.Icon({
          position: [item.position[0], item.position[1], item.position[2]],
          url: './assets/3d/img/3.png',
          scale: [0.025, 0.025],
          color: 0x1296db,
          sizeAttenuation: false
        })
        icon.name = item.name

        // icon.renderOrder = -1
        icon.material.alphaToCoverage = true
        STATE.bloomList.push(icon)
        STATE.sceneList.icon.add(icon)
        STATE.outClickObjects.push(icon)

      } else {
        const icon = new Bol3D.POI.Icon({
          position: [item.position[0], item.position[1], item.position[2]],
          url: './assets/3d/img/2.png',
          scale: [0.045, 0.045],
          color: 0xff8300,
          sizeAttenuation: false
        })
        icon.name = item.name
        // icon.renderOrder = -1
        icon.material.alphaToCoverage = true
        STATE.bloomList.push(icon)
        STATE.sceneList.icon.add(icon)
        if (i === 0) this.iconMoveList.push(icon)

        const text = new Bol3D.POI.Text({
          position: [item.position[0], item.position[1] + 7, item.position[2]],
          value: [item.name],
          color: '#ffffff',
          lineHeight: 40,
          lineSpacing: 0,
          topSpacing: 5,
          textAlign: 'center',
          scale: .0003,
          background: './assets/3d/img/4.png',
          backgroundColor: '',
          sizeAttenuation: false,
          publicPath: '',
          bgScale: [1.5, 2.5],
          bgOffset: [0, -0.05]
        })
        text.name = item.name
        text.renderOrder = -1
        text.material.alphaToCoverage = true
        STATE.bloomList.push(text)
        STATE.sceneList.icon.add(text)
      }
    }

    container.attach(STATE.sceneList.icon)
  },

  /**
   * icon动画
   */
  animation(elapsedTime) {
    this.iconMoveList.forEach(e => {
      e.position.y += Math.sin(elapsedTime * 10) / 10
    })
  }

}

/**
 * 静态合批(网格合并)
 */
function mergedMesh(models) {
  const mergeMeshInfo = []
  let mergeMeshMaterialInfo = null
  models.children.forEach(model => {
    model.updateWorldMatrix(true, false)
    const matrixWorldGeometry = model.geometry.clone().applyMatrix4(model.matrixWorld)
    mergeMeshInfo.push(matrixWorldGeometry)
    if (!mergeMeshMaterialInfo) {
      mergeMeshMaterialInfo = model.material.clone()
    }
  })


  const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(mergeMeshInfo)
  const merged = new Bol3D.Mesh(mergedGeometry, mergeMeshMaterialInfo)

  return merged
}

/**
 * 设置模型位置(position)，旋转(rotation)，缩放(scale),有该属性的物体亦可
 * @param {object} mesh 待操作模型
 */
function setModelPosition(mesh) {
  const controls = CACHE.container.transformControl
  const gui = new dat.GUI()
  const options = {
    transformModel: "translate"
  }
  gui.add(options, 'transformModel', ["translate", 'rotate', 'scale']).onChange(val => controls.setMode(val))
  const positionX = gui.add(mesh.position, 'x').onChange(val => mesh.position.x = val).name('positionX')
  const positionY = gui.add(mesh.position, 'y').onChange(val => mesh.position.y = val).name('positionY')
  const positionZ = gui.add(mesh.position, 'z').onChange(val => mesh.position.z = val).name('positionZ')
  const rotationX = gui.add(mesh.rotation, 'x').step(0.01).onChange(val => mesh.rotation.x = val).name('rotationX')
  const rotationY = gui.add(mesh.rotation, 'y').step(0.01).onChange(val => mesh.rotation.y = val).name('rotationY')
  const rotationZ = gui.add(mesh.rotation, 'z').step(0.01).onChange(val => mesh.rotation.z = val).name('rotationZ')
  const scaleX = gui.add(mesh.scale, "x").step(0.01).onChange(val => mesh.scale.x = val).name('scaleX')
  const scaleY = gui.add(mesh.scale, "y").step(0.01).onChange(val => mesh.scale.y = val).name('scaleY')
  const scaleZ = gui.add(mesh.scale, "z").step(0.01).onChange(val => mesh.scale.z = val).name('scaleZ')
  controls.attach(mesh)
  controls.addEventListener("change", (e) => {
    positionX.setValue(mesh.position.x)
    positionY.setValue(mesh.position.y)
    positionZ.setValue(mesh.position.z)
    rotationX.setValue(mesh.rotation.x)
    rotationY.setValue(mesh.rotation.y)
    rotationZ.setValue(mesh.rotation.z)
    scaleX.setValue(mesh.scale.x)
    scaleY.setValue(mesh.scale.y)
    scaleZ.setValue(mesh.scale.z)
  })
}

/**
 * 加载3d弹窗
 * @param {Number} type 类型名代号 1-门禁 2-监控 3-保卫处
 * @param {String} name 监控名字
 */
function initPopup3d(type, name) {
  removeAllPopup()
  let typeName = ''
  let value = ``
  if (type === 1) { typeName = '门禁' }
  else if (type === 2) { typeName = '监控' }
  else if (type === 3) { typeName = '保卫处' }

  if (typeName) {
    const arr = STATE.popup3DData.find(e => e.name === typeName)
    if (type === 2) { // 监控
      const monitorInfo = arr.value.find(e2 => e2.name === name)
      if (monitorInfo) {
        value = `<video style="width: 100%; height: 97%;" autoplay loop src="${monitorInfo.videoUrl}"></video>`
        const popup3D = new Bol3D.POI.Popup3D({
          value: `
            <div style="
              margin:0;
              width: 14.55vw;
              height:23vh;
              padding: 4% 0 0 0;
              float: left;
              background: url('./assets/3d/img/6.png') center / 100% 100%;
              color: #ffffff;
            ">
            ${value}
            </div>
          `,
          position: [monitorInfo.position3D.x, monitorInfo.position3D.y, monitorInfo.position3D.z],
          className: 'popup3dclass bg6',
          scale: [0.1, 0.1, 0.1],
          closeVisible: 'visible'
        })

        popup3D.name = monitorInfo.name
        CACHE.container.attach(popup3D)
        STATE.popupList.push(popup3D)

        const cameraState = {
          position: { x: monitorInfo.position3D.x + 40, y: monitorInfo.position3D.y + 40, z: monitorInfo.position3D.z + 40 },
          target: monitorInfo.position3D
        }
        cameraAnimation({ cameraState })
      }

    } else { // 门禁 保卫处
      for (let i = 0; i < arr.value.length; i++) {
        if (type === 1) {
          value = `<p style='margin-bottom: 1.25rem;'>${typeName}</p>`
          value += `<p style='margin-bottom: 1rem;'>位置：${arr.value[i].position}</p>`
          value += `<p style='margin-bottom: 1rem;'>门禁状态：${arr.value[i].state}</p>`
          value += `<p style='margin-bottom: 1rem;'>今日通行人数：${arr.value[i].value}</p>`
        } else if (type === 3) {
          value = `<p style='margin-bottom: 1.25rem;'>${typeName}</p>`
          value += `<p style='margin-bottom: 1rem;'>位置：${arr.value[i].position}</p>`
          value += `<p style='margin-bottom: 1rem;'>值班人员：${arr.value[i].person}</p>`
        }

        const popup3D = new Bol3D.POI.Popup3D({
          value: `
            <div style="
              margin:0;
              width: 20vw;
              height:20vh;
              padding: 0 0 0 2.6vw;
              font-size: 1.25rem;
              float: left;
              background: url('./assets/3d/img/7.png') center / 100% 100%;
              color: #ffffff;
            ">
            ${value}
            </div>
          `,
          position: [arr.value[i].position3D.x, arr.value[i].position3D.y, arr.value[i].position3D.z],
          className: 'popup3dclass bg7',
          scale: [0.08, 0.08, 0.08],
          closeVisible: 'visible'
        })

        popup3D.name = arr.value[i].name
        CACHE.container.attach(popup3D)
        STATE.popupList.push(popup3D)
      }
    }


    setTimeout(() => {
      const dom = document.getElementsByClassName('popup3dclass')
      if (dom.length) {
        dom[0].parentElement.parentElement.style.zIndex = 20
      }
    }, 500)
  }
}


const render = () => {
  const singleFrameTime = STATE.clock.getDelta()
  const elapsedTime = STATE.clock.getElapsedTime()


  shader.peilou.shaderAnimate(singleFrameTime)
  shader.school.shaderAnimate(elapsedTime)
  flyLines.animation()
  tubes.animation()
  icon.animation(elapsedTime)

  requestAnimationFrame(render);
};



/**
 * 显示orbitCamera的position和orbitControls的target
 */
function showTargetPositon() {
  let mypt = {
    position: "",
    target: ""
  }
  const gui = new dat.GUI()
  const guiPosition = gui.add(mypt, "position")
  const guiTarget = gui.add(mypt, "target")

  container.orbitControls.addEventListener("end", () => {
    const position = container.orbitCamera.position
    const pString = '{x:' + position.x + ",y:" + position.y + ',z:' + position.z + "}"
    guiPosition.setValue(pString)
    const target = container.orbitControls.target
    const tString = '{x:' + target.x + ",y:" + target.y + ',z:' + target.z + "}"
    guiTarget.setValue(tString)
  })
}


export const API = {
  loadGUI,
  initFloor,
  initMainBuilding,
  initInnerFloor,
  dbRightClick,
  getWorldState,
  edge,
  initPopup3d,
  icon,
  tubes,
  shader,
  classRoom,
  flyLines,
  render,
  showTargetPositon
}

import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'
import router from '@/router/index'
import Shader from './shader'

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
  scenesFolder
    .addColor(CACHE.container.attrs.lights.directionLights[0], 'color')
    .onChange((val) => {
      CACHE.container.directionLights[0].color.set(val)
    })
    .name('平行光颜色')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'x')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'y')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'z')
  scenesFolder.add(deafultsScene, 'distance').onChange((val) => {
    CACHE.container.directionLights[0].shadow.camera.left = -val
    CACHE.container.directionLights[0].shadow.camera.right = val
    CACHE.container.directionLights[0].shadow.camera.top = val
    CACHE.container.directionLights[0].shadow.camera.bottom = -val
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'far').onChange(() => {
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'near').onChange(() => {
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder
    .add(CACHE.container.directionLights[0].shadow, 'bias')
    .step(0.0001)
    .onChange(() => {
      CACHE.container.directionLights[0].shadow.needsUpdate = true
    })
  scenesFolder.add(CACHE.container.directionLights[0], 'intensity').step(0.1).min(0).max(10)

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
  const floorGeo = new Bol3D.PlaneGeometry(500, 500)
  const floorMat = new Bol3D.MeshBasicMaterial({ color: 0x3c3a3b, side: Bol3D.DoubleSide })
  const floor = new Bol3D.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.1
  CACHE.container.attach(floor)
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
          }
          new Bol3D.TWEEN.Tween(child.material)
            .to({
              opacity: 1
            }, 500)
            .start()
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
  CACHE.container.outlineObjects = []
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
  removeAllPopup()
  STATE.sceneList.mainBuilding.visible = false

  const classRoomModel = STATE.sceneList[classRoomName]

  classRoomModel.visible = true
  CACHE.container.orbitCamera.position.set(-0.0485, 12.5571, 11.7318)
  CACHE.container.orbitControls.target.set(-0.012, 2, -0.8)


  classRoom.hiddenRoof(classRoomName)

  STATE.sceneList.peilou.visible = false
  STATE.sceneList.peilouLine.visible = false
  STATE.sceneList.school.visible = false
  STATE.sceneList.road.visible = false
  STATE.sceneList.tree.visible = false

  router.push("/classroom?id=" + classRoomName)
}

/**
 * 返回至初始界面
 */
function backToOut() {
  STATE.outLineObjects = []
  STATE.sceneList.mainBuilding.traverse(child => {
    if (child.isMesh) {
      STATE.outLineObjects.push(child)
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

  CACHE.container.outlineObjects = STATE.outLineObjects
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
      CACHE.container.addBloom(flyLine)
    }

    STATE.sceneList.flyLine = flyLineGroup
    STATE.sceneList.carLine = carLineGroup
    CACHE.container.attach(STATE.sceneList.flyLine)
    CACHE.container.attach(STATE.sceneList.carLine)


  },
  animation() {
    for (let i = 0; i < this.flyLines.length; i++) {
      const direction = this.flyLines[i].userData.flowDirection
      const speed = this.flyLines[i].userData.speed
      this.flyLines[i].material.map.offset[direction] -= speed
    }
  }
}




const render = () => {
  // const elapsedTime = STATE.clock.getElapsedTime()
  const singleFrameTime = STATE.clock.getDelta()

  shader.peilou.shaderAnimate(singleFrameTime)
  flyLines.animation()

  requestAnimationFrame(render);
};


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
 * 获取世界坐标的状态并赋值
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

  hiddenRoof: function (classRoomName) {
    const info = STATE.classRoomInfo.find(e => e.name === classRoomName)
    this.info = info

    STATE.sceneList[classRoomName].traverse(child => {
      if (child.isMesh) {
        if (this.info.model.roof.includes(child.name)) {
          child.visible = false
        } else if (this.info.model.light.includes(child.name)) {
          child.material.transparent = true
          child.material.opacity = 0.5
        }
      }
    })
  },

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

  brightness: function (val) {
    STATE.sceneList[this.currentClassRoomName].traverse(child => {
      if (child.isMesh) {
        if (!this.info.model.screen.includes(child.name)) {
          child.material.color.r = val * 0.01
          child.material.color.g = val * 0.01
          child.material.color.b = val * 0.01
        }
      }
    })
  },

  temperature: function (val) {

  }
}

export const API = {
  loadGUI,
  initFloor,
  initMainBuilding,
  initInnerFloor,
  dbRightClick,
  getWorldState,
  shader,
  classRoom,
  flyLines,
  render
}

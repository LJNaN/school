import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'
import Shader from './shader.js'
import router from '@/router/index'
import Utils from './utils/index'


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
 * shader测试用
 */
const shader = {
  time: {
    value: 0
  },
  isStart: false,
  StartTime: {
    value: 0
  },

  setCityMaterial(object) {
    
    // 确定oject的geometry的box size
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();

    const { geometry } = object;

    // 获取geometry的长宽高 中心点
    const { center, radius } = geometry.boundingSphere;
    

    const { max, min } = geometry.boundingBox;

    const size = new Bol3D.Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z
      )
      
    console.log('size: ', size);

    Utils.forMaterial(object.material, (material) => {
      // material.opacity = 0.6;
      material.transparent = true;
      material.color.setStyle("#1B3045");

      material.onBeforeCompile = (shader) => {
        shader.uniforms.time = this.time;
        shader.uniforms.uStartTime = this.StartTime;

        // 中心点
        shader.uniforms.uCenter = {
          value: center
        }

        // geometry大小
        shader.uniforms.uSize = {
          value: size
        }

        shader.uniforms.uMax = {
          value: max
        }

        shader.uniforms.uMin = {
          value: min
        }
        shader.uniforms.uTopColor = {
          value: new Bol3D.Color('#001c38')
        }

        // 效果开关
        shader.uniforms.uSwitch = {
          value: new Bol3D.Vector3(
            0, // 扩散
            0, // 左右横扫
            0 // 向上扫描
          )
        };
        // 扩散
        shader.uniforms.uDiffusion = {
          value: new Bol3D.Vector3(
            0, // 0 1开关
            120, // 范围
            600 // 速度
          )
        };
        // 扩散中心点
        shader.uniforms.uDiffusionCenter = {
          value: new Bol3D.Vector3(
            0, 0, 0
          )
        };

        // 扩散中心点
        shader.uniforms.uFlow = {
          value: new Bol3D.Vector3(
            1, // 0 1开关
            30, // 速度
            10 // 范围
          )
        };

        // 效果颜色
        shader.uniforms.uColor = {
          value: new Bol3D.Color("#5588aa")
        }
        // 效果颜色
        shader.uniforms.uFlowColor = {
          value: new Bol3D.Color("#63c9e1")
        }


        // 效果透明度
        shader.uniforms.uOpacity = {
          value: 1
        }

        // 效果透明度
        shader.uniforms.uRadius = {
          value: radius
        }
        shader.uniforms.uModRange = { value: 10 } // 范围
        shader.uniforms.uModWidth = { value: 1.5 } // 范围

        /**
         * 对片元着色器进行修改
         */
        const fragment = `
          // float distanceTo(vec2 src, vec2 dst) {
          //   float dx = src.x - dst.x;
          //   float dy = src.y - dst.y;
          //   float dv = dx * dx + dy * dy;
          //   return sqrt(dv);
          // }

          float lerp(float x, float y, float t) {
            return (1.0 - t) * x + t * y;
          }

          vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
            float r = lerp(color1.r, color2.r, index);
            float g = lerp(color1.g, color2.g, index);
            float b = lerp(color1.b, color2.b, index);
            return vec3(r, g, b);
          }


          varying vec4 vPositionMatrix;
          varying vec3 vPosition;

          uniform float time;
          // 扩散参数
          uniform float uRadius;
          uniform float uOpacity;
          uniform float uModRange;
          uniform float uModWidth;
          // 初始动画参数
          uniform float uStartTime; 

          uniform vec3 uMin;
          uniform vec3 uMax;
          uniform vec3 uSize;
          uniform vec3 uFlow;
          uniform vec3 uColor;
          uniform vec3 uCenter;
          uniform vec3 uSwitch;
          uniform vec3 uTopColor;
          uniform vec3 uFlowColor;
          uniform vec3 uDiffusion; 
          uniform vec3 uDiffusionCenter;


          void main() {
        `;
        const fragmentColor = `
          vec3 distColor = outgoingLight;
          float dstOpacity = diffuseColor.a;

          float indexMix = vPosition.y / (uSize.y * 0.6);
          distColor = mix(distColor, uTopColor, indexMix);

       
          // 流动效果{
          float dTime = mod(time * uFlow.y, uSize.y); 
          // 流动范围
          float topY = vPosition.y + uFlow.z;
          if (dTime > vPosition.y && dTime < topY) {
            // 颜色渐变 
            float dIndex = sin((topY - dTime) / uFlow.z * PI);
            distColor = mix(distColor, uFlowColor,  dIndex); 
          }
          gl_FragColor = vec4(distColor, dstOpacity * uStartTime);
        `;
        shader.fragmentShader = shader.fragmentShader.replace("void main() {", fragment)
        shader.fragmentShader = shader.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );", fragmentColor);



        /**
         * 对顶点着色器进行修改
         */
        const vertex = `
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;
          uniform float uStartTime;
          void main() {
            vPositionMatrix = projectionMatrix *  vec4(position, 1.0);
            vPosition = position;
        `
        const vertexPosition = `
          vec3 transformed = vec3(position.x, position.y * uStartTime, position.z);
        `
        // 

        shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", vertexPosition);
      }
    })
  },

  uniform: {
    u_color: { value: new Bol3D.Color("#5588aa") },
    u_tcolor: { value: new Bol3D.Color("#ffffff") },
    u_r: { value: 0.25 },
    u_length: { value: 10 }, //扫过区域
    u_height: { value: 30.5 },
    u_time: { value: 0 }
  },

  initShader: function () {
    this.isStart = true
    const model = STATE.sceneList.peilou.children[0]
    this.setCityMaterial(model)
    console.log('model: ', model);

  },

  shaderAnimate: function (singleFrameTime) {
    if (singleFrameTime > 1) return false
    this.time.value += singleFrameTime

    
    // 启动
    if (this.isStart) {
      this.StartTime.value += singleFrameTime * 0.5
      if (this.StartTime.value >= 1) {
        this.StartTime.value = 1;
        this.isStart = false;
      }
    }

  }
}

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

const render = () => {
  // const elapsedTime = STATE.clock.getElapsedTime()
  const singleFrameTime = STATE.clock.getDelta()

  shader.shaderAnimate(singleFrameTime)

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
  render
}

import { API } from './API.js'
import { CACHE } from './CACHE.js'


const PUBLIC_PATH = './assets/3d'
const initialState = {
  position: {
    // x: 105.41616099631243, y: 74.01781066807432, z: 74.1189
    x: 935.1784917846949, y: 291.0193266441977, z: -4.4444442388618945
  },
  target: {
    // x: 34.56716070238548, y: 20, z: 3.854471
    x: 186.50902342021402, y: 20, z: -35.95007810675151
  }
}

// 内外的发光、可点击对象
const outLineObjects = []
const outClickObjects = []
const innerClickObjects = []

const clock = new Bol3D.Clock()
clock.running = true
// let elapsedTime = clock.getElapsedTime()
// let singleFrameTime = clock.getDelta()

/*
  out  外场景 
  mainBuilding  主楼
  1f 2f 3f 4f roof  楼层
  309 310 311 ...  教室
*/
const currentScene = "out"

const classRoomPopup = [{
  name: '309',
  position: [-62, 17, -52.5]
}, {
  name: '310',
  position: [-51, 17, -56.3]
}]
// 装弹窗实例的
const popupList = []


const floorList = [
  {
    floor: '1f',
    model: ['1lou_1', '1lou_2', '1lou_3', '1lou_4', '1lou_5', '1lou_6', '1louqiang', '1loushinei', '1louboli', '1loudimian']
  }, {
    floor: '2f',
    model: ['2lou_1', '2lou_2', '2lou_3', '2louqiang', '2loushinei', '2louboli', '2loudimian']
  }, {
    floor: '3f',
    model: ['3lou_1', '3lou_2', '3louqiang', '3loushinei', '3louboli', '3loudimian']
  }, {
    floor: '4f',
    model: ['4lou_1', '4lou_2', '4louqiang', '4loushinei', '4louboli', '4loudimian']
  }, {
    floor: 'roof',
    model: ['wuding_1', 'wuding_2']
  }]

// 加载的场景列表
const sceneList = {
  mainBuilding: new Bol3D.Group(), // 交互的主楼
  peilou: new Bol3D.Group(), // 配楼
  peilouLine: new Bol3D.Group(), // 配楼的描边
  school: new Bol3D.Group(), // 学校
  tree: new Bol3D.Group(), // 树
  floor: null, // 纯色地板
  road: null, // 路
  flyLine: null, // 竖直飞线
  carLine: null // 车流飞线
}

// 教室信息
const classRoomInfo = [{
  name: '309',
  model: {
    roof: ['309jiaoshi19_1', '309jiaoshi19_2'],
    light: ['309jiaoshi20_1', '309jiaoshi20_2'],
    curtain: ['309jiaoshi10', '309jiaoshi11', '309jiaoshi12', '309jiaoshi13', '309jiaoshi14', '309jiaoshi15', '309jiaoshi16', '309jiaoshi17'],
    curtainScale: [82, 180],
    screen: ['309jiaoshi02_2', '309jiaoshi09_3'],
    frontDoor: ['309jiaoshi06'],
    backDoor: ['309jiaoshi07']
  }
}, {
  name: '310',
  model: {
    roof: ['310jiaoshi18_1'],
    light: ['310jiaoshi18_2'],
    curtain: ['310jiaoshi10', '310jiaoshi11', '310jiaoshi12', '310jiaoshi13', '310jiaoshi14', '310jiaoshi15'],
    curtainScale: [76, 167],
    screen: ['310jiaoshi02_2', '310jiaoshi09_3'],
    frontDoor: ['310jiaoshi06'],
    backDoor: ['310jiaoshi07']
  }
}]

// 场景流线
// 前12个是往上飞的
// 后面的是车流线
const flyLineConfig = [
  {
    type: 'fly',
    path: [
      653, 0, -582,
      653, 600, -582
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      255, 0, -586,
      255, 600, -586
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      -88, 0, -588,
      -88, 600, -588
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      -528, 0, -582,
      -528, 600, -582
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      -540, 0, -298,
      -540, 600, -298
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      -553, 0, 222,
      -553, 600, 222
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      -571, 0, 589,
      -571, 600, 589
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      -224, 0, 612,
      -224, 600, 612
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      188, 0, 615,
      188, 600, 615
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      605, 0, 618,
      605, 600, 618
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      631, 0, 217,
      631, 600, 217
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'fly',
    path: [
      639, 0, -184,
      639, 600, -184
    ],
    radius: 1,
    imgUrl: '/assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.005
  }, {
    type: 'car',
    path: [
      -771, 0, -238,
      287, 0, -239,
      289, 0, -801
    ],
    radius: 0.9,
    imgUrl: '/assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 4,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      993, 0, -242,
      287, 0, -239,
      287, 0, -8,
      132, 0, -12
    ],
    radius: 0.9,
    imgUrl: '/assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 5,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      955, 0, -12,
      287, 0, -8,
      286, 0, 227,
      -275, 0, 234,
      -280, 0, 30
    ],
    radius: 0.9,
    imgUrl: '/assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 7,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      -777, 0, 24,
      -149, 0, 26
    ],
    radius: 0.9,
    imgUrl: '/assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 3,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      287, 0, 852,
      286, 0, 227
    ],
    radius: 0.9,
    imgUrl: '/assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 3,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      -274, 0, 229,
      -274, 0, 851
    ],
    radius: 0.9,
    imgUrl: '/assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 3,
    speed: 0.02
  }]

const temp = null


export const STATE = {
  initialState, // 初始状态
  PUBLIC_PATH,  // 公共路径
  outLineObjects,  // 描边物体
  clock,
  // elapsedTime,  // 经过的总时间
  // singleFrameTime,  // 单帧时间
  outClickObjects,  // 外场景可点击的物体
  innerClickObjects,  // 内场景可点击的物体
  currentScene,  // 当前场景
  floorList, // 楼层数组
  popupList, // 弹窗数组
  sceneList, // 场景模型数组
  classRoomPopup,  // 教室弹窗
  classRoomInfo,  // 教室的信息
  flyLineConfig, // 场景流线
  temp
}

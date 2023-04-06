import { API } from './API.js'
import { CACHE } from './CACHE.js'


const PUBLIC_PATH = './assets/3d'
const initialState = {
  position: {
    x: 197.02449313696982, y: 122.13810006283873, z: 126.939
    // x: 935.1784917846949, y: 291.0193266441977, z: -4.4444442388618945
  },
  target: {
    x: 60.64430796456643, y: 20, z: 4.2167
    // x: 186.50902342021402, y: 20, z: -35.95007810675151
  }
}

const showTubeState = {
  position: { x: 82.99589382331085, y: -7.282949417734496, z: 47.69 },
  target: { x: 6.734846680912499, y: -20, z: -3.2761796 }
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
  tube 管道
*/
const currentScene = "out"

const classRoomPopup = [{
  name: '309',
  position: [-62, 17, -52.5]
}, {
  name: '310',
  position: [-51, 17, -56.3]
}]

// 弹窗数据
const popup3DData = [{
  name: '门禁',
  value: [{
    position3D: { x: 128, y: 20, z: -16 },
    name: '门禁1',
    position: '南门',
    state: '在线',
    value: '2845'
  }, {
    position3D: { x: -117, y: 20, z: 17 },
    name: '门禁1',
    position: '南门',
    state: '在线',
    value: '2845'
  }]
}, {
  name: '监控',
  value: [{
    position3D: { x: 129, y: 16, z: 2 },
    name: '监控1',
    videoUrl: './assets/2d/video/monitor4.mp4'
  }, {
    position3D: { x: 31, y: 21, z: 16 },
    name: '监控2',
    videoUrl: './assets/2d/video/monitor4.mp4'
  }, {
    position3D: { x: -80, y: 22, z: 44 },
    name: '监控3',
    videoUrl: './assets/2d/video/monitor4.mp4'
  }, {
    position3D: { x: -116, y: 16, z: 5 },
    name: '监控4',
    videoUrl: './assets/2d/video/monitor4.mp4'
  }]
}, {
  name: '保卫处',
  value: [{
    position3D: { x: -64, y: 25, z: 37 },
    name: '保卫处1',
    position: '东门',
    person: '张伟'
  }, {
    position3D: { x: -26, y: 10, z: -34 },
    name: '保卫处2',
    position: '西门',
    person: '李四'
  }]
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


// 图标
const iconList = [
  { name: '教学楼1', position: [-56, 22, -54] },
  { name: '教学楼2', position: [-111, 55, 44] },
  { name: '教学楼3', position: [-119, 49, -29] },
  { name: '教学楼4', position: [82, 22, -42] },
  { name: '教学楼5', position: [-13, 22, 44] },
  { name: '教学楼6', position: [-51, 22, 44] },
  { name: '教学楼7', position: [82, 22, 17] },
  { name: '教学楼8', position: [-6, 23, -13] },
  { name: '教学楼9', position: [1, 18, -51] },
  { name: '监控1', position: [129, 16, 2] },
  { name: '监控2', position: [31, 21, 16] },
  { name: '监控3', position: [-80, 22, 44] },
  { name: '监控4', position: [-116, 16, 5] },
]

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
  carLine: null, // 车流飞线
  schoolEdge: null, //学校边框
  mainBuildingEdge: null, //主楼边框
  tube: null, // 管道
  icon: null, //图标
  plane: null // 配合雾的地板
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
    backDoor: ['309jiaoshi07'],
    window: ['309jiaoshi01_2'],
    enterState: {
      position: { x: 0.35132133540255045, y: 2.5964947672572083, z: 7.7359664157137775 },
      target: { x: 0.4627314508596592, y: 2, z: 0.9115881241332402 }
    },
    wall: ['waiqiang_1', '309jiaoshi00_1'],
    table: ['309jiaoshi24_2', '309jiaoshi23_2', '309jiaoshi23_1', '309jiaoshi24_1'],
    door: ['309jiaoshi06_1', '309jiaoshi06_2', '309jiaoshi06_3', '309jiaoshi06_4', '309jiaoshi07_1', '309jiaoshi07_2', '309jiaoshi07_3', '309jiaoshi07_4']
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
    backDoor: ['310jiaoshi07'],
    window: ['310jiaoshi01_2'],
    enterState: {
      position: { x: 4.193204692975613, y: 2.5169714905708562, z: 3.893859200170662 },
      target: { x: 1.9489241309363219, y: 2, z: 1.2357259033772325 }
    },
    wall: ['waiqiang_1', '310jiaoshi00_1'],
    door: ['310jiaoshi06_1', '310jiaoshi06_2', '310jiaoshi06_3', '310jiaoshi06_4', '310jiaoshi07_1', '310jiaoshi07_2', '310jiaoshi07_3', '310jiaoshi07_4']
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
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
    imgUrl: './assets/3d/img/flyline1.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.005
  }, {
    type: 'car',
    path: [
      -771, 0, -238,
      287, 0, -239,
      289, 0, -801
    ],
    radius: 0.9,
    imgUrl: './assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      993, 0, -242,
      287, 0, -239,
      285, 0, -12,
      132, 0, -12
    ],
    radius: 0.9,
    imgUrl: './assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      955, 0, -12,
      285, 0, -12,
      286, 0, 227,
      -275, 0, 234,
      -280, 0, 30
    ],
    radius: 0.9,
    imgUrl: './assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      -777, 0, 24,
      -149, 0, 26
    ],
    radius: 0.9,
    imgUrl: './assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      287, 0, 852,
      286, 0, 227
    ],
    radius: 0.9,
    imgUrl: './assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.02
  }, {
    type: 'car',
    path: [
      -274, 0, 229,
      -274, 0, 851
    ],
    radius: 0.9,
    imgUrl: './assets/3d/img/flyline2.png',
    flowDirection: 'x',
    repeat: 1.2,
    speed: 0.02
  }]

// 辉光数组
const bloomList = []

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
  popup3DData, // 3d弹窗数据
  popupList, // 弹窗数组
  sceneList, // 场景模型数组
  classRoomPopup,  // 教室弹窗
  classRoomInfo,  // 教室的信息
  flyLineConfig, // 场景流线
  bloomList, // 辉光数组
  showTubeState, // 显示管道的相机设置
  iconList, // 图标
  temp
}

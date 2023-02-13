import { API } from './API.js'
import { CACHE } from './CACHE.js'


const PUBLIC_PATH = './assets/3d'
const initialState = {
  position: {
    x: 105.41616099631243, y: 74.01781066807432, z: 74.1189
  },
  target: {
    x: 34.56716070238548, y: 20, z: 3.854471
  }
}

// 内外的发光、可点击对象
const outLineObjects = []
const outClickObjects = []
const innerClickObjects = []

const clock = new Bol3D.Clock()

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
  name: '311',
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
  school: new Bol3D.Group(), // 学校
  floor: null, // 纯色地板
  road: null // 路
}

// temp
let temp = null

export const STATE = {
  initialState,
  PUBLIC_PATH,
  outLineObjects,
  clock,
  outClickObjects,
  innerClickObjects,
  currentScene,
  floorList,
  popupList,
  sceneList,
  classRoomPopup,
  temp
  // router
}

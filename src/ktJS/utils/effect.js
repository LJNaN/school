import * as Bol3D from 'three'
export default {
    // 获取到包围的线条
    surroundLineGeometry(object) {
        return new Bol3D.EdgesGeometry(object.geometry);
    }
}
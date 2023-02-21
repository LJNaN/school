import { STATE } from './STATE.js'
import Utils from './utils/index'
import Effects from './utils/effect'

const Shader = {
  peilou: {
    time: { value: 0 },
    isStart: false,
    StartTime: { value: 0 },
    surroundLineMaterial: null,
    flyData: [{
      source: { x: 100, y: 0, z: 100 },
      target: { x: 100, y: 400, z: 100 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 3.0,
      size: 10
    }, {
      source: { x: 350, y: 0, z: 190 },
      target: { x: 350, y: 400, z: 190 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 1.9,
      size: 10
    }, {
      source: { x: 150, y: 0, z: -150 },
      target: { x: 150, y: 400, z: -150 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 2.1,
      size: 10
    }, {
      source: { x: -150, y: 0, z: -200 },
      target: { x: -150, y: 400, z: -200 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 2.4,
      size: 10
    }, {
      source: { x: 300, y: 0, z: -300 },
      target: { x: 300, y: 400, z: -300 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 2.6,
      size: 10
    }, {
      source: { x: -200, y: 0, z: 500 },
      target: { x: -200, y: 400, z: 500 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 3.4,
      size: 10
    }, ],

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



      Utils.forMaterial(object.material, (material) => {
        material.opacity = 0.6;
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
              1, // 0 1开关
              1000, // 速度
              120 // 范围
            )
          };
          // 扩散中心点
          shader.uniforms.uDiffusionCenter = {
            value: new Bol3D.Vector3(
              0, 0, 0
            )
          };

          // 从下到上的扫光
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
            float distanceTo(vec2 src, vec2 dst) {
              float dx = src.x - dst.x;
              float dy = src.y - dst.y;
              float dv = dx * dx + dy * dy;
              return sqrt(dv);
            }
  
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

            // 开启扩散波
            vec2 position2D = vec2(vPosition.x, vPosition.z);
            float mx = mod(vPosition.x, uModRange);
            float my = mod(vPosition.y, uModRange);
            float mz = mod(vPosition.z, uModRange);
          
            if (uDiffusion.x > 0.5) {
              // 扩散速度
              float dTime = mod(time * uDiffusion.y, uRadius * 2.0);
              // 当前的离中心点距离
              float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.y));
      
              // 扩散范围
              if (uLen < dTime && uLen > dTime - uDiffusion.z) {
                // 颜色渐变
                float dIndex = sin((dTime - uLen) / uDiffusion.z * PI);
                distColor = mix(uColor, distColor, 1.0 - dIndex);
              }
      
              // 扫描中间格子
              // if (uLen < dTime) {
              //   if (mx < uModWidth || my < uModWidth || mz < uModWidth ) {
              //     distColor = vec3(0.7);
              //   }
              // }
            }
         
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

    /**
    * 获取包围线条效果
    */
    surroundLine(object) {
      // 获取线条geometry
      const geometry = Effects.surroundLineGeometry(object);
      // 获取物体的世界坐标 旋转等
      const worldPosition = new Bol3D.Vector3();
      object.getWorldPosition(worldPosition);

      // 传递给shader重要参数
      const { max, min } = object.geometry.boundingBox;

      const size = new Bol3D.Vector3(
        max.x - min.x,
        max.y - min.y,
        max.z - min.z
      );

      // this.effectGroup.add();
      const material = this.createSurroundLineMaterial({ max, min, size });

      const line = new Bol3D.LineSegments(geometry, material);

      line.name = 'surroundLine';

      line.scale.copy(object.scale);
      line.rotation.copy(object.rotation);
      line.position.copy(worldPosition);

      container.attach(line);
    },

    surroundLineShader: {
      // 顶点着色器
      vertexShader: `
        #define PI 3.14159265359
    
        uniform mediump float uStartTime;
        uniform mediump float time;
        uniform mediump float uRange;
        uniform mediump float uSpeed;
    
        uniform vec3 uColor;
        uniform vec3 uActive;
        uniform vec3 uMin;
        uniform vec3 uMax;
    
        varying vec3 vColor;
    
        float lerp(float x, float y, float t) {
          return (1.0 - t) * x + t * y;
        }

        void main() { 
          if (uStartTime >= 0.99) {
            float iTime = mod(time * uSpeed - uStartTime, 1.0);
            float rangeY = lerp(uMin.z, uMax.z, iTime);
            if (rangeY < position.z && rangeY > position.z - uRange) {
              float index = 1.0 - sin((position.z - rangeY) / uRange * PI);
              float r = lerp(uActive.r, uColor.r, index);
              float g = lerp(uActive.g, uColor.g, index);
              float b = lerp(uActive.b, uColor.b, index);

              vColor = vec3(r, g, b);
            } else {
              vColor = uColor;
            }
          }
          vec3 vPosition = vec3(position.x, position.y * uStartTime, position.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
        } 
      `,
      // 片元着色器
      fragmentShader: ` 
        precision mediump float;

        float distanceTo(vec2 src, vec2 dst) {
          float dx = src.x - dst.x;
          float dy = src.y - dst.y;
          float dv = dx * dx + dy * dy;
          return sqrt(dv);
        } 

        float lerp(float x, float y, float t) {
          return (1.0 - t) * x + t * y;
        }

        #define PI 3.14159265359
        #define PI2 6.28318530718
        
        uniform float time;
        uniform float uOpacity;
        uniform float uStartTime;

        varying vec3 vColor; 

        void main() {

          gl_FragColor = vec4(vColor, uOpacity * uStartTime);
        }
      `
    },

    flyShader(option) {
      const { source, target, height, size, color, range, frequency } = option;
      const positions = [];
      const attrPositions = [];
      const attrCindex = [];
      const attrCnumber = [];

      const _source = new Bol3D.Vector3(source.x, source.y, source.z);
      const _target = new Bol3D.Vector3(target.x, target.y, target.z);
      const _center = _target.clone().lerp(_source, 0.5);
      _center.y += height;

      const number = parseInt(_source.distanceTo(_center) + _target.distanceTo(_center));

      const curve = new Bol3D.QuadraticBezierCurve3(
        _source,
        _center,
        _target
      );

      const points = curve.getPoints(number);

      // 粒子位置计算 

      points.forEach((elem, i) => {
        const index = i / (number - 1);
        positions.push({
          x: elem.x,
          y: elem.y,
          z: elem.z
        });
        attrCindex.push(index);
        attrCnumber.push(i);
      })


      positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
      })

      const geometry = new Bol3D.BufferGeometry();

      geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(attrPositions, 3));
      // 传递当前所在位置
      geometry.setAttribute('index', new Bol3D.Float32BufferAttribute(attrCindex, 1));
      geometry.setAttribute('current', new Bol3D.Float32BufferAttribute(attrCnumber, 1));

      const shader = new Bol3D.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: Bol3D.AdditiveBlending,
        uniforms: {
          totalTime: this.time,
          uColor: {
            value: new Bol3D.Color(color) // 颜色
          },
          uRange: {
            value: range || 100 // 显示当前范围的个数
          },
          uSize: {
            value: size // 粒子大小
          },
          uTotal: {
            value: number // 当前粒子的所有的总数
          },
          uFrequency: {
            value: frequency // 频率
          },
          time: {
            value: 0 // 
          }
        },
        vertexShader: `
          attribute float index;
          attribute float current;
          uniform float time;
          uniform float uSize;
          uniform float uRange; // 展示区间
          uniform float uTotal; // 粒子总数
          uniform float totalTime; // 总经过时间
          uniform float uFrequency;
          uniform vec3 uColor; 
          varying vec3 vColor;
          varying float vOpacity;
          void main() {
            // 需要当前显示的索引
            float size = uSize;
            float showNumber = uTotal * mod(time, 1.0);


            // vOpacity = 1.0;
            if (showNumber > current && showNumber < current + uRange) {
              float uIndex = ((current + uRange) - showNumber) / uRange;
              size *= uIndex;
              vOpacity = 1.0;
            } else {
              vOpacity = 0.0;
            }


            // 顶点着色器计算后的Position
            vColor = uColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
          }`,
        fragmentShader: `
          varying vec3 vColor; 
          varying float vOpacity;
          void main() {
            gl_FragColor = vec4(vColor, vOpacity);
        }`
      });

      const point = new Bol3D.Points(geometry, shader);

      return point;
    },

    /**
     * 创建包围线条材质
     */
    createSurroundLineMaterial({ max, min, size }) {
      if (this.surroundLineMaterial) return surroundLineMaterial;

      this.surroundLineMaterial = new Bol3D.ShaderMaterial({
        transparent: true,
        uniforms: {
          uColor: {
            value: new Bol3D.Color("#14324c")
          },
          uActive: {
            value: new Bol3D.Color("#7797a3")
          },
          time: this.time,
          uOpacity: {
            value: 0.6
          },
          uMax: {
            value: max,
          },
          uMin: {
            value: min,
          },
          uRange: {
            value: 200
          },
          uSpeed: {
            value: 0.2
          },
          uStartTime: this.StartTime
        },
        vertexShader: this.surroundLineShader.vertexShader,
        fragmentShader: this.surroundLineShader.fragmentShader
      });

      return this.surroundLineMaterial;
    },

    initShader: function () {
      this.isStart = true
      const model = STATE.sceneList.peilou.children[0]
      this.setCityMaterial(model)
      this.surroundLine(model)

      setTimeout(() => {
        this.flyData.forEach((data) => {
          const mesh = this.flyShader(data);
          mesh.material.uniforms.time = this.time;
          mesh.renderOrder = 10;
          container.attach(mesh)
        });
      }, 1000)
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
  },
}


export default Shader

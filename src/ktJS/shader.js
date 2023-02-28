import { STATE } from './STATE.js'
import Utils from './utils/index'
import Effects from './utils/effect'
import { CACHE } from './CACHE.js';

const Shader = {
  peilou: {
    time: { value: 0 },
    isStart: false,
    StartTime: { value: 0 },
    surroundLineMaterial: null,
    flyData: [{
    //   source: { x: 100, y: 0, z: 100 },
    //   target: { x: 100, y: 400, z: 100 },
    //   range: 150,
    //   height: 230,
    //   color: '#65cbe3',
    //   frequency: 3.0,
    //   size: 10
    // }, {
    //   source: { x: 350, y: 0, z: 190 },
    //   target: { x: 350, y: 400, z: 190 },
    //   range: 150,
    //   height: 230,
    //   color: '#65cbe3',
    //   frequency: 1.9,
    //   size: 10
    // }, {
    //   source: { x: 150, y: 0, z: -150 },
    //   target: { x: 150, y: 400, z: -150 },
    //   range: 150,
    //   height: 230,
    //   color: '#65cbe3',
    //   frequency: 2.1,
    //   size: 10
    // }, {
    //   source: { x: -150, y: 0, z: -200 },
    //   target: { x: -150, y: 400, z: -200 },
    //   range: 150,
    //   height: 230,
    //   color: '#65cbe3',
    //   frequency: 2.4,
    //   size: 10
    // }, {
    //   source: { x: 300, y: 0, z: -300 },
    //   target: { x: 300, y: 400, z: -300 },
    //   range: 150,
    //   height: 230,
    //   color: '#65cbe3',
    //   frequency: 2.6,
    //   size: 10
    // }, {
      source: { x: -200, y: 0, z: 500 },
      target: { x: -200, y: 400, z: 500 },
      range: 150,
      height: 230,
      color: '#65cbe3',
      frequency: 3.4,
      size: 10
    }],

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
              0, // 0 1开关
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
      CACHE.container.attach(line);
      CACHE.container.addBloom(line)
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

      const temp1 = [0,0,0,-6.060236027763116,2.5180602303964132,0.6121045337085322,-12.238510332152941,5.07151121530701,1.2479290627650976,-18.5311722448202,7.659258395313825,1.9067399790661483,-24.93457109741561,10.280207210998892,2.5878036745081374,-31.445056221589894,12.933263102944252,3.2903865409875173,-38.05897694899377,15.617331511731935,4.01375497040074,-44.772682611277965,18.33131787794398,4.75717535464426,-51.58252254009317,21.074127642162424,5.519914085614527,-58.48484606709015,23.844666244969297,6.301237555207995,-65.47600252391959,26.64183912694664,7.100412155321118,-72.55234124223223,29.464551728676483,7.916704277850347,-79.71021155367879,32.31170949074087,8.749380314692132,-86.94596278990998,35.18221785372182,9.597706657742934,-94.25594428257654,38.074982258201395,10.460949698899196,-101.63650536332914,40.98890814476161,11.338375830057375,-109.08399536381856,43.922900953984495,12.229251443113924,-116.5947636156955,46.87586612645211,13.132842929965298,-124.16515945061066,49.84670910274648,14.04841668250794,-131.79153220021476,52.83433532344963,14.975239092638313,-139.47023119615855,55.837650229143605,15.912576552252863,-147.19760577009276,58.85555926041043,16.859695453248047,-154.97000525366806,61.88696785783217,17.815862187520317,-162.78377897853522,64.93078146199083,18.780343146966125,-170.6352762763449,67.98590551346845,19.752404723481916,-178.5208464787479,71.05124545284708,20.731313308964154,-186.43683891739488,74.12570672070875,21.716335295309293,-194.37960292393657,77.20819475763547,22.706737074413777,-202.34548783002373,80.29761500420932,23.701785038174055,-210.33084296730698,83.3928729010123,24.700745578486586,-218.33201766743716,86.49287388862646,25.70288508724783,-226.34536126206493,89.59652340763385,26.707469956354227,-234.36722308284104,92.70272689861648,27.713766577702234,-242.39395246141618,95.8103898021564,28.721041343188304,-250.4218987294411,98.91841755883563,29.728560644708896,-258.4474112185664,102.02571560923623,30.73559087416045,-266.466839260443,105.13118939394022,31.741398423439424,-274.4765321867215,108.23374435352963,32.74524968444227,-282.4728393290526,111.33228592858651,33.74641104906546,-290.4521100190871,114.4257195596929,34.74414890920541,-298.41069358847574,117.51295068743082,35.737729656758596,-306.344939368869,120.5928847523823,36.72641968362146,-314.251196691918,123.66442719512938,37.70948538169047,-322.1258148892731,126.72648345625413,38.68619314286207,-329.9651432925852,129.77795897633854,39.6558093590327,-337.765531233505,132.81775919596464,40.61760042209884,-345.5233280436832,135.84478955571453,41.57083272395692,-353.23488305477053,138.85795549617018,42.514772656503396,-360.8965455984176,141.85616245791365,43.44868661163473,-368.5046650062754,144.83831588152697,44.37184098124736,-376.0555906099944,147.8033212075922,45.28350215723775,-383.5456717412254,150.75008387669135,46.18293653150235,-390.9712577316191,153.67750932940646,47.06941049593762,-398.3286979128263,156.58450300631955,47.94219044244,-405.61434161649765,159.4699703480127,48.800542762905955,-412.82453817428393,162.33281679506788,49.64373384923192,-419.9556369178358,165.1719477880672,50.471030093314354,-427.00398717880387,167.98626876759266,51.28169788704971,-433.9659382888391,170.7746851742263,52.07500362233446,-440.837839579592,173.53610244855014,52.85021369106502,-447.61604038271355,176.26942603114622,53.60659448513789,-454.29689002985424,178.97356136259657,54.34341239644947,-460.87673785266475,181.64741388348327,55.05993381689626,-467.3519331827961,184.2898890343883,55.755425138374676,-473.71882535189866,186.89989225589372,56.4291527527812,-479.9737636916233,189.47632898858157,57.08038305201226,-486.11309753362093,192.01810467303386,57.70838242796432,-492.13317620954183,194.52412474983268,58.312417272533835,-498.0303490510372,196.99329465956,58.89175397761724,-503.8009653897574,199.42451984279796,59.445658935111005,-509.44137455735347,201.8167057401284,59.97339853691161,-514.9479258854757,204.16875779213353,60.47423917491543,-520.3169687057753,206.47958143939542,60.947447241018985,-525.5448523499025,208.7480821224959,61.39228912711871,-530.6279261495085,210.9731652820172,61.80803122511105,-535.5625394362437,213.1537363585412,62.193939926892476,-540.3450415417587,215.28870079265005,62.54928162435942,-544.9717817977048,217.37696402492583,62.87332270940833,-549.4391095357321,219.41743149595044,63.165329573935686,-553.7433740874918,221.40900864630592,63.424568609837905,-557.8809247846343,223.35060091657445,63.65030620901146,-561.8481109588104,225.24111374733786,63.8418087633528,-565.6412819416707,227.0794525791784,63.9983426647584,-569.2567870648663,228.86452285267794,64.1191743051247,-572.6909756600475,230.59523000841858,64.20357007634809,-575.9401970588651,232.27047948698242,64.25079637032513,-579.0008005929701,233.88917672895144,64.26011957895221,-581.8691355940128,235.45022717490758,64.23080609412578,-584.5415513936446,236.95253626543303,64.16212230774232,-587.0143973235154,238.39500944110972,64.05333461169826,-589.2840227152764,239.77655214251973,63.90370939789007,-591.3467769005781,241.09606981024515,63.712513058214185,-593.1990092110715,242.35246788486788,63.47901198456708,-594.8370689784072,243.54465180697005,63.20247256884515,-596.2573055342359,244.67152701713366,62.88216120294493,-597.456068210208,245.73199895594075,62.51734427876285,-598.4297063379745,246.72497306397344,62.107288188195284,-599.1745692491864,247.64935478181366,61.6512593231388,-599.6870062754942,248.50404955004345,61.148524075489775,-599.9633667485485,249.28796280924487,60.5983488371447,-600,250,60,-599.7568303712961,250.70575719261313,59.27836775637847,-599.2179163117903,251.3228429910941,58.49730515911822,-598.3877615437788,251.85260772124184,57.65771723898532,-597.2708697895583,252.29640170885534,56.76050902674583,-595.8717447714251,252.6555752797335,55.806585553165846,-594.194890211676,252.9314787596754,54.79685184901142,-592.2448098326072,253.12546247447992,53.73221294504864,-590.026007356515,253.23887674994606,52.61357387204357,-587.5429865056964,253.27307191187276,51.44183966076227,-584.8002510024475,253.22939828605902,50.21791534197082,-581.8023045690649,253.1092061983038,48.942705946435304,-578.553650927845,252.9138459744061,47.61711650492178,-575.0587938010843,252.64466794016482,46.24205204819636,-571.3222369110794,252.30302242137896,44.818417607025054,-567.3484839801265,251.8902597438475,43.34711821217395,-563.1420387305224,251.40773023336942,41.829058894409144,-558.7074048845633,250.85678421574363,40.26514468449668,-554.0490861645461,250.23877201676913,38.656280613202654,-549.1715862927666,249.5550439622449,37.00337171129313,-544.0794089915219,248.80695037796986,35.307323009534166,-538.7770579831083,247.995841589743,33.569039538691854,-533.2690369898221,247.12306792336332,31.789426329532255,-527.5598497339599,246.18997970462976,29.969388412821452,-521.6539999378183,245.1979272593413,28.1098308193255,-515.5559913236937,244.14826091329698,26.211658579810475,-509.2703276138823,243.0423309922956,24.275776725042462,-502.80151253068084,241.88148782213622,22.30309028578753,-496.1540497963859,240.6670817286178,20.294504292811734,-489.33244313329374,239.4004630375393,18.250923776881155,-482.341196263701,238.08298207469974,16.173253768761878,-475.184812909904,236.715989165898,14.062399299219962,-467.8677967941994,235.3008346369331,11.919265399021473,-460.3946516388835,233.83886881360408,9.7447570989325,-452.7698811662528,232.33144202170976,7.539779429719099,-444.9979890986039,230.77990458704915,5.305237422147357,-437.0834791582332,229.18560683542125,3.042036106983331,-429.03085506743724,227.54989909262503,0.7510805149931059,-420.8446205485126,225.87413168445948,-1.56672432305721,-412.5292793237554,224.1596549367235,-3.9104733764016384,-404.0893351154623,222.4078191752161,-6.279261614274041,-395.52929164592973,220.61997472573623,-8.672184005908383,-386.85365263745445,218.79747191408285,-11.088335520538555,-378.06692181233257,216.94166106605493,-13.526811127398503,-369.17360289286074,215.05389250745148,-15.986705795722164,-360.1781996013354,213.13551656407148,-18.46711449474344,-351.08521566005305,211.18788356171382,-20.96713219369628,-341.89915479131025,209.21234382617746,-23.48585386181462,-332.62452071740324,207.21024768326143,-26.022374468332348,-323.26581716062884,205.1829454587647,-28.575788982483434,-313.8275478432831,203.13178747848616,-31.145192373501793,-304.31421648766303,201.05812406822486,-33.72967961062134,-294.7303268160645,198.9633055537798,-36.328345663076036,-285.08038255078446,196.84868226094986,-38.940285500099755,-275.3688874141193,194.71560451553398,-41.56459409092648,-265.60034512836523,192.5654226433312,-44.20036640479012,-255.77925941581913,190.3994869701405,-46.84669741092458,-245.91013399877707,188.21914782176074,-49.502682078563815,-235.9974725995359,186.025755523991,-52.16741537694173,-226.04577894039176,183.82066040263024,-54.8399922752923,-216.05955674364137,181.60521278347736,-57.5195077428494,-206.0433097315812,179.38076299233137,-60.20505674884697,-196.0015416265075,177.1486613549913,-62.89573426251897,-185.93875615071732,174.91025819725598,-65.59063525309924,-175.85945702650636,172.66690384492455,-68.28885468982182,-165.7681479761716,170.41994862379576,-70.98948754192062,-155.66933272200922,168.17074285966868,-73.69162877862951,-145.5675149863158,165.92063687834235,-76.39437336918249,-135.46719849138802,163.67098100561563,-79.09681628281339,-125.37288695952219,161.42312556728754,-81.79805248875624,-115.28908411301478,159.17842088915702,-84.49717695624491,-105.22029367416229,156.9382172970231,-87.1932846545133,-95.17101936526126,154.70386511668477,-89.88547055279543,-85.1457649086081,152.47671467394085,-92.57282962032511,-75.14903402649912,150.25811629459037,-95.25445682633642,-65.18533044123126,148.04942030443237,-97.92944714006317,-55.259157875100584,145.85197702926573,-100.5968955307393,-45.37502005040369,143.66713679488947,-103.25589696759879,-35.53742068943694,141.49624992710247,-105.9055464198755,-25.75086351449704,139.34066675170382,-108.54493885680344,-16.019852247880408,137.2017375944924,-111.17316924761649,-6.348890611883462,135.08081278126733,-113.78933256154853,3.257517671197263,132.97924263782738,-116.39252376783358,12.794868879065291,130.8983774899716,-118.98183783570549,22.258659289424372,128.8395676634989,-121.55636973439827,31.64438517997786,126.80416348420835,-124.1152144331458,40.947542828429164,124.79351527789888,-126.657466901182,50.163628512481864,122.80897337036944,-129.1822221077408,59.28813850983937,120.85188808741901,-131.6885750220561,68.31656909820526,118.92360975484658,-134.1756206133619,77.24441655528358,117.02548869845103,-136.64245385089208,86.0671771587771,115.15887524403144,-139.08816970388062,94.7803471863898,113.32511971738668,-141.51186314156138,103.37942291582533,111.52557244431574,-143.9126291331683,111.85990062478652,109.7615837506176,-146.28956264793544,120.21727659097758,108.03450396209124,-148.64175865509654,128.4470470921018,106.34568340453566,-150.96831212388557,136.54470840586248,104.69647240374977,-153.2683180235365,144.50575680996326,103.08822128553257,-155.54087132328326,152.32568858210823,101.52228037568295,-157.7850669923598,160,100,-160]
      geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(temp1, 3));
      // geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(attrPositions, 3));
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
            float showNumber = uTotal * mod(time, 2.0);


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
            value: 0.3
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


      // this.flyData.forEach((data) => {
      //   const mesh = this.flyShader(data);
      //   mesh.material.uniforms.time = this.time;
      //   mesh.renderOrder = 10;
      //   container.attach(mesh)
      // });
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

const Shader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() { 
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ); 
      vUv = uv;
      vPosition = position;
    }
  `,
  fragmentShader: `
    uniform float u_time;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() { 
      float opacity = 0.5;

      vec3 firstColor = vec3(1.0,0.0,0.0);
      vec3 endColor = vec3(0.0,0.0,1.0);

      vec3 color = mix(firstColor, endColor, (vUv.x));
      gl_FragColor = vec4(color, opacity);
    } 
  `
}

export default {
  Shader
}

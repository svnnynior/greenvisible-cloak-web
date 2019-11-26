import * as THREE from "three";

export default class ChromaKeyMaterial extends THREE.ShaderMaterial {
  constructor(video: HTMLVideoElement, color: string) {
    const videoTexture = new THREE.Texture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const uniforms = {
      video_texture: {
        type: "t",
        value: videoTexture,
      },
      color: {
        type: "c",
        value: color,
      },
    };

    super({
      depthWrite: false,
      transparent: true,
      uniforms,
      vertexShader: `
        varying mediump vec2 vUv;
        void main(void) {
          vUv = uv;
          mediump vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader: `
        uniform mediump sampler2D video_texture;
        uniform mediump vec3 color;
        varying mediump vec2 vUv;
        void main(void) {
          mediump vec3 tColor = texture2D(video_texture, vUv).rgb;
          mediump float a = (length(tColor - color) - 0.5) * 7.0;
          gl_FragColor = vec4(tColor, a);
        }`,
    });
  }
}

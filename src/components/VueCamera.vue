<template>
  <div
    ref="holder"
    :class="{ 'is-selfie': isSelfieMode }"
    class="vue-camera"
  >
    <template v-if="isSupported">
      <video
        ref="camera"
        class="vue-camera-video"
        autoplay
        playsinline
        muted
        @click="() => captureOnClick && capture()"
      />

      <div
        class="vue-camera-shutter"
        :class="{'is-on': isShutterOn }"
      />

      <img
        v-if="preview"
        :src="preview"
        class="vue-camera-preview"
      >

      <div
        v-if="isLoading"
        class="vue-camera-loader"
      >
        <loader-icon />
      </div>

      <div
        v-if="isMobile"
        class="vue-camera-switcher"
        @click="switchCamera"
      >
        <switch-icon />
      </div>
    </template>
    <template v-else>
      <div class="vue-camera-content">
        <crash-icon />
      </div>

      <input
        ref="fallback"
        class="vue-camera-fallback"
        style="display: none"
        type="file"
        accept="image/*"
        capture="camera"
      >
    </template>

    <slot
      :capture="capture"
      :isSupported="isSupported"
      :isLoading="isLoading"
      :isSelfieMode="isSelfieMode"
      :isPreviewing="isPreviewing"
    />
  </div>
</template>

<script>
import { isIOS, isMobile } from "../utils";
import LoaderIcon from '../images/camera-loader.svg';
import CrashIcon from '../images/camera-crash.svg';
import SwitchIcon from '../images/camera-switch.svg';

function hasGetUserMedia() {
  return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export default {
  components: {
    LoaderIcon,
    CrashIcon,
    SwitchIcon
  },
  props: {
    captureOnClick: {
      type: Boolean,
      default: false
    },
    preview: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      hasPermissions: false,
      isLoading: true,
      facingMode: isMobile() ? "environment" : "user",
      isMobile: isMobile(),
      isSupported: hasGetUserMedia(),
      isShutterOn: false,
    };
  },
  computed: {
    isSelfieMode() {
      return this.facingMode === "user";
    },
    isPreviewing() {
      return Boolean(this.preview)
    }
  },
  mounted() {
    if (this.isSupported) this.initUi();
  },
  methods: {
    async initUi() {
      try {
        const { width, height } = await this.setupCamera();
        this.setupCameraDimensions(width, height, 320);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.isSupported = false;
        if (error.name === "TypeError" && isIOS()) {
          console.log("safari webview error");
        } else if (error.name === "NotAllowedError") {
          console.log("no access");
        } else {
          console.log("general error");
        }
      }
    },
    async setupCamera() {
      const constraints = {
        audio: false,
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const camera = this.$refs.camera;
      camera.srcObject = stream;

      return new Promise(resolve => {
        camera.onloadedmetadata = () => {
          resolve({
            width: camera.videoWidth,
            height: camera.videoHeight
          });
        };
      });
    },
    setupCameraDimensions(width, height, sizing) {
      const aspectRatio = width / height;
      const camera = this.$refs.camera;

      if (width >= height) {
        camera.height = sizing;
        camera.width = aspectRatio * sizing;
      } else {
        camera.width = sizing;
        camera.height = sizing / aspectRatio;
      }
    },
    async switchCamera() {
      const camera = this.$refs.camera;
      this.facingMode =
        this.facingMode === "environment" ? "user" : "environment";

      const constraints = {
        sound: false,
        video: {
          facingMode: this.facingMode
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      camera.srcObject = stream;
    },
    capturePhoto() {
      const { camera } = this.$refs;
      const canvas = document.createElement("canvas");
      canvas.width = camera.videoWidth;
      canvas.height = camera.videoHeight;
      this.shutter();
      canvas.getContext("2d").drawImage(camera, 0, 0);
      return canvas.toDataURL("image/webp");
    },
    getPhoto() {
      const input = this.$refs.fallback;

      return new Promise(resolve => {
        const onChange = event => {
          const file = event.currentTarget.files[0];
          const url = window.URL.createObjectURL(file);
          resolve(url);
          input.removeEventListener("change", onChange);
        };
        input.addEventListener("change", onChange);
        input.click();
      });
    },
    async capture() {
      const imgUrl = this.isSupported
        ? this.capturePhoto()
        : await this.getPhoto();
      this.$emit("capture", imgUrl);
    },
    shutter() {
      this.isShutterOn = true;
      setTimeout(() => this.isShutterOn = false, 300);
    }
  }
};
</script>

<style>
.vue-camera {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.vue-camera-loader {
  z-index: 10;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  color: #B0B0B0;
}

.vue-camera-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.vue-camera-video {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  object-fit: cover;
}

.vue-camera.is-selfie .vue-camera-video {
  transform: scale(-1, 1);
}

.vue-camera-shutter {
  z-index: 30;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  transition: opacity 150ms ease;
  opacity: 0;
  pointer-events: none;
}

.vue-camera-shutter.is-on {
  opacity: 1;
}

.vue-camera-preview {
  z-index: 20;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vue-camera.is-selfie .vue-camera-preview {
  transform: scale(-1, 1);
}

.vue-camera-switcher {
  z-index: 10;
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 40px;
  color: #fff;
}

.vue-camera-switcher svg {
  width: 100%;
  height: 100%;
}
</style>

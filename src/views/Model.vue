<template>
  <div
    style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;" />
    <div
      class="btns">
      <i
        @click="handleClick">
        {{ cut ? '内部裁切' : '外部裁切' }}
      </i>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import {
  cutModelByPolygon
} from '@/utils/ClippingPlane'
export default {
  data () {
    return {
      cut: false,
      tileset: null
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    const _this = this
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM'
    const viewer = new Cesium.Viewer('cesium-container', {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false, // 是否显示左下角的仪表盘
      baseLayerPicker: false, // 是否显示图层选择器按钮，右上角那个地图图标
      fullscreenButton: false, // 是否显示全屏按钮
      vrButton: false, // 是否显示VR按钮
      geocoder: false, // 是否显示搜索按钮
      homeButton: false, // 是否显示主页按钮
      infoBox: false, // 是否显示提示信息
      sceneModePicker: false, // 是否显示右上角的模式切换按钮
      selectionIndicator: false, // 是否显示选取指示器组件
      timeline: false, // 是否显示下边的时间轴
      navigationHelpButton: false, // 是否显示右上角的帮助按钮
      navigationInstructionsInitiallyVisible: true, // 是否显示导航
      // scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
      // requestRenderMode: true,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
    })

    // 添加 3DTileset
    this.tileset = new Cesium.Cesium3DTileset({
      url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json', // 上海（白）
      // url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json', // 上海（蓝）
      // url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(this.tileset)
    viewer.zoomTo(this.tileset) // 视角切换到模型的位置

    // const new_tileset = new Cesium.Cesium3DTileset({
    //   // url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json', // 上海（白）
    //   url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json', // 上海（蓝）
    //   // url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
    //   debugShowMemoryUsage: false
    // })
    // viewer.scene.primitives.add(new_tileset)

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      // 平面坐标系转笛卡尔空间直角坐标系
      /**
        position: Cartesian2 {x: 683.0753784179688, y: 512.71826171875}
        转
        Cartesian3{x: -2174106.926252774, y: 4386734.375324652, z: 4074136.167795586}
       */
      console.log('平面坐标系转笛卡尔空间直角坐标系', viewer.scene.pickPosition(event.position))

      // 空间直角坐标系转经纬度
      const earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
      const cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      console.log('空间直角坐标系转经纬度', longitude, latitude, cartographic.height)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
    handleClick () {
      this.cut = !this.cut
      if (this.cut) {
        // 裁切模型
        cutModelByPolygon(
          this.tileset,
          [
            [121.49260265519028, 31.242117807041236],
            [121.51355676668399, 31.245032122784824],
            [121.51871163020894, 31.232316199923016],
            [121.50450627122848, 31.227712061479057],
            [121.49406078139155, 31.238990131267578]
          ],
          true // 外部裁切
        )
      } else {
        cutModelByPolygon(
          this.tileset,
          [
            [121.49260265519028, 31.242117807041236],
            [121.51355676668399, 31.245032122784824],
            [121.51871163020894, 31.232316199923016],
            [121.50450627122848, 31.227712061479057],
            [121.49406078139155, 31.238990131267578]
          ],
          false // 内部裁切
        )
      }
    }
  }
}
</script>

<template>
  <div
    style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;" />
    <div
      class="btns">
      <i id="left"
        class="el-icon-arrow-left" />
      <i id="right"
        class="el-icon-arrow-right" />
      <i id="up"
        class="el-icon-arrow-up" />
      <i id="down"
        class="el-icon-arrow-down" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { createClippingPlaneFun } from '@/utils/ClippingPlane'
export default {
  data () {
    return {}
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    const _this = this
    let timer = null
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
    window.viewer = viewer

    // 模型一
    const tileseta = createClippingPlaneFun(
      'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json',
      new Cesium.ClippingPlaneCollection({
        planes: [
          new Cesium.ClippingPlane(
            new Cesium.Cartesian3(1.0, 0.0, 0.0),
            0.0
          ) // 左
          // new Cesium.ClippingPlane(
          //   new Cesium.Cartesian3(0.0, 0.0, 1.0),
          //   0.0
          // ) // 上
        ],
        unionClippingRegions: true
      })
    )

    // 模型二
    const tilesetb = createClippingPlaneFun(
      'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json',
      new Cesium.ClippingPlaneCollection({
        planes: [
          new Cesium.ClippingPlane(
            new Cesium.Cartesian3(-1.0, 0.0, 0.0),
            0.0
          ) // 右
          // new Cesium.ClippingPlane(
          //   new Cesium.Cartesian3(0.0, 0.0, -1.0),
          //   0.0
          // ) // 下
        ],
        // edgeColor: Cesium.Color.WHITE,
        // edgeWidth: 0.0,
        unionClippingRegions: true
      })
    )

    viewer.zoomTo(tileseta)

    function changeFun (type) {
      if (timer) {
        clearInterval(timer)
      }
      timer = setInterval(() => {
        if (type === 'left') {
          if (tileseta.clippingPlanes.get(0).distance > 3500) {
            clearInterval(timer)
            return
          }
          tileseta.clippingPlanes.get(0).distance += 10
          tilesetb.clippingPlanes.get(0).distance -= 10
        } else if (type === 'right') {
          if (tilesetb.clippingPlanes.get(0).distance > 3500) {
            clearInterval(timer)
            return
          }
          tilesetb.clippingPlanes.get(0).distance += 10
          tileseta.clippingPlanes.get(0).distance -= 10
        } else if (type === 'up') {
          if (tilesetb.clippingPlanes.get(1).distance > 250) {
            clearInterval(timer)
            return
          }
          tilesetb.clippingPlanes.get(1).distance += 10
          tileseta.clippingPlanes.get(1).distance -= 10
          console.log('up', tilesetb.clippingPlanes.get(1).distance)
        } else if (type === 'down') {
          if (tileseta.clippingPlanes.get(1).distance > 250) {
            clearInterval(timer)
            return
          }
          tileseta.clippingPlanes.get(1).distance += 10
          tilesetb.clippingPlanes.get(1).distance -= 10
          console.log('down', tileseta.clippingPlanes.get(1).distance)
        }
      }, 10)
    }

    const leftBtn = document.getElementById('left')
    leftBtn.onclick = function () {
      changeFun('left')
      // if (tileseta.clippingPlanes.get(0).distance > 3500) {
      //   return
      // }
      // tileseta.clippingPlanes.get(0).distance += 500
      // tilesetb.clippingPlanes.get(0).distance -= 500
    }

    const rightBtn = document.getElementById('right')
    rightBtn.onclick = function () {
      changeFun('right')
      // if (tilesetb.clippingPlanes.get(0).distance > 3500) {
      //   return
      // }
      // tilesetb.clippingPlanes.get(0).distance += 500
      // tileseta.clippingPlanes.get(0).distance -= 500
    }

    // const upBtn = document.getElementById('up')
    // upBtn.onclick = function () {
    //   changeFun('up')
    // }

    // const downBtn = document.getElementById('down')
    // downBtn.onclick = function () {
    //   changeFun('down')
    // }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;">
    <div
      class="btn_container">
      <button
        id="getGeometryInstanceAttributes">通过id查找Geometry并改变样式</button>
      <button
        id="getPrimitive">查找primitive</button>
      <button
        id="clear">清除primitive</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-reserved-keys */
import { getObjectSize } from '@/utils/getObjectSize'
import * as turf from '@turf/turf'
export default {
  data () {
    return {
      _primitive: null
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

    // 随机生成坐标
    const positions = turf.randomPoint(1000, {
      bbox: [
        70.01180980018789,
        20.12881664932077,
        134.27620577723778,
        50.568644557429835
      ]
      // bbox: [
      //   114.72692258196378,
      //   38.1023045206586,
      //   119.02498669643339,
      //   40.94067311600792
      // ]
    }).features.map((_, index) => {
      return {
        longitude: _.geometry.coordinates[0],
        latitude: _.geometry.coordinates[1],
        altitude: 0,
        value: index
      }
    })
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        70.01180980018789,
        20.12881664932077,
        134.27620577723778,
        50.568644557429835
      )
    })

    // viewer.camera.percentageChanged = 0.00001
    // viewer.camera.changed.addEventListener(function (event) {
    //   console.log(CesiumUtils.getExtend(viewer))
    // })

    viewer.scene.renderError.addEventListener(function () {
      alert('内存超出100%')
    })

    // Primitive 方式
    const instance1 = new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(positions[0].longitude, positions[0].latitude, positions[0].longitude + 1.0, positions[0].latitude + 1.0),
        // rectangle: Cesium.Rectangle.fromDegrees(117.5091325944274, 38.38624847508735, 117.6091325944274, 38.48624847508735),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
      }),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.8)
      }
    })
    const instance2 = new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(positions[10].longitude, positions[10].latitude, positions[10].longitude + 1.0, positions[10].latitude + 1.0),
        // rectangle: Cesium.Rectangle.fromDegrees(116.77941010807417, 38.94292632334566, 116.87941010807417, 38.99292632334566),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
      }),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.8)
      }
    })
    viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: [instance1, instance2],
      // appearance: new Cesium.EllipsoidSurfaceAppearance({
      //   material: Cesium.Material.fromType('Stripe')
      // })
      appearance: new Cesium.PerInstanceColorAppearance()
    }))

    // 合并多个 GeometryInstances 为一个 Primitive 可以极大的提高性能
    const instances = []
    positions.map((point, index) => {
      instances.push(
        new Cesium.GeometryInstance({
          geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(point.longitude, point.latitude, point.longitude + 0.80, point.latitude + 0.80),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
          }),
          id: 'instance' + index,
          attributes: {
            color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
            show: new Cesium.ShowGeometryInstanceAttribute(true)
          }
        })
      )
    })
    this._primitive = new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance({
        // translucent: false,
        // closed: true
      })
    })
    console.log('sizeof', getObjectSize(this._primitive))
    /**
     * viewer.scene.primitives 方法 http://www.bigemap.com/Public/offline/gl/PrimitiveCollection.html
     * remove(this._primitive) // 清除指定 primitive
     * removeAll() // 清除所有 primitive
     */
    viewer.scene.primitives.add(this._primitive)

    document.getElementById('getGeometryInstanceAttributes').onclick = function () {
      // 随机选取一个 Geometry 改变颜色，设置显隐
      const radom = Math.floor(Math.random() * 100)
      const attributes = _this._primitive.getGeometryInstanceAttributes('instance' + radom)
      attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
        Cesium.Color.fromRandom({
          alpha: 1.0
        })
      )
      setTimeout(() => {
        // 设置显隐
        attributes.show = Cesium.ShowGeometryInstanceAttribute.toValue(false)
      }, 2000)
      setTimeout(() => {
        // 设置显隐
        attributes.show = Cesium.ShowGeometryInstanceAttribute.toValue(true)
      }, 4000)
    }

    document.getElementById('clear').onclick = function () {
      viewer.scene.primitives.remove(_this._primitive)
    }

    document.getElementById('getPrimitive').onclick = function () {
      console.log(_this._primitive)
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const pick = viewer.scene.pick(event.position)
      if (Cesium.defined(pick) && pick.id) {
        console.log('pick', pick)
        const attributes = _this._primitive.getGeometryInstanceAttributes(pick.id)
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          Cesium.Color.fromRandom({
            alpha: 1.0
          })
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
  }
}
</script>

<style>
* {
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
}
.btn_container {
  position: absolute;
  z-index: 9;
  top: 50px;
  right: 50px;
  padding: 20px;
}
</style>

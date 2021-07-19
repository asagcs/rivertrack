import './App.css';
import React, { Component } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'; // Node.js
import { getAreaList2 } from './getIntersectionPoint';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      map: null
    }
  }

  componentDidMount () {
    this.setMap();
    
  }

  setMap () {
    let map = new window.T.Map("mapDiv");
    map.centerAndZoom(new window.T.LngLat(116.40969, 39.89945), 12);

    // this.setState({ map }, this.setPolygon)
    this.setState({ map }, this.setPolineOfArea)
  }

  /**
   * 绘制单个方向上的范围线
   * @param {LatLon} points1  顺序点1
   * @param { LatLon } points2 顺序点2
   * @param {*} flag true   正向90度，  false, 反向90度
   * @param {boolean}  first true  第一组点  false   非第一组点 
   */
  setLineAndMarker (points1, points2, flag, first) {
    let angle = flag ? 90 : -90;
    const p1 = new LatLon(points1[0], points1[1]);
    const p2 = new LatLon(points2[0], points2[1]);
    
    // 初始方位角
    let Angle1 = p1.initialBearingTo(p2);
    // 获取点位置
    let newPoint1 = p1.destinationPoint(100, (Angle1 + angle));
    let newPoint2 = p2.destinationPoint(100, (Angle1 + angle));
    

    return {
      newPoint1,
      newPoint2
    }
  }

  /**
   * 
   * @param {*} points1 顺序点1
   * @param {*} points2 顺序点2
   * @param {*} points3 顺序点3
   * @param {Bollean} flagOfFirst  first true  第一组点  false   非第一组点 
   */
  getLocation (points1, points2, points3, flagOfFirst, tparr, btarr, isLast) {
    let lineBottom1 = this.setLineAndMarker(points1, points2, true, flagOfFirst);
    let lineTop1 = this.setLineAndMarker(points1, points2, false, flagOfFirst);
    this.setPoline([lineBottom1.newPoint1, lineBottom1.newPoint2])
    this.setPoline([lineTop1.newPoint1, lineTop1.newPoint2])
    this.setMarker1(points1[0], points1[1])
    this.setMarker1(points2[0], points2[1])
    this.setMarker1(points3[0], points3[1])
    let lineBottom2 = this.setLineAndMarker(points2, points3, true, false);
    let lineTop2 = this.setLineAndMarker(points2, points3, false, false);
     this.setPoline([lineBottom2.newPoint1, lineBottom2.newPoint2])
    this.setPoline([lineTop2.newPoint1, lineTop2.newPoint2])
    
    if (flagOfFirst) {
      tparr.push(lineTop1.newPoint1);
      btarr.push(lineBottom1.newPoint1);
    } 

    this.setMarker(lineTop1.newPoint1._lat,lineTop1.newPoint1._lon)
    this.setMarker(lineTop1.newPoint2._lat,lineTop1.newPoint2._lon)
    this.setMarker(lineTop2.newPoint1._lat,lineTop2.newPoint1._lon)
    this.setMarker(lineTop2.newPoint2._lat,lineTop2.newPoint2._lon)
    let lines = getAreaList2(lineTop1, lineBottom1, lineTop2, lineBottom2, isLast, tparr, btarr)
    

    let tp = lines.topArr;
    let bt = lines.bottomArr

    return {
      tp,
      bt
    }
  }


  setPolineOfArea () {
    
    
    // let river = `115.251071565:28.760179962,115.25203716:28.759343113,115.252584331:28.760072674`;
    let river = `115.18594753:28.78465351,115.185926072:28.782893981,115.185690038:28.781756725,115.188114755:28.780962791,115.19000303:28.779696788,115.193092935:28.778838481,115.196204297:28.77866682,115.19839298:28.778366412,115.201547257:28.778194751,115.206074826:28.776306476,115.208521001:28.775748576,115.209787004:28.775512542,115.21092426:28.773985185,115.211224668:28.773426427,115.212254636:28.7734908,115.212662332:28.773297681,115.213542096:28.773662462,115.215451829:28.773469342,115.215687863:28.772954358,115.214786641:28.772341098,115.21590244:28.770302619,115.219056718:28.771482791,115.219850652:28.769916381,115.220408551:28.767788209,115.222747437:28.765614976,115.223219506:28.76456355,115.225472562:28.763140477,115.226373784:28.762496747,115.226073377:28.761368932,115.226588361:28.759681072,115.227435939:28.758329024,115.228101127:28.757805456,115.229055993:28.757719626,115.230815522:28.758395542,115.231920592:28.758406271,115.232950561:28.758910527,115.23369085:28.760187258,115.234538428:28.760544743,115.2357186:28.761628355,115.236930959:28.761842932,115.238046758:28.762196984,115.238497369:28.762390103,115.239430778:28.762121882,115.240589492:28.76269051,115.241555087:28.763527359,115.242306106:28.763870682,115.243550651:28.763924326,115.243529193:28.763377156,115.244655721:28.762669052,115.245417468:28.761928763,115.246361606:28.761778559,115.246983878:28.761531796,115.248271338:28.761928763,115.248968713:28.76158544,115.249794833:28.761714186,115.250921361:28.761134829,115.251071565:28.760179962,115.25203716:28.759343113,115.252584331:28.760072674,115.253206603:28.760040488,115.25378596:28.759729351,115.254182927:28.75909635`;


    let tparr = [], btarr = [];
    let riverArr = river.split(',').map(current => {
      let point = current.split(':');
      return point.reverse()
    })
    let len = riverArr.length - 3
    for (var i = 0; i <= len; i++) {
      let point1 = riverArr[i];
      let point2 = riverArr[i + 1];
      let point3 = riverArr[i + 2];
      let flag = i == 0 ? true : false
      let isLast = i ==  len ? true : false
      let { tp, bt } = this.getLocation(point1, point2, point3,flag, tparr, btarr, isLast);
      tparr = tp;
      btarr = bt;
    }
    

    this.setPolygon()
    this.setPoline2(tparr,  btarr);
    // this.setPolineOfArea2()
  }

  setPolineOfArea2 () {
    
    
    let river = `115.18594753:28.78465351,115.185926072:28.782893981,115.185690038:28.781756725,115.188114755:28.780962791,115.19000303:28.779696788,115.193092935:28.778838481,115.196204297:28.77866682,115.19839298:28.778366412,115.201547257:28.778194751,115.206074826:28.776306476,115.208521001:28.775748576,115.209787004:28.775512542,115.21092426:28.773985185,115.211224668:28.773426427,115.212254636:28.7734908,115.212662332:28.773297681,115.213542096:28.773662462,115.215451829:28.773469342,115.215687863:28.772954358,115.214786641:28.772341098,115.21590244:28.770302619,115.219056718:28.771482791,115.219850652:28.769916381,115.220408551:28.767788209,115.222747437:28.765614976,115.223219506:28.76456355,115.225472562:28.763140477,115.226373784:28.762496747,115.226073377:28.761368932,115.226588361:28.759681072,115.227435939:28.758329024,115.228101127:28.757805456,115.229055993:28.757719626,115.230815522:28.758395542,115.231920592:28.758406271,115.232950561:28.758910527,115.23369085:28.760187258,115.234538428:28.760544743,115.2357186:28.761628355,115.236930959:28.761842932,115.238046758:28.762196984,115.238497369:28.762390103,115.239430778:28.762121882,115.240589492:28.76269051,115.241555087:28.763527359,115.242306106:28.763870682,115.243550651:28.763924326,115.243529193:28.763377156,115.244655721:28.762669052,115.245417468:28.761928763,115.246361606:28.761778559,115.246983878:28.761531796,115.248271338:28.761928763,115.248968713:28.76158544,115.249794833:28.761714186,115.250921361:28.761134829,115.251071565:28.760179962,115.25203716:28.759343113,115.252584331:28.760072674,115.253206603:28.760040488,115.25378596:28.759729351,115.254182927:28.75909635`;
    let tparr = [], btarr = [];
    let riverArr = river.split(',').map(current => {
      let point = current.split(':');
      return point.reverse()
    })
    let len = riverArr.length - 3
    for (var i = 0; i <= len; i++) {
      let point1 = riverArr[i];
      let point2 = riverArr[i + 1];
      let point3 = riverArr[i + 2];
      let flag = i == 0 ? true : false
      let isLast = i ==  len ? true : false
      let { tp, bt } = this.getLocation(point1, point2, point3,flag, tparr, btarr, isLast);
      tparr = tp;
      btarr = bt;
    }
    this.setPolygon()
    // this.setPoline2(tparr,  btarr);
  }

  setMarker1 (lat, long) {
    let { map } = this.state;
    //创建图片对象
    var icon = new window.T.Icon({
      iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
      iconSize: new window.T.Point(19, 27),
      iconAnchor: new window.T.Point(10, 25)
  });
    let marker = new window.T.Marker(new window.T.LngLat(long, lat), {icon: icon});
    map.addOverLay(marker);
  }

  setMarker (lat, long) {
    let { map } = this.state;
    let marker = new window.T.Marker(new window.T.LngLat(long, lat));
    map.addOverLay(marker);
  }

  // 绘制折线 
  setPoline (pointArray) {
    let { map } = this.state;
    let tdmapArray = pointArray.map(current => {
      return new window.T.LngLat(current._lon, current._lat);
    })
    let poline = new window.T.Polyline(tdmapArray);
    map.addOverLay(poline)
  }

  setPolygon () {
    let { map } = this.state;
    let river = "115.18594753:28.78465351,115.185926072:28.782893981,115.185690038:28.781756725,115.188114755:28.780962791,115.19000303:28.779696788,115.193092935:28.778838481,115.196204297:28.77866682,115.19839298:28.778366412,115.201547257:28.778194751,115.206074826:28.776306476,115.208521001:28.775748576,115.209787004:28.775512542,115.21092426:28.773985185,115.211224668:28.773426427,115.212254636:28.7734908,115.212662332:28.773297681,115.213542096:28.773662462,115.215451829:28.773469342,115.215687863:28.772954358,115.214786641:28.772341098,115.21590244:28.770302619,115.219056718:28.771482791,115.219850652:28.769916381,115.220408551:28.767788209,115.222747437:28.765614976,115.223219506:28.76456355,115.225472562:28.763140477,115.226373784:28.762496747,115.226073377:28.761368932,115.226588361:28.759681072,115.227435939:28.758329024,115.228101127:28.757805456,115.229055993:28.757719626,115.230815522:28.758395542,115.231920592:28.758406271,115.232950561:28.758910527,115.23369085:28.760187258,115.234538428:28.760544743,115.2357186:28.761628355,115.236930959:28.761842932,115.238046758:28.762196984,115.238497369:28.762390103,115.239430778:28.762121882,115.240589492:28.76269051,115.241555087:28.763527359,115.242306106:28.763870682,115.243550651:28.763924326,115.243529193:28.763377156,115.244655721:28.762669052,115.245417468:28.761928763,115.246361606:28.761778559,115.246983878:28.761531796,115.248271338:28.761928763,115.248968713:28.76158544,115.249794833:28.761714186,115.250921361:28.761134829,115.251071565:28.760179962,115.25203716:28.759343113,115.252584331:28.760072674,115.253206603:28.760040488,115.25378596:28.759729351,115.254182927:28.75909635";
    let newArr1 = river.split(",").map(current => {
      const point = current.split(':');
      return new window.T.LngLat(point[0], point[1]);
    })
    var polyline = new window.T.Polyline(newArr1, {
      color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFF00", fillOpacity: 0.5
    })
    map.addOverLay(polyline);
    map.setViewport(newArr1)
  }

  /**
   * 
   * @param {*} topArr 顶部经纬度数据集 
   * @param {*} bottomArr 底部经纬度数据集
   * @returns {Obejct} { pointsAll, ntdmapArray } 天地图实例化后的经纬度数据集-合并及底部数据集
   */
  arrayCombine (topArr, bottomArr) {
    let ntdmapArray = topArr.map(current => {
      return new window.T.LngLat(current._lon, current._lat);
    })

    let ntdmapArrayB = bottomArr.map(current => {
      return new window.T.LngLat(current._lon, current._lat);
    })

    let pointsAll = ntdmapArray.concat(ntdmapArrayB.reverse());
    return pointsAll
  }
  
  filterPointsArray (initTop, initBottom) {
  }
  

  setPoline2 (initTop, initBottom) {
    let { map } = this.state;
    let pointsAll = this.arrayCombine(initTop, initBottom);
    let poline = new window.T.Polygon(pointsAll, {
        color: "red", weight: 3, opacity: 0.5
    });
    // let poline2 = new window.T.Polyline(ntdmapArrayB, {
    //   color: "red", weight: 3, opacity: 0.5
    // });
    // let test = pointsAll.reduce( (add, current, currentIndex) => {
    //   if (currentIndex === 0) {
    //     return add + `${current.lng}:${current.lat}`
    //   } else {
    //     return add + `,${current.lng}:${current.lat}`
    //   }
    // }, '')
    // console.log(test);
    //map.addOverLay(poline2)
    map.addOverLay(poline)
  }
  
  render () {
    return (
      <div className="App">
         <div id="mapDiv" className="mapDiv">

         </div>
      </div>
    );
  }
}

export default App;

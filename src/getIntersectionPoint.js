import LatLon from 'geodesy/latlon-nvector-spherical.js';

/**
   * 
   * @param {*} topArr 顶部经纬度数据集 
   * @param {*} bottomArr 底部经纬度数据集
   * @returns {Obejct} { pointsAll, ntdmapArray } 天地图实例化后的经纬度数据集-合并及底部数据集
   */
 function arrayCombine (topArr, bottomArr, top) {
     if (topArr.length < 2) return false; 
     let topLast = [], bottomLast = [];
    if (top) {
        topLast = topArr.slice(-3);
        bottomLast = bottomArr.slice(-4);
    } else {
        topLast = topArr.slice(-4);
        bottomLast = bottomArr.slice(-3);
    }
    let pointsAll = topLast.concat(bottomLast.reverse());
    let newPointsAll = pointsAll.map(current => {
        return new LatLon(current._lat, current._lon)
    })
    return newPointsAll
  }

function getIntersectionPoints (pn1, pn2, pn3, pn4) {
    let intersection = null
    intersection = LatLon.intersection(pn1, pn2, pn3, pn4);
    console.log(intersection)
    return intersection
}   

/**
 * 三点折现确定区域
 * @param {*} lineTop1 第一组横线 （上）
 * @param {*} lineBottom1 第一组横线 （下）
 * @param {*} lineTop2 
 * @param {*} lineBottom2 
 */
export function getAreaList (lineTop1, lineBottom1, lineTop2, lineBottom2, isLast, tparr, btarr) {
     // let polygonArr = [lineTop1.newPoint1, lineTop1.newPoint2, lineBottom1.newPoint1, lineBottom1.newPoint2];
     let p1 = new LatLon(lineTop1.newPoint1._lat, lineTop1.newPoint1._lon);
     let p2 = new LatLon(lineTop1.newPoint2._lat, lineTop1.newPoint2._lon);
     let p3 = new LatLon(lineBottom1.newPoint1._lat, lineBottom1.newPoint1._lon);
     let p4 = new LatLon(lineBottom1.newPoint2._lat, lineBottom1.newPoint2._lon);
     let p5 = new LatLon(lineTop2.newPoint1._lat, lineTop2.newPoint1._lon);
     let p6 = new LatLon(lineTop2.newPoint2._lat, lineTop2.newPoint2._lon);
     let p7 = new LatLon(lineBottom2.newPoint1._lat, lineBottom2.newPoint1._lon);
     let p8 = new LatLon(lineBottom2.newPoint2._lat, lineBottom2.newPoint2._lon);


     let area1Array = [p1, p2, p4, p3]
     let flag1 = p5.isEnclosedBy(area1Array);
     let flag2 = p6.isEnclosedBy(area1Array);
     let flag7 = p7.isEnclosedBy(area1Array);
     let flag8 = p8.isEnclosedBy(area1Array);
     let topPointArrayReturn1 = []
     let topPointArrayReturn2 = []
     if (flag1 && flag2) {
        topPointArrayReturn2 = [p4, p7]
     } else if (!flag1 && !flag2) {
        topPointArrayReturn1 = [p2, p5]

        if (flag7 && flag8) {
            // topPointArrayReturn1 = [p2, p5]
        } else if (!flag7 && !flag8){
            topPointArrayReturn2 = [p4, p7];
        } else {
            let inter = getIntersectionPoints(p3, p4, p7, p8)
            // topPointArrayReturn2.push(inter)
            let lastArea = arrayCombine(tparr, btarr, false)
            
            if (lastArea === false) {
                topPointArrayReturn2.push(inter)
            }else {
                // debugger
                let interflagInarea = inter.isEnclosedBy(lastArea);
                if (interflagInarea) {
                    let areaInter = getIntersectionPoints(inter, p8, btarr[btarr.length - 2], btarr[btarr.length - 1]);
                    btarr.splice(-1)
                    topPointArrayReturn2.push(areaInter)
                } else {
                    topPointArrayReturn2.push(inter)
                }
            }
            
            // topPointArrayReturn2.push(p8)
        }

     } else {
        if (!flag7 && !flag8){
            topPointArrayReturn2 = [p4, p7];
        } 
        let inter = getIntersectionPoints(p1, p2, p5, p6)
        // topPointArrayReturn1.push(inter)
        let lastArea = arrayCombine(tparr, btarr, true)
        if (lastArea === false) {
            topPointArrayReturn1.push(inter)
        }else {
                // debugger
            let interflagInarea = inter.isEnclosedBy(lastArea);
                if (interflagInarea) {
                    let areaInter = getIntersectionPoints(inter, p6, tparr[tparr.length - 2], tparr[tparr.length - 1]);
                    tparr.splice(-1)
                    topPointArrayReturn1.push(areaInter)
                } else {
                    topPointArrayReturn1.push(inter)
                }
        }
        // topPointArrayReturn1.push(p6)
     }
     if (isLast) {
        topPointArrayReturn1.push(p6);
        topPointArrayReturn2.push(p8)
     }
     return {
         topArr: tparr.concat(topPointArrayReturn1),
         bottomArr: btarr.concat(topPointArrayReturn2),
     }
}
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
    return intersection
}

function judgeTwoInLastarea (p1, p2, tparr, btarr) {

}

/**
 * 判断交点是否在上一个范围内
 * @param {*} intersection 
 * @param {*} tparr 
 * @param {*} btarr 
 * @param {*} last 
 * @param {*} isTop  上边还是下边
 */
function judgeInnerInOther (intersection, tparr, btarr, last, isTop) {
    let intArr = []
    let lastArr = arrayCombine(tparr, btarr, isTop)
    let newstart = new LatLon(intersection._lat, intersection._lon);
    let flag = lastArr  ? newstart.isEnclosedBy(lastArr) :  false
    
    if (flag) {
        
        let inner = null;
        if (isTop) {
            if (tparr.length < 2) {
                inner = newstart;
            } else {
                inner = hasIntersection(newstart, last, tparr[tparr.length-1], tparr[tparr.length - 2])
            }
           
        } else {
            if (btarr.length < 2) {
                inner = newstart;
            } else {
                inner = hasIntersection(newstart, last, btarr[btarr.length-1], btarr[btarr.length - 2])
            }   
        }

        if (!inner) {
            inner = hasIntersection(newstart, last, tparr[tparr.length - 1], btarr[btarr.length - 1])
            if (!inner) {
                intArr = []
            } else {
                intArr = [inner]
            }
        } else {
            if (isTop) {
                tparr.splice(-1);
            } else {
                btarr.splice(-1)
            }
            
            intArr = [inner]
        }
    } else {
        intArr = [newstart]
    }  
    console.log(intArr);
    if (intArr[0] == false ) {
        intArr = []
    }
    return intArr
}

/**
 * 纵向， 是否两个点都在另一个范围内
 * @param {*} pn1 
 * @param {*} pn2 
 * @param {*} pn3 
 * @param {*} pn4 
 * @returns status
 */
 function pointInOther (firstarray, pn1, pn2) {
    let innerFlag1 = pn1.isEnclosedBy(firstarray);
    let innerFlag2 = pn2.isEnclosedBy(firstarray);
    let status = 0; //都不在
    if (innerFlag1 && innerFlag2) {
        status = 1 // 都在
    } else if (innerFlag1 && !innerFlag2){
        status = 2 // 第一个在
    } else if (!innerFlag1 && innerFlag2) {
        status = 3 // 第二个在
    } else {
        status = 0 //都不在
    }
    return status
}

/**
 * 同向， 是否有焦点
 * @param {*} pn1 
 * @param {*} pn2 
 * @param {*} pn3 
 * @param {*} pn4 
 * @returns 
 */
function hasIntersection (pn1, pn2, pn3, pn4) {
    
    let intersection = null
    intersection = LatLon.intersection(pn1, pn2, pn3, pn4);
    // 是否在线一上
    let in1 = intersection.isWithinExtent(pn1, pn2);
    // 是否在线二上
    let in2 = intersection.isWithinExtent(pn3, pn4);
    if (in1 && in2) {
        return intersection
    }else  {
        return false
    }
}

/**
 * 三点折现确定区域2
 * @param {*} lineTop1 第一组横线 （上）
 * @param {*} lineBottom1 第一组横线 （下）
 * @param {*} lineTop2 
 * @param {*} lineBottom2 
 */
 export function getAreaList2 (lineTop1, lineBottom1, lineTop2, lineBottom2, isLast, tparr, btarr) {
    let topPointArrayReturn1 = [], topPointArrayReturn2 = [];

    // let polygonArr = [lineTop1.newPoint1, lineTop1.newPoint2, lineBottom1.newPoint1, lineBottom1.newPoint2];
    let p1 = new LatLon(lineTop1.newPoint1._lat, lineTop1.newPoint1._lon);
    let p2 = new LatLon(lineTop1.newPoint2._lat, lineTop1.newPoint2._lon);
    let p3 = new LatLon(lineBottom1.newPoint1._lat, lineBottom1.newPoint1._lon);
    let p4 = new LatLon(lineBottom1.newPoint2._lat, lineBottom1.newPoint2._lon);
    let p5 = new LatLon(lineTop2.newPoint1._lat, lineTop2.newPoint1._lon);
    let p6 = new LatLon(lineTop2.newPoint2._lat, lineTop2.newPoint2._lon);
    let p7 = new LatLon(lineBottom2.newPoint1._lat, lineBottom2.newPoint1._lon);
    let p8 = new LatLon(lineBottom2.newPoint2._lat, lineBottom2.newPoint2._lon);

    let intersectionTop = hasIntersection(p1, p2, p5, p6);
    let intersectionBot = hasIntersection(p3, p4, p7, p8);

    let firstArr = [p1, p2, p4, p3];
    
    if (intersectionTop) {
         topPointArrayReturn1 = judgeInnerInOther(intersectionTop, tparr, btarr, p6, true)
    } else {
        let pointStatus = pointInOther(firstArr, p5, p6)

        if (pointStatus !== 1)   {
            topPointArrayReturn1 = [p2, p5];
        } else {
            topPointArrayReturn2 = [p4]
        }
    }

    if (intersectionBot) {
        topPointArrayReturn2 = judgeInnerInOther(intersectionBot, tparr, btarr, p8, false)
    } else {
        // topPointArrayReturn2 = [p4, p7]
        let pointStatus = pointInOther(firstArr, p7, p8)
        if (pointStatus !== 1)  {
            topPointArrayReturn2 = [p4, p7];
        } else {
            topPointArrayReturn2 = [p4]
        }
            
    }

    if (topPointArrayReturn1.length === 2 && tparr.length > 2) {
        let inset1 = hasIntersection(topPointArrayReturn1[0], topPointArrayReturn1[1], tparr[tparr.length - 1], tparr[tparr.length - 2]);
        if (inset1) {
            tparr.splice(-1);
            topPointArrayReturn1[0] = inset1;
        } 
    }

    if (topPointArrayReturn2.length === 2 && btarr.length > 2) {
        let inset1 = hasIntersection(topPointArrayReturn2[0], topPointArrayReturn2[1], btarr[btarr.length - 1], btarr[btarr.length - 2]);
        if (inset1) {
            btarr.splice(-1);
            topPointArrayReturn2[0] = inset1;
        } 
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

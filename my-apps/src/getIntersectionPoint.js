import LatLon from 'geodesy/latlon-nvector-spherical.js';

function getIntersectionPoints (p1, p2, p3, p4) {
    let intersection = null
    try {
        let angle1 = p1.initialBearingTo(p2);
        let angle2 = p3.initialBearingTo(p4);
        intersection = LatLon.intersection(p1, angle1, p3, angle2);
    }catch(e) {
        console.log(e)
    }
    return intersection
}   

/**
 * 
 * @param {*} lineTop1 第一组横线 （上）
 * @param {*} lineBottom1 第一组横线 （下）
 * @param {*} lineTop2 
 * @param {*} lineBottom2 
 */
export function getAreaList (lineTop1, lineBottom1, lineTop2, lineBottom2) {
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
     } else if (!flag1 && !flag2) {
        topPointArrayReturn1 = [p2, p5]
        if (flag7 && flag8) {
        } else if (!flag7 && !flag8){
            topPointArrayReturn2 = [p4, p7];
        } else {
            topPointArrayReturn2.push(getIntersectionPoints(p3, p4, p7, p8))
            // topPointArrayReturn2.push(p8)
        }

     } else {
        if (flag7 && flag8) {
        } else if (!flag7 && !flag8){
            topPointArrayReturn2 = [p4, p7];
        } else {
            // topPointArrayReturn2.push(getIntersectionPoints(p3, p4, p7, p8))
            // topPointArrayReturn2.push(p8)
        }
        topPointArrayReturn1.push(getIntersectionPoints(p1, p2, p5, p6));
        // topPointArrayReturn1.push(p6)
     }
     return {
         topArr: topPointArrayReturn1,
         bottomArr: topPointArrayReturn2,
     }
}
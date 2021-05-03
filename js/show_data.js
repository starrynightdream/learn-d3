/**
 * 编写者： SND
 * 编写时间： 2022.5.2 20：12
 * 
 * 模块解释：解释模块数据，将其显示在界面上
 */


// import {scaleLinear} from 'd3';
const test_data = [];

// 设置参数
const cirCount = 12; // 最内部一圈放多少
const cirR = 10; // 小圆点半径
const cirDis = 80; // 小圆点圆心的距离
const minRLim = 50; // 小圆围成的半径的最小值
const normalRLim = 150; // 希望一行时小圆围成的半径值
const minLayerDis = 30; // 最小层间距
const normalLayerDis = 200; // 希望两行之间距离的最大值


const minColorChange = 16; 

const offsetX = 250;
const offsetY = 200;

const textOffsetX = 10;
const textOffsetY = 10;

/**
 * 对dataGet 获取的数据进行适应性修正
 */
transfromData = (data) =>{
    return data;
}

/**
 * 从其他位置获取项目数据
 */
getData= () =>{
    for (let i=0; i<48; i++)
        test_data.push(i+1);
    return transfromData(test_data);
}

/**
 * 推测应该有多少行存在
 */
gassLayer = (len)=>{
    return (len /10) +1;
}


/**
 * 根据总数据量获取
 * 绘制下标，绘制颜色
 * 等数据的列表
 */
getCirData = (len) =>{
    let layNum = gassLayer(len);
    let baseR = normalRLim / layNum;
    baseR = Math.max(minRLim, baseR);
    let distR = normalLayerDis / layNum;
    distR = Math.max(minLayerDis, distR);

    const ans = [];

    let r = baseR;
    for (let idx=0;idx < len; ++idx) {
        let count = Math.floor(2 * Math.PI / Math.asin(cirDis / 2 / r));
        count = Math.min(count, len - idx);
        let perDeg = Math.PI * 2 / count;
        let offset = Math.random() * 360;
        for (let inner =0; inner<count; ++inner, ++idx) {
            let deg = perDeg * inner;
            let x = Math.sin(deg) * r;
            let y = Math.cos(deg) * r;
            let color = d3.hsl(deg /Math.PI * 180 + offset, 1, 0.5);

            ans.push({
                x, y, r : cirR, color
            });
        }
        r += distR;
    }

    return ans;

}

/**
 * 根据数据进行界面的刷新
 */
showData = () =>{
    const data = getData();
    const targetFilter = getCirData(data.length);

    // 线
    d3.select('svg').selectAll('line')
        .data(targetFilter)
        .enter()
        .append('line')
        .attr('x1', offsetX)
        .attr('y1', offsetY)
        .attr('x2', offsetX)
        .attr('y2', offsetY)
        .style('stroke-width', 2)
        .style('stroke', d3.rgb(200, 200, 200))
        .transition(d3.transition().duration(2000))
        .attr('x2', (d)=>{return d.x + offsetX;})
        .attr('y2', (d)=>{return d.y + offsetY;})
  
    const gSet = d3.select('svg').selectAll('g')
        .data(targetFilter)
        .enter()
        .append('g');

      
    // 小圆点
    gSet.append('circle')
        .attr('cx', (d)=>{return offsetX;})
        .attr('cy', (d)=>{return offsetY;})
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .transition(d3.transition().duration(2000)) 
        .attr('cx', (d)=>{return d.x + offsetX;})
        .attr('cy', (d)=>{return d.y + offsetY;})
        .attr('r', (d)=>{return d.r;})
        .attr('fill', (d)=>{return d.color});


    // 文字
    gSet.append('text')
        .attr('x', (d)=>{return offsetX;})
        .attr('y', (d)=>{return offsetY;})
        .transition(d3.transition().duration(2000))
        .attr('x', (d)=>{return d.x + textOffsetX + offsetX;})
        .attr('y', (d)=>{return d.y + textOffsetY + offsetY;})
        .text((d, i)=>{return data[i];})
    
    const gs = document.getElementsByTagName('circle');
    for (let i=0; i< gs.length; ++i) {
        gs.item(i).addEventListener('click', (e) =>{
            console.log(e);
        });
    }

    // console.log(gs);
    // gs.forEach(obj => {
    //     obj.addEventListener('click', (e) =>{
    //         console.log('a');
    //     });
    // });
}


/**
 * 界面初始化
 */
pageInit = () =>{

    d3.select('#draw_svg')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')

    showData();
}

window.onload = ()=>{
    pageInit();
}

// export default {
//     showData
// };
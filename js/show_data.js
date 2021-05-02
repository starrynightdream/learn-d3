/**
 * 编写者： SND
 * 编写时间： 2022.5.2 20：12
 * 
 * 模块解释：解释模块数据，将其显示在界面上
 */


// import {scaleLinear} from 'd3';
const test_data = [];

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
 * 根据总数据量获取
 * 绘制下标，绘制颜色
 * 等数据的列表
 */
getCirData = (len) =>{
    let baseR = 100 / (Math.floor(len / 10) + 1);
    const ans = [];

    for (let idx = 0; idx < len; ++idx) {
        let r = Math.floor(idx / 12) * 20 + baseR;
        let deg = idx % 12 * 30;
        deg = Math.PI * (deg / 180);

        let x = r * Math.sin(deg);
        let y = r * Math.cos(deg);
        let color = 0x00ff00;

        ans.push({x, y, r:10, color});
    }

    return ans;
}

/**
 * 根据数据进行界面的刷新
 */
showData = () =>{
    const data = getData();
    const targetFilter = getCirData(data.length);

    d3.select('svg').selectAll('circle')
        .data(targetFilter)
        .enter()
        .append('circle')
        .attr('cx', (d)=>{return d.x + 100;})
        .attr('cy', (d)=>{return d.y + 100;})
        .attr('r', (d)=>{return d.r;})

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
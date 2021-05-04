/*
 * @Author: SND 
 * @Date: 2021-05-04 15:49:16 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-04 23:58:03
 */

const testLinkData = [
    {source: 1, target: 2, reals: 'num', type: 'test'},
    {source: 1, target: 3, reals: 'num', type: 'test'},
    {source: 1, target: 4, reals: 'num', type: 'test'},
    {source: 1, target: 5, reals: 'num', type: 'test'},
    {source: 1, target: 6, reals: 'num', type: 'test'},
    {source: 1, target: 7, reals: 'num', type: 'test'},
    {source: 1, target: 8, reals: 'num', type: 'test'},
    {source: 1, target: 9, reals: 'num', type: 'test'},
    {source: 1, target: 0, reals: 'num', type: 'test'},
    {source: 1, target: -1, reals: 'num', type: 'test'},
]

// setting param
const cirR = 10;

const sglobal = {};
window.onload = () =>{

const main = new Vue({
    el: "#main",
    data: {
        svg: null,
        width: 960,
        height: 540,
        circle: null,
        cirText: null,
        link: null,
        linkText: null,
        force : null,
        nodes : {},
        edges : [],

        searchKey: "",
    },
    methods:{
        /**
         * 逐步更新函数
         */
        tick: function() {
            // console.log(sglobal.link[0][0])
            // 每一帧更新小圆、线段与文字的位置信息
            if (sglobal.circle) {
                sglobal.circle.attr('transform', this.transformCir);
            }
            if (sglobal.cirText)
                sglobal.cirText.attr('transform', this.transformCirText);
            if (sglobal.link){
                sglobal.link.attr('d', this.linkArc);
            }
            if (sglobal.linkText)
                sglobal.linkText.attr('transform', this.transformLinkText);
        },
        /**
         * 创建连接路径的函数
         */
        linkArc: (d) =>{
            const comm = `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`;
            return comm;
        },
        /**
         * 对线段的文字每帧施加的位移
         */
        transformLinkText : (d) =>{},
        /**
         * 对园内的文字每帧施加的位移
         */
        transformCirText : (d) =>{},
        /**
         * 小圆位移 
         */
        transformCir : (d) =>{
            return `translate(${d.x}, ${d.y})`;
        },

        /**
         * 根据key查找数据并更新
         * @param {string} key 查找的键值
         */
        getData : function (key){
            const data = testLinkData;
            const _self = this;
            data.forEach((item)=>{
                const newData = {};
                newData.source = sglobal.nodes[ item.source] || (sglobal.nodes[ item.source] = {name: item.source});
                newData.target = sglobal.nodes[ item.target] || (sglobal.nodes[ item.target] = {name: item.target});
                sglobal.edges.push(newData);
            });
        }
    },
    created: function() {
        sglobal.nodes = {};
        sglobal.edges = [];

        const _self = this;
        this.getData("123");

        const svg = d3.select('#drawPath').append('svg')
            .attr('width', "90%")
            .attr('height', "60vh");
 
        svg.append('marker')
            .attr('id', 'resolved')
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX",32)
            .attr("refY", -1)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .attr("orient", "auto")
            .attr("stroke-width",2)
            .append("path")
            .attr("d", "M 0,-5 L 10,0 L 0,5")
            .attr('fill','#000000');

        const force = d3.layout.force()
            .nodes( d3.values(sglobal.nodes))
            .links(sglobal.edges)
            // .size([this.width, this.height])
            .linkDistance(180)
            .charge(-1800)
            .on('tick', this.tick)
            .start();
           
        // 线
        const link = svg.append('g')
            .selectAll('.edgePath')
            .data(force.links())
            .enter()
            .append('path')
            .attr({
                'd': (d) =>{return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
                'class':'edgePath',
                'id':(d,i) =>{return 'edgepath'+i;}
            })
            .style("pointer-events", "none")
            .style("stroke-width",0.5)
            .attr("marker-end", "url(#resolved)" );
            
        // 点
        const circle = svg.append('g')
            .selectAll('circle')
            .data(force.nodes())
            .enter()
            .append("circle")
            .style("fill", node=>{
                // TODO: corcle setting
                let color="#222222";
                return color;
            })
            .style('stroke',(node) =>{ 
                let color;
                color="#A254A2";
                return color;
            })
            .attr("r", 18)
            .on("click", (node) =>{
                // TODO: click event
                console.log(node);
            })
            .call(force.drag);

        sglobal.svg = svg;
        sglobal.force = force;
        sglobal.link = link;
        sglobal.circle = circle;
        
        sglobal.circle.style('fill' ,()=>{
            return '#212121';
        })
    },
});

} // end window onload
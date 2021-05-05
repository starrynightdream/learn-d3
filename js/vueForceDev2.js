/*
 * @Author: SND 
 * @Date: 2021-05-05 22:47:32 
 * @Last Modified by:   SND 
 * @Last Modified time: 2021-05-05 22:47:32 
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
    {source: 0, target: -1, reals: 'num', type: 'test'},
]

// setting param
const cirR = 10;

// const sglobal = {};
window.onload = () =>{

const main = new Vue({
    el: "#main",
    data: {
        width: 0,
        height: 0,
        sglobal : {},

        searchKey: "",

    },
    methods:{
        /**
         * 逐步更新函数
         */
        tick: function() {
            // 每一帧更新小圆、线段与文字的位置信息
            this.sglobal.circle
                .attr('transform', this.transformCir);

            this.sglobal.link
                .attr('d', this.linkArc);

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
         * 拖动开始的触发函数 
         */
        dragstart :  function (d){
            d.fixed = true;
        },

        /**
         * 根据key查找数据并更新
         * @param {string} key 查找的键值
         */
        getData : function (key, needClear){
            const _self = this;
            if (needClear){
                _self.sglobal.nodes = {};
                _self.sglobal.edges = [];
            }
            const data = testLinkData;
            data.forEach((item)=>{
                const newData = {};
                newData.source = _self.sglobal.nodes[ item.source] || (_self.sglobal.nodes[ item.source] = {name: item.source});
                newData.target = _self.sglobal.nodes[ item.target] || (_self.sglobal.nodes[ item.target] = {name: item.target});
                _self.sglobal.edges.push(newData);
            });
        }
    },
    mounted: function() {
        const _self = this;
        // 获取宽高
        _self.width = window.innerWidth * 0.9;
        _self.height = window.innerHeight * 0.6;

        // 获取默认数据
        // TODO： 根据url中的key进行默认值的变更
        this.getData("123", true);

        const svg = d3.select('#drawPath').append('svg')
            .attr('width', _self.width)
            .attr('height', _self.height);
 
        // 通用箭头遮罩
        svg.append('marker')
            .attr('id', 'resolved')
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX",32)
            .attr("refY", -1)
            .attr("markerWidth", cirR /2)
            .attr("markerHeight", cirR /2)
            .attr("orient", "auto")
            .attr("stroke-width",2)
            .append("path")
            .attr("d", "M 0,-5 L 10,0 L 0,5")
            .attr('fill','#000000');

        for (let key in _self.sglobal.nodes) {
            // console.log(_self.width, _self.height)
            _self.sglobal.nodes[key].x = _self.width / 2;
            _self.sglobal.nodes[key].y = _self.height / 2;
            // console.log(_self.sglobal.nodes[key].x, _self.sglobal.nodes[key].y)
        }

        // console.log(d3.values(_self.sglobal.nodes));

        const force = d3.layout.force()
            .nodes( d3.values(_self.sglobal.nodes))
            .links(_self.sglobal.edges)
            .size([_self.width, _self.height])
            .linkDistance(cirR * 8)
            .charge(-980)
            .on('tick', _self.tick)
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
            .attr("r", cirR)
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
            .style('pointer-events', 'visible')
            .on("click", (node) =>{
                // TODO: click event
                console.log(node);
            })
            .call(
                force.drag()
                    .on('dragstart', _self.dragstart)
            );

        _self.sglobal.force = force;
        _self.sglobal.link = link;
        _self.sglobal.circle = circle;
    },
});

} // end window onload
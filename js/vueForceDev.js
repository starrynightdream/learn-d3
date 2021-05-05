/*
 * @Author: SND 
 * @Date: 2021-05-04 15:49:16 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-05 09:52:57
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
        width: 960,
        height: 540,
        sglobal : {},

        searchKey: "",
    },
    methods:{
        /**
         * 逐步更新函数
         */
        tick: function() {
            // console.log(sglobal.link[0][0])
            // 每一帧更新小圆、线段与文字的位置信息
            const svg = d3.select('svg');
            svg.selectAll('circle')
                .data(this.sglobal.force.nodes())
                .attr('transform', this.transformCir);

            svg.selectAll('.edgePath')
                .data(this.sglobal.force.links())
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
    created: function() {
        const _self = this;
        _self.width = window.innerWidth * 0.9;
        _self.height = window.innerHeight * 0.6;

        this.getData("123", true);

        const svg = d3.select('#drawPath').append('svg')
            .attr('width', _self.width)
            .attr('height', _self.height);
 
        svg.append('marker')
            .attr('id', 'resolved')
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX",32)
            .attr("refY", -1)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .attr("stroke-width",2)
            .append("path")
            .attr("d", "M 0,-5 L 10,0 L 0,5")
            .attr('fill','#000000');

        for (let key in _self.sglobal.nodes) {
            // console.log(_self.width, _self.height)
            _self.sglobal.nodes[key].x = _self.width / 2;
            _self.sglobal.nodes[key].y = _self.height / 2;
            console.log(_self.sglobal.nodes[key].x, _self.sglobal.nodes[key].y)
        }

        console.log(d3.values(_self.sglobal.nodes));

        const force = d3.layout.force()
            .nodes( d3.values(_self.sglobal.nodes))
            .links(_self.sglobal.edges)
            .size([_self.width, _self.height])
            .linkDistance(100)
            .charge(-980)
            .on('tick', _self.tick)
            .start();  
           
        // 线
        svg.append('g')
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
        svg.append('g')
            .selectAll('circle')
            .data(force.nodes())
            .enter()
            .append("circle")
            .attr("r", 18)
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
            .on("click", (node) =>{
                // TODO: click event
                console.log(node);
            })
            .call(force.drag);

        _self.sglobal.force = force;
    },
});

} // end window onload
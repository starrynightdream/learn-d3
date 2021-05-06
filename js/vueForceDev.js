/*
 * @Author: SND 
 * @Date: 2021-05-04 15:49:16 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-06 11:25:31
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
]

const addingTextData = [
    {source: 0, target: -1, reals: 'num', type: 'test'},
    {source: 0, target: -2, reals: 'num', type: 'test'},
    {source: 0, target: -3, reals: 'num', type: 'test'},
    {source: 0, target: -4, reals: 'num', type: 'test'},
    {source: 0, target: -5, reals: 'num', type: 'test'},
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

            this.sglobal.cirText
                .attr('x', d=>{return d.x;})
                .attr('y', d=>{return d.y;});

            this.sglobal.linkText
                .attr('x', d=>{return (d.target.x + d.source.x)/2;})
                .attr('y', d=>{return (d.target.y + d.source.y)/2;})

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
        transformCirText : (d) =>{
            return `translate(${d.x}, ${d.y})`;
        },
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
            let data;
            if (key == '123')
                data = testLinkData;
            else
                data = addingTextData;

            data.forEach((item)=>{
                const newData = {};
                newData.source = _self.sglobal.nodes[ item.source] || (_self.sglobal.nodes[ item.source] = {name: item.source});
                newData.target = _self.sglobal.nodes[ item.target] || (_self.sglobal.nodes[ item.target] = {name: item.target});
                newData.reals = item.reals;
                _self.sglobal.edges.push(newData);
            });

            
            if (_self.sglobal.force){
                _self.sglobal.force.stop();
                _self.sglobal.force.nodes(_self.sglobal.nodes);
                _self.sglobal.force.links(_self.sglobal.edges);
                _self.sglobal.force.start();
            }

            console.log(_self.sglobal.nodes)
            console.log(_self.sglobal.edges)

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
            _self.sglobal.nodes[key].x = _self.width / 2;
            _self.sglobal.nodes[key].y = _self.height / 2;
        }

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
                // _self.getData('test')
            })
            .call(
                force.drag()
                    .on('dragstart', _self.dragstart)
            );

        const cirText = svg.append('g')
                .selectAll('text')
                .data(force.nodes())
                .enter()
                .append('text')
                .text(d=>{
                    return d.name;
                })
                .attr('x', d=>{return d.x;})
                .attr('y', d=>{return d.y;})
        
        const linkText = svg.append('g')
                .selectAll('text')
                .data(force.links())
                .enter()
                .append('text')
                .text(d=>{
                    return d.reals;
                })
                .attr('x', d=>{return (d.target.x + d.source.x)/2;})
                .attr('y', d=>{return (d.target.y + d.source.y)/2;})
 
        _self.sglobal.force = force;
        _self.sglobal.link = link;
        _self.sglobal.circle = circle;
        _self.sglobal.cirText = cirText;
        _self.sglobal.linkText = linkText;
    },
});

} // end window onload
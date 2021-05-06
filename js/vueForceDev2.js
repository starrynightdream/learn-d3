/*
 * @Author: SND 
 * @Date: 2021-05-05 22:47:32 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-06 19:00:27
 */

const testLinkData = [
    [
        {source: 1, target: 2, reals: 'num', type: 'test'},
        {source: 1, target: 3, reals: 'num', type: 'test'},
        {source: 1, target: 4, reals: 'num', type: 'test'},
        {source: 1, target: 5, reals: 'num', type: 'test'},
        {source: 1, target: 6, reals: 'num', type: 'test'},
        {source: 1, target: 7, reals: 'num', type: 'test'},
        {source: 1, target: 8, reals: 'num', type: 'test'},
        {source: 1, target: 9, reals: 'num', type: 'test'},
        {source: 1, target: 0, reals: 'num', type: 'test'},
    ],
    [
        {source: 0, target: -1, reals: 'num', type: 'test'},
        {source: 0, target: -2, reals: 'num', type: 'test'},
        {source: 0, target: -3, reals: 'num', type: 'test'},
        {source: 0, target: -4, reals: 'num', type: 'test'},
        {source: 0, target: -5, reals: 'num', type: 'test'},
    ],
    [
        {source: 0, target: 4, reals: 'num', type: 'test'},
        {source: 1, target: 2, reals: 'num', type: 'test'},
        {source: 2, target: 4, reals: 'num', type: 'test'},
    ]
]


// setting param
const cirR = 12;
const forceStreng = -300;

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
                .attr('x', d=>{return (d.source.x + d.target.x)/2;})
                .attr('y', d=>{return (d.source.y + d.target.y)/2;})
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
        dragStart :  function (d){
            d.fixed = true;
        },
        /**
         * 拖动计算 
         */
        draged : function(event, d) {
            d.fx = event.x;
            d.fy = event.y;
            // 重启以适用新值， 否则会出现计算终止
            this.sglobal.force.alpha(0.1).restart();
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

            // TODO: 从后台获取数据
            let data = testLinkData[key % testLinkData.length];
            data.forEach((item)=>{
                const newData = {};
                newData.source = _self.sglobal.nodes[ item.source] || (_self.sglobal.nodes[ item.source] = {name: item.source});
                newData.target = _self.sglobal.nodes[ item.target] || (_self.sglobal.nodes[ item.target] = {name: item.target});
                newData.reals = item.reals;
                _self.sglobal.edges.push(newData);
            });

            if (_self.sglobal.force){
                _self.reDraw();
            }
            
        },

        /**
         * 重新绘制界面
         */
        reDraw: function (){
            const _self = this;
            const svg = _self.sglobal.svg;
            svg.selectAll('g').remove();
            const force = d3.forceSimulation( Object.values( _self.sglobal.nodes))
                .force('link', d3.forceLink(_self.sglobal.edges).distance(cirR * 8))
                .force('charge', d3.forceManyBody().strength(forceStreng))
                .force('center', d3.forceCenter(_self.width/2, _self.height/2))
                .on('tick', _self.tick);
        
            const drag = 
                d3.drag()
                    .on('start', _self.dragStart)
                    .on('drag', _self.draged)
                    .on('end', null);
           
            // 线
            const link = svg.append('g')
                .selectAll('.edgePath')
                .data(_self.sglobal.edges)
                .enter()
                .append('path')
                .style("stroke-width",0.5)
                .attr("marker-end", "url(#resolved)" )
                .attr('d', (d) =>{return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
                .attr('class', 'edgePath')
                .attr('id', (d, i)=>{return 'edgepath'+i;})

            // 点
            const circle = svg.append('g')
                .selectAll('circle')
                .data( Object.values( _self.sglobal.nodes))
                .enter()
                .append('circle')
                .attr("r", cirR)
                .style('fill', node=>{
                    // TODO: corcle setting
                    let color= d3.hsl(Math.random() * 2 * 360, 0.6, 0.5);
                    return color;
                })
                .style('stroke',(node) =>{ 
                    let color;
                    color='#A254A2';
                    return color;
                })
                .style('pointer-events', 'visible')
                .on('click', (node) =>{
                    // TODO: click event 如果有则显示细节信息
                })
                .call(drag);

            const linkText = svg.append('g')
                .selectAll('text')
                .data(_self.sglobal.edges)
                .enter()
                .append('text')
                .attr('x', d=>{return (d.source.x + d.target.x)/2;})
                .attr('y', d=>{return (d.source.y + d.target.y)/2;})
                .text(d=>{return d.reals;})
        
            const cirText = svg.append('g')
                .selectAll('text')
                .data( Object.values( _self.sglobal.nodes))
                .enter()
                .append('text')
                .attr('x', d=>{return d.x;})
                .attr('y', d=>{return d.y;})
                .text(d=>{return d.name;})

            _self.sglobal.force = force;
            _self.sglobal.drag = drag;
            _self.sglobal.link = link;
            _self.sglobal.circle = circle;
            _self.sglobal.cirText = cirText;
            _self.sglobal.linkText = linkText;
        }
    },
    mounted: function() {
        const _self = this;
        // 获取宽高
        _self.width = window.innerWidth * 0.9;
        _self.height = window.innerHeight * 0.6;

        // 获取默认数据
        // TODO： 根据url中的key进行默认值的变更
        _self.getData(12, true);

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

        // TODO 初始化位置信息，最好有一个较好的初始位置
        for (let key in _self.sglobal.nodes) {
            _self.sglobal.nodes[key].x = _self.width / 2;
            _self.sglobal.nodes[key].y = _self.height / 2;
        }

        _self.sglobal.svg = svg;

        _self.reDraw();
    },
});

} // end window onload
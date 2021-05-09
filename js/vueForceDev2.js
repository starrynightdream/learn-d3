/*
 * @Author: SND 
 * @Date: 2021-05-05 22:47:32 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-09 10:15:04
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
        // 线的绘制函数
        linkDraw :(_self, data, rootNode)=>{

            return rootNode.selectAll('path')
                .data(data)
                .enter()
                .append('path')
                .style("stroke-width",0.5)
                .attr("marker-end", "url(#resolved)" )
                .attr('d', (d) =>{return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
                .attr('class', 'edgePath')
                .attr('id', (d, i)=>{return 'edgepath'+i;});
        },
        // 圆的绘制函数
        cirDraw : (_self, data, rootNode)=>{

            return rootNode.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', cirR)
                .style('fill', node=>{
                    return d3.hsl(Math.random() * 2 * 360, 0.6, 0.5);
                })
                // .style('stroke',(node) =>{ 
                //     let color;
                //     color='#A254A2';
                //     return color;
                // })
                .style('pointer-events', 'visible')
                .on('click', function(node) {
                    // TODO: click event 如果有则显示细节信息

                })
                .on('dblclick', function (e) {
                    // TODO: click event 添加新节点
                    _self.getData(1, false);
                })
                .call(_self.sglobal.drag);
        },
        linkTextDraw : (_self, data, rootNode) =>{

            return rootNode.selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('x', d=>{return (d.source.x + d.target.x)/2;})
                .attr('y', d=>{return (d.source.y + d.target.y)/2;})
                .style('fill', 'rgb(255, 255, 255)')
                .text(d=>{return d.reals;})
        },
        cirTextDraw : (_self, data, rootNode) =>{

            return rootNode.selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('x', d=>{return d.x;})
                .attr('y', d=>{return d.y;})
                .text(d=>{return d.name;})
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

            if (needClear && _self.sglobal.force){
                _self.reDraw();
            } else if (_self.sglobal.force) {
                _self.addNode();
            }
            
        },
        addNode: function() {
            const _self = this;
            const svg = _self.sglobal.svg;
            const force = _self.sglobal.force;
            const drag = _self.sglobal.drag;

            const link = _self.sglobal.link;
            const circle = _self.sglobal.circle;
            const linkText = _self.sglobal.linkText;
            const cirText = _self.sglobal.cirText;

            force.nodes( Object.values(_self.sglobal.nodes));
            force.force('link').links(_self.sglobal.edges);
            force.alpha(0.1).restart();

            // 重新更具各个数据绘制
            // svg.select('#linkG').selectAll('path')
            //     .data(_self.sglobal.edges)
            //     .enter()
            //     .append('path')
            //     .style("stroke-width",0.5)
            //     .attr("marker-end", "url(#resolved)" )
            //     .attr('d', (d) =>{return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
            //     .attr('class', 'edgePath')
            //     .attr('id', (d, i)=>{return 'edgepath'+i;})
            
            _self.linkDraw(_self, _self.sglobal.edges, svg.select('#linkG'));
            _self.sglobal.link = svg.selectAll('.edgePath');

            // svg.select('#circleG').selectAll('circle')
            //     .data(Object.values(_self.sglobal.nodes), (d)=>{return d.name;})
            //     .enter()
            //     .append('circle')
            //     .attr('r', cirR)
            //     .style('fill', node=>{
            //         return d3.hsl(Math.random() * 2 * 360, 0.6, 0.5);
            //     })
            //     // .style('stroke',(node) =>{ 
            //     //     let color;
            //     //     color='#A254A2';
            //     //     return color;
            //     // })
            //     .style('pointer-events', 'visible')
            //     .on('click', function(node) {
            //         // TODO: click event 如果有则显示细节信息

            //     })
            //     .on('dblclick', function (e) {
            //         // TODO: click event 添加新节点
            //         _self.getData(1, false);
            //     })
            //     .call(drag);

            _self.cirDraw(_self, Object.values(_self.sglobal.nodes), svg.select('#circleG'));
            _self.sglobal.circle = svg.select('#circleG').selectAll('circle');

            // svg.select('#linkTextG').selectAll('text')
            //     .data(_self.sglobal.edges)
            //     .enter()
            //     .append('text')
            //     .attr('x', d=>{return (d.source.x + d.target.x)/2;})
            //     .attr('y', d=>{return (d.source.y + d.target.y)/2;})
            //     .style('fill', 'rgb(255, 255, 255)')
            //     .text(d=>{return d.reals;})

            _self.linkTextDraw(_self, _self.sglobal.edges, svg.select('#linkTextG'));
            _self.sglobal.linkText = svg.select('#linkTextG').selectAll('text');
            
            // svg.select('#cirTextG').selectAll('text')
            //     .data( Object.values( _self.sglobal.nodes))
            //     .enter()
            //     .append('text')
            //     .attr('x', d=>{return d.x;})
            //     .attr('y', d=>{return d.y;})
            //     .text(d=>{return d.name;})

            _self.cirTextDraw(_self, Object.values( _self.sglobal.nodes), svg.select('#cirTextG'));
            _self.sglobal.cirText = svg.select('#cirTextG').selectAll('text');
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

            _self.sglobal.force = force;
        
            const drag = 
                d3.drag()
                    .on('start', _self.dragStart)
                    .on('drag', _self.draged)
                    .on('end', null);
           
            _self.sglobal.drag = drag;

            // 线
            // const link = svg.append('g')
            //     .attr('id', 'linkG')
            //     .selectAll('.edgePath')
            //     .data(_self.sglobal.edges)
            //     .enter()
            //     .append('path')
            //     .style("stroke-width",0.5)
            //     .attr("marker-end", "url(#resolved)" )
            //     .attr('d', (d) =>{return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
            //     .attr('class', 'edgePath')
            //     .attr('id', (d, i)=>{return 'edgepath'+i;})
            
            const link = _self.linkDraw(_self, _self.sglobal.edges, 
                svg.append('g').attr('id', 'linkG'));

            _self.sglobal.link = link;

            // 点
            // const circle = svg.append('g')
            //     .attr('id', 'circleG')
            //     .selectAll('circle')
            //     .data( Object.values( _self.sglobal.nodes))
            //     .enter()
            //     .append('circle')
            //     .attr("r", cirR)
            //     .style('fill', node=>{
            //         return d3.hsl(Math.random() * 2 * 360, 0.6, 0.5);
            //     })
            //     // .style('stroke',(node) =>{ 
            //     //     let color;
            //     //     color='#A254A2';
            //     //     return color;
            //     // })
            //     .style('pointer-events', 'visible')
            //     .on('click', function(node) {
            //         // TODO: click event 如果有则显示细节信息
            //     })
            //     .on('dblclick', function (e) {
            //         // e.target.style.fill = 'rgb(255,255,255)'
            //         _self.getData(1, false);
            //     })
            //     .call(drag);

            const circle = _self.cirDraw(_self, Object.values( _self.sglobal.nodes), 
                svg.append('g').attr('id', 'circleG'));

            _self.sglobal.circle = circle;

            // const linkText = svg.append('g')
            //     .attr('id', 'linkTextG')
            //     .selectAll('text')
            //     .data(_self.sglobal.edges)
            //     .enter()
            //     .append('text')
            //     .attr('x', d=>{return (d.source.x + d.target.x)/2;})
            //     .attr('y', d=>{return (d.source.y + d.target.y)/2;})
            //     .style('fill', 'rgb(255, 255, 255)')
            //     .text(d=>{return d.reals;})
            
            const linkText = _self.linkTextDraw(_self, _self.sglobal.edges, 
                svg.append('g').attr('id', 'linkTextG'));
            _self.sglobal.linkText = linkText;

            // const cirText = svg.append('g')
            //     .attr('id', 'cirTextG')
            //     .selectAll('text')
            //     .data( Object.values( _self.sglobal.nodes))
            //     .enter()
            //     .append('text')
            //     .attr('x', d=>{return d.x;})
            //     .attr('y', d=>{return d.y;})
            //     .text(d=>{return d.name;})

            const cirText = _self.cirTextDraw(_self, Object.values( _self.sglobal.nodes), 
                svg.append('g').attr('id', 'cirTextG'));
            _self.sglobal.cirText = cirText;
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

        // 创建svg 版面
        const svg = d3.select('#drawPath').append('svg')
            .attr('width', _self.width)
            .attr('height', _self.height)
            .call(d3.zoom()
                .on('zoom', (event) => {
                    svg.selectAll('g')
                    .attr('transform', event.transform);
               })
            )
            .on('dblclick.zoom', null);
 
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
        
        const shower = svg.append('rect')
            .attr('id', 'infoShower')
            .attr('x', 10)
            .attr('y', 10)
            .attr('width', (d)=>{return _self.width - 20})
            .attr('height', (d)=>{return _self.height - 20})
            .attr('fill', (d)=>{return d3.hsl(270, 0.7, 0.5)})
            .on('click', ()=>{

                shower.transition(d3.transition().duration(2000))
                    .attr('fill', (d)=>{return d3.hsl(270, 0.3, 0.5)})
                    .attr('height', 0);
            })
        
        _self.sglobal.shower = shower;
    },
});

} // end window onload
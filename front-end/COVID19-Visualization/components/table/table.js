// components/table/table.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        CovData:{
            type:Array,
            value:[]
        },
        dataAttribute:{
            type:Array,
            value:[]
        },
        rowHeight:{
            type:Number,
            value:96
        },
        columnWidth:{
            type:Number,
            value:200
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        sortBy:'total'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        sortTable(e){
            let sortBy=e.target.dataset.key
            let CovData=this.properties.CovData
            CovData.sort((a,b)=>b[sortBy]-a[sortBy])
            this.setData({CovData:CovData})
        },
        tapline(e){
            this.triggerEvent('province',e.currentTarget.dataset.name)
        }
    }
})

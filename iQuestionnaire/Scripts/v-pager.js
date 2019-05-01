Vue.component('v-pager', {
    template: '<div>' +
        '<button @click="pageLeft" :disabled="disabled" type="button" class="button btn_white" style="padding: 5px 9px">' +
        '<i class="fa fa-chevron-left"></i></button>' +
        '<div :id="pageDropId" class="DropList"></div>' +
        '<button @click="pageRight" :disabled="disabled" type="button" class="button btn_white" style="padding: 5px 9px">' +
        '<i class="fa fa-chevron-right"></i></button>' +
        '<div :id="perPageDropId" class="DropList"></div>' +
        '</div>',
    props: ['id', 'count', 'perPage', 'nowPage', 'disabled'],
    data: function () {
        return {
            pageDropId: this.id + 'PageDrop',
            perPageDropId: this.id + 'PerPageDrop'
        };
    },
    created: function () {
    },
    mounted: function () {
        this.build();
        this.buildPerPage();
    },
    computed: {
        totalPage: function () {
            var totalPage = Math.ceil(this.count / this.perPage);
            totalPage = totalPage ? totalPage : 1;
            return totalPage;
        }
    },
    watch: {
        nowPage: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                DropListSet(this.pageDropId, [this.nowPage]);
            }
        },
        perPage: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.build();
                this.buildPerPage();
            }
        },
        count: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.build();
                this.buildPerPage();
                if (this.nowPage > this.totalPage) {
                    this.$emit("nowpagechange", 1);
                }
            }
        }
    },
    methods: {
        pageLeft: function () {
            if (this.nowPage > 1) {
                this.$emit("nowpagechange", this.nowPage - 1);
            }
        },
        pageRight: function () {
            if (this.nowPage < this.totalPage) {
                this.$emit("nowpagechange", this.nowPage + 1);
            }
        },
        build: function () {
            var pageData = [{ Optgroup: '', Option: [] }];
            for (var i = 0; i < this.totalPage; i++) {
                pageData[0].Option.push({
                    Text: '第 ' + (i + 1) + ' 頁', Val: (i + 1)
                });
            }
            var _this = this;
            DropListSetting({
                ID: this.pageDropId,
                Data: pageData,
                Select: [this.nowPage],
                Class: 'button btn_white',
                Search: true,
                OnEnd: function (Select) {
                    _this.$emit("nowpagechange", Select[0]);
                }
            });
        },
        buildPerPage: function () {
            var _this = this;
            DropListSetting({
                ID: this.perPageDropId,
                Data: [
                    {
                        Optgroup: '',
                        Option: [
                            { Text: '每頁顯示 5 筆', Val: 5 },
                            { Text: '每頁顯示 10 筆', Val: 10 },
                            { Text: '每頁顯示 20 筆', Val: 20 },
                            { Text: '每頁顯示 50 筆', Val: 50 },
                            { Text: '每頁顯示 100 筆', Val: 100 },
                            { Text: '每頁顯示 200 筆', Val: 200 },
                            { Text: '每頁顯示 500 筆', Val: 500 }
                        ]
                    }
                ],
                Select: [this.perPage],
                Class: 'button btn_white',
                OnEnd: function (Select) {
                    _this.$emit("perpagechange", Select[0]);
                }
            });
        }
    }
});
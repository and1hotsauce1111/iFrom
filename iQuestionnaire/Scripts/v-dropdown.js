Vue.component('v-dropdown', {
    template: '<div :id="id" class="DropList"></div>',
    props: ['id', 'setting', 'data', 'value', 'disabled'],
    data: function () {
        return {
        };
    },
    created: function () {
    },
    mounted: function () {
        this.build();
    },
    watch: {
        data: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                var setting = { Data: newVal || [{ Optgroup: '', Option: [] }] };
                DropListSettingChange(this.id, setting);
            }
        },
        value: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                DropListSet(this.id, newVal || []);
            }
        },
        disabled: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                DropListEnabled(this.id, !newVal);
            }
        },
        setting: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                var setting = !newVal ? {} : _(newVal)
                    .omit(['ID', 'Select', 'Data', 'Disabled', 'OnChange', 'OnEnd']);
                DropListSettingChange(this.id, setting);
            }
        }
    },
    methods: {
        build: function () {
            var _this = this;
            var setting = _.cloneDeep(this.setting);
            setting.ID = this.id;
            setting.Select = this.value || [];
            setting.Data = this.data || [{ Optgroup: '', Option: [] }];
            setting.Disabled = this.disabled;
            setting.OnChange = function (Select, Name) {
                _this.$emit("onchange", Select);
            };
            setting.OnEnd = function (Select, Name) {
                _this.$emit("input", Select);
                _this.$emit("onend", Select);
            };
            DropListSetting(setting);
        }
    }
});
Vue.component('v-timepick', {
    template: '<div :id="id" class="TimePick"></div>',
    props: ['id', 'setting', 'value', 'format'],
    data: function () {
        return {
            isBuilding: false
        };
    },
    created: function () {
    },
    mounted: function () {
        this.$nextTick(function () {
            this.build();
        });
    },
    watch: {
        id: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.isBuilding = true;
                this.$nextTick(function () {
                    this.isBuilding = false;
                    this.build();
                });
            }
        },
        value: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!this.isBuilding) {
                    var setting = { DefaultDate: !newVal ? null : moment(newVal) };
                    TimePickSettingChange(this.id, setting);
                }
            }
        },
        format: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!this.isBuilding) {
                    var setting = { Format: newVal || undefined };
                    TimePickSettingChange(this.id, setting);
                }
            }
        },
        setting: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!this.isBuilding) {
                    var setting = !newVal ? {} : _(newVal)
                        .omit(['ID', 'DefaultDate', 'Format', 'OnClose']).value();
                    TimePickSettingChange(this.id, setting);
                }
            }
        }
    },
    methods: {
        build: function () {
            var _this = this;
            var setting = _.cloneDeep(this.setting);
            setting.ID = this.id;
            setting.DefaultDate = !this.value ? null : moment(this.value);
            setting.Format = this.format || undefined;
            setting.OnClose = function (Pick, Name) {
                var value = Pick ? Pick.String : null;
                _this.$emit("input", value);
                _this.$emit("Onclose", value);
            };
            TimePickSetting(setting);
        }
    }
});
define([], function () {
    return {
        $getByIds: function () {
            var ret = [], lastIndex = arguments.length - 1;
            for (var i = 0; i < lastIndex; i++) {
                var arg = arguments[i];
                var $$ui = webix.$$(arg);

                if (!$$ui) {
                    console.warn(arg + " is not a webix ui id. ");
                    return;
                }

                ret.push($$ui);
            }
            arguments[lastIndex].apply(null, ret);
        }
    }
});
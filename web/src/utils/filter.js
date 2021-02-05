
const filters = {
    playTimeFormat: function(date) {
        var dateee = new Date(date).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000)
            .toISOString()
            .replace(/T/g, ' ')
            .replace(/\.[\d]{3}Z/, '');
    },
    /**
     *  js中字符串超长作固定长度加省略号（...）处理
     * @param str 需要进行处理的字符串，可含汉字
     * @param len 需要显示多少个汉字，两个英文字母相当于一个汉字
     * @returns {string}
     */
    beautySub: function(str, len) {
        if (str) {
            var reg = /[\u4e00-\u9fa5]/g, //专业匹配中文
                slice = str.substring(0, len),
                chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length),
                realen = slice.length * 2 - chineseCharNum;
            return str.substr(0, realen) + (realen < str.length ? '...' : '');
        }
    },

};

// vm = Vue
export default vm => {
    Object.keys(filters).forEach(key => {
        // filter挂载
        vm.filter(key, filters[key]);
    });
};

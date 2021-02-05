const filters = {
    playTimeFormat: function(date) {
        var dateee = new Date(date).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000)
            .toISOString()
            .replace(/T/g, ' ')
            .replace(/\.[\d]{3}Z/, '');
    }
};

// vm = Vue
export default vm => {
    Object.keys(filters).forEach(key => {
        // filter挂载
        vm.filter(key, filters[key]);
    });
};

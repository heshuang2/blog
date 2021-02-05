export default {
    randSolt: function(arr, len) {
        for (const index in arr) {
            const rand = parseInt(Math.random() * arr.length);
            const temp = arr[rand];
            arr[rand] = arr[index];
            arr[index] = temp;
        }
        const cloneArr = arr.slice(0, len);
        return cloneArr;
    }
};

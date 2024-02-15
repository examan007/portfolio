var Portfolio = function () {
    function getWindowDimensions () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        //console.log(`Window size is ${width}x${height}`);
        return {
            width: width,
            height: height,
        }
    }
return {
        show: function () {
            const dims = getWindowDimensions()
            console.log(dims)
        }

    }
}

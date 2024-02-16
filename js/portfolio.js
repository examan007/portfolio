var Portfolio = function () {
    function getWindowDimensions () {
        const width = window.innerWidth
        const height = window.innerHeight
        //console.log(`Window size is ${width}x${height}`);
        return {
            width: width,
            height: height,
        }
    }
    function sendMessage (message) {
        window.parent.postMessage(JSON.stringify({
            operation: 'resize',
            data: message
        }), "*");
    }
    function receiveMessage(event) {
        console.log("origin=[" + JSON.stringify(event) + "]")
        if (event.isTrusted === true) {
            try {
                var message = JSON.parse(event.data)
                console.log("Received message: [" + event.data + "]")
                const portfolio = document.getElementById('portfolio')
                portfolio.style.height = message.data.height + 'px'
            } catch (e) {
                console.log(e.toString())
            }
        }
    }
    window.addEventListener("message", receiveMessage, false)
    function setHeight() {
        const gallery = document.getElementById('gallery')
        const height = gallery.clientHeight
        console.log("height: " + height)
        sendMessage({ height: height})
    }

    var elements = document.querySelectorAll('.opc-main-bg')
    elements.forEach(function(element) {
        console.log("register: " + element.outerHTML)
        element.addEventListener("click", ()=> {
            console.log("clicked: " + element.outerHTML)
            window.setTimeout(setHeight, 100)
        })
    })

return {
        show: function () {
            const dims = getWindowDimensions()
            console.log(JSON.stringify(dims))
            return dims
        },
        onload: function () {
            window.setTimeout(setHeight, 1000)
        }
    }
}

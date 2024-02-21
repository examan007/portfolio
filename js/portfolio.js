var Portfolio = function (flag) {
    var TotalHeight = 0
    var StartOfPortfolio = 0
    var consolex = {
        log: function(msg) {},
    }
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
        TotalHeight = message.height
        window.parent.postMessage(JSON.stringify({
            operation: 'resize',
            data: message
        }), "*");
    }
    function sendToPortfolio(messageobj) {
        const message = JSON.stringify(messageobj)
        var objectElement = document.getElementById('portfolio');
        var embeddedWindow = objectElement.contentWindow;
        embeddedWindow.postMessage(message, '*')
    }
    var LastData = null
    function positionLightBox(data) {
        if (data == null) {
            data = LastData
        } else {
            LastData = data
        }
        try {
            const obj = document.querySelectorAll('.nivo-lightbox-overlay')[0]
            obj.style.height = data.height + "px"
            function getScroll () {
                const max = data.offset + TotalHeight - data.height
                if (data.scroll > max) {
                    return max
                } else
                if (data.scroll < data.offset) {
                    return data.offset
                } else {
                    return data.scroll
                }
            }
            obj.style.top = getScroll() + "px"
        } catch (e) {
            console.log(e.toString())
        }
    }
    function receiveMessage(event) {
        console.log("origin=[" + JSON.stringify(event) + "]")
        if (event.isTrusted === true) {
            try {
                var message = JSON.parse(event.data)
                console.log("Received message: [" + event.data + "]")
                if (message.operation === 'resize') {
                    const portfolio = document.getElementById('portfolio')
                    portfolio.style.height = message.data.height + 'px'
                    sendToPortfolio({
                        operation: 'scroll',
                        data: {
                           height: getWindowDimensions().height,
                           scroll: document.documentElement.scrollTop || document.body.scrollTop,
                           offset: StartOfPortfolio
                        }
                    })
                } else
                if (message.operation === 'scroll') {
                    console.log("scroll event.data: " + event.data)
                    positionLightBox(message.data)
                }
            } catch (e) {
                console.log(e.toString())
            }
        }
    }
    window.addEventListener("message", receiveMessage, false)
    function setHeight() {
        const gallery = document.getElementById('portfolio')
        const height = gallery.clientHeight
        console.log("height: " + height)
        sendMessage({ height: height})
        function setOverlayHeight() {
            try {
                const overlay = document.querySelectorAll('.nivo-lightbox-overlay')[0]
                overlay.setAttribute("style", "height: " + getWindowDimensions().height + "px")
            } catch (e) {
                console.log(e.toString())
            }
            //window.setTimeout(setOverlayHeight(), 1000)
        }
        //setOverlayHeight()
       // window.setInterval(setOverlayHeight, 1000)
    }

    var elements = document.querySelectorAll('.opc-main-bg')
    elements.forEach(function(element) {
        console.log("register: " + element.outerHTML)
        element.addEventListener("click", ()=> {
            console.log("clicked: " + element.outerHTML)
            window.setTimeout(setHeight, 100)
        })
    })

    function loadResources(data, type) {
        const temp = 'template-property'
        const template = document.querySelectorAll('.' + temp)[0]
        const attribute = 'src'
        const array = data[type].reverse()
        array.forEach((filename) => {
            function createblock() {
                const block =  template.cloneNode(true)
                block.innerHTML = eval('`' + block.innerHTML + '`')
                block.classList.remove(temp)
                block.classList.add(type)
                template.parentNode.appendChild(block)
            }
            createblock()
            //console.log(filename)
        })
    }
    function getResources() {
        const data = ResourceImages()
        loadResources(data, 'property')
        loadResources(data, 'residents')
        loadResources(data, 'activities')
    }
    function getResourcesRemote() {
        const url = 'data/resources.json';
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            //console.log("Resources: " + JSON.stringify(data))
            loadResources(data, 'property')
            loadResources(data, 'residents')
            loadResources(data, 'activities')
            window.setTimeout(() => {
               window.setTimeout(setHeight, 1000)
               CustomObj()
            }, 1000)
         })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    }

    if (flag) {
        document.addEventListener('DOMContentLoaded', function(event) {
            getResources()
        });

        window.addEventListener('load', function(event) {
            CustomObj()
            window.setTimeout(() => {
                setHeight()
            }, 1000)
        });
            document.getElementById('portfolio').
                addEventListener("click", (element)=> {
                    console.log("clicked: " + element.outerHTML)
                    setHeight()
                })

    } else {
        window.addEventListener('load', function() {
            var element = document.getElementById('portfolio');
            var rect = element.getBoundingClientRect();

            StartOfPortfolio = rect.top
            console.log('Top: ' + rect.top);
            console.log('Left: ' + rect.left);
            console.log('Bottom: ' + rect.bottom);
            console.log('Right: ' + rect.right);
            console.log('Width: ' + rect.width);
            console.log('Height: ' + rect.height);
        })
        try {
            document.getElementById('portfolio').
                addEventListener("click", (element)=> {
                    console.log("clicked: " + element.outerHTML)
                })
            console.log("registered click on portfolio.")
        } catch (e) {
            console.log(e.toString())
        }
            window.addEventListener('scroll', function(event) {
                // Function to handle scroll event
                // You can perform actions here based on the scroll event
                console.log('Scrolling detected!');
                console.log('Scroll position X: ' + window.scrollX);
                console.log('Scroll position Y: ' + window.scrollY);
                    sendToPortfolio({
                        operation: 'scroll',
                        data: {
                           height: getWindowDimensions().height,
                           scroll: window.scrollY,
                           offset: StartOfPortfolio
                        }
                    })
            })
    }

return {
        show: function () {
            const dims = getWindowDimensions()
            console.log(JSON.stringify(dims))
            return dims
        },
        onload: function () {
            getResources()
        },
        setHeight: function () {
            setHeight()
        }
    }
}

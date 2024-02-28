var Portfolio = function (flag, input) {
    var TotalHeight = 0
    var StartOfPortfolio = 0
    var consolex = {
        log: function(msg) {},
    }
    function getOrElse(value, defvalue) {
        if (typeof(value) === 'undefined') {
            return defvalue
        } else {
            return value
        }
    }
    const options = getOrElse(input, {})
    const parent = getOrElse(options.ParentName, 'portfolio')
    const scrollmap = getOrElse(options.ScrollMap, 'portfolio')
    const scrolltarget = getOrElse(options.ScrollTarget, '.nivo-lightbox-overlay')
    const translateY = getOrElse(options.TranslateY, '0px')
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
            data: message,
            parent: parent
        }), "*");
    }
    function sendToPortfolio() {
        const message = JSON.stringify({
           operation: 'scroll',
           data: {
              height: getWindowDimensions().height,
              scroll: window.scrollY,
              offset: StartOfPortfolio,
              options: options
           }
        })

        var objectElement = document.getElementById(scrollmap);
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
            const padding = getOrElse(data.options.padding, 0)
            const tailing = getOrElse(data.options.tailing, padding / 2)
            const translatey = getOrElse(data.options.translateY, 0)
            const obj = document.querySelectorAll(scrolltarget)[0]
            //obj.style.height = (data.height - padding) + "px"
            function getScroll () {
                const trans = translatey
                const max = data.offset + TotalHeight - data.height + tailing
                if (data.scroll > max) {
                    return max
                } else
                if (data.scroll < data.offset) {
                    return data.offset - trans
                } else {
                    return data.scroll - trans
                }
            }
            const top = getScroll() + "px"
            obj.style.top = top
            obj.style.transform = 'translate-y(' + translatey + 'px)'
            console.log("top: " + top + " translateY: " + translatey +" scroll map: " + scrollmap)
        } catch (e) {
            console.log("scroll error: " + e.toString())
        }
    }
    function receiveMessage(event) {
        console.log("origin=[" + JSON.stringify(event) + "]")
        if (event.isTrusted === true) {
            try {
                var message = JSON.parse(event.data)
                if (message.operation === 'resize' && ! flag) {
                    console.log("Received message: [" + event.data + "]")
                    function getParentName() {
                        const parent = message.parent
                        if (typeof(parent) === 'undefined') {
                            return 'portfolio'
                        } else {
                            return parent
                        }
                    }
                    const portfolio = document.getElementById(getParentName())
                    portfolio.style.height = message.data.height + 'px'
                    portfolio.style.overflow = 'hidden'
                    sendToPortfolio()
                } else
                if (message.operation === 'scroll' && flag) {
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
        const gallery = document.getElementById(parent)
        const height = gallery.clientHeight
        console.log("set height: " + height)
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

    function loadResources(data, type, flag) {
        const temp = 'template-property'
        const template = document.querySelectorAll('.' + temp)[0]
        const attribute = 'src'
        const tag = 'img'
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
        if (flag) {
            template.parentNode.removeChild(template)
        }
    }
    function getResources() {
        const data = ResourceImages()
        loadResources(data, 'property', false)
        loadResources(data, 'residents', false)
        loadResources(data, 'activities', true)
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
            const loadfunc = getOrElse(options.LoadFunc, getResources)
            loadfunc()
        });

        window.addEventListener('load', function(event) {
            try {
                CustomObj()
            } catch (e) {
                console.log(e.toString())
            }
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
        try {
            window.addEventListener('load', function() {
                var element = document.getElementById(scrollmap);
                var rect = element.getBoundingClientRect();

                StartOfPortfolio = rect.top
                console.log('Top: ' + rect.top);
                console.log('Left: ' + rect.left);
                console.log('Bottom: ' + rect.bottom);
                console.log('Right: ' + rect.right);
                console.log('Width: ' + rect.width);
                console.log('Height: ' + rect.height);

            })
        } catch (e) {
            console.log(e.toString())
        }
        try {
            document.getElementById(scrollmap).
                addEventListener("click", (element)=> {
                    console.log("clicked: " + element.outerHTML)
                })
            console.log("registered click on portfolio.")
        } catch (e) {
            console.log(e.toString() + JSON.stringify(options))
        }
        try {
            window.addEventListener('scroll', function(event) {
                // Function to handle scroll event
                // You can perform actions here based on the scroll event
                console.log('Scrolling detected!');
                console.log('Scroll position X: ' + window.scrollX);
                console.log('Scroll position Y: ' + window.scrollY);
                sendToPortfolio()
            })
        } catch (e) {
            console.log(e.toString())
        }
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
        },
        loadPosts: function (data) {
            loadResources(data, 'property', true)
        }

    }
}

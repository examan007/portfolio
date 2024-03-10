var Portfolio = function (flag, input) {
    var TotalHeight = 0
    var StartOfPortfolio = 0
    var console = {
        log: function(msg) {},
    }
    function getOrElse(value, defvalue) {
        if (value === null) {
            return defvalue
        } else
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
    const translateY = getOrElse(options.TranslateY, '0')
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
    function sendToPortfolio(scrollinputmap) {
        const message = JSON.stringify({
           operation: 'scroll',
           data: {
              height: getWindowDimensions().height,
              scroll: window.scrollY,
              offset: StartOfPortfolio,
              options: options
           }
        })
        try {
            var objectElement = document.getElementById(scrollinputmap);
            var embeddedWindow = objectElement.contentWindow;
            embeddedWindow.postMessage(message, '*')
        } catch (e) {
            console.log("scroll map: " + scrollinputmap + " " + e.toString())
        }
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
            const newheight = data.height - padding + translatey
            obj.style.height = newheight + "px"
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
            //obj.style.transform = 'translate-y(' + translatey + 'px)'
            console.log("height: " + newheight + " top: " + top + " translateY: " + translatey +" scroll map: " + scrollmap + " target: " + scrolltarget)
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
                    function getParentName() {
                        const parentval = message.parent
                        if (typeof(parentval) === 'undefined') {
                            return 'portfolio'
                        } else {
                            return parentval
                        }
                    }
                    const parentname = getParentName()
                    if (parentname === parent &&
                     !(parent === "social" && message.data.noscroll === true)) {
                         if (parentname === "organization") {
                            const wrapper = document.getElementById("portfolio")
                            wrapper.style.height = message.data.height + 'px'
                         }
                        console.log("set height parent: [" + event.data + "]")
                        const portfolio = document.getElementById(parentname)
                        portfolio.style.height = message.data.height + 'px'
                        portfolio.style.overflow = 'hidden'
                        if (message.data.noscroll !== true) {
                            sendToPortfolio(parentname)
                        }
                    }
                } else
                if (message.operation === 'scroll' && flag) {
                    console.log("scroll event.data: " + event.data)
                    if (parent !== "organization") {
                        positionLightBox(message.data)
                    }
                    console.log("set height parent: " + parent)
                    setHeight(true)
                }
            } catch (e) {
                console.log(e.toString())
            }
        }
    }
    window.addEventListener("message", receiveMessage, false)
    var GalleryHeight = 20000
    function setHeight(noscroll) {
        try {
            const selector = getOrElse(options.ScrollTarget, null)
            function getGallery() {
                if (selector === null) {
                    return document.getElementById(parent)
                } else {
                    return document.querySelectorAll(selector)[0]
                }
            }
            const gallery = getGallery()
            function getTranslateY() {
                try {
                    const value = LastData.options.translateY
                    if (isNaN(value)) {
                        return 0
                    } else {
                        return value
                    }
                } catch (e) {
                    return 0
                }
            }
            function getHeight() {
                function getHeightVal() {
                    const notransflag = getOrElse(options.notransflag, false)
                    if (notransflag) {
                        return gallery.clientHeight
                    } else {
                        return gallery.clientHeight - getTranslateY() + 1
                    }
                }
                const height = getHeightVal()
                if (height < GalleryHeight || parent !== 'social') {
                    GalleryHeight = height
                    return height
                } else {
                    return GalleryHeight
                }
            }
            const height = getHeight()
            console.log("set height: " + height + " parent: " + parent + " scroll target: " + selector)
            sendMessage({
                height: height,
                noscroll: getOrElse(noscroll, false),
            })
        } catch (e) {
            console.log("set height for: " + parent + " scroll target: " + scrolltarget + "" + e.toString())
        }
    }

    var elements = document.querySelectorAll('.opc-main-bg')
    elements.forEach(function(element) {
        console.log("register: " + element.outerHTML)
        element.addEventListener("click", ()=> {
            console.log("clicked: " + element.outerHTML)
            //window.setTimeout(setHeight, 100)
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
               //window.setTimeout(setHeight, 1000)
               try {
                CustomObj()
               } catch (e) {
                console.log(e.toString())
               }
            }, 1000)
         })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    }

    if (flag) {
        console.log("set height initialize : " + parent)

        document.addEventListener('DOMContentLoaded', function(event) {
            const loadfunc = getOrElse(options.LoadFunc, getResources)
            loadfunc()
        });

        window.addEventListener('load', function(event) {
            console.log("set height timer, parent: " + parent)
            if (parent === 'portfolio') {
                window.setTimeout(() => {
                    setHeight()
                }, 1000)
                try {
                    CustomObj()
                } catch (e) {
                    console.log(e.toString())
                }
            }
        });
        try {
            document.getElementById(parent).
                addEventListener("click", (event)=> {
                    console.log("clicked: " + this.outerHTML)
                    setHeight()
                })
        } catch (e) {
            console.log("adding click: " + e.toString())
        }

    } else {
        window.addEventListener('load', function() {
            var element = document.getElementById(parent);
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
            window.addEventListener('load', function() {
                var element = document.getElementById(scrollmap);
                var rect = element.getBoundingClientRect();
                StartOfPortfolio = getOrElse(options.offset, rect.top)
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
        if (getOrElse(options.noscroll, false) === false)
        try {
            window.addEventListener('scroll', function(event) {
                // Function to handle scroll event
                // You can perform actions here based on the scroll event
                console.log('Scrolling detected!');
                console.log('Scroll position X: ' + window.scrollX);
                console.log('Scroll position Y: ' + window.scrollY);
                sendToPortfolio(scrollmap)
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
        setHeight: function (flag) {
            setHeight(flag)
        },
        loadPosts: function (data) {
            //loadResources(data, 'property', true)
        },
        sendScroll: function () {
            //sendToPortfolio(scrollmap)
        }


    }
}
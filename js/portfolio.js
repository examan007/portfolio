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
            console.log(filename)
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

    document.addEventListener('DOMContentLoaded', function(event) {
        getResources()
    });

    window.addEventListener('load', function(event) {
        CustomObj()
        window.setTimeout(() => {
            portfolio.setHeight()
        }, 1000)
    });

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

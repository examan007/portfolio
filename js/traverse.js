var Traversion = function () {
    var console = {
        log: function(msg) {},
    }
    function getParentName() {
        const urlParams = new URLSearchParams(window.location.search);
        const parentValue = urlParams.get('parent');
        console.log("Parent value:", parentValue);
        return parentValue
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
    function load() {
        //portfolio.loadPosts(data)
    }
    const data = {
          "property": []
    }

    function traverseNodes(element) {
        // Reference the current node
        console.log("traverse: " + "Node:", element);

        // Check if the current node has children
        if (element.children.length > 0) {
            // If it has children, iterate over each child and recursively call traverseNodes()
            for (var i = 0; i < element.children.length; i++) {
                traverseNodes(element.children[i]);
            }
        }
    }
    function traverse() {
        console.log("traverse: looking for portfolio.")
        // Get the <div> element with id "portfolio"
        var portfolioDiv = document.getElementById("portfolio");

        // Check if the element exists
        if (portfolioDiv) {
            // Traverse into the <div> element and access its child <object> element
            var objectElement = portfolioDiv.querySelector("object");

            // Check if the <object> element exists
            if (objectElement) {
                // Perform operations with the <object> element
                console.log("traverse: " + "Found <object> element:", objectElement);
                // You can access attributes, manipulate content, or perform other actions with the <object> element here
                var iframeDocument = objectElement.contentDocument || objectElement.contentWindow.document;

                traverseNodes(iframeDocument)
            } else {
                console.log("No <object> element found inside <div id='portfolio'>");
            }
        } else {
            console.log("No <div id='portfolio'> element found");
        }
        console.log("traverse: Done...")
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

    return {
        traverse: function () {
            traverse()
        },
        loadClients: function () {
            const metrics = MetricList()
            const viewheight = getWindowDimensions().height
            function loadPortfolio(index, offset, count) {
                const scale = 1
                if (count >= 3) {
                } else
                if (metrics[index].name === "skip") {
                    loadPortfolio(index + 1, offset, count)
                } else {
                    function getMetrics() {
                        try {
                            const start = Math.round(0 - metrics[index].start + metrics[index].offset)
                            const height = Math.round(metrics[index].height + metrics[index].start + metrics[index].padding)
                            return {
                                start: start,
                                height: height
                            }
                        } catch (e) {
                            console.log("getting metrics: " + e.toString())
                            return {
                                start: 68,
                                height: 500
                            }
                        }
                    }
                    const name = "panel" + count
                    const options = {
                        tflag: true,
                        height: getMetrics().height,
                        top: getMetrics().start,
                        ScrollMap: name,
                        ParentName: name
                    }
                    console.log("xheight: " + JSON.stringify(options))
                    Portfolio(false, options)
                    loadPortfolio(index + 1, offset, count + 1)
                }
            }
            loadPortfolio(0, 84 - 68, 0)
            return this
        },
        loadServer: function (scrolltarget, delay) {
            const portfolio = Portfolio(true, {
                "ParentName": getParentName(),
                "LoadFunc": load,
                "ScrollTarget": scrolltarget,
                "translateY": 0
            })
            window.setTimeout(() => {
                console.log("set height: loadServer timer delay; parent: " + getParentName())
                portfolio.setHeight()
            }, getOrElse(delay, 3000))
            return this
        }
    }
}
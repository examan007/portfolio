var Traversion = function () {

    const portfolio = Portfolio(true, {
        "ParentName": "social",
        "LoadFunc": load,
        "ScrollTarget": ".tm-portfolio",
        "translateY": 200 + 'px'
    })
    function load() {
        //portfolio.loadPosts(data)
    }
    const data = {
          "property": []
    }

    window.setTimeout(() => {
        portfolio.setHeight()
    }, 3000)

    function traverseNodes(element) {
        // Reference the current node
        console.log("Node:", element);

        // Check if the current node has children
        if (element.children.length > 0) {
            // If it has children, iterate over each child and recursively call traverseNodes()
            for (var i = 0; i < element.children.length; i++) {
                traverseNodes(element.children[i]);
            }
        }
    }
    function traverse() {
        // Get the <div> element with id "portfolio"
        var portfolioDiv = document.getElementById("portfolio");

        // Check if the element exists
        if (portfolioDiv) {
            // Traverse into the <div> element and access its child <object> element
            var objectElement = portfolioDiv.querySelector("object");

            // Check if the <object> element exists
            if (objectElement) {
                // Perform operations with the <object> element
                console.log("Found <object> element:", objectElement);
                // You can access attributes, manipulate content, or perform other actions with the <object> element here
                var iframeDocument = objectElement.contentDocument || objectElement.contentWindow.document;

                traverseNodes(iframeDocument)
            } else {
                console.log("No <object> element found inside <div id='portfolio'>");
            }
        } else {
            console.log("No <div id='portfolio'> element found");
        }
    }

    //traverse()

    return {
    }
}
var Traversion = function () {
    function getParentName() {
        const urlParams = new URLSearchParams(window.location.search);
        const parentValue = urlParams.get('parent');
        console.log("Parent value:", parentValue);
        return parentValue
    }

    function load() {
        //portfolio.loadPosts(data)
    }
    const data = {
          "property": []
    }

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
        loadClients: function () {
            Portfolio(false, { translateY: 68, padding: 0, tailing: 0, ScrollMap: "panel0", ParentName: "panel0" })
            Portfolio(false, { translateY: 868, padding: 348, tailing: 0, ScrollMap: "panel1", ParentName: "panel1" })
            Portfolio(false, { translateY: 1268, padding: 128, tailing: 0, ScrollMap: "panel2", ParentName: "panel2" })
        },
        loadServer: function () {
            const portfolio = Portfolio(true, {
                "ParentName": getParentName(),
                "LoadFunc": load,
                "ScrollTarget": ".tm-portfolio",
                "translateY": 200 + 'px'
            })
            window.setTimeout(() => {
                portfolio.setHeight()
            }, 3000)
        }
    }
}
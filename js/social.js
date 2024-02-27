var SocialFeed = function () {
    var console = {
        log: function(msg) {},
    }
    const portfolio = Portfolio(true, {
        "ParentName": "social",
        "LoadFunc": load
    })
    function load() {
        portfolio.loadPosts(data)
    }
    const array = FileList().reverse()
    const data = {
          "property": array.splice(array.length - 3)
    }

    window.setTimeout(() => {
        portfolio.setHeight()
    }, 3000)

    window.onload = function() {
       document.querySelectorAll(".reloadParent").
          forEach((element) => {
            const href = element.getAttribute('href')
            element.addEventListener("click", function(event) {
              event.preventDefault();
              console.log("Anchor clicked! " + element.innerHTML);
              window.top.location.href = href;
            })
          })
    }
    return {
        status: function () {
            return 0
        }
    }
}
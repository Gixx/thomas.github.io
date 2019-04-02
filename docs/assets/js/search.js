document.addEventListener('ThomasComponentsLoaded', function(){
    const searchIndex = lunr(function() {
        this.ref("id");
        this.field("title", { boost: 10 });
        this.field("content");

        if (!window.searchPages) {
            return;
        }

        for (var key in window.searchPages) {
            if (window.searchPages.hasOwnProperty(key)) {
                this.add({
                    "id": key,
                    "title": window.searchPages[key].title,
                    "content": window.searchPages[key].content
                });
            }
        }
    });

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
            }
        }
    }

    const searchTerm = getQueryVariable("q");
    console.log(searchTerm)
    // creation of searchIndex from earlier example
    const results = searchIndex.search(searchTerm);
    const resultPages = results.map(function (match) {
        return window.searchPages[match.ref];
    });

    let resultsString = "";
    resultPages.forEach(function (r) {
        resultsString += "<article><div class='preview'>";
        resultsString +=   "<h1><a class='result' href='" + r.path + "'>" + r.title + "</a></h1>";
        resultsString +=   "<p>" + r.excerpt + "</p>";
        resultsString += "</article>"
    });
    document.getElementById("search-results").innerHTML = resultsString;
});


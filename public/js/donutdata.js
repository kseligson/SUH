(function(d3) {
  "use strict";

  $.get("/demographics_age", function(data2) {

    var chart = c3.generate({
        data: {
            columns: [
                ['data1', 30],
                ['data2', 120],
            ],
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "Iris Petal Width"
        }
    });

  )};

})(d3);

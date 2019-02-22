var GraphHelper = function () {
    this.graph = null;
    this.statIndexes = [
        "hp",
        "attack",
        "defense",
        "special-defense",
        "special-attack",
    ];
};

GraphHelper.prototype.clearGraph = function() {
    this.graph = null;
};

GraphHelper.prototype.createGraph = function(name, stats) {
    this.graph = new Chart("stats-chart", {
        type: 'radar',
        data: this.getData(name, stats),
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 250 // true max is 260, but set 250 for formatting purposes
                }
            },
            responsive: true,
            defaultFontSize: 1
        }
    });
};

GraphHelper.prototype.getData = function(name, stats) {
    return {
        labels: ["HP", "Attack", "Defense", "Speed", "Sp Def", "Sp Atk"],
        datasets: [
            {
                label: name + " Stat Graph",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: this.getStatsArray(stats),
            },
        ]
    };
};

GraphHelper.prototype.getStatsArray = function(stats) {
    var self = this,
        statsArr = [];

    stats.forEach(function (statObj) {
        var idx = self.statIndexes.indexOf(statObj.stat.name);

        statsArr[idx] = statObj.base_stat;
    });

    return statsArr;
};

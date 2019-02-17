var GraphHelper = function () {
    this.graph = null;
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
                    max: 260
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
        var idx = self.findGraphIdx(statObj);

        statsArr[idx] = statObj.base_stat;
    });

    return statsArr;
};

GraphHelper.prototype.findGraphIdx = function(statObj) {
    switch (statObj.stat.name) {
        case "hp":
            return 0;
        case "attack":
            return 1;
        case "defense":
            return 2;
        case "speed":
            return 3;
        case "special-defense":
            return 4;
        case "special-attack":
            return 5;
        default:
            return false;
    }
}

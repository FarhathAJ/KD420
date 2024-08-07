/**
 * 
 * @param {any} data
 * @param {any} xProperty
 * @param {any} yProperty
 * @param {any} y1Property
 * @param {any} y2Property
 * @param {any} eleID
 * @param {any} barWidth
 * @param {any} labelTitle
 * @param {any} tooltipBar1Labels
 * @param {any} tooltipBar2Labels
 * @param {any} toolitpLineLabels
 * @param {any} tooltipBar1Datas
 * @param {any} tooltipBar2Data
 * @param {any} tooltipLineData
 */

function createChartLegend(mainDiv, group) {
    var mainDivName = mainDiv.substr(1, mainDiv.length);
    var keys = group;
    var i = 0;
    var cloloCode = "";
    keys.forEach(function (d) {
        if (i == 0) {
            cloloCode = "#77A5D9";
        }
        if (i == 1) {
            cloloCode = "#EC3D34"
        }
        if (i == 2) {
            cloloCode = "#2AB835";
        }

        $("#legend_chartTarget").append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
          			<span style='background:" + cloloCode +
            ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
          			<span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" + d +
            " </span>\
          		</span>");
        i = i + 1;
    });

}


function createGroupedBarLineGraph(data, xProperty, yProperty, y1Property, y2Property, eleID, barWidth, labelTitle, tooltipBar1Labels, tooltipBar2Labels, toolitpLineLabels, tooltipBar1Data, tooltipBar2Data, tooltipLineData, graph_type) {

    //debugger;
    $(eleID).empty();

    // Set default dimensions
    const defaultWidth = 600;
    const defaultHeight = 400;

    // Get the width and height of the element
    const chartElement = document.querySelector(eleID);
    const width = chartElement.clientWidth || defaultWidth;
    const height = chartElement.clientHeight || defaultHeight;

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };

    // Calculate inner dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    $("#legend_chartTarget").html("");
    var leg_name = ["Plant for the Shift", "Actual < Plan ", "Actual"]

    createChartLegend("#charts2", leg_name);

    // Create SVG container
    var svg = d3.select(eleID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set up scales
    var xScale = d3.scaleBand()
        .domain(data.map(d => d[xProperty]))
        .range([0, innerWidth])
        .padding(0.2);

    const min_axis = d3.max(data, d => Math.max(d[yProperty], d[y1Property], d[y2Property])) / 5;
    const max_axis = d3.max(data, d => Math.max(d[yProperty], d[y1Property], d[y2Property]));

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d[yProperty], d[y1Property], d[y2Property]))])
        .range([innerHeight, 0]);

    const tickValues = [parseInt(min_axis), (parseInt(min_axis) * 2), (parseInt(min_axis) * 3), (parseInt(min_axis) * 4), max_axis];

    //var yScale = d3.scaleLinear()
    //    .domain([0, d3.max(data, d => Math.max(d[yProperty], d[y1Property], d[y2Property]))])
    //    .range([innerHeight, 0]);

    // Create axes
    //const xAxis = d3.axisBottom(xScale).tickFormat("");
    const xAxis = d3.axisBottom(xScale);
    //const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2~s"));
    const yAxis = d3.axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat(d => {
            if (d >= 1000) {
                return d3.format(".2s")(d).replace(/G/, "B").replace(/M/, "M").replace(/k/, "k");
            } else {
                const formattedValue = d3.format(".1f")(d); // Use ".1f" to include one decimal place
                return formattedValue.endsWith('.0') ? formattedValue.slice(0, -2) : formattedValue; // Remove trailing '.0'
            }
        });

    // Append axes to the SVG
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
        .call(xAxis)
        .selectAll(".tick text")
        .attr("class", "axis-label");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(yAxis)
        .selectAll(".tick text")
        .attr("class", "axis-label");

    // Create a div element for the tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", `tooltip`)
        .style("opacity", 0);

    // Add bars for value1
    svg.selectAll(".bar1")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 - barWidth + margin.left)
        .attr("y", d => yScale(d[yProperty]) + margin.top)
        .attr("width", barWidth)
        .attr("height", d => innerHeight - yScale(d[yProperty]))

        //.on("mousemove", function (d) {

        //        // Show tooltip
        //        const [x, y] = [d3.event.pageX, d3.event.pageY];
        //        tooltip.transition()
        //            .duration(50)
        //            .style("opacity", 0.9);

        //        let tooltipContent = "";

        //        // Loop through tooltipLabels and tooltipData arrays
        //        for (let i = 0; i < tooltipBar1Labels.length; i++) {
        //            const label = tooltipBar1Labels[i];
        //            const dataValue = d[tooltipBar1Data[i]];
        //            tooltipContent += `${label} : ${dataValue}<br>`;                }

        //        tooltip.html(tooltipContent);

        //        const tooltipWidth = tooltip.node().offsetWidth;
        //        const tooltipHeight = tooltip.node().offsetHeight;

        //        // Check if the tooltip goes beyond the right edge of the page
        //        if (x + tooltipWidth > window.innerWidth) {

        //            tooltip.style("left", `${x - tooltipWidth}px`);
        //        }
        //        else {

        //            tooltip.style("left", `${x}px`);
        //        }

        //        // Check if the tooltip goes beyond the bottom edge of the page
        //        if (y + tooltipHeight > window.innerHeight) {

        //            tooltip.style("top", `${y - tooltipHeight}px`);
        //        } else {

        //            tooltip.style("top", `${y}px`);
        //        }

        //})
        .on("mouseout", function () {
            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add bars for value2
    svg.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("y", d => yScale(d[y1Property]) + margin.top)
        .attr("width", barWidth)
        .attr("height", d => innerHeight - yScale(d[y1Property]))
        .on("mousemove", function (d) {
            // Show tooltip
            const [x, y] = [d3.event.pageX, d3.event.pageY];
            tooltip.transition()
                .duration(50)
                .style("opacity", 0.9)

            let tooltipContent = "";

            // Loop through tooltipLabels and tooltipData arrays
            for (let i = 0; i < tooltipBar2Labels.length; i++) {

                const label = tooltipBar2Labels[i];
                const dataValue = d[tooltipBar2Data[i]];

                tooltipContent += `${label} : ${dataValue}<br>`;
            }

            if (labelTitle.length == 6 && labelTitle[5]) {

                const bar1 = d[yProperty];
                const bar2 = d[y1Property];
                window[(labelTitle[5])](bar1, bar2)
                    ? tooltipContent += labelTitle[3]
                    : tooltipContent += labelTitle[4];
            }

            tooltip.html(tooltipContent);

            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;

            // Check if the tooltip goes beyond the right edge of the page
            if (x + tooltipWidth > window.innerWidth) {

                tooltip.style("left", `${x - tooltipWidth}px`);
            }
            else {

                tooltip.style("left", `${x}px`);
            }

            // Check if the tooltip goes beyond the bottom edge of the page
            if (y + tooltipHeight > window.innerHeight) {

                tooltip.style("top", `${y - tooltipHeight}px`);
            } else {

                tooltip.style("top", `${y}px`);
            }

        })
        .on("mouseout", function () {
            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add line graph Gap
    //var line = d3.line()
    //    .x(d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
    //    .y(d => yScale(d[y2Property]) + margin.top);

    //svg.append("path")
    //    .data([data])
    //    .attr("class", "linegraphLine")
    //    .attr("d", line)
    //    .style("fill", "none");

    //svg.selectAll(".circle")
    //    .data(data)
    //    .enter()
    //    .append("circle")
    //    .attr("class", "linegraphCircle")
    //    .attr("cx", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
    //    .attr("cy", d => yScale(d[y2Property]) + margin.top)
    //    .attr("r", 3)
    //    .on("mousemove", function (d) {
    //        const [x, y] = [d3.event.pageX, d3.event.pageY];

    //        tooltip.transition()
    //            .duration(200)
    //            .style("opacity", 0.9);

    //        let tooltipContent = "";

    //        for (let i = 0; i < toolitpLineLabels.length; i++) {
    //            const label = toolitpLineLabels[i];
    //            const dataValue = d[tooltipLineData[i]];
    //            tooltipContent += `${label} : ${dataValue}<br>`;
    //        }

    //        tooltip.html(tooltipContent);

    //        const tooltipWidth = tooltip.node().offsetWidth;
    //        const tooltipHeight = tooltip.node().offsetHeight;

    //        if (x + tooltipWidth > window.innerWidth) {

    //            tooltip.style("left", `${x - tooltipWidth}px`);
    //        }
    //        else {

    //            tooltip.style("left", `${x}px`);
    //        }

    //        if (y + tooltipHeight > window.innerHeight) {

    //            tooltip.style("top", `${y - tooltipHeight}px`);
    //        } else {

    //            tooltip.style("top", `${y}px`);
    //        }

    //    })
    //    .on("mouseout", function () {
    //        tooltip.transition()
    //            .duration(500)
    //            .style("opacity", 0);
    //    });

    //Add line graph Gap

    var customFormat = function (value) {
        if (value < 1000 && value % 1 === 0) {
            return d3.format(",")(value);
        } else {
            return d3.format(".2~s")(value);
        }
    };

    // Add bars label
    if (graph_type == "hourly") {
        const labels = svg.selectAll(".bar-label")
            .data(data)
            .enter().append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
            .attr("y", d => yScale(d[yProperty]) + margin.top - 6)
            .attr("text-anchor", "middle")
            .text(function (d) { return customFormat(d[yProperty]); });
    }

    const labels1 = svg.selectAll(".bar2-label")
        .data(data)
        .enter().append("text")
        .attr("class", "bar2-label")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("y", d => yScale(d[y1Property]) + margin.top - 6)
        .attr("text-anchor", "middle")
        .text(function (d) { return customFormat(d[y1Property]); });

    // Add x-axis label
    var value = svg.append("text")
        .attr("class", "x-axis-label")
        .text(labelTitle[0])
        .style("font-size", "12px");
    var valueWidth = value.node().getComputedTextLength();
    var xValueTranslate = ((innerWidth - valueWidth) / 2) + margin.left;
    value.attr("transform", "translate(" + xValueTranslate + "," + (height - (margin.bottom / 3)) + ")");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", margin.left / 4)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text(labelTitle[1]);


    // Add x-axis - Title label
    var title = svg.append("text")
        .attr("class", "x-axis-title")
        .text(labelTitle[2]);
    var titleWidth = title.node().getComputedTextLength();
    var xTitleTranslate = (width - titleWidth) / 2;
    title.attr("transform", "translate(" + xTitleTranslate + "," + (margin.top / 2) + ")");


}

function lessThanEqual(x, y) {
    return x <= y;
}

function greaterThanEqual(x, y) {
    return x >= y;
}


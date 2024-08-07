// Function to create dynamic bar graph
function createBarGraph(data, xProperty, yProperty, eleID, barWidth, labelTitle, tooltipLabels, tooltipData) {
    // Set up the chart dimensions
    $(eleID).empty();

    // Set default dimensions
    const defaultWidth = 600;
    const defaultHeight = 400;

    // Get the width and height of the element
    const chartElement = document.querySelector(eleID);

    const width = chartElement.clientWidth || defaultWidth;
    const height = chartElement.clientHeight || defaultHeight;

    const margin = { top: 40, right: 20, bottom: 50, left: 60 };

    // Calculate inner dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select(eleID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d[xProperty]))
        .range([0, innerWidth])
        .padding(0.1);

    const min_axis = d3.max(data, d => d[yProperty]) / 5;
    const max_axis = d3.max(data, d => d[yProperty]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yProperty])])
        .range([innerHeight, 0]);

    const tickValues = [parseInt(min_axis), (parseInt(min_axis) * 2), (parseInt(min_axis) * 3), (parseInt(min_axis) * 4), max_axis];

    // Create axes
    //const xAxis = d3.axisBottom(xScale).tickFormat("");
    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat(d => {
            if (d >= 1000) {
                return d3.format(".2s")(d).replace(/G/, "B").replace(/M/, "M").replace(/k/, "k");
            } else {
                const formattedValue = d3.format(".1f")(d);
                return formattedValue.endsWith('.0') ? formattedValue.slice(0, -2) : formattedValue; // Remove trailing '.0'
            }
        });

    // Append axes to the SVG
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
        .call(xAxis)
        .selectAll(".tick text")
        .attr("transform", "rotate(-30)")
        .attr("class", "axis-label");



    svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(yAxis)
        .selectAll(".tick text")
        .attr("class", "axis-label");


    // Create a div element for the tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", `tooltip`)
        .style("opacity", 0);

    // Create bars with tooltips
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "bargraphBar")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 - barWidth / 2 + margin.left)
        .attr("y", d => yScale(d[yProperty]) + margin.top)
        .attr("width", barWidth)
        .attr("height", d => innerHeight - yScale(d[yProperty]))

        //.on("mouseover", (event, d) => {
        //   // console.log(event.pageX);
        //})

        //.on("mousemove", function (d) {
        //   const [x, y] = [d3.event.pageX, d3.event.pageY];

        //    tooltip.transition()
        //        .duration(200)
        //        .style("opacity", 0.9);

        //    let tooltipContent = "";

        //    // Loop through tooltipLabels and tooltipData arrays
        //    for (let i = 0; i < tooltipLabels.length; i++) {

        //        const label = tooltipLabels[i];
        //        const dataValue = d[tooltipData[i]];

        //        tooltipContent += `${label} : ${dataValue}<br>`;
        //    }

        //    tooltip.html(tooltipContent);

        //    const tooltipWidth = tooltip.node().offsetWidth;
        //    const tooltipHeight = tooltip.node().offsetHeight;

        //    // Check if the tooltip goes beyond the right edge of the page
        //    if (x + tooltipWidth > window.innerWidth) {

        //        tooltip.style("left", `${x - tooltipWidth}px`);
        //    }
        //    else {

        //        tooltip.style("left", `${x}px`);
        //    }

        //    // Check if the tooltip goes beyond the bottom edge of the page
        //    if (y + tooltipHeight > window.innerHeight) {

        //        tooltip.style("top", `${y - tooltipHeight}px`);
        //    } else {

        //        tooltip.style("top", `${y}px`);
        //    }
        //})


        .on("mouseout", function () {
            // Hide tooltip on mouseout
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //var formatValue = d3.format(".2~s");

    var customFormat = function (value) {
        if (value < 1000 && value % 1 === 0) {
            return d3.format(",")(value);
        } else {
            return d3.format(".2~s")(value);
        }
    };

    // Add bars label
    const labels = svg.selectAll(".bar-label")
        .data(data)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("y", d => yScale(d[yProperty]) + margin.top - 6)
        .attr("text-anchor", "middle")
        .text(function (d) { return customFormat(d[yProperty]); });


    // Add x-axis label
    var value = svg.append("text")
        .attr("class", "x-axis-label")
        .text(labelTitle[0])
        .style("top", "10px")
        .style("font-size", "12px");

    var valueWidth = value.node().getComputedTextLength();
    var xValueTranslate = ((innerWidth - valueWidth) / 2) + margin.left;
    value.attr("transform", "translate(" + xValueTranslate + "," + ((height - (margin.bottom / 2)) + 10) + ")");

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

    // Tooltip for labels with a value less than 10% of maximum value
    // const maxValue = d3.max(data, d => d[yProperty]);
    // condition as d[yProperty] < 0.1 * maxValue
    // Tooltip for labels with zero as value

    labels.filter(d => d[yProperty] === 0)
        .on("mousemove", function (d) {

            // Show tooltip
            const [x, y] = [d3.event.pageX, d3.event.pageY];

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

            let tooltipContent = "";

            // Loop through tooltipLabels and tooltipData arrays
            for (let i = 0; i < tooltipLabels.length; i++) {
                const label = tooltipLabels[i];
                const dataValue = d[tooltipData[i]];
                tooltipContent += `${label} : ${dataValue}<br>`;
            }

            tooltip.html(tooltipContent);

            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;

            // Check if the tooltip goes beyond the right edge of the page
            if (x + tooltipWidth > window.innerWidth) {
                tooltip.style("left", `${x - tooltipWidth}px`);
            } else {
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
            // Hide tooltip on mouseout
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


}



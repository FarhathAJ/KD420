
// Function to create dynamic line bar graph with target reached
function createBarGraphLineGraphTarget(data, xProperty, yProperty, y1Property, eleID, barWidth, labelTitle, tooltipLabels, toolitpLineLabels, tooltipData, tooltipLineData) {
    //debugger;
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

    // Adjust y-axis domain based on the highest value
    const maxBarValue = d3.max(data, d => d[yProperty]);
    const maxLineValue = d3.max(data, d => d[y1Property]);
    const maxValue = Math.max(maxBarValue, maxLineValue);

    // Create scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d[xProperty]))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat("");
    //const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2~s"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d => {
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
        .style("opacity", 0); // initially hidden

    // Create bars with tooltips
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "bargraphBar")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 - barWidth / 2 + margin.left)
        .attr("y", d => yScale(d[yProperty]) + margin.top)
        .attr("width", barWidth)
        .attr("height", d => innerHeight - yScale(d[yProperty]))
        //.style("fill", function (d) {
        //    // Check if the bar touches the line and change color
        //    const lineY = yScale(d[y1Property]) + margin.top;
        //    return yScale(d[yProperty]) + margin.top <= lineY && lineY <= yScale(d[yProperty]) + margin.top + innerHeight
        //        ? greenColor
        //        : redColor;
        //})
        .on("mousemove", function (d) {
            // Show tooltip
            const [x, y] = [d3.event.pageX, d3.event.pageY];

            tooltip.transition()
                .duration(50)
                .style("opacity", 0.9);

            let tooltipContent = "";

            // Loop through tooltipLabels and tooltipData arrays
            for (let i = 0; i < tooltipLabels.length; i++) {

                const label = tooltipLabels[i];
                const dataValue = d[tooltipData[i]];

                tooltipContent += `${label} : ${dataValue}<br>`;
            }

            // Check if the bar touches the line and change text
            const lineY = yScale(d[y1Property]) + margin.top;
            yScale(d[yProperty]) + margin.top <= lineY && lineY <= yScale(d[yProperty]) + margin.top + innerHeight
                ? tooltipContent += labelTitle[3]
                : tooltipContent += labelTitle[4];

            //tooltip.html(tooltipContent)
            //    .style("left", `${x}px`)
            //    .style("top", `${y}px`);

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

    // Create line
    const line = d3.line()
        .x(d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .y(d => yScale(d[y1Property]) + margin.top);

    // Create line chart
    svg.append("path")
        .datum(data)
        .attr("class", "linegraphLine")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "black");

    svg.selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "linegraphCircle")
        .attr("cx", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("cy", d => yScale(d[y1Property]) + margin.top)
        .attr("r", 4)
        .on("mousemove", function (d) {
            // Show tooltip
            const [x, y] = [d3.event.pageX, d3.event.pageY];

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

            let tooltipContent = "";

            for (let i = 0; i < toolitpLineLabels.length; i++) {
                const label = toolitpLineLabels[i];
                const dataValue = d[tooltipLineData[i]];
                tooltipContent += `${label} : ${dataValue}<br>`;
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

    var formatValue = d3.format(".2~s");

    // Add labels for the bars
    /*svg.selectAll(".bar-label")
        .data(data)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("y", d => yScale(d[yProperty]) + margin.top - 10) // Rotate by 90 degrees
        .attr("text-anchor", "middle")
        .text(function (d) { return formatValue(d[yProperty]); });*/
    //.text(function (d) { return (d[yProperty] / 1000) + 'k'; });
    //.text(d => d[yProperty]);


    //// Add x-axis label
    //svg.append("text")
    //    .attr("class", "x-axis-label")
    //    .attr("x", xScale.bandwidth() + margin.left) //innerWidth / 2 - textLength / 2
    //    .attr("y", innerHeight + margin.top + margin.bottom / 2)
    //    .attr("text-anchor", "middle")
    //    .attr("transform", `translate(${width / 2 - margin.left - margin.right})`)
    //    .text(labelTitle[0]);

    //// Add x-axis label
    var value = svg.append("text")
        .attr("class", "x-axis-label")
        .text(labelTitle[0])
        .style("font-size", "12px");

    var valueWidth = value.node().getComputedTextLength();
    var xValueTranslate = ((innerWidth - valueWidth) / 2) + margin.left;
    value.attr("transform", "translate(" + xValueTranslate + "," + (height - (margin.bottom / 2)) + ")");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", margin.left / 4)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text(labelTitle[1]);

    //// Add x-axis label
    //svg.append("text")
    //    .attr("class", "x-axis-title")
    //    .attr("x", xScale.bandwidth() + margin.left) //innerWidth / 2 - textLength / 2
    //    .attr("y", height-(height-margin.top+margin.top/2)) 
    //    .attr("text-anchor", "middle")
    //    .attr("transform", `translate(${innerWidth / 2 - margin.left})`)
    //    .text(labelTitle[2]);


    // Add x-axis - Title label
    var title = svg.append("text")
        .attr("class", "x-axis-title")
        .text(labelTitle[2]);

    var titleWidth = title.node().getComputedTextLength();
    var xTitleTranslate = (width - titleWidth) / 2;
    title.attr("transform", "translate(" + xTitleTranslate + "," + (margin.top / 2) + ")");

}


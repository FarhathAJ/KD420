function radialProgress(selector, labelText) {

	/*debugger;*/
	const parent = d3.select(selector)

	// Get the width and height of the element
	//const chartElement = document.querySelector(selector);

	

	var size = { top: 0, right: 0, bottom: 0, left: 0, height: 117, width: 117, x: 10, y: 10 };

	

	d3.select(selector + " svg").remove();
	const svg = parent.append('svg')
		.attr("class","circularSVG");

	const chartElement = document.querySelector('.circularSVG');

	svgwidth = chartElement.clientWidth;
	svgheight = chartElement.clientHeight;

	//console.log(svgwidth);
	//console.log(svgheight);

	const outerRadius = Math.min(svgwidth, svgheight) * 0.45;//radius
	const thickness = 8; //bar thickness
	let value = 0;

	const mainArc = d3.arc()
		.startAngle(0)
		.endAngle(Math.PI * 2)
		.innerRadius(outerRadius - thickness)
		.outerRadius(outerRadius)

	svg.append("path")
		.attr('class', 'progress-bar-bg')
		.attr('transform', `translate(${svgwidth / 2},${svgheight / 2})`)
		.attr('d', mainArc())

	const mainArcPath = svg.append("path")
		.attr('class', 'progress-bar')
		.attr('transform', `translate(${svgwidth / 2},${svgheight / 2})`)

	svg.append("circle")
		.attr('class', 'progress-bar')
		.attr('transform', `translate(${svgwidth / 2},${svgheight / 2 - outerRadius + thickness / 2})`)
		.attr('width', thickness)
		.attr('height', thickness)
		.attr('r', thickness / 2)

	const end = svg.append("circle")
		.attr('class', 'progress-bar')
		.attr('transform', `translate(${svgwidth / 2},${svgheight / 2 - outerRadius + thickness / 2})`)
		.attr('width', thickness)
		.attr('height', thickness)
		.attr('r', thickness / 2)

	let percentLabel = svg.append("text")
		.attr('class', 'progress-label')
		.attr('transform', `translate(${svgwidth / 2},${((svgheight / 2) - (svgheight / 25))})`)
		.text('0')
	let percentLabel1 = svg.append("text")
		.attr('class', 'progress-label1')
		.attr('transform', `translate(${svgwidth / 2},${((svgheight / 2) + (svgheight / 6))})`)
		.text('0')
	return {
		update: function (progressPercent) {
			const startValue = value
			const startAngle = Math.PI * startValue / 50
			const angleDiff = Math.PI * progressPercent / 50 - startAngle;
			const startAngleDeg = startAngle / Math.PI * 180
			const angleDiffDeg = angleDiff / Math.PI * 180
			const transitionDuration = 1500

			mainArcPath.transition().duration(transitionDuration).attrTween('d', function () {
				return function (t) {
					mainArc.endAngle(startAngle + angleDiff * t)
					return mainArc();
				}
			})
			end.transition().duration(transitionDuration).attrTween('transform', function () {
				return function (t) {
					return `translate(${svgwidth / 2},${svgheight / 2})` +
						`rotate(${(startAngleDeg + angleDiffDeg * t)})` +
						`translate(0,-${outerRadius - thickness / 2})`
				}
			})
			percentLabel.transition().duration(transitionDuration).tween('bla', function () {
				return function (t) {
					percentLabel.text((Math.round(startValue + (progressPercent - startValue) * t)) + " %");
					percentLabel1.text(labelText);
				}
			})
			value = progressPercent
		}
	}
}
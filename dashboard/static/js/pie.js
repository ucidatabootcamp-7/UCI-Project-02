var data = [{
	values: [19, 26, 55],
	labels: ['Residential', 'Non-Residential', 'Utility'],
	type: 'pie',
    textfont: {
        family: 'Arial',
        size: 14,
        color: 'rgb(255, 255, 255)'
    }
}];

var layout = {
	legend:{
		x:20,
		y:0,
		font:{
			family: "Arial",
			size: 14,
			color:'rgb(255, 255, 255)'
		}
	},
	annotations:[
    {
    xref: 'paper',
    yref: 'paper',
    x: 0.0,
    y: 0.9,
    xanchor: 'left',
    yanchor: 'bottom',
  	text: '{COUNTRY SELECTED} GDP Composition',
    font:{
        family: 'Arial',
        size: 16,
        color: 'rgb(255, 255, 255)'
    },
    showarrow: false
    }
  ],
  	autosize: false,
	width: 400,
	height: 300,
	paper_bgcolor: '#1a1a1a',
	plot_bgcolor: '#1a1a1a',
	margin: {
    l: 50,
    r: 50,
    b: 10,
    t: 10,
    pad: 1
  }
};

Plotly.newPlot('pie-chart', data, layout);

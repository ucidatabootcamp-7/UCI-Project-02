var data = [{
  values: [19, 26, 55],
  labels: ['Residential', 'Non-Residential', 'Utility'],
  type: 'pie'
}];

var layout = {
	annotations:[
    {
    xref: 'paper',
    yref: 'paper',
    x: 0.0,
    y: 1.05,
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
	width: 400,
	height: 300,
	paper_bgcolor: '#1a1a1a',
	plot_bgcolor: '#1a1a1a',
	tickcolor: 'rgb(255, 255, 255)',
	tickfont: {
      family: 'Arial',
      size: 12,
      color: 'rgb(255, 255, 255)'
    }
};

Plotly.newPlot('pie-chart', data, layout);

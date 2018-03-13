var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter',
  marker: {
    color: 'rgb(12, 206, 18)',
    size: 12,
    line: {
      color: '#fff',
      width: 0.5
    }
  }
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter',
  marker: {
    color: 'rgb(229, 73, 76)',
    size: 12,
    line: {
      color: '#fff',
      width: 0.5
    }
  }
};

var data = [trace1, trace2];

var layout = {
	paper_bgcolor: '#1a1a1a',
	plot_bgcolor: '#1a1a1a',
	annotations:[
    {
    xref: 'paper',
    yref: 'paper',
    x: -0.2,
    y: 1.5,
    xanchor: 'left',
    yanchor: 'bottom',
  	text: '{COUNTRY SELECTED} Population Change',
    font:{
        family: 'Arial',
        size: 16,
        color: 'rgb(255, 255, 255)'
    },
    showarrow: false
    }
  ],
  xaxis: {
    showgrid: true,
    showline: true,
    gridcolor: '#bdbdbd',
    gridwidth: 2,
    linecolor: '#bdbdbd',
    tickfont: {
      family: 'Arial',
      size: 14,
      color: '#bdbdbd'
    }
  },
  yaxis: {
    showgrid: true,
    showline: true,
    gridcolor: '#bdbdbd',
    gridwidth: 2,
    linecolor: '#bdbdbd',
    tickfont: {
      family: 'Arials',
      size: 14,
      color: '#bdbdbd'
    }
  }
};

Plotly.newPlot('line-chart', data, layout);

var update = {
  width: 400,  // or any new width
  height: 300  // " "
};

Plotly.relayout('line-chart', update);
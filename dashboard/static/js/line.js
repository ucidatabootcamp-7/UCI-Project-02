var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter',
  marker: {
    color: 'rgb(255, 255, 255)',
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
    color: 'rgb(255, 255, 255)',
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
	plot_bgcolor: '#1a1a1a'
};

Plotly.newPlot('line-chart', data, layout);

var update = {
  width: 400,  // or any new width
  height: 300  // " "
};

Plotly.relayout('line-chart', update);
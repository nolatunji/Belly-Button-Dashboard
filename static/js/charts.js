function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
        // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //5. Create a variable that holds the first sample in the array.
    var resultArray2 = samples.filter(sampleObj => sampleObj.id == sample);
    var result2 = resultArray2[0];
   
   
   

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleId = result2.otu_ids;
    var sampleVal = result2.sample_values;
    var sampleLabel = result2.otu_labels;
   

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = sampleId.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var labels = sampleLabel.slice(0,10).reverse();
    var xticks = sampleVal.slice(0,10).reverse();
   
    // 8. Create the trace for the bar chart. 
    var barData = [{
       
        x: xticks,
        y: yticks,
        text: labels,
        orientation: 'h',
        type: "bar"
  }];
      
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
     
    };
  
      
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
  


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sampleId,
      y: sampleVal,
      text: labels,
      
      mode: 'markers',
      marker: {
        color: sampleId,
        size: sampleVal,
        colorscale: 'Portland'
      },
      }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bellybutton Bubble Chart',
      hovermode: 'closest',
      height: 600,
      width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData, bubbleLayout); 




    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wfreq = result.wfreq;
    console.log(wfreq);

   // 4. Create the trace for the gauge chart.
   var gaugeData = [{

		domain: { x: [0], y: [0] },
		value: wfreq,
		title: { text: "Belly Button Wash Frequency" },
		type: "indicator",
		mode: "gauge+number"
    
	}
  ];

    
      
   // 5. Create the layout for the gauge chart.
   var gaugeLayout =[
    { width: 600, height: 450, margin: { t: 0, b: 0 } }
   ]

   // 6. Use Plotly to plot the gauge data and layout.
   Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  
});
}

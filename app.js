var data = {};
var panelDemoInfo = d3.select("#sample-metadata");

d3.json("samples.json").then((sample_data) =>{
   data = sample_data;
   console.log(data);

   var selectID = d3.select('#selDataset')
   var names = data.names;

   data.names.forEach(name => {
      selectID.append('option').text(name).property('value', name);
      });

   var idNum=names[0];
   populateDemoInfo(idNum);
   drawBarPlot(idNum);
   drawBubbleChart(idNum);
});


// Populate the Demographic Info panel
function populateDemoInfo(idNum) {
   // Log a change
   console.log("Pop: " + idNum);

   // Just grab the one ID we want
      var metadataFilter = data.metadata.filter(item => item["id"] == idNum);
      console.log(`metaFilter length: ${metadataFilter.length}`);

   // Clear out the data first
      panelDemoInfo.html("");

   // Fill it back in
      Object.entries(metadataFilter[0]).forEach(([key, value]) => panelDemoInfo.append("h6").text(`${key}: ${value}`) );
};

// Object Compare Function
function compareValues(key, order = 'asc') {
   return function innerSort(a, b) {
       if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
           // property doesn't exist on either object
           return 0;
       }
       const varA = (typeof a[key] === 'string')
           ? a[key].toUpperCase() : a[key];
       const varB = (typeof b[key] === 'string')
           ? b[key].toUpperCase() : b[key];
       let comparison = 0;
       if (varA > varB) {
           comparison = 1;
       } else if (varA < varB) {
           comparison = -1;
       }
       return (
         (order === 'desc') ? (comparison * -1) : comparison
     );
   };
};

function optionChanged(idNum) {
   // Update the Demographic Info Panel
   populateDemoInfo(idNum);

   //Draw the Bar Plot
   drawBarPlot(idNum);

   // Draw the Bubble Chart
   drawBubbleChart(idNum);

   // Draw the Gauge Chart
   //drawGaugeChart(idNum);
};

// Draw the bar plot

function drawBarPlot(idNum) {
   // Log a change
   console.log("Bar: " + idNum);

   // Just grab the one ID we want
   var samplesFilter = data["samples"].filter(item => item["id"] == idNum);
   // console.log(`samplesFilter length: ${samplesFilter.length}`);
      
   // get values into arrays
   var sample_values = samplesFilter[0].sample_values;
   var otu_ids = samplesFilter[0].otu_ids;
   var otu_labels = samplesFilter[0].otu_labels;

   // Create an array of objects to sort so that all of the data is together
   var combinedList = [];
   for (var i=0; i < sample_values.length; i++) {
      var otu_id = otu_ids[i];
      var otu_text = "OTU " + otu_id.toString();
      var combinedObject = {"sample_values": sample_values[i], "otu_ids": otu_text, "otu_labels": otu_labels[i]};
      combinedList.push(combinedObject);
   };
   var sortedList =combinedList.sort(compareValues("sample_values", "desc"));
   var slicedList = sortedList.slice(0, 10);

   // Grab the text into arrays with map now
   var sample_values_list = slicedList.map(item => item.sample_values).reverse();
   // console.log(`sample_values_list: ${sample_values_list}`);
   var otu_ids_list = slicedList.map(item => item.otu_ids).reverse();
   // console.log(`otu_ids_list: ${otu_ids_list}`);
   var otu_labels_list = slicedList.map(item => item.otu_labels).reverse();
   // console.log(`otu_labels_list: ${otu_labels_list}`);

   // Do the Plot
   // trace for the data
   var trace = {
      type: "bar",
      y: otu_ids_list,
      x: sample_values_list,
      text: otu_labels_list,
      orientation: 'h'
   };

   // data
   var traceData = [trace];

   // Define the layout
   var layout = {
      title: "Top 10 OTUs Found",
      yaxis: { title: "OTU Labels" },
      xaxis: { title: "Values"}
   };

   Plotly.newPlot("bar", traceData, layout);

};

function drawBubbleChart(idNum) {

   // Log a change
   console.log("bubble: " + idNum);
   // Just grab the one ID we want
   var samplesFilter = data["samples"].filter(item => item["id"] == idNum);
   
   // get values into arrays
   var sample_values = samplesFilter[0].sample_values;
   var otu_ids = samplesFilter[0].otu_ids;
   var otu_labels = samplesFilter[0].otu_labels;

   var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
         color: otu_ids,
         size: sample_values,
         colorscale: "Earth"
      }  
   };

   var traceData = [trace1]

   var layout = {
      showlegend: false,
      height: 600,
      width: 1500,
      x_axis: {
         title: "Otu Id"
      }
   }

   Plotly.newPlot("bubble", traceData, layout);

   }
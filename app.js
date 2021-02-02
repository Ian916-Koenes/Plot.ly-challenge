function checkID() {
d3.json("samples.json").then((data) =>{
   console.log(data);

   var selectID = d3.select('#selDataset')

   data.names.forEach(name => {
      selectID.append('option').text(name).property('value', name)
   });

   //var filteredData = .filter(pers => person.bloodType === inputValue);
   
   //bar chart trace
   var trace1 = {
      x: data.sample_values,
      y: data.otu_ids,
      hover_data: data.otu_labels,
      orientation: 'h',
      type: 'bar'
   };

   var bar_1 = [trace1];

   Plotly.newPlot("bar", bar_1); 
   
   var trace2 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
         color: data.otu_ids,
         size: data.sample_values
      }
   }
   });
};


function optionChanged(newOption){

}
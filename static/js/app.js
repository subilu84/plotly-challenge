
function getPlot(id) {
     d3.json("samples.json").then((data)=> {
        console.log(data)
        
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
        
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d)
        var labels = samples.otu_labels.slice(0, 10);
  
        // bar chart
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: ''},
            type:"bar",
            orientation: "h",
        };
  
        
        var data = [trace];
  
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        Plotly.newPlot("bar", data, layout);

        // bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        var data1 = [trace1];
  
        Plotly.newPlot("bubble", data1, layout_b); 
     });
}
    // The guage chart
        
function buildgauge(wfreq) {
var data_g = [
    {
    domain: { x: [0, 1], y: [0, 1] },
    value: wfreq,
    title: { text: `Weekly Washing Frequency ` },
    type: "indicator",
    
    mode: "gauge+number",
    gauge: { axis: { range: [null, 9] },
            steps: [
            { range: [0, 2], color: "rgba(232, 226, 202, .5)" },
            { range: [2, 4], color: "rgba(210, 206, 145, .5)" },
            { range: [4, 6], color: "rgba(170, 202, 42, .5)" },
            { range: [6, 8], color: "rgba(14, 127, 0, .5)" },
            { range: [8, 9], color: "green" },
            ]}
        
    }
];
var layout_g = { 
    width: 500, 
    height: 400, 
    margin: { t: 20, b: 40, l:100, r:100 } 
    };
Plotly.newPlot("gauge", data_g, layout_g );

}  

function getInfo(id) {
    d3.json("samples.json").then((data)=> {
        
        
        var metadata = data.metadata;
        console.log(metadata)

        
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");

        
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });

       buildgauge(result.wfreq) 
    });
}


function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}


function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=> {
        console.log(data)
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

       
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();
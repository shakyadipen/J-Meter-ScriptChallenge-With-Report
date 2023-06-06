/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.94378864530636, "KoPercent": 0.056211354693648116};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6219552337063858, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7528735632183908, 500, 1500, "/favicon.ico-3"], "isController": false}, {"data": [0.7173076923076923, 500, 1500, "Click Start"], "isController": true}, {"data": [0.7191235059760956, 500, 1500, "Enter_Number"], "isController": true}, {"data": [0.7445887445887446, 500, 1500, "/LoadRunner_Correlation_Challenge_Exp.aspx-81"], "isController": false}, {"data": [0.689453125, 500, 1500, "Enter_City_Name"], "isController": true}, {"data": [0.4004329004329004, 500, 1500, "Click_Next"], "isController": true}, {"data": [0.7296747967479674, 500, 1500, "/g/collect?v=2&tid=G-XQRC4QQ389&gtm=45je35v0&_p=313445955&cid=899822427.1685618745&ul=en-us&sr=1280x720&_eu=ABA&ngs=1&_s=1&sid=1685618747&sct=1&seg=1&dl=http%3A%2F%2Floadrunnertips.com%2FLoadRunner_Correlation_Challenge_Exp.aspx&dr=http%3A%2F%2Floadrunnertips.com%2FLoadRunner_Correlation_Challenge_Exp.aspx&dt=LoadRunner%3ACorrelation%20Challenge&en=page_view&_ee=1-77"], "isController": false}, {"data": [0.7173076923076923, 500, 1500, "/LoadRunner_Correlation_Challenge_Exp.aspx-14"], "isController": false}, {"data": [0.689453125, 500, 1500, "/LoadRunner_Correlation_Challenge_Exp.aspx-36"], "isController": false}, {"data": [0.7191235059760956, 500, 1500, "/LoadRunner_Correlation_Challenge_Exp.aspx-58"], "isController": false}, {"data": [0.2681992337164751, 500, 1500, "Launch"], "isController": true}, {"data": [0.3357664233576642, 500, 1500, "/LoadRunner_Correlation_Challenge_Exp.aspx-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1779, 1, 0.056211354693648116, 1618.8251826869023, 224, 56215, 485.0, 3411.0, 8602.0, 18303.40000000006, 17.08129698796916, 154.99456832878857, 11.842511614969899], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/favicon.ico-3", 261, 0, 0.0, 912.195402298851, 269, 9934, 395.0, 2298.2000000000016, 4357.799999999998, 7690.819999999987, 2.890493488083636, 4.124034166103703, 1.1094479372009833], "isController": false}, {"data": ["Click Start", 260, 0, 0.0, 1499.0500000000006, 274, 56215, 439.5, 2850.2000000000007, 5946.299999999994, 21913.10999999994, 2.839264848809147, 31.678107902984507, 2.473265864392343], "isController": true}, {"data": ["Enter_Number", 251, 0, 0.0, 1449.03984063745, 274, 16452, 396.0, 3531.0000000000027, 9587.599999999988, 12864.359999999997, 2.7297741139109726, 28.974526214939804, 2.6577976480168353], "isController": true}, {"data": ["/LoadRunner_Correlation_Challenge_Exp.aspx-81", 231, 0, 0.0, 1539.8138528138527, 277, 24381, 384.0, 2606.2000000000003, 11148.99999999999, 21789.600000000046, 2.6470790456764375, 34.4844086614489, 1.189117540049962], "isController": false}, {"data": ["Enter_City_Name", 256, 0, 0.0, 1470.6953124999998, 276, 19337, 442.0, 3609.600000000004, 6772.34999999998, 17742.98, 2.9536643898836994, 40.75274679611063, 2.761984478839764], "isController": true}, {"data": ["Click_Next", 231, 0, 0.0, 2323.090909090909, 515, 27323, 851.0, 4688.200000000011, 14600.999999999993, 23122.68000000004, 2.5589046558771726, 34.415268477285565, 3.2661019387026022], "isController": true}, {"data": ["/g/collect?v=2&tid=G-XQRC4QQ389&gtm=45je35v0&_p=313445955&cid=899822427.1685618745&ul=en-us&sr=1280x720&_eu=ABA&ngs=1&_s=1&sid=1685618747&sct=1&seg=1&dl=http%3A%2F%2Floadrunnertips.com%2FLoadRunner_Correlation_Challenge_Exp.aspx&dr=http%3A%2F%2Floadrunnertips.com%2FLoadRunner_Correlation_Challenge_Exp.aspx&dt=LoadRunner%3ACorrelation%20Challenge&en=page_view&_ee=1-77", 246, 1, 0.4065040650406504, 1479.2682926829266, 224, 26647, 380.5, 2849.0000000000027, 8091.499999999963, 21848.670000000002, 2.701426484960961, 1.157605603400942, 2.2253974411945574], "isController": false}, {"data": ["/LoadRunner_Correlation_Challenge_Exp.aspx-14", 260, 0, 0.0, 1499.0461538461534, 274, 56215, 439.5, 2850.2000000000007, 5946.299999999994, 21913.10999999994, 2.8392338436674165, 31.67776197392273, 2.4732388560071636], "isController": false}, {"data": ["/LoadRunner_Correlation_Challenge_Exp.aspx-36", 256, 0, 0.0, 1470.6953124999998, 276, 19337, 442.0, 3609.600000000004, 6772.34999999998, 17742.98, 2.953698468922708, 40.75321699660209, 2.7620163462980694], "isController": false}, {"data": ["/LoadRunner_Correlation_Challenge_Exp.aspx-58", 251, 0, 0.0, 1449.0358565737056, 274, 16452, 396.0, 3531.0000000000027, 9587.599999999988, 12864.359999999997, 2.7297741139109726, 28.974526214939804, 2.6577976480168353], "isController": false}, {"data": ["Launch", 261, 0, 0.0, 3088.8084291187706, 827, 31848, 1400.0, 8806.400000000003, 13283.699999999995, 26426.559999999994, 2.8498427672955975, 41.07502871339426, 2.3045783106219426], "isController": true}, {"data": ["/LoadRunner_Correlation_Challenge_Exp.aspx-1", 274, 0, 0.0, 2891.430656934308, 552, 33037, 949.5, 8543.0, 13240.75, 28342.75, 2.6308461915140806, 34.165031889408446, 1.1189085168844637], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google-analytics.com:443 failed to respond", 1, 100.0, 0.056211354693648116], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1779, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google-analytics.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/g/collect?v=2&tid=G-XQRC4QQ389&gtm=45je35v0&_p=313445955&cid=899822427.1685618745&ul=en-us&sr=1280x720&_eu=ABA&ngs=1&_s=1&sid=1685618747&sct=1&seg=1&dl=http%3A%2F%2Floadrunnertips.com%2FLoadRunner_Correlation_Challenge_Exp.aspx&dr=http%3A%2F%2Floadrunnertips.com%2FLoadRunner_Correlation_Challenge_Exp.aspx&dt=LoadRunner%3ACorrelation%20Challenge&en=page_view&_ee=1-77", 246, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google-analytics.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

$(document).ready(function() {
    $('#worldData').DataTable();

} );
// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");

// Set worldDataTable to init dataSet
var worldDataTable = dataSet;

// Render worldDataTable to tbody
function renderTable() {
    $tbody.innerHTML = "";
    for (var i = 0; i < worldDataTable.length; i++) {

        // Get UFO Data object and its fields
        var devData = worldDataTable[i];
        var fields = Object.keys(devData);

        // Create new row in tbody
        var $row = $tbody.insertRow(i);
        for (var j = 0; j < fields.length; j++) {

            // For every field in the devData object create a new cell at set its inner text to be the current value at the current address's field
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = devData[field];
        }

    }

}

// render full dataSet first load
renderTable();

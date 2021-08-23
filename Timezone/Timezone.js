<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js" ></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js" ></script>

<style>
	#worldClockContainer thead tr {
		border-bottom: 1px solid #666;
	}
	#worldClockContainer td, #worldClockContainer th {
		padding: 2px 3em;
	}
	#worldClockContainer tbody tr:hover, #worldClockContainer tbody tr:nth-child(even):hover {
		background-color: #F0F8FF;
	}
	#worldClockContainer tbody tr:nth-child(even) {
    	background-color: #ddd;
	}
</style>

<div id="worldClockContainer">
	<table>
		<thead>
			<tr>
				<th>Country</th>
				<th>City</th>
				<th>Current Time</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>

<script type="text/javascript">
	//The name of the SharePoint list in the current site that will contain the 
	//settings for the world clock. The list needs to contain a Title (the standard column), a text column called Timezone and a text column called Country.
	//The timezone column contains the timezone text, such as "America/Toronto".
	var locationsListName = "locations";

	//The variable to store/store the list results in between calls to the WriteClock function.
	var locationData;

	//Outputs the world clock locations to the clock container based on the cached data
	function WriteClock() {
		//Clear the contents of the table's body (quick and dirty)
		$("#worldClockContainer tbody").empty();
		
		//Iterate the items in the list and build the world clock table.
		for(index in locationData) { 
			var locationItem = locationData[index];
			$("#worldClockContainer tbody").append("<tr><td>"+ locationItem.Country +"</td><td>"+ locationItem.Title +"</td><td>"+ moment().tz(locationItem.Timezone).format('LLLL') +"</td></tr>");	
		}
	}

	//Use jquery to call the rest service to get the location data from the SP list
	$.ajax({
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('" + locationsListName + "')/items?$orderby=Country,Title&$select=ID,Title,Timezone,Country",
		type: "GET",
		dataType: "json",
		headers: {
			Accept: "application/json;odata=verbose"
		}
	}).done(function(data, status, response) {
		//Cache the list results so we don't need to keep querying.
		locationData = data.d.results;

		//Do the initial creation of the world clock list
		WriteClock();

		//Set the list to refresh every 15 seconds
		window.setInterval(WriteClock, 15 * 1000);
	}).fail(function(data) {
		alert("Could load the location data from the SharePoint list called '"+ locationsListName +"'. "+ data.responseText);
	});	
</script>

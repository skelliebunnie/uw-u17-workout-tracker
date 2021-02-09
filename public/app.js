$(document).ready(function() {
	$.ajax({
		url: "/api/exercises",
		method: "GET"
	}).then(data => {
		console.log(data);
		// $("#exercises").html(data);
	});
});
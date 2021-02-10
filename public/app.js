$(document).ready(function() {

	// display formatted date in schedule date title
	$(".date").each(function() {
		let formattedDay = dayjs($(this).attr("data-date")).format("dddd");
		let formattedDate = dayjs($(this).attr("data-date")).format("MMM D, YYYY");
		$(this).text(formattedDay);
		$(this).parent().find(".subtitle").text(formattedDate);
	});

	$("#create").click(function(e) {
		e.preventDefault();

		createNew();
	});

	$("#update").click(function(e) {
		e.preventDefault();

		update();
	});

	$(".form").submit(function(e) {
		e.preventDefault();

		if(!$("#create").hasClass("hidden")) {
			createNew();
		} else {
			update();
		}
	});

	$("#isCardio").click(function() {
		$(".isCardio, .isNotCardio").toggleClass("hidden");
	});

	$("[name='create']").click(function() {
		let target = $(this).data("target");
		$(".toggle-field").addClass('hidden');
		$(`#${target}`).removeClass("hidden");
	});

	$(".edit, .activate, .deactivate, .delete, .btn, .fa-times").click(function() {
		let type = $(this).data("type");
		let action = $(this).data("action");
		let target = $(this).data("target");

		if(action === "edit") {
			$(".form").addClass("border-primary-analogous2-400");
			$("#formTitle").text(`Update ${type}`);
			$("#targetId").val(target);

			if(type === "exercise") {
				$("#createExercise").prop("checked", true);
				$("#createWorkout").prop("checked", false);
				$(".toggle-field").toggleClass("hidden");
				
				let exercise = {
					name: $(`[data-exerciseId='${target}']`).data("name"),
					isCardio: $(`[data-exerciseId='${target}']`).data("isCardio"),
					reps: $(`[data-exerciseId='${target}']`).data("reps"),
					sets: $(`[data-exerciseId='${target}']`).data("sets"),
					weight: $(`[data-exerciseId='${target}']`).data("weight"),
					distance: $(`[data-exerciseId='${target}']`).data("distance"),
					duration: $(`[data-exerciseId='${target}']`).data("duration")
				}
				$("#exerciseName").val(exercise.name);
				$("#exerciseReps").val(exercise.reps);
				$("#exerciseSets").val(exercise.sets);
				$("#exerciseWeight").val(exercise.weight);
				
				if(exercise.isCardio == "true") {
					$("#isCardio").prop("checked", true);
					$("#exerciseDistance").val(exercise.distance);
					$("#exerciseDuration").val(exercise.duration);
				} else {
					$("#exerciseDuration").val("0");
					$("#exerciseDistance").val("0");
				}
			} else {
				$("#createExercise").prop("checked", false);
				$("#createWorkout").prop("checked", true);
				$(".toggle-field").toggleClass("hidden");

				$("#workoutName").val( $(`[data-workoutId='${target}']`).data("name") )

				let exerciseList = [];
				const items = $(this).parents(".card").find(".item");
				$(this).parents(".card").find(".item").each(function() {
					exerciseList.push( $(this).data("exerciseid") );
				});

				$(".form .workoutExercises").each(function() {
					if( exerciseList.includes( $(this).val() ) ) {
						$(this).prop("checked", true);
					}
				});

			}

			$("#create").addClass("hidden");
			$("#update").removeClass("hidden");

		} else if(action === "delete") {
			if(type === "exercise") {
				let exerciseName = $(this).parents('.item').data("name");
				let workoutId = $(this).parents(".item").data("workoutid");
				$(".modal .btn-info").attr("data-workoutid", workoutId);
				$("#targetExercise").html(exerciseName);
			}
			remove(type, target);

		} else if(action === "activate") {
			$(".card").each(function() {
				let workoutId = $(this).data("workoutid");
				if(workoutId !== target) {
					// console.log(workoutId, target);
					deactivateWorkout(workoutId, false);
				}
			});
			activateWorkout(target);
		} else if(action === "deactivate") {
			deactivateWorkout(target, true);
		}
	});

	function deactivateWorkout(target, reload) {
		$.ajax({
			url: `/api/workouts/${target}`,
			data: { isActive: false },
			method: "PUT"
		}).then(data => {
			console.log(data);
			if(reload) window.location.replace("/");
		}).fail(err => {
			console.error(err);
		});
	}

	function activateWorkout(target) {
		$.ajax({
			url: `/api/workouts/${target}`,
			data: { isActive: true },
			method: "PUT"
		}).then(data => {
			window.location.replace("/");
		}).fail(err => {
			console.error(err);
		});
	}

	function createNew() {
		console.log($("[name='create']:checked").attr("id"));
		if($("[name='create']:checked").attr("id") === "createExercise") {
			let newExercise = {
				name: $("#exerciseName").val(),
				reps: $("#exerciseReps").val(),
				sets: $("#exerciseSets").val(),
				duration: $("#exerciseDuration").val(),
				isCardio: $("#isCardio").is(":checked"),
				distance: $("#exerciseDistance").val(),
				weight: $("#exerciseWeight").val()
			};
			console.log(newExercise);

			if(newExercise.name !== "") {
				$("#error").empty().addClass("hidden");
				$.ajax({
					url: "/api/exercises",
					data: newExercise,
					method: "POST"
				}).then(data => {
					window.location.replace("/");

				}).fail(err => {
					console.log(err);
					$("#error").html(err);
				});
			} else {
				$("#error").html("Exercise Name cannot be blank").removeClass("hidden");
			}

		} else {
			let exercises = [];

			$(".workoutExercises").each(function() {
				if( $(this).is(":checked") ) {
					exercises.push( $(this).val() );
				}
			});

			let newWorkout = {
				name: $("#workoutName").val(),
				exercises: exercises
			}

			console.log(newWorkout);

			if(newWorkout.name !== "") {
				$("#error").empty().addClass("hidden");
				$.ajax({
					url: "/api/workouts",
					data: newWorkout,
					method: "POST"
				}).then(data => {
					window.location.replace("/");

				}).fail(err => {
					console.log(err);
					$("#error").html(err);
				});
			} else {
				$("#error").html("Workout Name cannot be blank").removeClass("hidden");
			}

		}
	}

	function update() {
		target = $("#targetId").val();

		if($("[name='create']:checked").attr("id") === "createExercise") {
			let targetExercise = {
				name: $("#exerciseName").val(),
				reps: $("#exerciseReps").val(),
				sets: $("#exerciseSets").val(),
				duration: $("#exerciseDuration").val(),
				isCardio: $("#isCardio").is(":checked"),
				distance: $("#exerciseDistance").val(),
				weight: $("#exerciseWeight").val()
			};
			console.log(targetExercise);

			if(targetExercise.name !== "") {
				$("#error").empty().addClass("hidden");
				$.ajax({
					url: `/api/exercises/${target}`,
					data: targetExercise,
					method: "PUT"
				}).then(data => {
					window.location.replace("/");

				}).fail(err => {
					console.log(err);
					$("#error").html(err);
				});
			} else {
				$("#error").html("Exercise Name cannot be blank").removeClass("hidden");
			}

		} else {

			let exercises = [];

			$(".workoutExercises").each(function() {
				if( $(this).is(":checked") ) {
					exercises.push( $(this).val() );
				}
			});

			let newWorkout = {
				name: $("#workoutName").val(),
				exercises: exercises
			}

			console.log(newWorkout);

			if(newWorkout.name !== "") {
				$("#error").empty().addClass("hidden");
				$.ajax({
					url: `/api/workouts/${target}`,
					data: newWorkout,
					method: "PUT"
				}).then(data => {
					window.location.replace("/");

				}).fail(err => {
					console.log(err);
					$("#error").html(err);
				});
			} else {
				$("#error").html("Workout Name cannot be blank").removeClass("hidden");
			}

		}
	}

	function updateRemoveExercise(target, workoutId) {
		let exerciseList = [];

		$(`.card[data-workoutid='${workoutId}'] .item`).each(function() {
			if( $(this).data("exerciseid") !== target ) {
				exerciseList.push( $(this).data("exerciseid") );
			}
		});

		let workout = {
			exercises: exerciseList
		}

		$.ajax({
			url: `/api/workouts/${workoutId}`,
			data: workout,
			method: "PUT"
		}).then(data => {
			window.location.replace("/");

		}).fail(err => {
			console.error(err);
		})
	}

	function remove(type, target) {

		if(type === "exercise") {
			$(".modal").addClass("modal-visible");
			$("body").addClass("noscroll");

			$(".modal .btn").click(function() {
				if( $(this).data("action") == "remove" ) {
					updateRemoveExercise(target, $(this).data("workoutid"));

				} else {
					$.ajax({
						url: `/api/exercises/${target}`,
						method: "DELETE"
					}).then(data => {
						window.location.replace("/");
					}).fail(err => {
						console.error(err);
					});
				}
			})
		} else {
			$.ajax({
				url: `/api/workouts/${target}`,
				method: "DELETE"
			}).then(data => {
				window.location.replace("/");
			}).fail(err => {
				console.error(err);
			});
		}
	}

	$(".close-button").click(function() {
		$("body").removeClass("noscroll");
		$(".modal").removeClass("modal-visible");
	});
});
"use strict";

$(document).ready(function(){

	$("#error_msg").hide();

	function sendAjaxData(action, data){

		$.ajax({

			cache: false,
			type: "POST",
			url: action,
			data: data,
			dataType: "json",
			success: function(result, status, xhr){

				window.location = result.redirect;
				$("#error_msg").hide();
			},
			error: function(xhr, status, error){

				var jsonMsg = JSON.parse(xhr.responseText);

				generateError(jsonMsg.error);
			}
		});
	}

	function generateError(errorMsg){

		$("#error_msg").text(errorMsg);
		$("#error_msg").show();		
	}

	$("#login_submit").on("click", function(event){

		event.preventDefault();

		if ($("#username_input").val() == '' || $("#password_input").val() == ''){

			generateError("All fields required! Please check your login details and try again.")

			return false;
		}

		sendAjaxData($("#login_form").attr("action"), $("#login_form").serialize());

		return false;
	});
});
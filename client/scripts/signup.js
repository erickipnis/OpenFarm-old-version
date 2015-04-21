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

	$("#signup_submit").on("click", function(event){

		event.preventDefault();

		if ($("#user_input").val() === '' || $("#password_input").val() === '' || $("#password_input2").val() === ''){

			generateError("All fields required! Please check your login details and try again.");

			return false;
		}

		if ($("#password_input").val() !== $("#password_input2").val()){

			generateError("Passwords entered do not match. Please check your login details and try again.");

			return false;
		}

		sendAjaxData($("#signup_form").attr("action"), $("#signup_form").serialize());

		return false;
	});


});
$(document).ready(function () {
	$.ajax({
		url: nodeURL + '/getAllCities/',
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result) {
				$.each(result, function (data, value) {
					$("#ddCity").append($("<option></option>").val(value.CityId).html(value.CityName));
				})
			}
		},
		error: function (err) {
			console.log(err);
		}
	});

	$.ajax({
		url: nodeURL + '/getAllCitizenhips/',
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result) {
				$.each(result, function (data, value) {
					$("#ddCitizenship").append($("<option></option>").val(value.CitizenshipId).html(value.Description));
				})
			}
		},
		error: function (err) {
			console.log(err);
		}
	});

	$.ajax({
		url: nodeURL + '/getAllNativePlaces/',
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result) {
				$.each(result, function (data, value) {

					$("#ddNative").append($("<option></option>").val(value.NativeId).html(value.Name));
				})
			}
		},
		error: function (err) {
			console.log(err);
		}
	});

	$.ajax({
		url: nodeURL + '/getAllEducations/',
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result) {
				$.each(result, function (data, value) {

					$("#ddEducation").append($("<option></option>").val(value.EducationId).html(value.Description));
				})
			}
		},
		error: function (err) {
			console.log(err);
		}
	});

	$.ajax({
		url: nodeURL + '/getAllHeights/',
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result) {
				$.each(result, function (data, value) {

					$("#ddHeight").append($("<option></option>").val(value.HeightId).html(value.Description));
				})
			}
		},
		error: function (err) {
			console.log(err);
		}
	});

	$('#btnNext').click(function () {
		var data = {};
		var fromAge = $('#ddFromAge').find(":selected").val();
		var toAge = $('#ddToAge').find(":selected").val();
		var manglik = $('#ddMaglik').find(":selected").val();
		var citizenship = $('#ddCitizenship').find(":selected").val();
		var marital = $('#ddMarital').find(":selected").val();
		var gender = $('#ddGender').find(":selected").val();
		var height = $('#ddHeight').find(":selected").val();
		var education = $('#ddEducation').find(":selected").val();
		var city = $('#ddCity').find(":selected").val();
		var native = $('#ddNative').find(":selected").val();
		var handicap = $("#cbHandicap").prop('checked') == true;
		data["fromAge"] = fromAge ? fromAge : 'null';
		data["toAge"] = toAge ? toAge : 'null';
		data["manglik"] = manglik ? (manglik == 'All' ? 'null' : manglik) : 'null';
		data["citizenship"] = citizenship ? (citizenship == '1' ? 'null' : citizenship) : 'null';
		data["marital"] = marital ? (marital == 'All' ? 'null' : marital) : 'null';
		data["gender"] = gender ? (gender == 'All' ? 'null' : gender) : 'null';
		data["height"] = height ? (height == '1' ? 'null' : height) : 'null';
		data["education"] = education ? (education == '1' ? 'null' : education) : 'null';
		data["city"] = city ? (city == '1' ? 'null' : city) : 'null';
		data["native"] = native ? (native == '1' ? 'null' : native) : 'null';
		data["handicap"] = handicap ? handicap : 'null';
		var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), "Secret");
		localStorage.setItem("formData", encrypted.toString());
		window.location.href = "MatrimonialResult.html?formData=" + encrypted.toString();
	});

	$('#btnClear').click(function () {
		$('#ddHeight').prop('selectedIndex', 0);
		$('#ddFromAge').prop('selectedIndex', 0);
		$('#ddToAge').prop('selectedIndex', 12);
		$('#ddMaglik').prop('selectedIndex', 0);
		$('#ddCitizenship').prop('selectedIndex', 0);
		$('#ddMarital').prop('selectedIndex', 0);
		$('#ddGender').prop('selectedIndex', 0);
		$('#ddEducation').prop('selectedIndex', 0);
		$('#ddCity').prop('selectedIndex', 0);
		$('#ddNative').prop('selectedIndex', 0);
		$("#cbHandicap").removeAttr('checked');
	});
});

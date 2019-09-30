'use strict';

var ENEXT = ENEXT || {};

ENEXT.registration = (function(){
  var _suffix = 'dash';

  var init = function(suffix) {
    if (suffix) {
      _suffix = suffix;
    }

    // Some fields are meant to be create automatically
    registerHiddenFields();
    registerSolveUsernameCollision();
    registerFormValidation();
  };

  var registerHiddenFields = function() {
    // Any change to the firstname alter the username and fullname
    $("#firstname-js").change(function() {
      $("#name").val(generateFullname());
      $("#username").val(generateUsername());
    });

    // Any change to the lastname alter the username and fullname
    $("#lastname-js").change(function() {
      $("#name").val(generateFullname());
      $("#username").val(generateUsername());
    });

    // Any change to the date selector recreates the birth date
    $("#year_of_birth").change(function() {
      $("#date-of-birth").val(generateBirthdate());
    });
    $("#month_of_birth").change(function() {
      $("#date-of-birth").val(generateBirthdate());
    });
    $("#day_of_birth").change(function() {
      $("#date-of-birth").val(generateBirthdate());
    });
  };

  var generateBirthdate = function() {
    var year = $('#year_of_birth').val();
    var month = $('#month_of_birth').val();
    var day = $('#day_of_birth').val();
    return day + "/" + month + "/" + year;
  };

  var generateUsername = function(dynamic) {
    var suffix = _suffix;

    if (dynamic) {
      var index = sessionStorage.getItem('registration-clash-index');
      if (index) {
        index = String(Number(index) + 1);
      }
      else {
        index = 1;
      }
      sessionStorage.setItem('registration-clash-index', index);
      suffix += String(index);
    }

    var first = $.trim($('#firstname-js').val());
    var last = $.trim($('#lastname-js').val());
    var username = $.trim(first + " " + last + " " + suffix);
    return username.split(' ').join('.');
  };

  var generateFullname = function() {
    var first = $.trim($('#firstname-js').val());
    var last = $.trim($('#lastname-js').val());
    return $.trim(first + " " + last);
  };

  var solveUsernameCollision = function() {
    $("#username").val(generateUsername(true));
    $('#submit').click();
  };

  var registerSolveUsernameCollision = function() {
    $('#register-form').on('ajax:error', function(event, jqXHR, textStatus) {
      var error = JSON.parse(jqXHR.responseText);
      // Solve the collition only if the conditions are met
      if (error.field == 'username' && error.success == false && error.value.indexOf(generateUsername()) > -1){
        console.warn("Generating a dynamic username");
        solveUsernameCollision();
      }
    });
  };

  var registerFormValidation = function() {
    jQuery.validator.addMethod('selectRequired', function(value) {
        return (value != 'none');
    });

    $('#register-form').validate({
      rules: {
        firstname_js: "required",
        lastname_js: "required",
        email: {
          required: true,
          email: true
        },
        year_of_birth: "selectRequired",
        month_of_birth: "selectRequired",
        day_of_birth: "selectRequired",
        gender: "selectRequired",
        password: "required",
        new_password: {
          equalTo: "#password"
        },
        personal_id: "required",
        country: "selectRequired",
        city: "required",
        terms_of_service: "required"
      },
      messages: {
        firstname_js: "Campo requerido",
        lastname_js: "Campo requerido",
        personal_id: "Campo requerido",
        year_of_birth : "Campo requerido",
        month_of_birth : "Campo requerido",
        day_of_birth : "Campo requerido",
        gender: "Campo requerido",
        email:{
          required: "Campo requerido",
          email: "Por favor ingrese una cuenta de correo valida"
        },
        password: "Campo requerido",
        new_password: "El valor no coincide con la contraseña anterior",
        country: "Campo requerido",
        city: "Campo requerido",
        terms_of_service: "Para continuar debe aceptar los términos del servicio"
      },
      errorElement: "div",
      submitHandler: function(form) {
        form.submit();
      },
      invalidHandler: function(form) {
        toggleSubmitButton(true);
      }
    });
  }


  var api = {
    init: init,
    fullname: generateFullname,
    username: generateUsername,
    birthdate: generateBirthdate
  };

  // *********************** Only for testing purposes ********************

  // api.__testing__ = {};
  // api.__testing__.add_element = add_element;

  // *********************** Only for testing purposes ********************

  return api;

})();

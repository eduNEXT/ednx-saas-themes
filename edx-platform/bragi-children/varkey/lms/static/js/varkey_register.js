"use strict";
var ENEXT = ENEXT || {};

ENEXT.register = function($, gapi){

  var CLIENT_ID ="99585143056-3gvh9ui0oiqjidbkfmdq4al7mgs352f2.apps.googleusercontent.com";
  var API_KEY = "AIzaSyBGnjU0YqmfQRJCQmrBGtGZfR0Dbjr6d4o";
  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
  var SPREADSHEET_ID = "19Bzcctfefi-wQC3BXQbUaj-X-u_suSTqyHF6C9Krvq4";

  var MESSAGE = "Este correo electrónico no esta registrado como parte del programa. Comunícate con nosotros para mayor información.";

  var TIME_WAIT_VERIFY = 1500;

  var list = [];

  var timer;

  function listUsers() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "A2:A"
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {

        list= range.values;
        $("#register-form").prepend("<div id='verify-email' role='alert' class='status message submission-error' tabindex='-1'>  <h3 class='message-title'>los siguientes errores al procesar su registro: </h3> <ul class='message-copy' href>"+MESSAGE+" <a href='/contact'> Aqui</a> </ul> </div>");

      } else {
        console.log("No data found.");
      }
    }, function(response){
      console.log(response.result.error.message);
    });
  }

  /**
   *  Authenticity beacons
   */
  function addBeacon() {
    $("#register-form").append('<input id="varkey-registration-beacon" type="hidden" name="authorized_email" value="True" />');
  }

  function removeBeacon() {
    $("#varkey-registration-beacon").remove();
  }


  function verifyEmail(email){

    if (list.length > 0) {
      var i;
      var row;

      for (i=0; i < list.length; i+=1) {
        row = list[i];
        if(email === row[0]){
          // Accessing this branch means the user is authorized
          $("#submit").prop("disabled", false);
          $("#verify-email").attr("class", "status message submission-error");
          addBeacon();
          break;
        }
        removeBeacon();
        $("#submit").prop("disabled", true);
        $("#verify-email").attr("class", "status message submission-error is-shown");
      }
    }
    else {
      removeBeacon();
    }
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {

    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {

      listUsers();
    });
  }

  function handleClientLoad() {
    gapi.load("client:auth2", initClient);
  }

  // First we disable the button
  timer = setTimeout(function(){
    $("#submit").prop("disabled",true);
  }, TIME_WAIT_VERIFY);

  handleClientLoad();

  $("#email").on("input", function(){

    var email = $(this).val();

    clearTimeout(timer);

    timer = setTimeout(function(){
      verifyEmail(email);
    }, TIME_WAIT_VERIFY);
  });

  $('#register-form').on('ajax:error', function(event, jqXHR, textStatus) {
    var json = $.parseJSON(jqXHR.responseText);
    if (json.field === "authorized_email") {
      setTimeout(function(){
        $('.status.message.submission-error .message-copy').html(MESSAGE);
      }, 500)
    }
  });

  $('#personal_id').change(function(){
   var message_dni_error, invalid, color_error, color_gray;

   color_error = "#a0050e";
   color_gray = "#c8c8c8";
   message_dni_error = "<div id='message_dni'>Este campo no debe contener puntos, espacios ni guiones. Solamente el DNI</div>"
   invalid = $(this).is(':invalid');

   // Message dni field invalid
   $("#message_dni").remove();
   
   if (invalid) {
     $(message_dni_error).appendTo($('#field-personal_id'));
     $("#message_dni").css("color", color_error);
     $("#personal_id").css("border-color", color_error);
   } else {
     $("#message_dni").remove();
     $("#personal_id").css("border-color", color_gray);
   }

   if (!invalid && $('#varkey-registration-beacon').length) {
      //When user is authorized and dni field is valid
      $("#submit").prop("disabled", false);
    } else {
      $("#submit").prop("disabled", true);    
    }
  });  
};

ENEXT.register(jQuery, gapi);

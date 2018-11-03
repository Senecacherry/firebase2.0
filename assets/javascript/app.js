//Global Variables
var time;
var clock;

$(document).ready(function () {


        function runningClock() {
            time = moment().format("hh:mm:ss A");
            $("#time").text(time);
        }
        //  Call function with setInterval
        clock = setInterval(runningClock , 1000);
});        

//Initializing Firebase

var config = {
    apiKey: "AIzaSyDD5-I9t-NYd9jqlK7mbrp7wRGdWwPYsJY",
    authDomain: "trainschedule-a2ad7.firebaseapp.com",
    databaseURL: "https://trainschedule-a2ad7.firebaseio.com",
    projectId: "trainschedule-a2ad7",
    storageBucket: "trainschedule-a2ad7.appspot.com",
    messagingSenderId: "701899955884"
  };

firebase.initializeApp(config);

var database = firebase.database();

var currentTime = moment();

//had to do some firebase reading to find that "child added" is an event used to get a list of items from the database
database.ref().on("child_added", function(childSnap) {

    var name = childSnap.val().name;
    var destination = childSnap.val().destination;
    var firstTrain = childSnap.val().firstTrain;
    var frequency = childSnap.val().frequency;
    var min = childSnap.val().min;
    var next = childSnap.val().next;

//using js to grab the stored value and add it to the table

    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

database.ref().on("value", function(snapshot) {
   

});

//Grabs all the new information from the form and makes sure each input from the form has a value (the IFs)

$("#addTrainBtn").on("click", function() {

    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    if (trainName == "") {
        alert('Enter a train name.');
        return false;
    }
    if (destination == "") {
        alert('Enter a destination.');
        return false;
    }
    if (firstTrain == "") {
        alert('Enter a first train time.');
        return false;
    }
    if (frequency == "") {
        alert('Enter a frequency');
        return false;
    }

    //this part was really hard. Not a math person...had to look into this a LOT

     //subtracts the first train time back a year to ensure it's before current time.
     var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");

     // the time difference between current time and the first train
     var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
     var remainder = difference % frequency;
     var minUntilTrain = frequency - remainder;
     var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

     var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstInput").val("");
    $("#frequencyInput").val("");

    return false;
});

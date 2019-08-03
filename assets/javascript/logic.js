var firebaseConfig = {
    apiKey: "AIzaSyDpTchTrWhx8xm1r4yz4FgtKsQfxPspfDc",
    authDomain: "rpg-multiplayer-92664.firebaseapp.com",
    databaseURL: "https://rpg-multiplayer-92664.firebaseio.com",
    projectId: "rpg-multiplayer-92664",
    storageBucket: "rpg-multiplayer-92664.appspot.com",
    messagingSenderId: "535283611355",
    appID: "1:535283611355:web:545fa437e3b0d0fc",
  };
firebase.initializeApp(firebaseConfig);

var db = firebase.database();
var playersRef = db.ref("/players");
var chatRef = db.ref("/chat");
var connectedRef = db.ref(".info/connected");
var playerName,
    player1LoggedIn = false,
    player2LoggedIn = false,
    playerNumber,
    playerObject,
    player1Object = {
        name: "",
        choice: "",
        wins: 0,
        losses: 0
    },
    player2Object = {
        name: "",
        choice: "",
        wins: 0,
        losses: 0
    },
    resetId;

// when player is added
playersRef.on("child_added", function (childSnap) {
    window["player" + childSnap.key + "LoggedIn"] = true;
    window["player" + childSnap.key + "Object"] = childSnap.val();
}, errorHandler);

// when player is changed
playersRef.on("child_changed", function (childSnap) {
    window["player" + childSnap.key + "Object"] = childSnap.val();

    updateStats();
}, errorHandler);

// when player is removed
playersRef.on("child_removed", function (childSnap) {
    chatRef.push({
        userId: "system",
        text: childSnap.val().name + " has disconnected"
    });

    window["player" + childSnap.key + "LoggedIn"] = false;
    window["player" + childSnap.key + "Object"] = {
        name: "",
        choice: "",
        wins: 0,
        losses: 0
    };
}, errorHandler);

// when general changes are made, perform game logic
playersRef.on("value", function (snap) {
    // update the player names
    $("#player-1").text(player1Object.name || "Waiting for Player 1");
    $("#player-2").text(player2Object.name || "Waiting for Player 2");

    // display correct "screen" depending on logged in statuses
    if (player1LoggedIn && player2LoggedIn && !playerNumber) {
        loginPending();
    } else if (playerNumber) {
        showLoggedInScreen();
    } else {
        showLoginScreen();
    }

    // if both players have selected their choice, perform the comparison
    if (player1Object.choice && player2Object.choice) {
        rps(player1Object.choice, player2Object.choice);
    }

}, errorHandler);




// when the login button is clicked, add the new player to the open player slot
$("#login").click(function (e) {
    e.preventDefault();

    // check to see which player slot is available
    if (!player1LoggedIn) {
        playerNumber = "1";
        playerObject = player1Object;
    }
    else if (!player2LoggedIn) {
        playerNumber = "2";
        playerObject = player2Object;
    }
    else {
        playerNumber = null;
        playerObject = null;
    }

    // if a slot was found, update it with the new information
    if (playerNumber) {
        playerName = $("#player-name").val().trim();
        playerObject.name = playerName;
        $("#player-name").val("");

        $("#player-name-display").text(playerName);
        $("#player-number").text(playerNumber);

        db.ref("/players/" + playerNumber).set(playerObject);
        db.ref("/players/" + playerNumber).onDisconnect().remove();
    }
});

// when a selection is made, send it to the database
$(".selection").click(function () {
    // failsafe for if the player isn't logged in
    if (!playerNumber) return;

    playerObject.choice = this.id;
    db.ref("/players/" + playerNumber).set(playerObject);

    $(".p" + playerNumber + "-selections").hide();
    $(".p" + playerNumber + "-selection-reveal").text(this.id).show();
});


function errorHandler(error) {
    console.log("Error:", error.code);
}


function loginPending() {
    $(".pre-connection, .pre-login, .post-login, .selections").hide();
    $(".pending-login").show();
}

function showLoginScreen() {
    $(".pre-connection, .pending-login, .post-login, .selections").hide();
    $(".pre-login").show();
}

function showLoggedInScreen() {
    $(".pre-connection, .pre-login, .pending-login").hide();
    $(".post-login").show();
    if (playerNumber == "1") {
        $(".p1-selections").show();
    } else {
        $(".p1-selections").hide();
    }
    if (playerNumber == "2") {
        $(".p2-selections").show();
    } else {
        $(".p2-selections").hide();
    }
}

function rps(p1choice, p2choice) {
    $(".p1-selection-reveal").text(p1choice);
    $(".p2-selection-reveal").text(p2choice);

    showSelections();

    if (p1choice == p2choice) {
        //tie
        $("#feedback").text("TIE");
    }
    else if ((p1choice == "rock" && p2choice == "scissors") || (p1choice == "paper" && p2choice == "rock") || (p1choice == "scissors" && p2choice == "paper")) {
        // p1 wins
        $("#feedback").html("<small>" + p1choice + " beats " + p2choice + "</small><br/><br/>" + player1Object.name + " wins!");

        if (playerNumber == "1") {
            playerObject.wins++;
        } else {
            playerObject.losses++;
        }
    } else {
        // p2 wins
        $("#feedback").html("<small>" + p2choice + " beats " + p1choice + "</small><br/><br/>" + player2Object.name + " wins!");

        if (playerNumber == "2") {
            playerObject.wins++;
        } else {
            playerObject.losses++;
        }
    }

    resetId = setTimeout(reset, 3000);
}

function reset() {
    clearTimeout(resetId);

    playerObject.choice = "";

    db.ref("/players/" + playerNumber).set(playerObject);

    $(".selection-reveal").hide();
    $("#feedback").empty();
}
function updateStats() {
    for (var i = 1; i<=2; i++){
        var obj = window["player"+ i + "Object"];
        $("#p" + i + "-wins").text(obj.wins);
        $("#p" + i + "-losses").text(obj.losses);
    }
    player1LoggedIn ? $(".p1-stats").show() : $(".p1-stats").hide();
    player2LoggedIn ? $(".p2-stats").show() : $(".p2-stats").hide();
}
function showSelections() {
    $(".selections, .pending-selection, .selection-made").hide();
    $(".selection-reveal").show();
}

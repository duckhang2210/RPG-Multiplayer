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

var database = firebase.database();
var playerName;
var player1Logged = false;
var player2Logged = false;
var playerNumber;
var player;

var player1 = {
    choice: "",
    wins: 0,
    losses: 0
};
var player2 = {
    choice: "",
    wins: 0,
    losses: 0
};
var loginFunc = function(){
$('#login').on('click', function(event){
    event.preventDefault();
    
    if (player1Logged == false){
       
        //player1.name = $('#name').val().trim();
        playerName = $('#name').val().trim();
        player = player1;
        player1Logged = true;
        database.ref(playerName).set(player);
    }
       else{
       
        //player2.name = $('#name').val().trim();
        playerName = $('#name').val().trim();
        player = player2;
        player2Logged = true;
        database.ref(playerName).set(player);
    }

});
};

var selecFunc = function(){
$('.selection').on('click',function(){
    player1.choice = this.id;
    database.ref(playerName).set(player1);
    player2.choice = this.id;
    database.ref(playerName).set(player2);
});
//database.ref().on('value',function(snapshot){
//    var choices = snapshot.val();
//    var key = Object.keys(choices);
//    console.log(key);
//});
};

var compare = function(p1choice,p2choice){
    database.ref().on('value',function(snapshot){
        var arr = Object.entries(snapshot.val());
        p1choice = arr[0][1].choice;
        p2choice = arr[1][1].choice;
        var p1name = arr[0][0];
        var p2name = arr[1][0];
    
        if (p1choice === p2choice){
            $('#result').text("Draw");
        } else if ((p1choice == "rock" && p2choice == "scissors") || (p1choice == "paper" && p2choice == "rock") || (p1choice == "scissors" && p2choice == "paper")){
            $('#result').text(p1name +' beats the crap out of '+p2name);
        } else {
            $('#result').text(p2name +" beats the shit out of "+p1name);
        }
    });
    };
var gameLogic = function (){
    loginFunc();
    selecFunc();
    database.ref().on('value',function(snapshot){
        var arr = Object.entries(snapshot.val());
        var p1Choice = arr[0][1].choice;
        var p2Choice = arr[1][1].choice
    console.log(arr[0][1].choice);
    console.log(arr[1][1].choice);
    compare(p1Choice, p2Choice);
    console.log(arr);
});
};
gameLogic();

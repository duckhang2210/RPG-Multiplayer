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
var player = {
    number: '0',
    name: '',
    wins: 0,
    losses: 0,
    turns: 0,
    choice: ''
};
var opponent = {
    number: '0',
    name: '',
    wins: 0,
    losses: 0,
    turns: 0,
    choice: ''
};
  connectionsRef.once('value', function (snapshot) {
    if (Object.keys(snapshot.val()).indexOf('1') === -1) {
        player.number = '1';
        opponent.number = '2';
    } else if (Object.keys(snapshot.val()).indexOf('2') === -1) {
        player.number = '2';
        opponent.number = '1';
    }
​
    if (player.number !== '0') {
​
        con = connectionsRef.child(player.number);
        con.set(player);
​
        con.onDisconnect().remove();
​
    } else {
        app.delete();
    }
    console.log("You are Player " + player.number)
    console.log("You are Opponent " + opponent.number)
});
​
if (player.number = '1') {
    $(".player-two-form").hide();
} else if(opponent.number = '1'){
    $(".player-one-form").hide();
}

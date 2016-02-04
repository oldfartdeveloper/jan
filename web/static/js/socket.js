import {Socket} from "phoenix";

let socket = new Socket("/socket");

document.addEventListener('DOMContentLoaded', function() {
  $('.player-name').off("keypress").on("keypress", e => {
    if (e.keyCode == 13) {
      init();
    }
  });
});

let init = function() {
  socket.connect();

  let elmApp = Elm.fullscreen(Elm.Jan, { testPort: "",
                                         playersPort: [],
                                         winnerFoundPort: "" });

  elmApp.ports.chooseWeaponPort.subscribe(function (weapon) {
    channel.push("new_move", { move: weapon});
  });

  elmApp.ports.newGamePort.subscribe(function () {
    channel.push("new_game");
  });

  let roomName = $('.room-name').val();
  let playerName = $('.player-name').val();
  let channel = socket.channel("rooms:" + roomName, { player_name: playerName });

  channel.join().receive("ok", handleSuccessfulJoin)
                .receive("error", handleFailedJoin);

  window.onbeforeunload = function () {
    leave(channel);
  };

  $('.new-message').off("keypress").on("keypress", e => {
    if (e.keyCode == 13 && !e.shiftKey) sendNewMessage(channel);
  });

  channel.on("players_changed", payload => {
    elmApp.ports.playersPort.send(payload.players);
  });

  channel.on("winner_found", payload => {
    elmApp.ports.winnerFoundPort.send(payload.player_name);
  });

  channel.on("draw", payload => {
    $('.result-wrapper').show();
    $('.result').html(`It's a draw!`);
    $('.weapon-wrapper').addClass('-disabled');
  });

  channel.on("new_message", payload => {
    $('.messages').append(`<p><strong>${payload.player}:</strong> ${payload.message}</p>`);
  });
};

let handleSuccessfulJoin = function(response) {
  $('.game').show();
  $('.name').hide();
  console.log("Joined successfully", response);
};

let handleFailedJoin = function(response) {
  console.log("Unable to join", response);
  $('.error-message').html(response);
  $('.error-message').show();
};

let leave = function (channel) {
  channel.push("leave");
};

let playerView = function (player) {
    return `<div class="large-4 medium-4 columns">` +
             `<div class="score round label">${player.score}</div>` +
             `<div class="player-${player.name}">` +
               weaponView(player.name, player.move) +
             '</div>' +
           '</div>';
};

let weaponView = function (playerName, weapon) {
  if (weapon) {
     return `<a data-move="${weapon}" class="weapon-wrapper -disabled">` +
               `<p class="weapon-label">${playerName}</p>` +
               `<i class="weapon fa fa-5x fa-hand-${weapon}-o"></i> ` +
               `<p class="weapon-label">${weapon}</p>` +
             '</a>';
  } else {
     return '<a data-move="scissors" class="weapon-wrapper -disabled">' +
               `<p class="weapon-label">${playerName}</p>` +
               '<i class="weapon fa fa-5x fa-question"></i> ' +
               '<p class="weapon-label">...</p>' +
             '</a>';
  }
};

let sendNewMessage = function (channel) {
  let message = $('.new-message').val();
  $('.new-message').val('');
  channel.push("new_message", { message: message });
};

export default socket;

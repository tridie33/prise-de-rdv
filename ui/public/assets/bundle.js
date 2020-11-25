'use strict';

$(document).ready(function () {
  if (document.getElementById("prdv-button") !== null) {
    var urlHost = window.location.href;
    var valueCfaId = null;

    if (urlHost === 'http://localhost/fakeHost/ps') {
      valueCfaId = document.getElementById('domPSCfaId').textContent;
    }

    if (urlHost === 'http://localhost/fakeHost/lba') {
      valueCfaId = document.getElementById('domLBACfaId').textContent;
    }

    var a = document.createElement('a');
    var link = document.createTextNode("Prendre rendez-vous");
    a.appendChild(link);
    a.title = "Prendre rendez-vous";
    a.href = "http://localhost/form?paramCfaId=".concat(valueCfaId);
    var button = document.createElement('button');
    button.appendChild(a);
    document.getElementById("prdv-button").appendChild(button);
  }
});

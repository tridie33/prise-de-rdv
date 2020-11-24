'use strict';

$(document).ready(function () {
  if (document.getElementById("prdv-button") !== null) {
    var cfaId = document.getElementById('cfaId'); // Create anchor element.

    var a = document.createElement('a'); // Create the text node for anchor element.

    var link = document.createTextNode("Prendre rendez-vous"); // Append the text node to anchor element.

    a.appendChild(link); // Set the title.

    a.title = "Prendre rendez-vous"; // Set the href property.

    a.href = "http://localhost/form/".concat(cfaId.textContent);
    var button = document.createElement('button');
    button.appendChild(a);
    document.getElementById("prdv-button").appendChild(button);
  }
});

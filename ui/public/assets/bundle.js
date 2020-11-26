'use strict';

$(document).ready(function () {
  if (document.getElementById("prdv-button") !== null) {
    var urlHost = window.location.href;
    var valueCentreId = null;
    var valueTrainingId = null;

    if (urlHost === 'http://localhost/fakeHost/ps') {
      var getElementByIdForPs = document.getElementById('domPSCentreId');

      if (getElementByIdForPs !== null) {
        valueCentreId = getElementByIdForPs.textContent;
      }

      var getElementByTrainingIdForPs = document.getElementById('domPSTrainingId');

      if (getElementByTrainingIdForPs !== null) {
        valueTrainingId = getElementByTrainingIdForPs.textContent;
      }
    }

    if (urlHost === 'http://localhost/fakeHost/lba') {
      var getElementByIdForLBA = document.getElementById('domLBACentreId');

      if (getElementByIdForLBA !== null) {
        valueCentreId = getElementByIdForLBA.textContent;
      }

      var getElementByTrainingIdForLBA = document.getElementById('domLBATrainingId');

      if (getElementByTrainingIdForLBA !== null) {
        valueTrainingId = getElementByTrainingIdForLBA.textContent;
      }
    }

    var a = document.createElement('a');
    var link = document.createTextNode("Prendre rendez-vous");
    a.appendChild(link);
    a.title = "Prendre rendez-vous";
    a.href = "http://localhost/form?centreId=".concat(valueCentreId, "&trainingId=").concat(valueTrainingId);
    var button = document.createElement('button');
    button.appendChild(a);
    document.getElementById("prdv-button").appendChild(button);
  }
});

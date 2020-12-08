'use strict';

(function() {
    const env = {"PRDV_MNA_ENV":"recette"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

if (document.readyState !== 'loading') {
  console.log('document is already ready, just execute code here');
  myInitCode();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    console.log('document was not ready, place code here !');
    myInitCode();
  });
}

var prdv_mna_env = process.env.PRDV_MNA_ENV; // Used by rollup-plugin-inject-process-env to replace env name

var prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr";

switch (prdv_mna_env) {
  case "production":
    prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr";
    break;

  case "recette":
    prdv_mna_hostname = "https://rdv-cfa-recette.apprentissage.beta.gouv.fr";
    break;

  case "local":
    break;

  default:
    prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr";
    break;
}

function myInitCode() {
  if (document.getElementById("prdv-button") !== null) {
    var urlHost = window.location.href;
    var valueCentreId = null;
    var valueTrainingId = null;
    var fromReferrer = null;

    if (urlHost === prdv_mna_hostname + '/fakeHost/ps') {
      /*
      var getElementByIdForPs = document.getElementById('domPSCentreId');
      if (getElementByIdForPs !== null) {
          valueCentreId = getElementByIdForPs.textContent;
      }
      var getElementByTrainingIdForPs = document.getElementById('domPSTrainingId');
      if (getElementByTrainingIdForPs !== null) {
          valueTrainingId = getElementByTrainingIdForPs.textContent;
      }
       */
      valueCentreId = "0831760M";
      valueTrainingId = "13531545";
      fromReferrer = "Parcoursup";
    }

    if (urlHost === prdv_mna_hostname + '/fakeHost/lba') {
      /*
      var getElementByIdForLBA = document.getElementById('domLBACentreId');
      if (getElementByIdForLBA !== null) {
          valueCentreId = getElementByIdForLBA.textContent;
      }
      var getElementByTrainingIdForLBA = document.getElementById('domLBATrainingId');
      if (getElementByTrainingIdForLBA !== null) {
          valueTrainingId = getElementByTrainingIdForLBA.textContent;
      }
       */
      valueCentreId = "0831760M";
      valueTrainingId = "13531545";
      fromReferrer = "LBA";
    }

    var a = document.createElement('a');
    var link = document.createTextNode("Prendre rendez-vous");
    a.appendChild(link);
    a.title = "Prendre rendez-vous";
    a.href = "".concat(prdv_mna_hostname, "/form?fromReferrer=").concat(fromReferrer, "&centreId=").concat(valueCentreId, "&trainingId=").concat(valueTrainingId);
    var button = document.createElement('button');
    button.appendChild(a);
    document.getElementById("prdv-button").appendChild(button);
  }
}

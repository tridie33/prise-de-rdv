if (document.readyState !== "loading") {
  console.log("document is already ready, just execute code here");
  loaderWidgetPRDV();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("document was not ready, place code here !");
    loaderWidgetPRDV();
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
    prdv_mna_hostname = "http://localhost";
    break;

  default:
    prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr";
    break;
}

function loaderWidgetPRDV() {
  var elements = document.getElementsByClassName("widget-prdv");
  for (var element of elements) {
    createWidgetPRDV(element);
  }
}

function createWidgetPRDV(element) {
  if (element !== null) {
    var fromReferrer = window.location.href;
    var valueCentreId =
      element.dataset.prdvCentre !== undefined
        ? element.dataset.prdvCentre
        : null;
    var valueTrainingId =
      element.dataset.prdvTraining !== undefined
        ? element.dataset.prdvTraining
        : null;
    var valueSiteName =
      element.dataset.prdvSitename !== undefined
        ? element.dataset.prdvSitename
        : window.location.origin;
    var valueCandidatFirstname =
      element.dataset.prdvCandidatFirstname !== undefined
        ? element.dataset.prdvCandidatFirstname
        : undefined;
    var valueCandidatLastname =
      element.dataset.prdvCandidatLastname !== undefined
        ? element.dataset.prdvCandidatLastname
        : undefined;

    var a = document.createElement("a");
    var link = document.createTextNode("Prendre rendez-vous");
    a.appendChild(link);
    a.title = "Prendre rendez-vous";
    a.href = `${prdv_mna_hostname}/form?fromReferrer=${fromReferrer}&centreId=${valueCentreId}&trainingId=${valueTrainingId}&siteName=${valueSiteName}&candidatFirstname=${valueCandidatFirstname}&candidatLastname=${valueCandidatLastname}`;

    var button = document.createElement("button");
    button.appendChild(a);
    element.appendChild(button);
  } else {
    console.log("error loading widget PRDV");
  }
}

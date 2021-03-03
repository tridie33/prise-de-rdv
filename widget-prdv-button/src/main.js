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

/**
 * @description Initializes widgets.
 * @returns {void}
 */
window.initPrdvWidget = function () {
  var elements = document.getElementsByClassName("widget-prdv");
  for (var element of elements) {
    createWidgetPRDV(element);
  }
}

/**
 * @description Creates button if allowed.
 * @param {HTMLCollectionOf<Element>} element
 * @returns {void}
 */
function createWidgetPRDV(element) {
  if (element !== null) {
    var siret = element.dataset.siret !== undefined ? element.dataset.siret : null;
    var cfd = element.dataset.cfd !== undefined ? element.dataset.cfd : null;
    var referrer = element.dataset.referrer !== undefined ? element.dataset.referrer : null;
    var candidatFirstname = element.dataset.candidatFirstname !== undefined ? element.dataset.candidatFirstname : undefined;
    var valueCandidatLastname = element.dataset.candidatLastname !== undefined ? element.dataset.candidatLastname : undefined;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {

        var data = JSON.parse(this.responseText);

        // Skip if widget isn't allowed
        if(data && data.error) {
          return;
        }

        var a = document.createElement("a");
        var link = document.createTextNode("Prendre rendez-vous");
        a.appendChild(link);
        a.title = "Prendre rendez-vous";
        a.target = '_blank';
        a.href = `${prdv_mna_hostname}/form?referrer=${referrer}&siret=${siret}&cfd=${cfd}&candidatFirstname=${candidatFirstname}&candidatLastname=${valueCandidatLastname}`;

        var button = document.createElement("button");
        button.appendChild(a);
        element.appendChild(button);
      }
    };

    xhttp.open("GET", `${prdv_mna_hostname}/api/appointment-request/context/create?siret=${siret}&cfd=${cfd}&referrer=${referrer}`, true);
    xhttp.send();
  } else {
    console.log("An error occurred during widget initialization.");
  }
}

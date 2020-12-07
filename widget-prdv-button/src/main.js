if( document.readyState !== 'loading' ) {
    console.log( 'document is already ready, just execute code here' );
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log( 'document was not ready, place code here' );
        myInitCode();
    });
}

var prdv_mna_env = process.env.PRDV_MNA_ENV; // Used by rollup-plugin-inject-process-env to replace env name
var prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr";
switch (prdv_mna_env) {
    case "production":
        prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr"
    break;
    case "recette":
        prdv_mna_hostname = "https://rdv-cfa-recette.apprentissage.beta.gouv.fr"
    break;
    case "local":
        prdv_mna_hostname - "http://localhost"
    break;

    default:
        prdv_mna_hostname = "https://rdv-cfa.apprentissage.beta.gouv.fr"
    break;
}

function myInitCode() {
    if (document.getElementById("prdv-button") !== null) {
        var urlHost = window.location.href;
        var valueCentreId = null;
        var valueTrainingId = null;
        var fromWhom = null;
        

        if (urlHost === prdv_mna_hostname+'/fakeHost/ps') {
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
            fromWhom = "Parcoursup";
        }

        if (urlHost === prdv_mna_hostname+'/fakeHost/lba') {
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
            fromWhom = "LBA";
        }

        var a = document.createElement('a');
        var link = document.createTextNode("Prendre rendez-vous");
        a.appendChild(link);
        a.title = "Prendre rendez-vous";
        a.href = `${prdv_mna_hostname}/form?fromWhom=${fromWhom}&centreId=${valueCentreId}&trainingId=${valueTrainingId}`;

        var button = document.createElement('button');
        button.appendChild(a);
        document.getElementById("prdv-button").appendChild(button);
    }
};

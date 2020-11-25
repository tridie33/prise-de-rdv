$( document ).ready(function() {
    if (document.getElementById("prdv-button") !== null) {
        var urlHost = window.location.href;
        var valueCfaId = null;
        if (urlHost === 'http://localhost/fakeHost/ps') {
            var getElementByIdForPs = document.getElementById('domPSCfaId');
            if (getElementByIdForPs !== null) {
                valueCfaId = getElementByIdForPs.textContent;
            }
        }

        if (urlHost === 'http://localhost/fakeHost/lba') {
            var getElementByIdForLBA = document.getElementById('domLBACfaId');
            if (getElementByIdForLBA !== null) {
                valueCfaId = getElementByIdForLBA.textContent;
            }
        }

        var a = document.createElement('a');
        var link = document.createTextNode("Prendre rendez-vous");
        a.appendChild(link);
        a.title = "Prendre rendez-vous";
        a.href = `http://localhost/form?paramCfaId=${valueCfaId}`;

        var button = document.createElement('button');
        button.appendChild(a);
        document.getElementById("prdv-button").appendChild(button);
    }
});

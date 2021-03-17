/**
 * @description Initializes widgets.
 * @returns {Promise<{siret: {String}, cfd: {String}: referrer: {String}, data: {Object} }[]>}
 */
window.initPrdvWidget = () => {
    const promises = Object.values(document.getElementsByClassName("widget-prdv"))
        .map(createWidgetPRDV);

    return Promise.all(promises);
}

/**
 * @description Creates button if allowed.
 * @param {HTMLCollectionOf<Element>} element - DOM element
 * @returns {void}
 */
function createWidgetPRDV(element) {
    const baseUrl = process.env.BASE_URL;

    const siret = element.dataset.siret;
    const cfd = element.dataset.cfd;
    const referrer = element.dataset.referrer;
    const candidatFirstname = element.dataset.candidatFirstname;
    const candidatLastname = element.dataset.candidatLastname;

    let url = `${baseUrl}/form?referrer=${referrer}&siret=${siret}&cfd=${cfd}`;

    if(candidatFirstname) {
        url = `${url}&candidatFirstname=${candidatFirstname}`;
    }

    if(candidatLastname) {
        url = `${url}&candidatLastname=${candidatLastname}`;
    }

    return fetch(`${baseUrl}/api/appointment-request/context/create?siret=${siret}&cfd=${cfd}&referrer=${referrer}`)
        .then(response => response.json())
        .then(data => {

            if(data && !data.error) {
                const a = document.createElement("a");
                const link = document.createTextNode("Prendre rendez-vous");

                a.appendChild(link);
                a.title = "Prendre rendez-vous";
                a.target = '_blank';
                a.href = url

                element.appendChild(a);
            }

            return {
                siret,
                cfd,
                referrer,
                data,
            }
        })
        .catch(console.error)
}

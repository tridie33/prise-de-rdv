'use strict';

(function() {
    const env = {"PRDV_MNA_ENV":"production"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
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
/**
 * @description Initializes widgets.
 * @returns {void}
 */


window.initPrdvWidget = function () {
  var elements = document.getElementsByClassName("widget-prdv");

  var _iterator = _createForOfIteratorHelper(elements),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var element = _step.value;
      createWidgetPRDV(element);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
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

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText); // Skip if widget isn't allowed

        if (data && data.error) {
          return;
        }

        var a = document.createElement("a");
        var link = document.createTextNode("Prendre rendez-vous");
        a.appendChild(link);
        a.title = "Prendre rendez-vous";
        a.target = '_blank';
        a.href = "".concat(prdv_mna_hostname, "/form?referrer=").concat(referrer, "&siret=").concat(siret, "&cfd=").concat(cfd, "&candidatFirstname=").concat(candidatFirstname, "&candidatLastname=").concat(valueCandidatLastname);
        var button = document.createElement("button");
        button.appendChild(a);
        element.appendChild(button);
      }
    };

    xhttp.open("GET", "".concat(prdv_mna_hostname, "/api/appointment-request/context/create?siret=").concat(siret, "&cfd=").concat(cfd, "&referrer=").concat(referrer), true);
    xhttp.send();
  } else {
    console.log("An error occurred during widget initialization.");
  }
}

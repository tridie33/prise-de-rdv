"use strict";

(function () {
  const env = { PRDV_MNA_ENV: "recette" };
  try {
    if (process) {
      process.env = Object.assign({}, process.env);
      Object.assign(process.env, env);
      return;
    }
  } catch (e) {} // avoid ReferenceError: process is not defined
  globalThis.process = { env: env };
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
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length)
            return {
              done: true,
            };
          return {
            done: false,
            value: o[i++],
          };
        },
        e: function (e) {
          throw e;
        },
        f: F,
      };
    }

    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
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
    },
  };
}

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

  var _iterator = _createForOfIteratorHelper(elements),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var element = _step.value;
      createWidgetPRDV(element);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function createWidgetPRDV(element) {
  if (element !== null) {
    var fromReferrer = window.location.href;
    var valueCentreId = element.dataset.prdvCentre !== undefined ? element.dataset.prdvCentre : null;
    var valueTrainingId = element.dataset.prdvTraining !== undefined ? element.dataset.prdvTraining : null;
    var valueSiteName =
      element.dataset.prdvSitename !== undefined ? element.dataset.prdvSitename : window.location.origin;
    var valueCandidatFirstname =
      element.dataset.prdvCandidatFirstname !== undefined ? element.dataset.prdvCandidatFirstname : undefined;
    var valueCandidatLastname =
      element.dataset.prdvCandidatLastname !== undefined ? element.dataset.prdvCandidatLastname : undefined;
    var a = document.createElement("a");
    var link = document.createTextNode("Prendre rendez-vous");
    a.appendChild(link);
    a.title = "Prendre rendez-vous";
    a.href = ""
      .concat(prdv_mna_hostname, "/form?fromReferrer=")
      .concat(fromReferrer, "&centreId=")
      .concat(valueCentreId, "&trainingId=")
      .concat(valueTrainingId, "&siteName=")
      .concat(valueSiteName, "&candidatFirstname=")
      .concat(valueCandidatFirstname, "&candidatLastname=")
      .concat(valueCandidatLastname);
    var button = document.createElement("button");
    button.appendChild(a);
    element.appendChild(button);
  } else {
    console.log("error loading widget PRDV");
  }
}

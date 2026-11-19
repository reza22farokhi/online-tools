(function (window, document) {
  'use strict';

  var analyticsName = 'yektanet';
  var scriptId = 'yektanet-publisher-loader';
  var existingScript = document.getElementById(scriptId);

  // The layout can be re-evaluated by client navigation or third-party code.
  // Never inject the publisher loader more than once per document.
  if (window.__yektanetPublisherLoaderStarted || existingScript) return;

  var current = window[analyticsName];
  if (typeof current === 'function' && !current.q) {
    // The real analytics runtime is already present.
    window.__yektanetPublisherLoaderStarted = true;
    return;
  }

  window.__yektanetPublisherLoaderStarted = true;
  window.yektanetAnalyticsObject = analyticsName;

  if (typeof current !== 'function') {
    var queue = [];
    var stub = function () { queue.push(arguments); };
    stub.q = queue;
    window[analyticsName] = stub;
  }

  var script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = 'https://cdn.yektanet.ir/superscript-v2/Cg1anVr4/native-49280/yn_pub.js';
  script.onerror = function () {
    // Keep the failure isolated to advertising; core tools remain unaffected.
    script.setAttribute('data-load-failed', 'true');
  };
  document.head.appendChild(script);
})(window, document);

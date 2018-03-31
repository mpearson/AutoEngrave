
function callAPI(url, method, data) {
  return fetch(url, {
    method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then(response => response.json())
    .then(json => Promise.resolve(json.results));
}

// function console_send(command) {
//   post_json("/console/send", JSON.stringify({command}))
//     .catch(error => console.log(error))
//     .then(response => console.log(response.json()));
// }



$(() => {
  let selectedPort = null;

  const consoleInput = $("#console-input");
  const consoleLog = $("#console-log");
  const portList = $("#port-list");
  const portScanButton = $("#port-scan-button");
  const consoleSendButton = $("#console-send-button");

  const loadingSpinner = $(
    `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" preserveAspectRatio="xMidYMid" class="lds-dual-ring">
       <circle cx="15" cy="15" fill="none" stroke-linecap="round" r="8" stroke-width="3" stroke="#51CACC" stroke-linecap="butt" stroke-dasharray="12.5663706 12.5663706" transform="rotate(95 50 50)">
          <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 15 15;360 15 15" keyTimes="0;1" dur="1.2s" begin="0s" repeatCount="indefinite"></animateTransform>
       </circle>
    </svg>`
  );

  function consoleSend(command) {
    if (command) {
      callAPI("/console/send", "post", {command})
        .then(results => {
          addConsoleEntry(command, "command");
          if(results !== null)
            addConsoleEntry(results, "response");
        })
        .catch(error => addConsoleEntry(error, "error"));
    }
  }

  function addConsoleEntry(text, className) {
    const newDiv = $(document.createElement("div"));
    newDiv.text(text).addClass(className).prependTo(consoleLog);

    consoleLog.prop("scrollTop", consoleLog.height());
  }


  function selectPort(port) {
    selectedPort = port;
    portList.val(port);
  }

  function updatePorts(ports) {
    const label = portList.children().first().detach();
    portList.empty();
    portList.append(label);
    for (const port of ports) {
      const item = $(document.createElement("option"));
      item.value = port;
      item.text(port);
      portList.append(item);
    }
  }

  function scanComPorts() {
    portScanButton.html(loadingSpinner.clone());
    callAPI("/comms/scan", "get")
      .then(results => {
        updatePorts(results);
        portScanButton.html("Scan");
      });
  }

  scanComPorts();

  portList.on("change", e => selectPort(e.target.value));
  portScanButton.click(scanComPorts);

  consoleSendButton.click(() => {
    consoleSend(consoleInput.val());
    consoleInput.select();
  });

  consoleInput.keydown(e => {
    if(e.which == 13) {
      consoleSend(e.target.value);
      e.target.select();
    }
  }).on("input", e => {
    e.target.value = e.target.value.toUpperCase();
  });

});


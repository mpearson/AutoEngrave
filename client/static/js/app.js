
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

  function addConsoleEntry(text, className) {
    const newDiv = $(document.createElement("div"));
    newDiv.text(text).addClass(className).appendTo(consoleLog);

    consoleLog.prop("scrollTop", consoleLog.height());
  }


  function selectPort(port) {
    selectedPort = port;
    portList.val(port);
  }

  function updatePorts(ports) {
    portList.empty();
    for (const port of ports) {
      const item = $(document.createElement("option"));
      item.value = port;
      item.text(port);
      portList.append(item);
    }
  }

  function portScan() {
    callAPI("/comms/scan", "get")
      .then(results => updatePorts(results));
  }

  portList.on("change", e => selectPort(e.target.value));
  portScanButton.click(portScan);

  consoleInput.keydown(e => {
    if(e.which == 13) {
      const command = e.target.value;
      callAPI("/console/send", "post", {command})
        .then(results => {
          addConsoleEntry(command, "command");
          if(results !== null)
            addConsoleEntry(results, "response");
        })
        .catch(error => addConsoleEntry(error, "error"));

      e.target.value = "";
    }
  }).on("input", e => {
    e.target.value = e.target.value.toUpperCase();
  });

});


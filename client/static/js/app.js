
function postJSON(url, data) {
  return fetch(url, {
    method: "post",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: data,
  })
}

function putJSON(url, data) {
  return fetch(url, {
    method: "put",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: data,
  })
}


// function console_send(command) {
//   post_json("/console/send", JSON.stringify({command}))
//     .catch(error => console.log(error))
//     .then(response => console.log(response.json()));
// }



$(() => {
  const consoleInput = $("#console-input");
  const consoleLog = $("#console-log");

  function addConsoleEntry(text, className) {
    const newDiv = $(document.createElement("div"));
    newDiv.text(text).addClass(className).appendTo(consoleLog);

    consoleLog.prop("scrollTop", consoleLog.height());
  }

  consoleInput.keydown(e => {
    if(e.which == 13) {
      const command = e.target.value;
      postJSON("/console/send", JSON.stringify({command}))
        .then(response => response.json())
        .then(json => {
          addConsoleEntry(command, "command");
          if(json.result !== null)
            addConsoleEntry(json.result, "response");
        })
        .catch(error => addConsoleEntry(error, "error"));

      e.target.value = "";
    }
  }).on("input", e => {
    e.target.value = e.target.value.toUpperCase();
  });

});


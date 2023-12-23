/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow ] );
    start(modules);
  } catch (e) {
    console.error(e);
    throw e;
  }
})();

async function start( [ evtWindow ] ) {
  try {
    console.log(evtWindow);
    function createServiceWorkerButton(serviceWorker) {
      const btn = document.createElement("button");
      btn.appendChild(document.createTextNode(serviceWorker.scriptURL));
      btn.addEventListener("click", function (evt) {
        const display = document.createElement("div");
        display.style.left = "10%";
        display.style.top = "10%";
        display.style.width = "80%";
        display.style.height = "80%";
        const closeBtn = document.createElement("button");
        display.appendChild(closeBtn);
        closeBtn.addEventListener("click", function () {
          display.remove();
        });
        const pURL = document.createElement("p");
        display.appendChild(pURL);
        pURL.appendChild(document.createTextNode("scriptURL: " + serviceWorker.scriptURL));
        const pState = document.createElement("p");
        display.appendChild(pState);
        pState.appendChild(document.createTextNode("state: " + serviceWorker.state));
        document.body.appendChild(display);
      });
      return btn;
    }
    const controller = document.createElement("p");
    let controllerBtn = createServiceWorkerButton(navigator.serviceWorker.controller);
    controller.appendChild(controllerBtn);
    navigator.serviceWorker.addEventListener("controllerchange", function (evt) {
      controllerBtn.remove();
      controllerBtn = createServiceWorkerButton(navigator.serviceWorker.controller);
      controller.appendChild(controllerBtn);
    });
    const pCreateRegistration = document.createElement("p");
    pCreateRegistration.appendChild(document.createTextNode("sw_"));
    const inpId = document.createElement("input");
    pCreateRegistration.appendChild(inpId);
    inpId.type = "text";
    pCreateRegistration.appendChild(document.createTextNode(".js"));
    const createRegistrationBtn = document.createElement("button");
    document.body.appendChild(createRegistrationBtn);
    createRegistrationBtn.appendChild(document.createTextNode("Create Registration"));
    createRegistrationBtn.addEventListener("click", function (evt) {
      (async function () {
        await navigator.serviceWorker.register("/sw_" + inpId.value + ".js", {
          scope: "/",
        });
        refreshRegistrationTable();
      })();
    });
    const refreshRegistrationTableBtn = document.createElement("button");
    document.body.appendChild(refreshRegistrationTableBtn);
    refreshRegistrationTableBtn.appendChild(document.createTextNode("Refresh Registration Table"));
    refreshRegistrationTableBtn.addEventListener("click", function (evt) {
      refreshRegistrationTable();
    });
    const registrationTable = document.createElement("table");
    document.body.appendChild(registrationTable);
    const registrationTableHeader = document.createElement("tr");
    registrationTable.appendChild(registrationTableHeader);
    const registrationTableHeader0 = document.createElement("th");
    registrationTableHeader.appendChild(registrationTableHeader0);
    registrationTableHeader0.appendChild(document.createTextNode("active"));
    const registrationTableHeader1 = document.createElement("th");
    registrationTableHeader.appendChild(registrationTableHeader1);
    registrationTableHeader1.appendChild(document.createTextNode("installing"));
    const registrationTableHeader2 = document.createElement("th");
    registrationTableHeader.appendChild(registrationTableHeader2);
    registrationTableHeader2.appendChild(document.createTextNode("waiting"));
    const registrationTableHeader3 = document.createElement("th");
    registrationTableHeader.appendChild(registrationTableHeader3);
    registrationTableHeader3.appendChild(document.createTextNode("scope"));
    const registrationTableHeader4 = document.createElement("th");
    registrationTableHeader.appendChild(registrationTableHeader4);
    registrationTableHeader4.appendChild(document.createTextNode("unregister"));
    const registrationTableHeader5 = document.createElement("th");
    registrationTableHeader.appendChild(registrationTableHeader5);
    registrationTableHeader5.appendChild(document.createTextNode("update"));
    refreshRegistrationTable();
    function refreshRegistrationTable() {
      function createRow(registration) {
        const row = document.createElement("tr");
        const cell0 = document.createElement("td");
        row.appendChild(cell0);
        cell0.appendChild(createServiceWorkerButton(registration.active));
        const cell1 = document.createElement("td");
        row.appendChild(cell1);
        cell1.appendChild(createServiceWorkerButton(registration.installing));
        const cell2 = document.createElement("td");
        row.appendChild(cell2);
        cell2.appendChild(createServiceWorkerButton(registration.waiting));
        const cell3 = document.createElement("td");
        row.appendChild(cell3);
        cell3.appendChild(document.createTextNode(scope));
        const cell4 = document.createElement("td");
        row.appendChild(cell4);
        const unregisterBtn = document.createElement("button");
        cell4.appendChild(unregisterBtn);
        unregisterBtn.appendChild(document.createTextNode("Unregister"));
        unregisterBtn.addEventListener("click", function () {
          (async function () {
            row.style.backgroundColor = "grey";
            await registration.unregister();
            refreshRegistrationTable();
          })();
        });
        const cell5 = document.createElement("td");
        row.appendChild(cell5);
        const updateBtn = document.createElement("button");
        cell5.appendChild(updateBtn);
        updateBtn.appendChild(document.createTextNode("Update"));
        updateBtn.addEventListener("click", function () {
          (async function () {
            row.style.backgroundColor = "grey";
            await registration.update();
            refreshRegistrationTable();
          })();
        });
        return row;
      }
      registrationTable.innerHTML = "";
      registrationTableHeader.style.backgroundColor = "grey";
      registrationTable.appendChild(registrationTableHeader);
      let readyRow = document.createElement("tr");
      readyRow.style.backgroundColor = "red";
      registrationTable.appendChild(readyRow);
      (async function () {
        const registrations = await navigator.serviceWorker.getRegistrations();
        registrationTable.appendChild(readyRow);
        for (const registration of registrations) {
          registrationTable.appendChild(createRow(registration));
        }
        registrationTableHeader.style.backgroundColor = "white";
      })();
      (async function () {
        const readyRegistration = await navigator.serviceWorker.ready;
        readyRow.remove();
        readyRow = createRow(readyRegistration);
        readyRow.style.backgroundColor = "green";
        registrationTable.appendChild(readyRow);
      })();
    }
  } catch (e) {
    console.log(e);
  }
  async function getRegistration() {
    if ("serviceWorker" in navigator) {
      try {
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  }
}

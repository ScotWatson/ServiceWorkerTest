/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

let numFetches = 0;

self.addEventListener("install", function (evt) {
  // only occurs once
  evt.waitUntil(Promise.resolve());
});

self.addEventListener("activate", function (evt) {
  evt.waitUntil(Promise.resolve());
});

// push notifications require a push server that expects to be communicating with this origin. It is not implemented here.

self.addEventListener("sync", function (evt) {
  
});

self.addEventListener("fetch", function (evt) {
  ++numFetches;
  // if "test.html" is loaded from any scope, return "/ServiceWorkerTest/test.html"
  // if "test.js" is loaded from any scope, return "/ServiceWorkerTest/test.html"
  async function fetchModified(request) {
    const requestURL = new URL(request.url);
    await sendMessage(requestURL.pathname);
    if (requestURL.pathname.endsWith("/test.html")) {
      await sendMessage("Modified Fetch");
      /*
      const newRequest = new Request("https://scotwatson.github.io/ServiceWorkerTest/test.html", {
        method: request.method,
        headers: request.headers,
        body: request.body,
//        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: request.keepalive,
        signal: request.signal,
        priority: request.priority,
      });
      const directResponse = await fetch(request);
      */
      const directResponse = await fetch("https://scotwatson.github.io/ServiceWorkerTest/test.html");
      return new Response(await directResponse.blob(), {
        status: directResponse.status,
        statusText: directResponse.statusText,
        headers: directResponse.headers,
      });
    } else if (requestURL.pathname.endsWith("/test.js")) {
      await sendMessage("Modified Fetch");
      /*
      const newRequest = new Request("https://scotwatson.github.io/ServiceWorkerTest/test.js", {
        method: request.method,
        headers: request.headers,
        body: request.body,
//        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: request.keepalive,
        signal: request.signal,
        priority: request.priority,
      });
      const directResponse = await fetch(request);
      */
      const directResponse = await fetch("https://scotwatson.github.io/ServiceWorkerTest/test.js");
      return new Response(await directResponse.blob(), {
        status: directResponse.status,
        statusText: directResponse.statusText,
        headers: directResponse.headers,
      });
    } else {
      return await fetch(request);
    }
  }
  async function getResponse() {
    await sendMessage(evt.request.url);
    const response = await fetchModified(evt.request);
    await sendMessage(response.status);
    return response;
  }
  evt.respondWith(getResponse());
});

self.addEventListener("message", function (evt) {
  evt.waitUntil((async function () {
    const data = evt.data;
    if (data.action === "claim") {
      await self.clients.claim();
      evt.source.postMessage("done");
    }
    if (data.action === "skipWaiting") {
      self.skipWaiting();
      evt.source.postMessage("done");
    }
    if (data.action === "numClients") {
      const clients = await self.clients.matchAll();
      evt.source.postMessage("numClients: " + clients.length);
    }
    if (data.action === "numFetches") {
      evt.source.postMessage("numFetches: " + numFetches);
    }
    await sendMessage("Test Broadcast");
  })());
});

async function sendMessage(data) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage(data);
  }
}

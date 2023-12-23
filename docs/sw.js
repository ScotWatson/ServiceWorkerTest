/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
  // if any file is requested that starts with "sw_" and ends with ".js", return "sw.js"
  async function fetchModified() {
    const request = evt.request;
    const requestURL = URL(request.url);
    const pathElements = requestURL.pathname.split("/");
    const resourceName = pathElements[pathElements.length - 1];
    if (resourceName.startsWith("sw_") && resourceName.endsWith(".js")) {
      return Response.redirect("/sw.js");
/*
      const newRequest = new Request(requestURL.origin + pathElements.join("/"), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        mode: request.mode,
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
      return new Response(new Blob( [ directResponse.blob(), "\n//", Date().toString() ], {
        status: directResponse.status.
        statusText: directResponse.statusText,
        headers: directResponse.headers,
      });
*/
    } else {
      return await fetch(request);
    }
  }
  async function getResponse() {
    const response = await fetchModified();
    evt.respondWith(response);
  }
  evt.waitUntil(getResponse());
});

self.addEventListener("message", function (evt) {
  
});
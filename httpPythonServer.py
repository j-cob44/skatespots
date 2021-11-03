# server.py
import http.server # Our http server handler for http requests
import socketserver # Establish the TCP Socket connections
import json

PORT = 80

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        self._set_headers()
        print("in post method")
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        data = json.loads(self.data_string)
        with open("./backend/unverified.json", "w") as outfile:
            json.dump(data, outfile)
        return

Handler = MyHttpRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Http Server Serving at port", PORT)
    httpd.serve_forever()

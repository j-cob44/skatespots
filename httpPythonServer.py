# server.py
import argparse
import http.server # Our http server handler for http requests
import socketserver # Establish the TCP Socket connections
import json
import uuid
from datetime import datetime

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_HEAD(self):
        self._set_headers()

    # def do_POST(self):
    #     self._set_headers()
    #     print("in post method")
    #     self.data_string = self.rfile.read(int(self.headers['Content-Length']))
    #
    #     self.send_response(200)
    #     self.end_headers()
    #     print(self.data_string)
    #     data = json.loads(self.data_string)
    #     with open("./backend/unverified.json", "w") as outfile:
    #         json.dump(data, outfile)
    #     return

    def do_PUT(self):
        self._set_headers()
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        submittedData = json.loads(self.data_string)

        dt = datetime.now()
        ts = datetime.timestamp(dt)

        data = {'IP': self.client_address[0], 'timestamp': str(datetime.fromtimestamp(ts, tz=None)), 'submission': submittedData}
        dataUpURL = "./backend/unverified/" + str(uuid.uuid4().hex) + ".json"
        with open(dataUpURL, "w") as outfile:
            json.dump(data, outfile)
        return

Handler = MyHttpRequestHandler

def run(handler_class=Handler, addr="0.0.0.0", port=80):
    with socketserver.TCPServer((addr, port), handler_class) as httpd:
        print(f"Http Server starting at {addr}:{port}")
        httpd.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run a simple HTTP server")
    parser.add_argument(
        "-l",
        "--listen",
        default="localhost",
        help="Specify the IP address of the server"
    )
    parser.add_argument(
        "-p",
        "--port",
        type=int,
        default=80,
        help="Specify the port for the server"
    )
    args = parser.parse_args()
    run(addr=args.listen, port=args.port)

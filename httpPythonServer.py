# server.py
import argparse
import http.server # Our http server handler for http requests
import socketserver # Establish the TCP Socket connections
import json
import uuid
import os
from datetime import datetime

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if (self.path == '/'):
            self.path = '/index.html'

        if(os.path.dirname(self.path) == '/backend/unverified'):
            self.send_error(404, 'File Not Found/Allowed')
            return

        permitted_extensions = ['.html','.png','.svg','.jpg', '.js', '.json', '.css', '.ico']
        if not os.path.splitext(self.path)[1] in permitted_extensions:
            self.send_error(404, 'File Not Found/Allowed')
        else:
            http.server.SimpleHTTPRequestHandler.do_GET(self)
        return

    def do_PUT(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        submittedData = json.loads(self.data_string)

        dt = datetime.now()
        ts = datetime.timestamp(dt)
        nowTime = dt.strftime('%Y-%m-%d-%H-%M-%S')

        data = {'IP': self.client_address[0], 'timestamp': str(datetime.fromtimestamp(ts, tz=None)), 'submission': submittedData}
        dataUpURL = "./backend/unverified/" + nowTime + ".json"
        outfile = open(dataUpURL, "w")
        json.dump(data, outfile)
        outfile.close()
        return

Handler = MyHttpRequestHandler

def run(handler_class=Handler, addr="0.0.0.0", port=80):
    with socketserver.TCPServer((addr, port), handler_class) as httpd:
        dt = datetime.now()
        nowTime = dt.strftime('%d/%m/%Y %H:%M:%S')
        print(f"[{nowTime}] - Http Server starting at {addr}:{port}")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        httpd.server_close()

        dt = datetime.now()
        nowTime = dt.strftime('%d/%m/%Y %H:%M:%S')
        print(f"[{nowTime}] - Http Server stopping at {addr}:{port}")


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

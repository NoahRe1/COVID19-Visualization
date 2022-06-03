import Processing
from flask import Flask

app = Flask(__name__)


@app.route('/<param>')
def hello_world(param):
    return Processing.get_json(param=param)


if __name__ == '__main__':
    app.run(host="192.168.3.2",port="5000")

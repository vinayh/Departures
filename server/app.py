from flask import Flask, Response, request, jsonify
from werkzeug.exceptions import abort

from nearest import nearest_departures_json

app = Flask(__name__)


@app.route("/nearest")
def nearest():
    """
    - Check cache - TODO
    - If not in cache, get stops within radius from TfL API - DONE
    - Return next departures from nearest stops - DONE
    - Optional: if user profile exists, filter/sort by preferences - TODO
    """
    lat, lng = request.args.get("lat"), request.args.get("lng")
    stop_types = request.args.get("stopTypes")
    modes = request.args.get("modes")
    if lat is None or lng is None:
        abort(400)
    try:
        lat = float(lat)
        lng = float(lng)
    except (TypeError, ValueError):
        abort(400)

    resp_obj = nearest_departures_json(lat, lng, stop_types, modes)
    resp = jsonify(resp_obj)

    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    
    return resp


if __name__ == "__main__":
    app.run()

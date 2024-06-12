from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/clothes/*": {"origins": "http://localhost:4200"}})

db_file = 'db.json'


def read_db():
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"items": []}


def write_db(data):
    with open(db_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


@app.route('/clothes', methods=['GET'])
def get_clothes():
    page = int(request.args.get('page', 0))
    per_page = int(request.args.get('perPage', 10))

    data = read_db()
    start = page * per_page
    end = start + per_page

    result = data['items'][start:end]

    return jsonify({
        "items": result,
        "total": len(data['items']),
        "page": page,
        "perPage": per_page,
        "totalPages": (len(data['items']) + per_page - 1) // per_page
    })


@app.route('/clothes', methods=['POST'])
def add_cloth():
    new_item = request.json
    data = read_db()

    max_id = max((item['id'] for item in data['items']), default=0)
    new_item['id'] = max_id + 1

    data['items'].append(new_item)
    write_db(data)

    return jsonify(new_item), 201


@app.route('/clothes/<int:id>', methods=['PUT'])
def update_cloth(id):
    updated_item = request.json
    data = read_db()

    for item in data['items']:
        if item['id'] == id:
            item.update(updated_item)
            write_db(data)
            return jsonify(item)

    return "Not Found", 404


@app.route('/clothes/<int:id>', methods=['DELETE'])
def delete_cloth(id):
    data = read_db()

    for i, item in enumerate(data['items']):
        if item['id'] == id:
            del data['items'][i]
            write_db(data)
            return '', 204

    return "Not Found", 404


if __name__ == '__main__':
    app.run(port=3000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def hello():
    return 'Hello, this is the Data Cleaning Tool backend!'

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(message='No file part in the request'), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(message='No selected file'), 400
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        # Here you can add the data cleaning functionality
        return jsonify(message='File successfully uploaded'), 200

if __name__ == '__main__':
    app.run(debug=True)

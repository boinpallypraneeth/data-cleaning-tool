from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        df = pd.read_csv(file)
        return df.to_json(orient='records')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clean', methods=['POST'])
def clean_file():
    data = request.json.get('data')
    options = request.json.get('options')

    try:
        df = pd.DataFrame(data)
        cleaned_df = clean_data(df, options)
        return cleaned_df.to_json(orient='records')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def clean_data(df, options):
    if options.get('removeDuplicates', False):
        df.drop_duplicates(inplace=True)

    if options.get('fillForward', False):
        df.fillna(method='ffill', inplace=True)

    if options.get('fillBackward', False):
        df.fillna(method='bfill', inplace=True)

    if options.get('standardizeDates', False) and 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.strftime('%Y-%m-%d')

    return df

if __name__ == '__main__':
    app.run(debug=True)

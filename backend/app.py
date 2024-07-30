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
        cleaned_df = clean_data(df)
        return cleaned_df.to_json(orient='records')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def clean_data(df):
    # Remove duplicates
    df.drop_duplicates(inplace=True)

    # Replace 'NA' and empty strings with NaN
    df.replace(['NA', ''], pd.NA, inplace=True)

    # Fill forward missing values
    df.fillna(method='ffill', inplace=True)

    # Fill backward remaining missing values if any
    df.fillna(method='bfill', inplace=True)

    # Standardize date format if 'date' column exists
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.strftime('%Y-%m-%d')

    # Ensure all numeric columns are numbers
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = pd.to_numeric(df[col], errors='ignore')

    return df

if __name__ == '__main__':
    app.run(debug=True)

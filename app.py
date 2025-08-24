from flask import Flask, render_template, request, jsonify
import sqlite3
import json
  
app = Flask(__name__, template_folder='templates')

def init_db():
    conn = sqlite3.connect('markers.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS marker
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  description TEXT,
                  category TEXT,
                  lat DECIMAL(8, 6),
                  lng DECIMAL(8, 6))''')
    conn.commit()
    conn.close()

@app.route('/truncate', methods=['POST'])
def truncate():
    conn = sqlite3.connect('markers.db')
    c = conn.cursor()
    c.execute("DROP TABLE marker")
    conn.commit()
    record_id = c.lastrowid
    conn.close()
    init_db()
    return jsonify({'status': 'success', 'id': record_id})

@app.route('/delete_record', methods=['POST'])
def delete_record():
    data = request.json
    conn = sqlite3.connect('markers.db')
    c = conn.cursor()
    c.execute("DELETE FROM marker WHERE id = ?", (data['id'],))
    conn.commit()
    record_id = c.lastrowid
    conn.close()
    return jsonify({'status': 'success', 'id': record_id})

@app.route('/update_coords', methods=['POST'])
def update_coords():
    data = request.json
    conn = sqlite3.connect('markers.db')
    c = conn.cursor()
    c.execute("UPDATE marker SET lat = ?, lng = ? WHERE id = ?", (data['coords'][0], data['coords'][1], data['id']))
    conn.commit()
    record_id = c.lastrowid
    conn.close()
    return jsonify({'status': 'success', 'id': record_id})

@app.route('/add_record', methods=['POST'])
def add_record():
    data = request.json
    conn = sqlite3.connect('markers.db')
    c = conn.cursor()
    c.execute("INSERT INTO marker (name, description, category, lat, lng) VALUES (?, ?, ?, ?, ?)",
              (data['name'], data['desc'], data['category'], data['coords'][0], data['coords'][1]))
    conn.commit()
    record_id = c.lastrowid
    conn.close()
    return jsonify({'status': 'success', 'id': record_id})

@app.route('/get_records', methods=['GET'])
def get_records():
    conn = sqlite3.connect('markers.db')
    c = conn.cursor()
    c.execute("SELECT * FROM marker ORDER BY id")
    records = []
    for row in c.fetchall():
        records.append({
            'id': row[0],
            'name': row[1],
            'desc': row[2],
            'category': row[3],
            'coords': [row[4], row[5]]
        })
    conn.close()
    return jsonify(records)

@app.route("/")  
def web():  
    return render_template('index.html')
  
if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0", port='80')
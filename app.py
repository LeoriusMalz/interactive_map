<<<<<<< HEAD
from flask import Flask, render_template  
  
app = Flask(__name__, template_folder='templates')  
  
@app.route("/")  
def web():  
    return render_template('index.html')  
  
if __name__ == "__main__":  
=======
from flask import Flask, render_template  
  
app = Flask(__name__, template_folder='templates')


  
@app.route("/")  
def web():  
    return render_template('index.html')
  
if __name__ == "__main__":  
>>>>>>> 15e51ec (Added all files)
    app.run(debug=True, host="0.0.0.0", port='80')
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/leasing')
def leasing():
    return render_template('leasing.html')

@app.route('/client_dash')
def client_dash():
    return render_template('client_dash.html')

@app.route('/admin_login')
def admin_login():
    return render_template('admin_login.html')

@app.route('/client_login')
def client_login():
    return render_template('client_login.html')

if __name__ == '__main__':
    app.run(debug=True)
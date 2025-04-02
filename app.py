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

@app.route('/leasing_form')
def leasing_form():
    return render_template('leasing_form.html')

@app.route('/client_dash')
def client_dash():
    return render_template('client_dash.html')

@app.route('/admin_dash')
def admin_dash():
    return render_template('admin_dash.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/admin_login')
def admin_login():
    return render_template('admin_login.html')

@app.route('/client_login')
def client_login():
    return render_template('client_login.html')

if __name__ == '__main__':
    app.run(debug=True)
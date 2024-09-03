from flask import Flask,render_template
app=Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/a')
def a():
    return render_template("a.html")

@app.route('/text')
def text():
    return render_template("text.html")
@app.route('/file')
def file():
    return render_template("file.html")

@app.route('/caeser_cipher')
def caeser_cipher():
    return render_template("caeser_cipher.html")

@app.route('/monoalphabetic_cipher')
def monoalphabetic_cipher():
    return render_template("monoalphabetic_cipher.html")

@app.route('/playfair_cipher')
def playfair_cipher():
    return render_template("playfair_cipher.html")

@app.route('/vigenere_cipher')
def vigenere_cipher():
    return render_template("vigenere_cipher.html")
@app.route('/columnar_transposition_cipher')
def columnar_transposition_cipher():
    return render_template("columnar_transposition_cipher.html")
@app.route('/railfence_cipher')
def railfence_cipher():
    return render_template("railfence_cipher.html")
@app.route('/caeser_file')
def caeser_file():
    return render_template("caeser_file.html")
@app.route('/monoalphabetic_file')
def monoalphabetic_file():
    return render_template("monoalphabetic_file.html")
@app.route('/playfair_file')
def playfair_file():
    return render_template("playfair_file.html")
@app.route('/vigenere_file')
def vigenere_file():
    return render_template("vigenere_file.html")
@app.route('/columnar_transposition_file')
def columnar_transposition_file():
    return render_template("columnar_transposition_file.html")
@app.route('/railfence_file')
def railfence_file():
    return render_template("railfence_file.html")
@app.route('/hill_file')
def hill_file():
    return render_template("hill_file.html")
@app.route('/hill_cipher')
def hill_cipher():
    return render_template("hill_cipher.html")
@app.route('/IDEA_cipher')
def IDEA_cipher():
    return render_template("IDEA_cipher.html")
@app.route('/AES_file')
def AES_file():
    return render_template("AES_file.html")
if __name__=="__main__":
 app.run(debug=True)

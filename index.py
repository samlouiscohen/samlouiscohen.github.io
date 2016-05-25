from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route("/js/<path:path>")
def sendJs(path):
	return send_from_directory('js',path)


#Check this out: http://stackoverflow.com/questions/20646822/how-to-serve-static-files-in-flask
@app.route("/")
def home():
	#Returns the html to user
	return render_template('index.html')



if __name__ == '__main__':
    # app.run(debug=True)
    app.debug = True
    app.run()






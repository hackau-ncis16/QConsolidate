from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from text_detection import detectText
import os
import base64
import json

application = Flask(__name__)
cors = CORS(application, esources={r"/api/*": {"origins": "*"}})
chatbot = ChatBot('NCIS16')

def trainChatbot(inputfile):
    print("training chatbot...")
    trainer = ChatterBotCorpusTrainer(chatbot)
    trainer.train(inputfile)
    print("finished training!")

@application.route("/ask_question", methods = ['POST'])
def answer():
    question = request.get_json(force=True)["data"]
    answer_str = chatbot.get_response(question)

    #question = str(request.data)
    #answer_str = chatbot.get_response(question[9:-1])
    print(question)
    return jsonify(answer_str.text)

@application.route("/highlight", methods = ['POST'])
def highlight():
    input = request.get_json(force=True)
    img_url = input["image"]
    query = "curl " + str(img_url) + " > test.png"
    image = os.system(query)
    coord = input["rectArray"]

    data = detectText('test.png', coord)
    print(json.dumps(data))
    return json.dumps(data)

if __name__ == "__main__":
    #trainChatbot("./english")
    application.run(host="0.0.0.0", port=8080)

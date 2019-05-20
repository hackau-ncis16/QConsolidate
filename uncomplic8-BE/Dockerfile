FROM python:3.6
ADD . /app
WORKDIR /app
RUN pip install flask gunicorn chatterbot
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app"]

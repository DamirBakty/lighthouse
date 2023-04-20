FROM python:3.8

COPY ./backend/api /lighthouse


WORKDIR /lighthouse

RUN pip install -r requirements

EXPOSE 8000

CMD ["gunicorn", "api.wsgi", "-b 0.0.0.0:8000"]

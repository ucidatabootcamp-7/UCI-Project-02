# import dependencies
import pandas as pd
import numpy as np 

# import sqlalchemy dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
from sqlalchemy import func 
from sqlalchemy import inspect

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, Numeric

# PyMySQL 
import pymysql
pymysql.install_as_MySQLdb()

# flask dependencies
from flask import Flask, jsonify, render_template

# database set up
engine = create_engine("sqlite:///static/sql/world_dev.sqlite")
conn = engine.connect()

# refelct an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# assign classes to variables
WorldDev = Base.classes.worldDev

# create a session
# session means that you want to do something to your data
session = Session(engine)

# use inspector to inspect engine
inspector = inspect(engine)

# flask set up
app = Flask(__name__, static_folder="static")

# first route returns to the dashboard home page
@app.route("/")
def home():
    return render_template("index.html")

# second route returns the gini coefficient for each country
@app.route("/gini")
def gini_func():
    results = session.query(WorldDev.CountryName, WorldDev.GiniCoefficient).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)




if __name__ == "__main__":
    app.run(debug=True)

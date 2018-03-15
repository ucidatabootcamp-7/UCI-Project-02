# import dependencies
import pandas as pd
import numpy as np 
import json
import os

# import sqlalchemy dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
from sqlalchemy import func 
from sqlalchemy import inspect
from sqlalchemy import select

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
WorldDev = Base.classes.world_dev

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

# first route returns to the dashboard home page
@app.route("/comparisons")
def comparisonsPage():
    return render_template("comparisons.html")

# route returns the table page
@app.route("/table")
def table():
    return render_template("table.html")


# second route returns a list of IsoCode = Country Code    
@app.route("/iso")
def iso():
    results = session.query(WorldDev.IsoCode).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# third route returns a list of each CountryName 
@app.route("/country")
def countries():
    results = session.query(WorldDev.CountryName).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter metadata for all countries
@app.route('/metadata')
def metadata():
    """Return the MetaData for a given country"""
    sel = [WorldDev.CountryName,
           WorldDev.HDI, WorldDev.LifeExpectancy, 
           WorldDev.GDP_PPP]
    
    # s = select([WorldDev.CountryName, WorldDev.GDP_PPP,WorldDev.HDI, WorldDev.LifeExpectancy])
    # results = conn.execute(s)
    results = session.query(*sel).all()
    result_dict = [u._asdict() for u in results]
    return jsonify(result_dict)

# table metadata
@app.route('/table_data')
def table_data():
    """Return the MetaData for a our dynamic table"""
    sel = sel = [WorldDev.IsoCode, WorldDev.CountryName,
           WorldDev.GiniCoefficient, WorldDev.HomicidePer100k,
           WorldDev.HDI, WorldDev.GDP_Mean,
           WorldDev.LifeExpectancy, WorldDev.services2015,
           WorldDev.industry2015, WorldDev.agriculture2015,
           WorldDev.GDP_PPP, WorldDev.Unemployment2015,
           WorldDev.Unemployment2016, WorldDev.Unemployment2017]
    
    # s = select([WorldDev.CountryName, WorldDev.GDP_PPP,WorldDev.HDI, WorldDev.LifeExpectancy])
    # results = conn.execute(s)
    results = session.query(*sel).all()
    result_dict = [u._asdict() for u in results]
    return jsonify(result_dict)


# Allows us to filter metadata by country
@app.route('/metadata/<country>')
def country_metadata(country):
    """Return the MetaData for a given country"""
    sel = [WorldDev.IsoCode, WorldDev.CountryName,
           WorldDev.GiniCoefficient, WorldDev.HomicidePer100k,
           WorldDev.HDI, WorldDev.GDP_Mean,
           WorldDev.LifeExpectancy, WorldDev.services2015,
           WorldDev.industry2015, WorldDev.agriculture2015,
           WorldDev.GDP_PPP, WorldDev.Unemployment2015,
           WorldDev.Unemployment2016, WorldDev.Unemployment2017]

    results = session.query(*sel).\
        filter(WorldDev.IsoCode == country).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata['IsoCode'] = result[0]
        sample_metadata['CountryName'] = result[1]
        sample_metadata['GiniCoefficient'] = result[2]
        sample_metadata['HomicidePer100k'] = result[3]
        sample_metadata['HDI'] = result[4]
        sample_metadata['GDP_Mean'] = result[5]
        sample_metadata['LifeExpectancy'] = result[6]
        sample_metadata['services2015'] = result[7]
        sample_metadata['industry2015'] = result[8]
        sample_metadata['agriculture2015'] = result[9]
        sample_metadata['GDP_PPP'] = result[10]
        sample_metadata['Unemployment2015'] = result[11]
        sample_metadata['Unemployment2016'] = result[12]
        sample_metadata['Unemployment2017'] = result[13]

        return jsonify(sample_metadata)

# fourth route returns the gini coefficient for each country
@app.route("/gini")
def gini_func():
    results = session.query(WorldDev.GiniCoefficient).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)


# new route returns iso & gini
@app.route("/iso_gini")
def iso_gini_func():
    """Return the MetaData for a given country"""
    sel = [WorldDev.IsoCode, WorldDev.GiniCoefficient]
    
    # s = select([WorldDev.CountryName, WorldDev.GDP_PPP,WorldDev.HDI, WorldDev.LifeExpectancy])
    # results = conn.execute(s)
    results = session.query(*sel).all()
    result_dict = [u._asdict() for u in results]
    return jsonify(result_dict)


# Allows us to filter gini by country
@app.route('/gini/<country>')
def gini_country(country):
    """Return gini coefficient by country"""
    results = session.query(WorldDev.GiniCoefficient).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])


# fifth route returns the intentional homicides per 100k people for each country
@app.route("/homicides_per_100k")
def homicides():
    results = session.query(WorldDev.HomicidePer100k).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter homicide by country
@app.route('/homicides/<country>')
def homicides_country(country):
    """Return homicides_per_100k by country"""
    results = session.query(WorldDev.HomicidePer100k).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# fourth route returns the Human Development Index for each country
@app.route("/hdi")
def hdi():
    results = session.query(WorldDev.HDI).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)


# Allows us to filter hdi by country
@app.route('/hdi/<country>')
def hdi_country(country):
    """Return hdi by country"""
    results = session.query(WorldDev.HDI).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# fifth route returns the 5 year mean for GDP of each country
@app.route("/gdp_mean")
def gdp_mean():
    results = session.query(WorldDev.GDP_Mean).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# gdp_mean search route
@app.route('/gdp_mean/<country>')
def gdp_mean_country(country):
    """Return gdp_mean by country"""
    results = session.query(WorldDev.GDP_Mean).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# sixth route returns the life expectancy for each country
@app.route("/life_expectancy")
def life_expectancy():
    results = session.query(WorldDev.LifeExpectancy).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter life_expectancy by country
@app.route('/life_expectancy/<country>')
def life_expectancy_country(country):
    """Return life_expectancy by country"""
    results = session.query(WorldDev.LifeExpectancy).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# seventh route returns the GDP for services in each country
@app.route("/gdp_services")
def gdp_services():
    results = session.query(WorldDev.services2015).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_services by country
@app.route('/gdp_services/<country>')
def gdp_services_country(country):
    """Return gdp_services by country"""
    results = session.query(WorldDev.services2015).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# eighth route returns the GDP for industry in each country
@app.route("/gdp_industry")
def gdp_industry():
    results = session.query(WorldDev.industry2015).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_industry by country
@app.route('/gdp_industry/<country>')
def gdp_industry_country(country):
    """Return gdp_industry by country"""
    results = session.query(WorldDev.industry2015).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])


# ninth route returns the GDP for services in each country
@app.route("/gdp_agriculture")
def gdp_agriculture():
    results = session.query(WorldDev.agriculture2015).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_agriculture by country
@app.route('/gdp_agriculture/<country>')
def gdp_agriculture_country(country):
    """Return gdp_agriculture by country"""
    results = session.query(WorldDev.agriculture2015).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# tenth route returns the GDP PPP in each country
@app.route("/gdp_ppp")
def gdp_ppp():
    results = session.query(WorldDev.GDP_PPP).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_ppp by country
@app.route('/gdp_ppp/<country>')
def gdp_ppp_country(country):
    """Return gdp_ppp by country"""
    results = session.query(WorldDev.GDP_PPP).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# tenth route returns the GDP PPP in each country
@app.route("/unemployment2015")
def unemployment2015():
    results = session.query(WorldDev.Unemployment2015).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_ppp by country
@app.route('/unemployment2015/<country>')
def unemployment2015_country(country):
    """Return gdp_ppp by country"""
    results = session.query(WorldDev.Unemployment2015).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# tenth route returns the GDP PPP in each country
@app.route("/unemployment2016")
def unemployment2016():
    results = session.query(WorldDev.Unemployment2016).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_ppp by country
@app.route('/unemployment2016/<country>')
def unemployment2016_country(country):
    """Return gdp_ppp by country"""
    results = session.query(WorldDev.Unemployment2016).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# tenth route returns the GDP PPP in each country
@app.route("/unemployment2017")
def unemployment2017():
    results = session.query(WorldDev.Unemployment2017).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# Allows us to filter gdp_ppp by country
@app.route('/unemployment2017/<country>')
def unemployment2017_country(country):
    """Return gdp_ppp by country"""
    results = session.query(WorldDev.Unemployment2017).\
        filter(WorldDev.CountryName == country).all()
    results_list = np.ravel(results)
    return jsonify(results_list[0])

# d3scatterplot route returns the data needed for scatter plot
@app.route("/d3scatterplotdata")
def d3_scatter():
    results = session.query(WorldDev.CountryName, WorldDev.GDP_PPP, WorldDev.HDI, WorldDev.LifeExpectancy).all()
    results_list = list(np.ravel(results))
    return jsonify(results_list)

# borders route returns data needed for leaflet map
with open('static/sql/borders.json') as json_data:
    borders = json.load(json_data)
    
@app.route("/borders")
def borders_func():
    return jsonify(borders)


if __name__ == "__main__":
    app.run(debug=True)
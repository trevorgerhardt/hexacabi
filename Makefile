
all: csv stations

clean: rm -rf data/*

csv:
	@wget http://www.capitalbikeshare.com/assets/files/trip-history-data/2014-1st-quarter.zip --output-document=data/2014-1st-quarter.zip
	@unzip data/2014-1st-quarter.zip
	@mv 2014-1st-quarter.csv data/
	@./process-csv.js data/2014-1st-quarter.csv data/2014-1st-quarter.processed.csv

stations:
	@wget http://www.capitalbikeshare.com/data/stations/bikeStations.xml --output-document=data/bikeStations.xml
	@./stations-to-json.js data/bikeStations.xml data/stations.json

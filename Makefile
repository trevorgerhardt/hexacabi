
csv:
	@wget http://www.capitalbikeshare.com/assets/files/trip-history-data/2014-1st-quarter.zip --output-document=data/2014-1st-quarter.zip

stations:
	@wget http://www.capitalbikeshare.com/data/stations/bikeStations.xml --output-document=data/bikeStations.xml

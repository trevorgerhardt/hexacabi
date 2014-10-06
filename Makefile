
download:
	@wget http://www.capitalbikeshare.com/assets/files/trip-history-data/2014-1st-quarter.zip --output-document=data/2014Q1.zip
	@wget http://www.capitalbikeshare.com/assets/files/trip-history-data/2014-Q2-Trips-History-Data.zip --output-document=data/2014Q2.zip
	@wget https://raw.githubusercontent.com/tmcw/capital-bikeshare-stations/master/stations.geojson --output-document=www/data/stations.geojson

process:
	@find data -name '*.csv' -exec ./bin/process-csv {} www/data/processed.csv \;

push:
	@aws s3 sync www s3://hexacabi --acl public-read

QUARTERS = 2013-4th-quarter 2014-1st-quarter 2014-2nd-quarter 2014-3rd-quarter
URL := http://www.capitalbikeshare.com/assets/files/trip-history-data

CSV := $(shell echo $(shell find data -name '*.csv' -print))
ZIP := $(foreach quarter, $(QUARTERS), data/$(quarter).zip)

download: install $(ZIP) www/data/stations.geojson

www/data/processed.csv:
	@bin/process-csv data/2013-4th-quarter.csv $@
	@bin/process-csv data/2014-1st-quarter.csv $@
	@bin/process-csv data/2014-Q2-Trips-History-Data.csv $@
	@bin/process-csv data/2014-Q3-Trips-History-Data.csv $@

data/%.zip:
	@wget $(URL)/$(basename $(notdir $@)).zip --output-document=data/$(basename $(notdir $@)).zip
	@unzip data/$(basename $(notdir $@)).zip -d data

data/%.csv:
	@bin/process-csv $@ www/data/processed.csv

www/data/stations.geojson:
	@wget https://raw.githubusercontent.com/trevorgerhardt/capital-bikeshare-stations/master/stations.geojson --output-document=$@

install:
	@mkdir -p data www/data

push:
	@aws s3 sync . s3://hexacabi \
		--acl public-read \
		--exclude .git

.PHONY: build install push
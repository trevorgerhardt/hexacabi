
QUARTERS = 2014-1st-quarter 2014-2nd-quarter 2014-3rd-quarter
URL = http://www.capitalbikeshare.com/assets/files/trip-history-data

CSV = $(foreach quarter, $(QUARTERS), data/$(quarter).csv)
ZIP = $(foreach quarter, $(QUARTERS), data/$(quarter).zip)

default: install www/data/processed.csv www/data/stations.geojson

data/%.csv: $(ZIP)
	@unzip data/$(basename $(notdir $@)).zip -d data

data/%.zip:
	@wget $(URL)/$(basename $(notdir $@)).zip --output-document=data/$(basename $(notdir $@)).zip

www/data/processed.csv: $(CSV)
	@$(foreach csv, $(CSV), ./bin/process-csv $(csv) $@)
	@wc -l $@

www/data/stations.geojson:
	@wget https://raw.githubusercontent.com/trevorgerhardt/capital-bikeshare-stations/master/stations.geojson --output-document=$@

install:
	@mkdir -p data www/data

push:
	@aws s3 sync www s3://hexacabi --acl public-read

.PHONY: install push
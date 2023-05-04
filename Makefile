
.DEFAULT_GOAL := build

docs/primap-hist/index.html: primap-hist/template.jinja2.html primap-hist/scripts/render-template.py
	./venv/bin/python primap-hist/scripts/render-template.py

.PHONY: csvs
csvs: download
	./venv/bin/python primap-hist/scripts/prepare-data.py

.PHONY: download
download primap-hist/Guetschow-et-al-2023a-PRIMAP-hist_v2.4.2_final_09-Mar-2023.csv primap-csvs:
	wget --no-clobber --directory-prefix primap-hist https://zenodo.org/record/7727475/files/Guetschow-et-al-2023a-PRIMAP-hist_v2.4.2_final_09-Mar-2023.csv

.PHONY: build
build: download csvs docs/primap-hist/index.html

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv

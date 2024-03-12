
.DEFAULT_GOAL := build

docs/primap-hist/index.html: primap-hist/template.jinja2.html primap-hist/scripts/render-template.py
	./venv/bin/python primap-hist/scripts/render-template.py

.PHONY: csvs
csvs: download
	./venv/bin/python primap-hist/scripts/prepare-data.py

.PHONY: download
download primap-hist/Guetschow_et_al_2023b-PRIMAP-hist_v2.5_final_15-Oct-2023.csv \
 primap-csvs:
	wget --no-clobber --directory-prefix primap-hist https://zenodo\
	.org/record/10006301/files/Guetschow_et_al_2023b-PRIMAP-hist_v2.5_final_15-Oct-2023.csv

.PHONY: build
build: venv download csvs docs/primap-hist/index.html

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv

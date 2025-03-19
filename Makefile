
.DEFAULT_GOAL := build

docs/primap-hist/index.html: primap-hist/template.jinja2.html primap-hist/scripts/render-template.py
	./venv/bin/python primap-hist/scripts/render-template.py

.PHONY: csvs
csvs: download
	./venv/bin/python primap-hist/scripts/prepare-data.py

.PHONY: download
download primap-hist/Guetschow_et_al_2025-PRIMAP-hist_v2.6.1_final_13-Mar-2025.csv \
 primap-csvs:
	wget --no-clobber --directory-prefix primap-hist https://zenodo\
	.org/record/15016289/files/Guetschow_et_al_2025-PRIMAP-hist_v2.6.1_final_13-Mar-2025.csv

.PHONY: build
build: venv download csvs docs/primap-hist/index.html

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv

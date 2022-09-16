public/primap-hist/index.html: primap-hist/template.jinja2.html primap-hist/scripts/render-template.py
	./venv/bin/python primap-hist/scripts/render-template.py

.PHONY: csvs
csvs:
	./venv/bin/python primap-hist/scripts/prepare-data.py

primap-hist/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_20-Sep_2021.csv:
	wget --no-clobber --directory-prefix primap-hist https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_20-Sep_2021.csv

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv


docs/primap-hist/index.html: primap-hist/template.jinja2.html primap-hist/scripts/render-template.py
	./venv/bin/python primap-hist/scripts/render-template.py

.PHONY: csvs
csvs:
	./venv/bin/python primap-hist/scripts/prepare-data.py

primap-hist/Guetschow-et-al-2022-PRIMAP-hist_v2.4_11-Oct-2022.csv:
	wget --no-clobber --directory-prefix primap-hist https://zenodo.org/record/7179775/files/Guetschow-et-al-2022-PRIMAP-hist_v2.4_11-Oct-2022.csv

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv


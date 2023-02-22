docs/primap-hist/index.html: primap-hist/template.jinja2.html primap-hist/scripts/render-template.py
	./venv/bin/python primap-hist/scripts/render-template.py

.PHONY: csvs
csvs:
	./venv/bin/python primap-hist/scripts/prepare-data.py

primap-hist/Guetschow-et-al-2023-PRIMAP-hist_v2.4.1_final_16-Feb-2023.csv:
	wget --no-clobber --directory-prefix primap-hist https://zenodo.org/record/7585420/files/Guetschow-et-al-2023-PRIMAP-hist_v2.4.1_final_16-Feb-2023.csv

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv


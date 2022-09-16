import json
from pathlib import Path

import jinja2
import pandas as pd
import requests

# Identifier of latest Zenodo release
identifier = "5494497"

root = Path(__file__).parents[1]

primaphist = pd.read_csv(
    root / "Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_20-Sep_2021.csv"
)

templateLoader = jinja2.FileSystemLoader(searchpath=root)
templateEnv = jinja2.Environment(loader=templateLoader)
template = templateEnv.get_template("template.jinja2.html")

r = requests.get(f"https://zenodo.org/api/records/{identifier}")

data = r.json()

countries = json.load(open(root / "countries.json", "r"))
entities = json.load(open(root / "entities.json", "r"))

outputText = template.render(
    last_year=primaphist.columns[-1],
    data=data,
    countries=countries,
    entities=[e.replace(" ", "_") for e in entities],
)

with open(root / "../public/primap-hist/index.html", "w") as f:
    f.write(outputText)

print(
    "Rendered `public/primap-hist/index.html` from `primap-hist/template.jinja2.html`."
)

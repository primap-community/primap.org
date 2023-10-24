import json
import shutil
from pathlib import Path

import pandas as pd
from constants import FILE_NAME

root = Path(__file__).parents[2]

shutil.rmtree(root / "docs/primap-hist/data")

data_dir = root / "docs/primap-hist/data"

data_dir.mkdir()

for scen in ["HISTCR", "HISTTP"]:

    data = pd.read_csv(
        root / "primap-hist" / FILE_NAME
    )
    data = data[data["scenario (PRIMAP-hist)"] == scen]

    # Check unit before dropping
    assert data.loc[data.entity == "CH4"].unit.unique()[0] == "CH4 * gigagram / a"

    data = data.drop(["source", "scenario (PRIMAP-hist)", "unit", "provenance"], axis=1)
    data = data.set_index(["area (ISO3)", "category (IPCC2006_PRIMAP)", "entity"])
    data.columns = [int(c) for c in data.columns]
    print(data)
    # To Mt
    data = data / 1000

    categories = ["1", "2", "M.AG", "4", "5"]
    entities = data.index.get_level_values("entity").unique()
    countries = data.index.get_level_values("area (ISO3)").unique()

    data = data.swaplevel("entity", "category (IPCC2006_PRIMAP)")
    for country in countries:
        for entity in entities:
            try:
                out = data.loc[country, entity]
                out = out[out.index.isin(categories)]
                # Adjust column names to one used in original visualisation code
                out.index = [("IPC" + i).replace(".", "") for i in out.index]
                out.T.to_csv(
                    data_dir
                    / "{}_{}_{}_Mt.csv".format(scen, country, entity.replace(" ", "_")),
                    index_label="year",
                )
            except KeyError as e:
                print(country, "::", entity, e)

json.dump(list(countries), open(root / "primap-hist/countries.json", "w"))
json.dump(list(entities), open(root / "primap-hist/entities.json", "w"))

print(80 * "=")
print(f"Processed {len(countries)} countries/groups.")
print("Entities:", entities.values)
print("Last year:", data.columns[-1])

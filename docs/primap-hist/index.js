import {
  names,
  to_name,
} from "https://cdn.jsdelivr.net/npm/shortcountrynames@0.10.0/index.js";

names["EARTH"] = "Global Emissions (All Parties)";
names["ANNEXI"] = "Annex-I Parties";
names["NONANNEXI"] = "Non-Annex-I Parties";
names["UMBRELLA"] = "Umbrella-Group";
names["LDC"] = "Least Developed Countries";

names["ANT"] = "Former Netherlands Antilles";

// Loaded from template in pre-processing: lastYear, countries, entities

const duration = 400;

const formatYear = d3.format("i");
const formatPercent = d3.format(".1%");
const formatValue = d3.format(".2f");
const format1f = d3.format(".1f");

const format = function (value) {
  if (Math.abs(value) < 0.001 && value > 0) {
    const inKiloTonnes = value * 1000 * 1000;
    return format1f(inKiloTonnes) + " t";
  } else if (Math.abs(value) < 0.01 && value > 0) {
    const inKiloTonnes = value * 1000;
    return formatValue(inKiloTonnes) + " kt";
  } else if (Math.abs(value) > 1000 && value > 0) {
    const inMt = value / 1000;
    return formatValue(inMt) + " Gt";
  } else if (value == 0) {
    return "-";
  } else {
    return formatValue(value) + " Mt";
  }
};

const formatYTonnes = function (value) {
  const inTonnes = value * 1000 * 1000;
  return format1f(inTonnes);
};
const formatYKiloTonnes = function (value) {
  const inKiloTonnes = value * 1000;
  return format1f(inKiloTonnes);
};
const formatYGt = function (value) {
  const inGt = value / 1000;
  return format1f(inGt);
};
const formatYMt = function (value) {
  return formatValue(value);
};

const palette = [
  "#66C2A5",
  "#FC8D62",
  "#8DA0CB",
  "#E78AC3",
  "#A6D854",
  "#FFD92F",
  "#E5C494",
];

const colors = {
  IPC1: palette[6],
  IPC2: palette[1],
  IPCMAG: palette[2],
  IPC4: palette[0],
  IPC5: palette[4],
};

const colorsSorted = ["IPC1", "IPC2", "IPCMAG", "IPC4", "IPC5"];

colorsSorted.forEach(function (col) {
  d3.select("tr#" + col.toLowerCase()).style("background-color", colors[col]);
});

const setHash = function (scenario, countryId, entity) {
  document.location.hash =
    "scenario=" +
    scenario.toLowerCase() +
    "&id=" +
    countryId.toLowerCase() +
    "&entity=" +
    entity.toLowerCase();
};

const countryData = countries.map(function (id) {
  return { id: id, text: to_name(id) || id };
});

const entityNames = {
  CH4: "Methane (CH₄)",
  CO2: "Carbon Dioxide (CO₂)",
  "FGASES_(AR6GWP100)": "F-Gases (AR6)",
  "FGASES_(AR5GWP100)": "F-Gases (AR5)",
  "FGASES_(AR4GWP100)": "F-Gases (AR4)",
  "FGASES_(SARGWP100)": "F-Gases (SAR)",
  "HFCS_(AR6GWP100)": "Hydrofluorocarbons (AR6)",
  "HFCS_(AR5GWP100)": "Hydrofluorocarbons (AR5)",
  "HFCS_(AR4GWP100)": "Hydrofluorocarbons (AR4)",
  "HFCS_(SARGWP100)": "Hydrofluorocarbons (SAR)",
  "KYOTOGHG_(AR6GWP100)": "Kyoto Greenhouse Gases (AR6)",
  "KYOTOGHG_(AR5GWP100)": "Kyoto Greenhouse Gases (AR5)",
  "KYOTOGHG_(AR4GWP100)": "Kyoto Greenhouse Gases (AR4)",
  "KYOTOGHG_(SARGWP100)": "Kyoto Greenhouse Gases (SAR)",
  N2O: "Nitrous Oxide (N₂O)",
  "PFCS_(AR6GWP100)": "Perflurocarbons (AR6)",
  "PFCS_(AR5GWP100)": "Perflurocarbons (AR5)",
  "PFCS_(AR4GWP100)": "Perflurocarbons (AR4)",
  "PFCS_(SARGWP100)": "Perflurocarbons (SAR)",
  SF6: "Sulfur Hexafluoride",
};
const entityData = entities.map(function (id) {
  return { id: id, text: entityNames[id] || id };
});

const switchTotalsPercentages = function () {
  const percentagesShown = d3
    .select('input[id="show-percentage"]')
    .property("checked");
  d3.selectAll("td.legend-percent").classed("hidden", !percentagesShown);
  d3.selectAll("td.legend-values").classed("hidden", percentagesShown);
};
d3.selectAll('input[name="totals-or-percentage"]').on("change", function () {
  switchTotalsPercentages();
});

d3.selectAll("table tr.ipc").on("click", function () {
  const cat = d3.event.currentTarget.id;
  if (cat.length > 0) {
    if (d3.event.target.type !== "checkbox") {
      const input = d3.select("table tr#" + cat + " input");
      const status = input.property("checked");
      input.property("checked", !status);
    }
    if (d3.event.shiftKey) {
      if (d3.selectAll("table input:checked")[0].length === 0) {
        d3.selectAll("table input").property("checked", true);
        d3.select("table input#show-" + cat).property("checked", false);
      } else {
        d3.selectAll("table input").property("checked", false);
        d3.select("table input#show-" + cat).property("checked", true);
      }
    }
  }
  d3.selectAll("tr.ipc")[0].forEach(function (row) {
    const sel = d3.select(row);
    const checked = sel.select("input").property("checked");
    if (checked) {
      sel.style("opacity", 1);
    } else {
      sel.style("opacity", 0.75);
    }
  });
  const scenario = d3.select("#scenarios").property("value");
  const entity = d3.select("#entities").property("value");
  const country = d3.select("#countries").property("value");
  showData(scenario, country, entity);
});

// Slope graph
const slopeHeight = 20;
const slopeWidth = 30;

const slopeXScale = d3.scale
  .linear()
  .range([0, slopeWidth])
  .domain([1850, lastYear]);

const slopeYScale = d3.scale.linear().range([slopeHeight, 0]);

const slopeLine = d3.svg.line().x(function (d) {
  return slopeXScale(d.year);
});

const margin = { top: 20, right: 80, bottom: 30, left: 80 };

const width =
  parseInt(d3.select("#chart").style("width")) - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const padding = 10;

const xScale = d3.scale
  .linear()
  .range([padding, width])
  .domain([1850, lastYear])
  .clamp(true);

const yScale = d3.scale
  .linear()
  .range([height - padding, padding])
  .clamp(false);

const xAxis = d3.svg
  .axis()
  .scale(xScale)
  .orient("bottom")
  .tickFormat(formatYear);

const yAxis = d3.svg.axis().scale(yScale).orient("left");

const cat1 = d3.svg
  .area()
  .x(function (d) {
    return xScale(d.year);
  })
  .y0(function (d) {
    return yScale(0);
  })
  .y1(function (d) {
    return yScale(d.IPC1);
  });

const cat2 = d3.svg
  .area()
  .x(function (d) {
    return xScale(d.year);
  })
  .y0(function (d) {
    return yScale(d.IPC1);
  })
  .y1(function (d) {
    return yScale(d.IPC1 + d.IPC2);
  });

const cat3 = d3.svg
  .area()
  .x(function (d) {
    return xScale(d.year);
  })
  .y0(function (d) {
    return yScale(d.IPC1 + d.IPC2);
  })
  .y1(function (d) {
    return yScale(d.IPC1 + d.IPC2 + d.IPCMAG);
  });

const cat4 = d3.svg
  .area()
  .x(function (d) {
    return xScale(d.year);
  })
  .y0(function (d) {
    return yScale(d.IPC1 + d.IPC2 + d.IPCMAG);
  })
  .y1(function (d) {
    return yScale(d.IPC1 + d.IPC2 + d.IPCMAG + d.IPC4);
  });

const cat5 = d3.svg
  .area()
  .x(function (d) {
    return xScale(d.year);
  })
  .y0(function (d) {
    return yScale(d.IPC1 + d.IPC2 + d.IPCMAG + d.IPC4);
  })
  .y1(function (d) {
    return yScale(d.IPC1 + d.IPC2 + d.IPCMAG + d.IPC4 + d.IPC5);
  });

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.select(".x.axis").call(xAxis);

const pathWrapper = svg.append("g");

const pathCat1 = pathWrapper
  .append("path")
  .attr("class", "ipc1")
  .style("stroke", "grey")
  .style("fill", colors["IPC1"]);

const pathCat2 = pathWrapper
  .append("path")
  .attr("class", "ipc2")
  .style("stroke", "grey")
  .style("fill", colors["IPC2"]);

const pathCat3 = pathWrapper
  .append("path")
  .attr("class", "ipcmag")
  .style("stroke", "grey")
  .style("fill", colors["IPCMAG"]);

const pathCat4 = pathWrapper
  .append("path")
  .attr("class", "ipc4")
  .style("stroke", "grey")
  .style("fill", colors["IPC4"]);

const pathCat5 = pathWrapper
  .append("path")
  .attr("class", "ipc5")
  .style("stroke", "grey")
  .style("fill", colors["IPC5"]);

const errorMessage = pathWrapper
  .append("text")
  .attr("x", 0 + width / 2.5)
  .attr("y", 0 + height / 2)
  .attr("class", "hidden error-text");

const zeroLine = svg
  .append("line")
  .attr("x1", xScale(1850))
  .attr("x2", xScale(lastYear))
  .attr("stroke", "black")
  .attr("stroke-width", "1")
  .attr("visibility", "hidden");

const line = svg
  .append("line")
  .attr("y1", yScale.range()[0])
  .attr("y2", yScale.range()[1])
  .attr("stroke", "gray")
  .attr("stroke-width", "1");

const lineText = svg.append("text").attr("dx", ".5em").attr("dy", "-.5em");

const showDataInTable = function (year) {
  d3.select("th#year").text(year);
  const pos = year - 1750;
  let total = 0;
  colorsSorted.map(function (cat) {
    total += currentData[pos]["ORIG" + cat];
  });

  d3.select("#ipc0 td.legend-values").text(format(total));
  d3.select("#ipc0 td.legend-percent").text(formatPercent(total / total));

  d3.select("#ipc1 td.legend-values").text(
    format(currentData[pos]["ORIGIPC1"])
  );
  d3.select("#ipc1 td.legend-percent").text(
    formatPercent(currentData[pos]["ORIGIPC1"] / total)
  );

  d3.select("#ipc2 td.legend-values").text(
    format(currentData[pos]["ORIGIPC2"])
  );
  d3.select("#ipc2 td.legend-percent").text(
    formatPercent(currentData[pos]["ORIGIPC2"] / total)
  );

  d3.select("#ipcmag td.legend-values").text(
    format(currentData[pos]["ORIGIPCMAG"])
  );
  d3.select("#ipcmag td.legend-percent").text(
    formatPercent(currentData[pos]["ORIGIPCMAG"] / total)
  );

  d3.select("#ipc4 td.legend-values").text(
    format(currentData[pos]["ORIGIPC4"])
  );
  d3.select("#ipc4 td.legend-percent").text(
    formatPercent(currentData[pos]["ORIGIPC4"] / total)
  );

  d3.select("#ipc5 td.legend-values").text(
    format(currentData[pos]["ORIGIPC5"])
  );
  d3.select("#ipc5 td.legend-percent").text(
    formatPercent(currentData[pos]["ORIGIPC5"] / total)
  );

  d3.select("#total td.legend-values").text(format(total));
  d3.select("#total td.legend-percent").text(formatPercent(total / total));
};

const mousemove = function () {
  const year = Math.floor(xScale.invert(d3.mouse(this)[0]));
  line.attr("x1", xScale(year));
  line.attr("x2", xScale(year));
  lineText.attr("x", xScale(year)).attr("y", d3.mouse(this)[1]).text(year);

  showDataInTable(year);
};

svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mousemove", mousemove)
  .on("mouseenter", function () {
    line.classed("hidden", false);
  })
  .on("mouseleave", function () {
    d3.select("path.negcat5").transition().duration(100).style("opacity", 0.4);
    lineText.text("");
    line.classed("hidden", true);
    d3.select("th#year").text("");
    d3.selectAll("td.legend-percent").text("");
    d3.selectAll("td.legend-values").text("");
    showDataInTable(lastYear);
  });

let currentData;

const showData = function (scenario, countryId, entity) {
  const path = "data/" + scenario + "_" + countryId + "_" + entity + "_Mt.csv";

  d3.select("#scenarioName").text(scenario);
  d3.select("#countryName").text(to_name(countryId) || countryId);
  d3.select("#entityName").text(entityNames[entity]);

  selectScenario.val(scenario).trigger("change.select2");
  selectCountry.val(countryId).trigger("change.select2");
  selectEntity.val(entity).trigger("change.select2");

  d3.select("a#download").text(path.replace("data/", "")).attr("href", path);

  const showIPC1 = d3.select("input#show-ipc1").property("checked");
  const showIPC2 = d3.select("input#show-ipc2").property("checked");
  const showIPCMAG = d3.select("input#show-ipcmag").property("checked");
  const showIPC4 = d3.select("input#show-ipc4").property("checked");
  const showIPC5 = d3.select("input#show-ipc5").property("checked");

  d3.csv(path, function (error, data) {
    if (error) {
      console.warn(error);
      pathWrapper.selectAll("path").classed("hidden", true);
      const name = to_name(countryId);
      errorMessage
        .classed("hidden", false)
        .text("Could not load " + entity + " for " + name);
      return;
    }
    currentData = data;

    errorMessage.classed("hidden", true).text("");
    pathWrapper.selectAll("path").classed("hidden", false);

    const categories = ["IPC1", "IPC2", "IPCMAG", "IPC4", "IPC5"];

    let min = 0;
    let max = 0;
    let minIPC1 = 0;
    let maxIPC1 = 0;
    let minIPC2 = 0;
    let maxIPC2 = 0;
    let minIPCMAG = 0;
    let maxIPCMAG = 0;
    let minIPC4 = 0;
    let maxIPC4 = 0;

    let maxORIGIPC5 = 0;

    let minIPC5 = 0;
    let maxIPC5 = 0;
    data.forEach(function (item) {
      item.year = parseInt(item.year);

      categories.forEach(function (cat) {
        if (cat in item) {
          item[cat] = parseFloat(item[cat]);
          if (isNaN(item[cat])) {
            // Avoid jumps due to NaN values.
            item[cat] = 0;
          }
        } else {
          // To avoid fade-in effects set missing categories to zero.
          item[cat] = 0;
        }
      });
      item.ORIGIPC1 = item.IPC1;
      item.ORIGIPC2 = item.IPC2;
      item.ORIGIPCMAG = item.IPCMAG;
      item.ORIGIPC4 = item.IPC4;
      item.ORIGIPC5 = item.IPC5;
      if (!showIPC1) {
        item.IPC1 = 0;
      }
      if (!showIPC2) {
        item.IPC2 = 0;
      }
      if (!showIPCMAG) {
        item.IPCMAG = 0;
      }
      if (!showIPC4) {
        item.IPC4 = 0;
      }
      if (!showIPC5) {
        item.IPC5 = 0;
      }

      const keepScaleFixed = d3.select("#fixed-scale").property("checked");
      let prefix = "";
      if (keepScaleFixed) {
        prefix = "ORIG";
      }
      max = d3.max([
        max,
        d3.sum(
          categories.map(function (cat) {
            return item[prefix + cat];
          })
        ),
      ]);
      min = d3.min([
        min,
        d3.sum(
          categories.map(function (cat) {
            return item[prefix + cat];
          })
        ),
      ]);

      minIPC5 = d3.min([minIPC5, item.ORIGIPC5]);
      maxIPC5 = d3.max([maxIPC5, item.IPC5]);
      maxORIGIPC5 = d3.max([maxORIGIPC5, item.ORIGIPC5]);

      maxIPC1 = d3.max([maxIPC1, item.ORIGIPC1]);
      minIPC1 = d3.min([minIPC1, item.ORIGIPC1]);
      maxIPC2 = d3.max([maxIPC2, item.ORIGIPC2]);
      minIPC2 = d3.min([minIPC2, item.ORIGIPC2]);
      maxIPCMAG = d3.max([maxIPCMAG, item.ORIGIPCMAG]);
      minIPCMAG = d3.min([minIPCMAG, item.ORIGIPCMAG]);
      maxIPC4 = d3.max([maxIPC4, item.ORIGIPC4]);
      minIPC4 = d3.min([minIPC4, item.ORIGIPC4]);
    });

    slopeYScale.domain([minIPC1, maxIPC1]);
    slopeLine.y(function (d) {
      return slopeYScale(d.ORIGIPC1);
    });
    d3.select("tr#ipc1 svg path")
      .datum(data)
      .attr("d", function (d) {
        return slopeLine(d);
      });

    slopeYScale.domain([minIPC2, maxIPC2]);
    slopeLine.y(function (d) {
      return slopeYScale(d.ORIGIPC2);
    });
    d3.select("tr#ipc2 svg path")
      .datum(data)
      .attr("d", function (d) {
        return slopeLine(d);
      });

    slopeYScale.domain([minIPCMAG, maxIPCMAG]);
    slopeLine.y(function (d) {
      return slopeYScale(d.ORIGIPCMAG);
    });
    d3.select("tr#ipcmag svg path")
      .datum(data)
      .attr("d", function (d) {
        return slopeLine(d);
      });

    slopeYScale.domain([minIPC4, maxIPC4]);
    slopeLine.y(function (d) {
      return slopeYScale(d.ORIGIPC4);
    });
    d3.select("tr#ipc4 svg path")
      .datum(data)
      .attr("d", function (d) {
        return slopeLine(d);
      });

    slopeYScale.domain([minIPC5, maxORIGIPC5]);
    slopeLine.y(function (d) {
      return slopeYScale(d.ORIGIPC5);
    });
    d3.select("tr#ipc5 svg path")
      .datum(data)
      .attr("d", function (d) {
        return slopeLine(d);
      });

    yScale.domain([0, max]);

    let yLabel = "";
    if (Math.abs(max) < 0.001 && max > 0) {
      yAxis.tickFormat(formatYTonnes);
      yLabel = "Emissions [t CO₂eq]";
      if (["CO2", "N2O", "CH4", "SF6"].indexOf(entity) >= 0) {
        yLabel = "Emissions [t]";
      }
      svg.select(".label-emissions").text(yLabel);
    } else if (Math.abs(max) < 0.01 && max > 0) {
      yAxis.tickFormat(formatYKiloTonnes);
      yLabel = "Emissions [kt CO₂eq]";
      if (["CO2", "N2O", "CH4", "SF6"].indexOf(entity) >= 0) {
        yLabel = "Emissions [kt]";
      }
      svg.select(".label-emissions").text(yLabel);
    } else if (Math.abs(max) > 1000 && max > 0) {
      yAxis.tickFormat(formatYGt);
      yLabel = "Emissions [Gt CO₂eq]";
      if (["CO2", "N2O", "CH4", "SF6"].indexOf(entity) >= 0) {
        yLabel = "Emissions [Gt]";
      }
      svg.select(".label-emissions").text(yLabel);
    } else {
      yAxis.tickFormat(formatYMt);
      yLabel = "Emissions [Mt CO₂eq]";
      if (["CO2", "N2O", "CH4", "SF6"].indexOf(entity) >= 0) {
        yLabel = "Emissions [Mt]";
      }
      svg.select(".label-emissions").text(yLabel);
    }

    svg.select(".y.axis").call(yAxis);

    pathCat5
      .datum(data)
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return cat5(d);
      });

    pathCat1
      .datum(data)
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return cat1(d);
      });

    pathCat2
      .datum(data)
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return cat2(d);
      });

    pathCat3
      .datum(data)
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return cat3(d);
      });

    pathCat4
      .datum(data)
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return cat4(d);
      });

    showDataInTable(lastYear);
  });
};

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis);

svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .attr("class", "label-emissions")
  .style("text-anchor", "middle");

const hash = document.location.hash.substr(1);
const values = hash.split("&").map(function (item) {
  if (!item) {
    return false;
  }
  return item.split("=")[1].toUpperCase();
});
const startScenario = values[0] || "HISTCR";
const startCountry = values[1] || "EARTH";
const startEntity = values[2] || "KYOTOGHG_(AR4GWP100)";

const selectScenario = $("select#scenarios").select2({
  data: [
    { id: "HISTCR", text: "Country reported (HISTCR)" },
    { id: "HISTTP", text: "Third Party (HISTTP)" },
  ],
  placeholder: "Select a data source",
});
d3.select("#scenarios").property("value", startScenario);
selectScenario.trigger("change");
const selectCountry = $("select#countries").select2({
  data: countryData,
  placeholder: "Select a country or group",
});
d3.select("#countries").property("value", startCountry);
selectCountry.trigger("change");
const selectEntity = $("select#entities").select2({
  data: entityData,
  placeholder: "Select a gas or group",
});
d3.select("#entities").property("value", startEntity);
selectEntity.trigger("change");

selectScenario.on("change", function () {
  const entity = d3.select("#entities").property("value");
  const country = d3.select("#countries").property("value");
  const scenario = this.value;
  setHash(scenario, country, entity);
  d3.select("#scenarioName").text(scenario);
});
selectCountry.on("change", function () {
  const scenario = d3.select("#scenarios").property("value");
  const entity = d3.select("#entities").property("value");
  const country = this.value;
  setHash(scenario, country, entity);
  d3.select("#countryName").text(to_name(country) || country);
});
selectEntity.on("change", function () {
  const scenario = d3.select("#scenarios").property("value");
  const country = d3.select("#countries").property("value");
  const entity = this.value;
  setHash(scenario, country, entity);
  d3.select("#entityName").text(entityNames[entity] || entity);
});

$(window).on("hashchange", function () {
  const hash = document.location.hash.substr(1);
  const values = hash.split("&").map(function (item) {
    if (!item) {
      return false;
    }
    return item.split("=")[1].toUpperCase();
  });
  const scenario = values[0];
  const country = values[1];
  const entity = values[2];

  showData(scenario, country, entity);
});

d3.select("#scenarioName").text(startScenario);
d3.select("#countryName").text(to_name(startCountry) || startCountry);
d3.select("#entityName").text(entityNames[startEntity]);
showData(startScenario, startCountry, startEntity);
// Ensure Totals/Percentage match (potentially cached) radio button selection.
switchTotalsPercentages();

// Workaround for resizing, from http://stackoverflow.com/questions/5489946/jquery-how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-ac
d3.select(window).on("resize", function () {
  clearTimeout(window.resizedFinished);
  window.resizedFinished = setTimeout(function () {
    location.reload();
  }, 250);
});

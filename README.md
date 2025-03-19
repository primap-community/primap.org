# primap.org

Served from `docs` folder.

The landing page at `docs` is edited manually.

## PRIMAP-hist

The `primap-hist` pages are generated from a template.

For local development or updating the following steps are required.

To install the required Python libraries, run
```
make venv
```

### Release Procedure

To update to a new version, update
- checkout a new branch
- update the CSV to be downloaded into `primap-hist` in the Makefile,
- update the filename and Zenodo record in `primap-hist/scripts/constants.py`
- update changelog in `primap-hist/template.jinja2.html`
- a a subfolder `chnagelog_<version>` in `docs/primap-hist/`, add the changelog `html` and `img` folders and rename the html file in the `html` directory to `index.html`.
- run `make build` to download the latest data and update the local files
- Commit, push and create a MR

Once the MR is merged the updated website will be live

### Developer Information


To download the CSV data:
```
make download
```

To generate per country/entity CSV files used in the visualization and for download:

```
make csvs
```

To build the PRIMAP-hist page in `docs/primap-hist/index.html` from `primap-hist/template.jinja2.html`:

An internet connection is required as metadata for adding DOI and citation info etc. are pulled from Zenodo.
To update to a new version change the record identifier in the template file.

```
make docs/primap-hist/index.html
```

These steps have been combined into:

```
make build
```

The visualisation code can be edited directly in `docs/primap-hist/index.js`.
The actual HTML is generated from `primap-hist/template.jinja2.html`, so
`docs/primap-hist/index.html` should not be edited directly.

For local testing the site can be served with
```
python3 -m http.server 8080 --directory docs
```
or, if `browser-sync` is installed with
```
  browser-sync docs --watch docs
```

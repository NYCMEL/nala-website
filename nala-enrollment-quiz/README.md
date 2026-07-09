# NALA Enrollment Quiz

Self-contained package for the flexible NALA enrollment quiz/backend implementation.

- `locksmith-career-quiz/` contains the quiz page, styles, client logic, generated scoring config, and required logo asset.
- `api/` contains the PHP endpoints and storage/scoring layer.
- `scripts/import_nala_enrollment_sources.py` rebuilds the generated config from the source DOCX/XLSX files.

The frontend expects its API at `../api`, so deploy `locksmith-career-quiz/` and `api/` as sibling folders.

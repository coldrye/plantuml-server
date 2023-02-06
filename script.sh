docker build -t leanera/plantuml-renderer .
docker run -d --rm -p 8080:8080 leanera/plantuml-renderer

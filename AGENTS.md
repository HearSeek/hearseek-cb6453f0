# Architecture rules

- Generate route HTML from index.html using scripts/generate-collection-html.ts; collection generation preserves absent image-alt tags while persona generation supplies them, to avoid unrelated metadata changes.
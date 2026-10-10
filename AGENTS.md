# Architecture rules

- Generate route HTML from index.html using scripts/generate-collection-html.ts; collection generation preserves absent image-alt tags while persona generation supplies them, to avoid unrelated metadata changes.
- Keep persona landing pages on the shared CompactHero/Benefits/Faq and existing pricing/signup/video controls; persona configuration changes copy and media without duplicating tracking logic.
- Compact the consent banner presentation on persona routes only; keep storage and consent updates shared and unchanged so all choices retain their existing behavior.
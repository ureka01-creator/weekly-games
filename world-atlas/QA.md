# 2026-11-01 QA

- JavaScript syntax check passed (`node --check`).
- Data: 250 unique country/territory codes, 195 primary entries.
- All 250 SVG flags embedded; no external flag/image requests required.
- All 195 primary countries covered by map polygon or small-country circle.
- Corrected source Korean name collisions: Dominica/Dominican Republic, Georgia/South Georgia, India/British Indian Ocean Territory.
- Browser verified: map Japan selection, Nepal search and detail, English Canada search, no-results message, reset to 195 entries, extended list of 250 entries.
- Browser verified: passport stamp persists across reload; removal works.
- Desktop layout reviewed visually. Responsive CSS implemented; actual iPad/iPhone viewport and device audio output have not been verified in this environment.
- Speech synthesis uses installed Korean voice; API availability does not guarantee actual audible device playback.
- All countries have base information. Selected countries have curated additional notes; other entries have geographic summaries and flag observation prompts. Detailed cultural/history and flag symbolism for every entry remain future content expansion.

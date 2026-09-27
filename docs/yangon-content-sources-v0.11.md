# Yangon content and representation notes (v0.11)

## Representation boundary

The playable Yangon is deliberately compressed. It is not GIS data, a route
planner, an architectural reconstruction, or a statement of current opening
hours/prices. Names such as Sule, Bogyoke Aung San Market, Shwedagon,
Kandawgyi, Strand Road and Pansodan are used as inspiration and orientation.
The geometry, distances, businesses, NPCs, dialogue, fares, opening windows,
and activities are game-authored. UI copy calls approximate landmarks
“stylized” and photographs are taken from configured, respectful viewpoints.

## Factual-content policy and research trail

The milestone deliberately avoids historical dates, admission prices, worship
mechanics, and claims about exact architecture. Short food descriptions are
kept descriptive rather than presented as definitive recipes. Before a future
fact-heavy editorial pass, re-check dynamic visitor information rather than
turning it into timeless game data.

Reference set selected for that editorial pass:

* UNESCO, *Yangon Historic Urban Landscape* programme and city material:
  https://www.unesco.org/en/articles/yangon-historic-urban-landscape
* Shwedagon Pagoda official site: https://www.shwedagonpagoda.org.mm/
* Myanmar Ministry of Hotels and Tourism destination portal:
  https://tourism.gov.mm/
* Encyclopaedia Britannica, Yangon overview:
  https://www.britannica.com/place/Yangon

The implementation does not quote these pages. Named-place copy separates the
small factual identification (“a market”, “a lake/park”, “a river edge”) from
fictional NPC and gameplay flavour. Burmese visible text is limited to the
reviewed static strings already in the scene (`လက်ဖက်ရည်`, tea; `ဆိပ်ကမ်း`,
jetty/port); procedural Burmese generation is prohibited.

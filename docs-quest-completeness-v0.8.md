# Quest completeness audit — v0.8

| Objective | Required event | Implemented action | Reachable | Persistent | Automated |
|---|---|---|---|---|---|
| Check into Guest House | `ACTIVITY_COMPLETED/hotel_checkin` | Check In | Yes | Yes | Yes |
| Leave Your Bag | `LUGGAGE_STORED/guest_house` | Store Luggage | Yes | Yes | Yes |
| Visit Tea Shop | `LOCATION_ENTERED/tea_shop` | Enter | Yes | Yes | Yes |
| Eat Breakfast | `FOOD_EATEN/mohinga` | Order | Yes | Yes | Yes |
| Ask Where to Explore | `LOCATION_REVEALED/market` | Talk to Daw Nwe | Yes | Yes | Yes |
| Visit/Explore Market | entry and `LOCATION_REVEALED/shwedagon` | Enter, browse, talk | Yes | Yes | Yes |
| Visit/Photograph Landmark | discovery and photo events | Visit, camera | Yes | Yes | Yes |
| Find/Photograph Viewpoint | discovery and photo events | Search, camera | Yes | Yes | Yes |
| Return to Guest House | `LOCATION_ENTERED/hotel` | Enter | Yes | Yes | Yes |
| End Day and Sleep | `SLEEP_COMPLETED/guest_house` | End Day, Sleep | Yes | Yes | Yes |
| Collect Your Bag | `LUGGAGE_COLLECTED/guest_house` | Collect Luggage | Yes | Yes | Yes |
| Go to Bus Station | `LOCATION_ENTERED/bus` | Enter | Yes | Yes | Yes |
| Buy Bagan Ticket | `TRAVEL_STARTED/yangon_bagan_bus` | Buy Ticket | Yes | Yes | Yes |

The development validator checks event support, prerequisites, next-objective links, location/activity/food/route targets, and location activity references. Production does not expose invalid objectives because the checked-in objective graph has no invalid references.

## MMK and recovery audit

Starting balance is 22,000 MMK. Core food (3,000) plus landmark visit (1,000, with 1,200 first-visit reward) plus the 9,000 ticket leaves 10,200 MMK. Optional inventory and cosmetic purchases preserve the 9,000 MMK ticket reserve. Server failures occur before mutation commits; persistent actions exclude exploration actions and resume from UTC timestamps after refresh.

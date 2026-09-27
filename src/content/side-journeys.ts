export const SIDE_JOURNEYS = [
  { id:'yangon_food_trail', name:'Tables of Yangon', optional:true, steps:['talk:food_vendor','food:mohinga','food:shan_noodles'], rewards:{xp:180,score:100}, description:'Follow local suggestions between a neighbourhood breakfast and the evening food lane.' },
  { id:'yangon_photo_walk', name:'Six Ways to Frame a City', optional:true, steps:['photo:sule_photo','photo:bogyoke_photo','photo:shwedagon_view_photo','photo:lake_sunset_photo','photo:waterfront_photo'], rewards:{xp:250,score:160}, description:'Use deterministic viewpoints and time windows across contrasting districts.' },
  { id:'yangon_local_stories', name:'Streets, Gardens, River', optional:true, steps:['story:heritage_walk','story:south_garden_walk','story:strand_walked'], rewards:{xp:200,score:125}, description:'Find authored stories through observation and selected local conversations.' },
] as const;


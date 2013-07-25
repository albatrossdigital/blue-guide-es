var activeTab, query, rev, tab;

query = void 0;

tab = void 0;

rev = 0.1;

activeTab = void 0;

window.onload = function() {
  var data, filters, googleQuery, map, updateMarkers;
  updateMarkers = function() {
    map.drawMarkers(query.active(map.markerBounds(map.map.getBounds())));
    return console.log("update");
  };
  filters = new Filters();
  data = locache.get("blueGuideData");
  filters.draw("#filters");
  if (data && data.rev && data.rev === rev) {
    query = new JsonQuery("body", data);
  } else {
    googleQuery = new GoogleSpreadsheetsQuery(filters, function(data) {
      locache.set("blueGuideData", data);
      console.log(data);
      return query = new JsonQuery("body", data);
    });
    googleQuery.get("select *");
  }
  map = new Map({
    id: "map",
    updateSelector: "body",
    draw: true,
    resultsSelector: "#results",
    startLat: 38.659777730712534,
    startLng: -105.8203125,
    locate: true,
    geosearch: {
      provider: "Google",
      settings: {
        zoomLevel: 13
      }
    },
    layerUrl: "http://a.tiles.mapbox.com/v3/albatrossdigital.map-idkom5ru/{z}/{x}/{y}.png",
    fields: filters.displayFields,
    tabs: filters.tabs
  });
  $("body").bind("queryUpdate", function() {
    return updateMarkers();
  });
  $("body").bind("locationUpdate", function() {
    _.each(query.data.rows, function(row) {
      return query.setVal(row, "active", true);
    });
    return updateMarkers();
  });
  return map.map.on("moveend", function() {
    if ((map.lastBounds == null) || !query.withinBounds(map.map.getCenter(), map.markerBounds(map.lastBounds, 1.5))) {
      return updateMarkers();
    }
  });
};

/*
//@ sourceMappingURL=general.js.map
*/
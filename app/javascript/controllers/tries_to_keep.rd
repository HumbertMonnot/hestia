    //   the_map.addLayer({
    //     'id': 'poly-extrusion',
    //     'type': 'fill-extrusion',
    //     source: {
    //       type: 'geojson',
    //       data: hexas_object
    //     },
    //     'paint': {
    //     // Get the `fill-extrusion-color` from the source `color` property.
    //     'fill-extrusion-color': [
    //       "interpolate", ["linear"], ["get", "weight_average"],
    //       0, "red",
    //       25, "orange",
    //       50, "green",
    //       100, "purple"
    //     ],
         
    //     // Get `fill-extrusion-height` from the source `height` property.
    //     'fill-extrusion-height': ['get', 'weight_average_height'],
         
         
    //     // Make extrusions slightly opaque to see through indoor walls.
    //     'fill-extrusion-opacity': 0.8
    //     }
    // });
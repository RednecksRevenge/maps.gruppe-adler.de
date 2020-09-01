# maps.gruppe-adler.de

Arma 3 Web Map Tile Service (WMTS). The tiles are generated by [meh-utils](https://github.com/gruppe-adler/meh-utils) using data exported with [grad_meh](https://github.com/gruppe-adler/grad_meh).

## How to add new maps
We use the [meh-data](https://github.com/gruppe-adler/meh-data) repository for all our map data. Refer to [their documentation](https://github.com/gruppe-adler/meh-data) on how to add new maps.    
After the map is added you just have to [update the `maps/` git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules#_pulling_in_upstream_changes_from_the_submodule_remote) in this repository. 

## Consuming data
The following assumes that your docker container is reachable via `https://maps.gruppe-adler.de`.  
All requests are simple HTTP GET requests. So no body or extra HTTP headers are needed.
### List maps
A JSON containing a list of all maps with their respective display names can be accessed via:
```
https://mehps.gruppe-adler.de/maps
```
The response is an array of objects, each having a `displayName` and a `worldName` field:
```jsonc
[
    // [...]
    {
        "displayName": "Bystrica",
        "worldName": "Woodland_ACR"
    },
    {
        "displayName": "Stratis",
        "worldName": "Stratis"
    },
    // [...]
]
```

### Map Meta Data
Meta data of all maps can be accessed via the following URL, with `{worldName}` beeing the worldName of a map:
```
https://mehps.gruppe-adler.de/{worldName}/meta.json
```
The format matches the `meta.json` of [grad_meh](https://github.com/gruppe-adler/grad_meh), which is further specified [here](https://github.com/gruppe-adler/grad_meh/blob/master/docs/metajson_spec.md). 

### Preview Image
The preview image of each map can be accessed via the following URL: 
```
https://mehps.gruppe-adler.de/{worldName}/preview.png
```
### Satellite tiles
We host satellite tiles for all maps. The corresponding [TileJSON](https://github.com/mapbox/tilejson-spec) can be accessed here:
```
https://mehps.gruppe-adler.de/{worldName}/sat/tile.json
``` 
This TileJSON includes everything you need to add the satellite tile layer to your map. 

### Vector Tiles
We host [mapbox vector tiles](https://docs.mapbox.com/vector-tiles/reference/) for all maps. The corresponding [TileJSON](https://github.com/mapbox/tilejson-spec) (including everything you need, to add the tile layer to your map) can be found here:
```
https://mehps.gruppe-adler.de/{worldName}/mvt/tile.json
``` 
The corresponding [mapbox style document](https://docs.mapbox.com/mapbox-gl-js/style-spec/) can be found here: 
```
https://mehps.gruppe-adler.de/{worldName}/mvt/style.json
``` 
The vector tiles are generated from the GeoJSONs exported with [grad_meh](https://github.com/gruppe-adler/grad_meh). All feature properties are just copied over. Check out the [grad_meh GeoJSON documentation](https://github.com/gruppe-adler/grad_meh/blob/master/docs/geojson_spec.md) for details.

### Mapbox Sprites
We host our own [sprite sheets](https://docs.mapbox.com/mapbox-gl-js/style-spec/sprite/), which include several Arma 3 icons for our mapbox style documents.
```
https://mehps.gruppe-adler.de/sprites/sprite.png
https://mehps.gruppe-adler.de/sprites/sprite.json
https://mehps.gruppe-adler.de/sprites/sprite@2x.png
https://mehps.gruppe-adler.de/sprites/sprite@2x.json
https://mehps.gruppe-adler.de/sprites/sprite@4x.png
https://mehps.gruppe-adler.de/sprites/sprite@4x.json
```
## Building locally
This project is intendet to be used as a docker container. You can build the image - provided your working directory is ths project directory - with the following command:
```
docker build -t gruppeadler/maps .
``` 

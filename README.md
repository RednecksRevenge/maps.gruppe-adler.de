# maps.gruppe-adler.de

Arma 3 Web Map Tile Service (WMTS). The tiles are generated by [grad_mtg](https://github.com/gruppe-adler/grad_mtg).

## How to add new Maps
Adding a new map is fairly simple and requires just a few steps:

1. Generate the tiles of the desired map. As stated above generating the tiles is done using [grad_mtg](https://github.com/gruppe-adler/grad_mtg). Please refer to their documentation on how to use it.

2. Generate a meta file of the map. This can also be done using [grad_mtg](https://github.com/gruppe-adler/grad_mtg). Please refer to their documentation on how exactly to do that.

3. Move the entire map-folder from the grad_mtg output directory into the `maps/` directory of this repository

4. Navigate into the newly created directory and open the `meta.json` with the text editor of your choice.

5. Make the following changes to correct your `meta.json`:
    - The `layers` array should only include the layers which were exported. If you for example only exported topographic tiles the layers array should look like this:
        ```jsonc
        // [...]
        "layers": [
            {
                "name": "Topographic",
                "path": "topo/"
            }
        ],
        // [...]
        ```
    - Change the `maxLod` and `minLod` values to be the same as the smallest / largest exported LOD. Every folder, which is directly in the map directory (next to the `meta.json`) represents a LOD.  
    So for example if you have folders `2` through `8` the `meta.json` should look like this:
        ```jsonc
        // [...]
        "maxLod": 8,
        "minLod": 2,
        // [...]
        ```

6. Navigate into the map directory and then into one of the tile folders. Find a representative (has some features like buildings, streets and open fields) tile. Usually LOD7 tiles have a fairly good size to encompass all of those.  
**Remember which tile you chose!**  
Copy the tile and paste it directly into the `topo/` or `sat/` directory (depending on where you took it from :D) and rename it to `thumbnail.png`. Repeat that process for any have all other map types you have exported, ideally using the same tile (same extent, but correct type of course) for all of them.

7. Add the map to the bottom of the list within the `Dockerfile`. (We copy each map by itself to accelerate the building process in edge cases, when using the old image as a cache.)

## Consuming data from the WMTS

### List of maps
A JSON containing a list of all maps with their respective display names can be accessed via:   
```
http://maps.gruppe-adler.de/maps
```  

The resoponse looks like this:
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


### Map meta data
Each map has a corresponding `meta.json` which can be accessed via:  
```
http://maps.gruppe-adler.de/{worldName}/meta.json
```
This `meta.json` looks like this:
```jsonc
{
    "displayName": "Stratis",    // Map display name
    "grid": { // Offset of grid origin. Needed to calculate coordinates correctly
        "offsetX": 0,    // Offset from the left 
        "offsetY": 8192  // Offset from the top
    },
    "layers": [    // Available "Layers" with path and display name
        {
            "name": "Topographic",
            "path": "topo/"
        },
        {
            "name": "Satellite",
            "path": "sat/"
        }
    ],
    "locations": [   // Locations of type nameVillage, nameCity or nameCityCapital
        {
            "name": "Air Station Mike-26",
            "pos": [
                4278.85009765625,
                3855.60009765625,
                -217.83058166503906
            ]
        },
        // [...]
    ],
    "maxLod": 8,                // Maximal available LOD
    "minLod": 2,                // Minimal available LOD
    "worldName": "Stratis",     // Return of worldName script command
    "worldSize": 8192           // Return of worldSize script command
}
```

### Map tiles
Tile URL template:
```
http://maps.gruppe-adler.de/{worldName}/{layer}{z}/{x}/{y}.png
```
|Variable|Description|
|---|---|
|`{worldName}`|Arma Map Identifier|
|`{layer}`|Layer (`sat/` / `topo/`) can be found in [meta.json](#map-meta-data)#layers|
|`{z}`|Level of detail|
|`{x}`|Tile Column|
|`{y}`|Tile Row|


So one possible URL template for the `meta.json` above would be:
```
http://maps.gruppe-adler.de/stratis/sat/{z}/{x}/{y}.png
```

## Tile Properties

### Tile sizes
| Area one tile covers | LOD |
| ---: | :---: |
| 100m x 100m | 8 |
| 200m x 200m | 7 |
| 400m x 400m | 6 |
| 800m x 800m | 5 |
| 1600m x 1600m | 4 |
| 3200m x 3200m | 3 |
| 6400m x 6400m | 2 |
| 12800m x 12800m | 1 |
| 25600m x 25600m | 0 |

### Nomenclature
Our nomenclature of the tiles matches the one of the [OpenGIS® Web Map Tile Service Implementation Standard](https://www.opengeospatial.org/standards/wmts). 

The tile in the top left corner is 0,0 with the first number specifying the column and the second the row.
![https://i.imgur.com/7Itnufs.png](https://i.imgur.com/7Itnufs.png)

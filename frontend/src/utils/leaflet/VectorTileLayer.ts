import { TileLayer, Coords, DoneCallback } from 'leaflet';
import { ResponseError } from '..';
import Protobuf from 'pbf';
import { VectorTile as MapboxVectorTile } from '@mapbox/vector-tile';
import { VectorTile } from './VectorTile';

export default class VectorTileLayer extends TileLayer  {

    /**
     * Called by leaflet. Creates tile and returns 
     * @param coords tile coordinates
     * @param done callback
     */
    protected createTile(coords: Coords, done: DoneCallback): HTMLElement {
        // @ts-ignore | we know this exists, it's just missing in the typings
        const tileUrl = this.getTileUrl(coords)
        const { x: width, y: height } = this.getTileSize();
        const tile: VectorTile = new VectorTile(width, height);
        const domElem = tile.getDomElement();
    
        this.loadMbVectorTile(tileUrl).then(mbTile => {
            tile.addMapBoxTile(mbTile);
            done(undefined, domElem);
        }).catch(err => done(err));
        
        return domElem;
    };

    /**
     * Loads mapbox vector tile from given url
     * @param url url of tile
     */
    private async loadMbVectorTile(url: string): Promise<MapboxVectorTile> {
        let response: Response;
        try {
            response = await fetch(url);
        } catch (err) {
            throw err;
        }
        
        if (!response.ok) throw new ResponseError(response);
        
        const buffer = await response.arrayBuffer();

        return new MapboxVectorTile(new Protobuf(buffer))
    }
};

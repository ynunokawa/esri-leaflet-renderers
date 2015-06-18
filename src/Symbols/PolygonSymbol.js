EsriLeafletRenderers.PolygonSymbol = EsriLeafletRenderers.Symbol.extend({
  statics: {
    //not implemented: 'esriSFSBackwardDiagonal','esriSFSCross','esriSFSDiagonalCross','esriSFSForwardDiagonal','esriSFSHorizontal','esriSFSNull','esriSFSVertical'
    POLYGONTYPES:  ['esriSFSSolid']
  },
  initialize: function(symbolJson){
    EsriLeafletRenderers.Symbol.prototype.initialize.call(this, symbolJson);
    if (symbolJson){
      this._lineStyles = EsriLeafletRenderers.lineSymbol(symbolJson.outline).style();
      this._fillStyles();
    }
  },

  _fillStyles: function(){
    if (this._lineStyles) {
      if (this._lineStyles.weight === 0){
        //when weight is 0, setting the stroke to false can still look bad
        //(gaps between the polygons)
        this._styles.stroke = false;
      } else {
        //copy the line symbol styles into this symbol's styles
        for (var styleAttr in this._lineStyles){
          this._styles[styleAttr] = this._lineStyles[styleAttr];
        }
      }
    }

    //set the fill for the polygon
    if (this._symbolJson) {
      if (this._symbolJson.color &&
          //don't fill polygon if type is not supported
          EsriLeafletRenderers.PolygonSymbol.POLYGONTYPES.indexOf(this._symbolJson.style >= 0)) {

        this._styles.fill = true;
        this._styles.fillColor = this.colorValue(this._symbolJson.color);
        this._styles.fillOpacity = this.alphaValue(this._symbolJson.color);
      } else {
        this._styles.fill = false;
        this._styles.fillOpacity = 0;
      }
    }

  },

  style: function(feature, visualVariables) {
    if(!this._isDefault && visualVariables && visualVariables.colorInfo){
      var color = this.getColor(feature, visualVariables.colorInfo);
      if(color){
        this._styles.fillColor = this.colorValue(color);
        this._styles.fillOpacity = this.alphaValue(color);
      }
    }
    return this._styles;
  }
});
EsriLeafletRenderers.polygonSymbol = function(symbolJson){
  return new EsriLeafletRenderers.PolygonSymbol(symbolJson);
};

(function() {
  module.exports = [
    {
      type: 'variable:sass',
      regex: /([\$])([\w0-9-_]+)/ig
    }, {
      type: 'variable:less',
      regex: /([\@])([\w0-9-_]+)/ig
    }, {
      type: 'hsla',
      regex: /hsla\(([0-9]|[1-9][0-9]|[1|2][0-9][0-9]|3[0-5][0-9]|360),\s*([0-9]|[1-9][0-9]|100)\%?,\s*([0-9]|[1-9][0-9]|100)\%?,\s*(0|1|0*\.\d+)\)/ig
    }, {
      type: 'hsl',
      regex: /hsl\(([0-9]|[1-9][0-9]|[1|2][0-9][0-9]|3[0-5][0-9]|360),\s*([0-9]|[1-9][0-9]|100)\%?,\s*([0-9]|[1-9][0-9]|100)\%?\)/ig
    }, {
      type: 'hexa',
      regex: /(rgba\(((\#[a-f0-9]{6}|\#[a-f0-9]{3}))\s*,\s*(0|1|0*\.\d+)\))/ig
    }, {
      type: 'rgba',
      regex: /(rgba\(((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])))\s*,\s*(0|1|0*\.\d+)\))/ig
    }, {
      type: 'rgb',
      regex: /(rgb\(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\))/ig
    }, {
      type: 'hex',
      regex: /(\#[a-f0-9]{6}|\#[a-f0-9]{3})/ig
    }
  ];

}).call(this);

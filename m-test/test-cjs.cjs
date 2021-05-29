var args = [
    'nv-format',
    'nv-format/umd/nv-format.min.js',
    'nv-format/umd/nv-format.js',
];
for ( var i=0; i < args.length; i++ ) {
    if ( i > 0 ) console.log( '************************' );
    console.log( 'require(\''+args[i]+'\')' );
    var nF = require( args[i] );
    var nFI = nF();
    console.log( 'nF(300, "200")', nFI(300, 200) );
    console.log( 'nF(300, "x")', nFI(300, "x") );
    console.log( 'nF(300, "dddd")', nFI(300, "dddd") );
    console.log( 'nF(300, "dddd.ddd")', nFI(300, "dddd.ddd") );
    console.log( 'everything seems to work' );
}

var assert = require('assert').strict;
var nvFormat = require('../umd/nv-format.min.js');
var generateTests = (function() {
    var isObejct = function(value) {
        return ( value && typeof value === "object" &&
            value.constructor === Object.prototype.constructor );
    };
    var toString$ = function(value) {
        if ( typeof value === 'string' ) return value;
        if ( isObejct(value) ) {
            var result = '';
            for ( var i in value ) {
                if ( result.length ) result += ', ';
                result += i+':"'+value[i]+'"';
            }
            return '{' + result + '}';
        }
        return ""+value;
    };
    var performTest = function(scope, test) {
        var result = scope.instance.apply(null, test.args);
        scope.assert.equal(test.result, result);
    };
    var formTestSet = function(scope, tests) {
        var args = [];
        for ( var i=0; i < tests.length; i++ ) {
            var argc = tests[i].args.length;
            for ( var j=0; j < argc; j++ ) {
                args[j] = toString$(tests[i].args[j]);
            }
            if ( args.length > argc ) {
                args.splice(argc, args.length - argc);
            }
            var description = 'nvFormat(' + args.join(', ') + ')';
            description += ' === ' + tests[i].result;
            var f = performTest.bind(null, scope, tests[i]);
            scope.it(description, f);
        }
    };
    return function(scope, testSets) {
        for ( var i=0; i < testSets.length; i++ ) {
            var f = formTestSet.bind(null, scope, testSets[i].tests);
            scope.describe(testSets[i].description, f);
        }
    };
})();
console.log( 'settings description sequence: ');
console.log( '    format | trunc | filler | pointer --');
console.log( '    delimiter | prefix | postfix | output');
describe('settings: d|floor|zero|empty--empty|empty|empty|empty', function() {
    var instance = nvFormat({
        format: 'd',
        trunc: 'floor',
        filler: '0',
        point: '',
        delimiter: '',
        prefix: '',
        postfix: '',
        output: '',
    });
    var testSets = [{
        description: 'number\'s integer part less than format\'s integer part',
        tests: [{
            args: [15, 'dddd'],
            result: '0015',
        }, {
            args: [15, 'xddd'],
            result: '0015',
        }, {
            args: [5, 'ddddddd'],
            result: '0000005',
        }, {
            args: [5, 'xd'],
            result: '05',
        }],
    }, {
        description: 'number\'s integer part equal to format\'s integer part',
        tests: [{
            args: [125, 'ddd'],
            result: '125',
        }, {
            args: [25000, 'xdddd'],
            result: '25000',
        }, {
            args: [5, 'd'],
            result: '5',
        }, {
            args: [5, 'x'],
            result: '5',
        }],
    }, {
        description: 'number\'s integer part bigger than format\'s integer part',
        tests: [{
            args: [125000, 'ddd'],
            result: '125000',
        }, {
            args: [250750, 'xdd'],
            result: '750',
        }, {
            args: [50, 'd'],
            result: '50',
        }, {
            args: [50, 'x'],
            result: '0',
        }],
    }, {
        description: 'number\'s fractional part less than format\'s fractional part',
        tests: [{
            args: [125, 'd.ddd'],
            result: '125.000',
        }, {
            args: [250.55, 'xd.ddd'],
            result: '50.550',
        }],
    }, {
        description: 'fractional part rounding',
        tests: [{
            args: [12.775, 'ddd'],
            result: '012',
        }, {
            args: [-12.775, 'x.d'],
            result: '-2.8',
        }, {
            args: [12.0625, 'dddd.dd'],
            result: '0012.06',
        }],
    }, {
        description: 'integer part rounding',
        tests: [{
            args: [100012.375, 'xd0'],
            result: '010',
        }, {
            args: [-6250, 'd000'],
            result: '-7000',
        }, {
            args: [335557.33, 'dd0'],
            result: '335550',
        }],
    }, {
        description: 'rounding to a divisible number',
        tests: [{
            args: [3.4557, 'dd.125'],
            result: '03.375',
        }, {
            args: [-250.667, '0.5'],
            result: '-251.0',
        }, {
            args: [254.667, '1.25'],
            result: '253.75',
        }, {
            args: [-45530, '500'],
            result: '-46000',
        }, {
            args: [2243.05, 'dddd25'],
            result: '002225',
        }],
    }, {
        description: 'format omitted',
        tests: [{
            args: [1375],
            result: '1375',
        }, {
            args: [5],
            result: '5',
        }, {
            args: [23.333],
            result: '23',
        }],
    }];
    var scope = {
        assert: assert,
        describe: describe,
        instance: instance,
        it: it,
    };
    generateTests(scope, testSets);
});
describe('settings: +xdd|round|zero|dot--comma|empty|empty|empty', function() {
    var instance = nvFormat({
        format: '+xdd',
        trunc: 'round',
        filler: '0',
        point: '.',
        delimiter: ',',
        prefix: '',
        postfix: '',
        output: '',
    });
    var testSets = [{
        description: 'number\'s integer part less than format\'s integer part',
        tests: [{
            args: [15, 'dddd'],
            result: '0,015',
        }, {
            args: [15, 'xddd'],
            result: '0,015',
        }, {
            args: [5, 'ddddddd'],
            result: '0,000,005',
        }, {
            args: [5, 'xd'],
            result: '05',
        }],
    }, {
        description: 'number\'s integer part equal to format\'s integer part',
        tests: [{
            args: [125, 'ddd'],
            result: '125',
        }, {
            args: [25000, 'xdddd'],
            result: '25,000',
        }, {
            args: [5, 'd'],
            result: '5',
        }, {
            args: [5, 'x'],
            result: '5',
        }],
    }, {
        description: 'number\'s integer part bigger than format\'s integer part',
        tests: [{
            args: [125000, 'ddd'],
            result: '125,000',
        }, {
            args: [250750, 'xdd'],
            result: '750',
        }, {
            args: [50, 'd'],
            result: '50',
        }, {
            args: [50, 'x'],
            result: '0',
        }],
    }, {
        description: 'number\'s fractional part less than format\'s fractional part',
        tests: [{
            args: [125, 'd.ddd'],
            result: '125.000',
        }, {
            args: [250.55, 'xd.ddd'],
            result: '50.550',
        }],
    }, {
        description: 'fractional part rounding',
        tests: [{
            args: [12.775, 'ddd'],
            result: '013',
        }, {
            args: [-12.775, 'x.d'],
            result: '-2.8',
        }, {
            args: [12.0625, 'dddd.dd'],
            result: '0,012.06',
        }],
    }, {
        description: 'integer part rounding',
        tests: [{
            args: [100012.375, 'xd0'],
            result: '010',
        }, {
            args: [-6250, 'd000'],
            result: '-6,000',
        }, {
            args: [335557.33, 'dd0'],
            result: '335,560',
        }],
    }, {
        description: 'rounding to a divisible number',
        tests: [{
            args: [3.4557, 'dd.125'],
            result: '03.500',
        }, {
            args: [-250.667, '0.5'],
            result: '-250.5',
        }, {
            args: [254.667, '1.25'],
            result: '255.00',
        }, {
            args: [-45530, '500'],
            result: '-45,500',
        }, {
            args: [2243.05, 'dddd25'],
            result: '002,250',
        }],
    }, {
        description: 'format omitted',
        tests: [{
            args: [1375],
            result: '+375',
        }, {
            args: [5],
            result: '+005',
        }, {
            args: [23.333],
            result: '+023',
        }],
    }];
    var scope = {
        assert: assert,
        describe: describe,
        instance: instance,
        it: it,
    };
    generateTests(scope, testSets);
});
describe('settings: 500|ceil|*|dot--comma|=(|)pts.|html', function() {
    var instance = nvFormat({
        format: '500',
        trunc: 'ceil',
        filler: '*',
        point: '.',
        delimiter: ',',
        prefix: '=(',
        postfix: ')pts.',
        output: 'html',
    });
    var testSets = [{
        description: 'prefix/postfix test',
        tests: [{
            args: [15, 'dddd'],
            result: '=(**15)pts.',
        }, {
            args: [1554, 'dddddd0'],
            result: '=(***1,560)pts.',
        }, {
            args: [1554],
            result: '=(2,000)pts.',
        }, {
            args: [45, '{(20)}.--'],
            result: '=({60}.--)pts.',
        }, {
            args: [45, '((40))'],
            result: '=((80))pts.',
        }],
    }, {
        description: 'html-compatible output test',
        tests: [{
            args: [15, 'dddd'],
            result: '=(**15)pts.',
        }, {
            args: [1554, '&(ddd0)'],
            result: '=(&amp;1,560)pts.',
        }, {
            args: [1554, '< (500) >'],
            result: '=(&lt;&nbsp;2,000&nbsp;&gt;)pts.',
        }, {
            args: [1554, '<&(500)>'],
            result: '=(&lt;&amp;2,000&gt;)pts.',
        }],
    }, {
        description: 'settings overwriting test',
        tests: [{
            args: [15, 'dddd', { filler: '0' }],
            result: '=(0,015)pts.',
        }, {
            args: [1554, '((dddddd0))', { prefix: '', postfix: '' }],
            result: '(***1,560)',
        }, {
            args: [1554, { format: '100', trunc: 'floor' }],
            result: '=(1,500)pts.',
        }, {
            args: [1554, '<&(500)>', { output: '' }],
            result: '=(<&2,000>)pts.',
       	}],
    }];
    var scope = {
        assert: assert,
        describe: describe,
        instance: instance,
        it: it,
    };
    generateTests(scope, testSets);
});

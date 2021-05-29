var nvFormat = (function() {
    var truncFuncts = {
        "floor": {
            "1": Math.floor.bind(Math),
            "-1": Math.ceil.bind(Math),
        },
        "ceil": {
            "1": Math.ceil.bind(Math),
            "-1": Math.floor.bind(Math),
        },
        "round": {
            "1": Math.round.bind(Math),
            "-1": Math.round.bind(Math),
        },
    };
    var formatPattern = /(?:^|\()\s*(\+x|\+d|x|d|\d)d*\d*[\.,]?d*\d*\s*(?:\)|$)/;
    var formatRoundBase = /\d+/;
    var formatTrimmer = /[^\(\s\)]+/;
    var symbolsOrderTest = /\d+.*?d+/;
    var htmlConverterPattern = /[<>& ]/g;
    var instances = {};
    var defaultSettings = {
        trunc: "floor",
        filler: "0",
        format: "d",
        point: "",
        delimiter: "",
        prefix: "",
        postfix: "",
        output: "",
    };
    var defaultSettingsTag = "";
    for ( var attr in defaultSettings ) {
        defaultSettingsTag += defaultSettings[attr] + "-";
    }
    var isObject = function(value) {
        return (Object.prototype.toString.call(value) === "[object Object]");
    };
    var htmlConverter = (function() {
        var map = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            " ": "&nbsp;",
        };
        return function(match) {
            if ( !(match in map) ) return match;
            else return map[match];
        };
    })();
    var nvFormat = function(settings, releaseInstance) {
        if ( settings === "clear" ) {
            instances = {};
            return nvFormat;
        }
        var settingsTag = defaultSettingsTag;
        var seetingsDefined = isObject(settings);
        if ( seetingsDefined ) {
            settingsTag = "";
            for ( var attr in defaultSettings ) {
                if ( (attr in settings) ) settingsTag += settings[attr] + "-";
                else settingsTag += defaultSettings[attr] + "-";
            }
        }
        var instance = instances[settingsTag];
        if ( !instance ) {
            var generalSettings = {};
            for ( var attr in defaultSettings ) {
                if ( seetingsDefined && (attr in settings) ) generalSettings[attr] = settings[attr];
                else generalSettings[attr] = defaultSettings[attr];
            }
            instance = (function() {
                var settings = {};
                return function(value, format, _settings) {
                    var castValue = +value;
                    if ( !isFinite(castValue) ) return value.toString();
                    if ( isObject(format) ) {
                        _settings = format;
                        format = null;
                    }
                    var seetingsDefined = isObject(_settings);
                    for ( var attr in generalSettings ) {
                        if ( seetingsDefined && (attr in _settings) ) settings[attr] = _settings[attr];
                        else settings[attr] = generalSettings[attr];
                    }
                    if ( typeof format === "string" ) settings.format = format;
                    for ( var attr in settings ) {
                        if ( typeof settings[attr] !== "string" ) {
                            settings[attr] = defaultSettings[attr];
                        }
                    }
                    if ( !(settings.trunc in truncFuncts) ) settings.trunc = "floor";
                    var formatBaseImmd = formatPattern.exec(settings.format);
                    if ( !formatBaseImmd ) return castValue.toString();
                    else formatBaseImmd = formatBaseImmd[0];
                    var formatBase = formatTrimmer.exec(formatBaseImmd);
                    if ( !formatBase ) return castValue.toString();
                    else formatBase = formatBase[0];
                    if ( !formatBase.length ) return castValue.toString();
                    if ( symbolsOrderTest.test(formatBase) ) return castValue.toString();
                    var formatStartPosition = settings.format.indexOf(formatBaseImmd);
                    var formatEndPosition = formatStartPosition + formatBaseImmd.length;
                    if ( formatStartPosition < 0 ) return castValue.toString();
                    if ( formatEndPosition > settings.format.length ) return castValue.toString();
                    var formatPrefix = settings.format.substring(0, formatStartPosition);
                    var formatPostfix = settings.format.substring(formatEndPosition);
                    var outputSigned = (formatBase.indexOf("+") === 0);
                    var uFormat = formatBase, sign = "";
                    if ( outputSigned ) uFormat = formatBase.slice(1);
                    var leftTrancation = (uFormat.indexOf("x") === 0);
                    var uValue = Math.abs(castValue);
                    var vSign = ( castValue < 0 ) ? -1 : 1;
                    if ( vSign > 0 && outputSigned ) sign = "+";
                    if ( vSign < 0 ) sign = "-";
                    var truncFunct = truncFuncts[settings.trunc][vSign];
                    var formatMantissa = uFormat, pointChar = ".";
                    var pointPosition = uFormat.indexOf(".");
                    if ( pointPosition < 0 ) {
                        pointPosition = uFormat.indexOf(",");
                        if ( pointPosition > -1 ) pointChar = ",";
                    }
                    if ( settings.point !== "" ) pointChar = settings.point;
                    var iPartDigits = uFormat.length, fPartDigits = 0;
                    if ( pointPosition === 0 ) return castValue.toString();
                    if ( pointPosition > uFormat.length - 2 ) return castValue.toString();
                    if ( pointPosition > 0 ) {
                        iPartDigits = pointPosition;
                        fPartDigits = uFormat.length - pointPosition - 1;
                        formatMantissa = 
                            uFormat.slice(0, pointPosition) + 
                            uFormat.slice(pointPosition + 1);
                    }
                    var roundBase = 1, match = formatMantissa.match(formatRoundBase);
                    if ( match ) {
                        if ( +match[0] !== 0 ) roundBase = +match[0];
                        else roundBase = +("1"+match[0]);
                    }
                    var precisionCoef = Math.pow(10, fPartDigits);
                    var roundedValue = uValue * precisionCoef;
                    if ( Math.abs(roundedValue - Math.round(roundedValue)) < 1e-6 )
                        roundedValue = Math.round(roundedValue);
                    roundedValue = truncFunct(roundedValue / roundBase) * roundBase;
                    roundedValue /= precisionCoef;
                    var outputValue = roundedValue.toString();
                    if ( pointChar !== "." ) outputValue = outputValue.replace(".", pointChar);
                    var outputPointPosition = outputValue.indexOf(pointChar);
                    if ( outputPointPosition < 0 ) {
                        outputPointPosition = outputValue.length;
                        if ( fPartDigits > 0 ) outputValue += pointChar;
                    }
                    var fPartOutputSize = outputValue.length - 1 - outputPointPosition;
                    if ( fPartDigits > 0 && fPartOutputSize < fPartDigits ) {
                        var fractionalFiller = "0".repeat(fPartDigits - fPartOutputSize);
                        outputValue += fractionalFiller;
                    }
                    var outputIntegerDigits = outputPointPosition;
                    if ( outputPointPosition < iPartDigits ) {
                        var filler = settings.filler.repeat(iPartDigits - outputPointPosition);
                        outputValue = filler + outputValue;
                        outputPointPosition = iPartDigits;
                    }
                    if ( leftTrancation && outputPointPosition > iPartDigits ) {
                        var truncDigits = outputPointPosition - iPartDigits;
                        outputValue = outputValue.slice(-(outputValue.length - truncDigits));
                        outputPointPosition = iPartDigits;
                        outputIntegerDigits -= truncDigits;
                    }
                    if ( settings.delimiter !== "" && outputPointPosition > 3 ) {
                        var digits = [], reversed = false, startIndex, endIndex;
                        var delimiter = settings.delimiter;
                        if ( delimiter.length > 1 && delimiter.charAt(0) === "r" ) {
                            delimiter = delimiter.substring(1);
                            reversed = true;
                        }
                        var defaultFiller = (settings.filler === "0");
                        if ( defaultFiller && !reversed || reversed && !defaultFiller ) {
                            startIndex = 0;
                            endIndex = (outputPointPosition - 1) % 3 + 1;
                        } else {
                            startIndex = outputPointPosition - outputIntegerDigits;
                            endIndex = startIndex + (outputIntegerDigits - 1) % 3 + 1;
                        }
                        var operationStartIndex = startIndex;
                        while ( endIndex <= outputPointPosition ) {
                            digits.push(outputValue.substring(startIndex, endIndex));
                            startIndex = endIndex;
                            endIndex += 3;
                        }
                        var integerPart = digits.join(delimiter);
                        var outputLeftPart = outputValue.substring(0, operationStartIndex);
                        var outputRightPart = outputValue.substring(outputPointPosition);
                        outputValue = outputLeftPart + integerPart + outputRightPart;
                    }
                    formatPrefix = settings.prefix + formatPrefix;
                    formatPostfix = formatPostfix + settings.postfix;
                    var result = (formatPrefix + (sign + outputValue) + formatPostfix);
                    if ( settings.output === "html" ) {
                        result = result.replace(htmlConverterPattern, htmlConverter);
                    }
                    return result;
                };
            })();
        }
        if ( !releaseInstance ) instances[settingsTag] = instance;
        return instance;
    };
    return nvFormat;
})();
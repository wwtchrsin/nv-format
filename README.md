## nv-format
nv-format is a numeric value formatter. This tool serves for defining a string representation of a number.

## Functionality
* Defining a minimal number of characters that represent a number
(i.g. turn the number 53 to a string "0053")
* Defining a maximal number of characters that represent a number
(i.g. truncate the number 1234567 to a string "4567")
* Rounding the integer part of a number
(i.g turn the number 11553 to a string "12000" or "11000")
* Making the number representation or its remainder multiple of
some specified number (i.g. turn the number 1253 to a string "1250" or "1500")
* Adding delimiters like commas after each third digit to mark out hundreds,
millions and so forth (i.g. turn the number 1000000 to a string "1,000,000")

## Usage
```javascript
var result = nvFormat
    ({/*optionalSettings*/}, optionalNotRetainInstance)
    (number, optionalFormatString, {/*optionalParameters*/});
var result = nvFormat
    ({/*optionalParameters*/}, optionalNotRetainInstance)
    (number, {/*optionalSettings*/});
```

## Examples
```javascript
nvFormat
    ()(123.537, "d.dd", { trunc: "round" });
    //123.54
nvFormat
    ()(123.537, "d", { trunc: "round" });
    //124
nvFormat
    ()(123.537, "xd", { trunc: "round" });
    //24
nvFormat
    ({ format: "ddddddd.d", delimiter: "," })
    (1123.537);
    //0,001,123.5
nvFormat
    ({ format: "ddddddd.d", delimiter: "r," })
    (1123.537);
    //0001,123.5
nvFormat
    ({ format: "ddddddd.d", delimiter: "r," })
    (1123.537, "d");
    //1,123
nvFormat
    ({ format: "ddddddd.d", delimiter: "r," })
    (1123.537, { format: "ddddddd.d", delimiter: "," });
    //0,001,123.5
nvFormat
    ({ format: "d.25", trunc: "floor" })
    (1123.537);
    //1123.50
nvFormat
    ({ format: "d.25", trunc: "ceil" })
    (1123.537);
    //1123.75
nvFormat
    ({ format: "$(dd00).--", trunc: "floor" })
    (1123.537);
    //$1100.--
nvFormat
    ({ format: "$(dd00).--", trunc: "ceil" })
    (1123.537);
    //$1200.--
nvFormat
    ()(23.537, "dddd.25");
    //0023.50
nvFormat
    ()(23.537, "ddd1.25");
    //0022.50
nvFormat
    ()(23.537, "ddd1.25", { trunc: "ceil" });
    //0023.75
var nF = nvFormat({ format: "(dd,dd)%" }, true);
nF(12.2) //12,20%
nF(5) //05,00%
nF(123.537) //123,53%
```

## Connection
* Node environment / CommonJS module
```javascript
var nvFormat = require('nv-format'); /*OR*/
var nvFormat = require('./umd/nv-format.min.js'); /*OR*/
var nvFormat = require('./umd/nv-format.js');
```
* Node environment / ES6 module
```javascript
import nvFormat from 'nv-format/esm'; /*OR*/
import nvFormat from './esm/nv-format.js';
```
* Browser environment (global scope function nvFormat)
```html
<script src="./src/nv-format.min.js"></script> <!--OR-->
<script src="./src/nv-format.js"></script> <!--OR-->
<script src="./umd/nv-format.min.js"></script> <!--OR-->
<script src="./umd/nv-format.js"></script>
```
* Browser environment / ES6 Module
```javascript
import nvFormat from './esm/nv-format.js';
```
Note: Here "./" represents the package's root directory


## Usage description
A call to the function that represents that tools (i.g. **nvFormat**)
accept an object containing some set of settings that overwrites default ones.
It returns a function bound to the resulting settings and that function
factually performs formatting. It accepts a number to format as its first argument.
A format string can be passed via the *'format'* property of the settings object or
as the second argument of the formatting function. It is possible to overwrite those
setting the function was bound to by passing a settings object as the third argument
when a format string is passed as the second argument, or as the second argument 
when the format string parameter is omitted. By default after a function bound to
some settings is created, it will be retained in case a function bound to such settings set
will again be requested to return one already created. It is possible to prevent this behavior
by passing a true value as the second parameter. It is also possible to remove all links 
to the currently retained functions by passing a string **'clear'** as the first parameter
of the entry point function.

## Settings default values
```javascript
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
```

## Settings description
* **format**: describes the appearance of the resulting number.
The main part of the format is a placeholder for the digits of the number
which can be appended or prepended by arbitrary prefix or postfix.
If the format string contains a prefix or a postfix the format's main part
must be demarcated by round brackets. The resulting number appearance is described by
symbols "+", "x", "d", ",", ".", and decimal digits. A minimal length of
the integer part is depicted by a sequence of symbols "d" preceding a decimal point.
A maximal length is depicted by a similar sequence but started with a symbol "x" which
also counts. A maximal length of the fractional part is depicted by a "d" symbols sequence
following a decimal point. Decimal digits define the interval of rounding or in other
words define a number the resulting number should be multiple of. A decimal point can be 
depicted either by a dot or a comma symbol which will be used in such a role in the output string.
It is also possible to enable mandatory sign indication by prepending the format's
main part with a symbol "+" that means that both positive and negative numbers will have
a corresponding visible sign.
* **trunc**: defines how the number should be truncated or rounded, 
possible options are "floor", "round" and "ceil" that affect
a number the same way as the corresponding built-in functions.
* **filler**: defines a symbol a sequence of which will be added to
the left of the resulting number to reach the required length.
* **point**: defines a symbol that will be used as a delimiter between the integer and 
the fractional parts. If it is assigned any value but an empty
string it will overwrite that delimiter defined in the format string.
* **delimiter**: defines a symbol that will separate each third digit of the integer part.
If **filler** is set to "0", the delimiter will be applied to the filler sequence also,
otherwise only to the number itself. This behavior can be reversed by prefixing 
the parameter's value with a symbol "r" like "r0" i.g.
* **prefix** and **postfix**: define strings that will be added to the left and 
right ends of the output string respectively. These parameters will be added after
a prefix and a postfix that may be defined within the format.
* **output**: can be assigned a value "html" in which case HTML incompatible symbols
will be replaced by their HTML-compatible representation. It affects symbols "greater than",
"less than", and "ampersand". Spaces also will be replaced by the HTML codes of space.

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.jsCalc = factory());
}(this, (function () { 'use strict';

if (!window.isArray) {
    window.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}
function cleanFloat(number) {
    return number;
}

var jsCalcValue = {};
var calcCell;
jsCalcValue.makeValue = function (value) {
    switch (typeof value) {
    case 'string':
        if (value.toUpperCase() == 'TRUE' || value.toUpperCase() == 'FALSE') {
            var val = new jsCalcValue.jsCalcBooleanValue(value);
            return val;
        } else if (parseFloat(value) && !isNaN(Number(value))) {
            var val = new jsCalcValue.jsCalcNumValue(parseFloat(value));
            return val;
        } else {
            var val = new jsCalcValue.jsCalcStringValue(value);
            return val;
        }
    case 'number':
        var val = new jsCalcValue.jsCalcNumValue(parseFloat(value));
        return val;
    case 'boolean':
        var val = new jsCalcValue.jsCalcBooleanValue(value);
        return val;
    default:
        return -1;
    }
};
jsCalcValue.NumValue = function (value) {
    value = cleanFloat(value);
    var val = new jsCalcValue.jsCalcNumValue(value);
    return val;
};
jsCalcValue.ReferenceValue = function (startRow, startCol, endRow, endCol, cellCtx, sheetName) {
    return new jsCalcValue.jsCalcReferenceValue(startRow, startCol, endRow, endCol, cellCtx, sheetName);
};
jsCalcValue.BooleanValue = function (value) {
    var val = new jsCalcValue.jsCalcBooleanValue(value);
    return val;
};
jsCalcValue.StringValue = function (value) {
    var val = new jsCalcValue.jsCalcStringValue(value);
    return val;
};
jsCalcValue.ErrorValue = function (value, ctx, text) {
    var val = new jsCalcValue.jsCalcErrorValue(value, ctx, text);
    return val;
};
jsCalcValue.jsCalcBooleanValue = function (value) {
    if (value.toUpperCase) {
        if (value.toUpperCase() == 'FALSE') {
            this.data = false;
        } else if (value.toUpperCase() == 'TRUE') {
            this.data = true;
        } else {
            this.data = value ? true : false;
        }
    } else {
        this.data = value ? true : false;
    }
};
jsCalcValue.jsCalcBooleanValue.prototype.num = function (ctx) {
    return this.data ? 1 : 0;
};
jsCalcValue.jsCalcBooleanValue.prototype.b = function (ctx) {
    return this.data;
};
jsCalcValue.jsCalcBooleanValue.prototype.s = function (ctx) {
    return this.data ? 'True' : 'False';
};
jsCalcValue.jsCalcBooleanValue.prototype.v = function (ctx) {
    return this.data == true;
};
jsCalcValue.jsCalcBooleanValue.prototype.each = function (func, ctx) {
    func.call(this, ctx);
};
jsCalcValue.jsCalcBooleanValue.prototype.eachCell = function (func, ctx) {
    func.call(this, ctx);
};
jsCalcValue.jsCalcBooleanValue.prototype.isBlank = false;
jsCalcValue.jsCalcNumValue = function (value) {
    this.data = value;
};
jsCalcValue.jsCalcNumValue.prototype.num = function (ctx) {
    return this.data;
};
jsCalcValue.jsCalcNumValue.prototype.b = function (ctx) {
    return this.data ? true : false;
};
jsCalcValue.jsCalcNumValue.prototype.s = function (ctx) {
    return this.data.toString();
};
jsCalcValue.jsCalcNumValue.prototype.v = function (ctx) {
    return this.data;
};
jsCalcValue.jsCalcNumValue.prototype.each = function (func, ctx) {
    func.call(this, ctx);
};
jsCalcValue.jsCalcNumValue.prototype.eachCell = function (func, ctx) {
    func.call(this, ctx);
};
jsCalcValue.jsCalcNumValue.prototype.isBlank = false;
jsCalcValue.jsCalcReferenceValue = function (startRow, startCol, endRow, endCol, cellCtx, sheetName, sheetOb) {
    if (!cellCtx) {
        alert('set cellCtx in caller');
    }
    this.startRow = parseInt(startRow);
    this.startCol = parseInt(startCol);
    this.endRow = parseInt(endRow ? endRow : startRow);
    this.endCol = parseInt(endCol ? endCol : startCol);
    this.h = this.endRow - this.startRow + 1;
    this.w = this.endCol - this.startCol + 1;
    this.count = this.h * this.w;
    if (this.h == 1) {
        this.index = jsCalcValue.jsCalcReferenceValue.colIndex;
    } else if (this.w == 1) {
        this.index = jsCalcValue.jsCalcReferenceValue.rowIndex;
    } else {
        this.index = jsCalcValue.jsCalcReferenceValue.fullIndex;
    }
    if (sheetOb) {
        this.targetSheetOb = sheetOb;
    }
    if (!this.targetSheetOb && sheetName) {
        this.targetSheetOb = cellCtx.workbook.worksheets[sheetName];
    }
    if (!this.targetSheetOb && cellCtx.worksheet) {
        this.targetSheetOb = cellCtx.worksheet;
    }
    if (!this.targetSheetOb) {
        console.log('Didn\'t manage to find a worksheet reference for:', sheetName, '!R' + startRow + 'C' + endRow);
    }
    if (this.startRow == this.endRow && this.startCol == this.endCol) {
        this.num = function (ctx) {
            var ref = this.getSingleCellReference();
            if (ref.value.errorContext)
                return ref.value.num(ctx);
            return ref.value.num(ref);
        };
        this.b = function (ctx) {
            var ref = this.getSingleCellReference();
            if (ref.value.errorContext)
                return ref.value.b(ctx);
            return ref.value.b(ref);
        };
        this.s = function (ctx) {
            var ref = this.getSingleCellReference();
            if (ref.value.errorContext)
                return ref.value.s(ctx);
            return ref.value.s(ref);
        };
        this.v = function (ctx) {
            var ref = this.getSingleCellReference();
            if (ref.value.errorContext)
                return ref.value.v(ctx);
            if (ref === ctx) {
                throw new Error('Infinite loop evaluating cell');
            }
            return ref.value.v(ref);
        };
    } else {
        this.num = function (ctx) {
            return this.getReference(ctx).num(ctx);
        };
        this.b = function (ctx) {
            return this.getReference(ctx).b(ctx);
        };
        this.s = function (ctx) {
            var ref = this.getReference(ctx);
            return ref.s(ctx);
        };
        this.v = function (ctx) {
            var ref = this.getReference(ctx);
            return ref.v(ctx);
        };
    }
};
jsCalcValue.jsCalcReferenceValue.prototype.setValue = function (value) {
    if (window.isArray(value)) {
    } else {
        var ref = this.getSingleCellReference();
        ref.setValue(value);
    }
};
jsCalcValue.jsCalcReferenceValue.prototype.get = function (n) {
    var row = 1 + Math.floor(n / this.w);
    var col = 1 + n % this.w;
    return new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol + col - 1, this.startRow + row - 1, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb);
};
jsCalcValue.jsCalcReferenceValue.prototype.getByIndex = function (row, col) {
    return new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol + col - 1, this.startRow + row - 1, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb);
};
jsCalcValue.jsCalcReferenceValue.prototype.getCellByIndex = function (row, col) {
    return this.targetSheetOb.getCell(this.startRow + row, this.startCol + col);
};
jsCalcValue.jsCalcReferenceValue.prototype.resize = function (h, w) {
    return new jsCalcValue.jsCalcReferenceValue(this.startRow, this.startCol, this.startRow + h - 1, this.startCol + w - 1, this.targetSheetOb.getCell(this.startRow, this.startCol), this.targetSheetOb.name, this.targetSheetOb);
};
jsCalcValue.jsCalcReferenceValue.prototype.address = function () {
    var out = this.targetSheetOb.name + '!R' + this.startRow + 'C' + this.startCol;
    if (this.startRow != this.endRow || this.startCol != this.endCol) {
        out += ':R' + this.endRow + 'C' + this.endCol;
    }
    return out;
};
jsCalcValue.jsCalcReferenceValue.prototype.getReference = function (ctx) {
    if (this.h == 1 && this.w == 1) {
        return this;
    } else if ((this.h == 1 && this.w !== 1 || this.h !== 1 && this.w == 1) && ctx.debugExpressionData && ctx.debugExpressionData.isArray == 'true') {
        return this.targetSheetOb.getCell(this.startRow, this.startCol);
    } else if (ctx.row >= this.startRow && ctx.row <= this.endRow && this.startCol == this.endCol) {
        return this.targetSheetOb.getCell(ctx.row, this.startCol);
    } else if (ctx.col >= this.startCol && ctx.col <= this.endCol && this.startRow == this.endRow) {
        return this.targetSheetOb.getCell(this.startRow, ctx.col);
    } else
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx);
};
jsCalcValue.jsCalcReferenceValue.prototype.getReferenceAsValueReference = function (ctx) {
    if (this.h == 1 && this.w == 1) {
        return this;
    } else if (ctx.row >= this.startRow && ctx.row <= this.endRow && this.startCol == this.endCol) {
        return jsCalcValue.ReferenceValue(ctx.row, this.startCol, ctx.row, this.startCol, ctx, this.targetSheetOb.name);
    } else if (ctx.col >= this.startCol && ctx.col <= this.endCol && this.startRow == this.endRow) {
        return jsCalcValue.ReferenceValue(this.startRow, ctx.col, this.startRow, ctx.col, ctx, this.targetSheetOb.name);
    } else
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx);
};
jsCalcValue.jsCalcReferenceValue.prototype.each = function (func, ctx) {
    for (var r = this.startRow; r <= this.endRow; r++) {
        for (var c = this.startCol; c <= this.endCol; c++) {
            func.call(new jsCalcValue.jsCalcReferenceValue(r, c, r, c, this.targetSheetOb.getCell(r, c), this.targetSheetOb.name, this.targetSheetOb));
        }
    }
};
jsCalcValue.jsCalcReferenceValue.prototype.eachCell = function (func, ctx) {
    for (var r = this.startRow; r <= this.endRow; r++) {
        for (var c = this.startCol; c <= this.endCol; c++) {
            var cell = this.targetSheetOb ? this.targetSheetOb.getCell(r, c) : null;
            if (cell)
                func.call(cell);
        }
    }
};
jsCalcValue.jsCalcReferenceValue.prototype.valueArray = function () {
    var outArray = [];
    for (var r = this.startRow; r <= this.endRow; r++) {
        var curRow = [];
        for (var c = this.startCol; c <= this.endCol; c++) {
            curRow.push(this.targetSheetOb.getCell(r, c).v());
        }
        outArray.push(curRow);
    }
    return outArray;
};
jsCalcValue.jsCalcReferenceValue.fullIndex = function (row, col, ctx) {
    return new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol + col - 1, this.startRow + row - 1, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb);
};
jsCalcValue.jsCalcReferenceValue.rowIndex = function (row, ctx) {
    return row <= this.h ? new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol, this.startRow + row - 1, this.startCol, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol), this.targetSheetOb.name, this.targetSheetOb) : jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx, 'Attempted an out of bounds index');
};
jsCalcValue.jsCalcReferenceValue.colIndex = function (row, col, ctx) {
    if (!ctx) {
        ctx = col;
        col = row;
    }
    return col <= this.w ? new jsCalcValue.jsCalcReferenceValue(this.startRow, this.startCol + col - 1, this.startRow, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb) : jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx, 'Attempted an out of bounds index');
};
jsCalcValue.jsCalcReferenceValue.prototype.getSingleCellReference = function (ctx) {
    return this.targetSheetOb.getCell(this.startRow, this.startCol);
};
jsCalcValue.jsCalcStringValue = function (value) {
    this.data = value;
};
jsCalcValue.jsCalcStringValue.prototype.num = function (ctx) {
    var dataVal = isNaN(Number(this.data)) ? this.data : parseFloat(this.data);
    return this.data.length > 0 ? dataVal : 0;
};
jsCalcValue.jsCalcStringValue.prototype.b = function (ctx) {
    return this.data ? this.data.toUpper() == 'TRUE' ? true : false : false;
};
jsCalcValue.jsCalcStringValue.prototype.s = function (ctx) {
    return this.data;
};
jsCalcValue.jsCalcStringValue.prototype.v = function (ctx) {
    return this.data;
};
jsCalcValue.jsCalcStringValue.prototype.each = function (func, ctx) {
    func.call(this);
};
jsCalcValue.jsCalcStringValue.prototype.eachCell = function (func, ctx) {
    func.call(this);
};
jsCalcValue.jsCalcStringValue.prototype.isBlank = false;
jsCalcValue.jsCalcErrorValue = function (value, ctx, text) {
    this.data = value;
    this.errorContext = ctx;
    this.text = text;
    if (!ctx.errorStatus)
        ctx.errorStatus = this;
};
jsCalcValue.jsCalcErrorValue.uninitialized = '#UNINITIALIZED!';
jsCalcValue.jsCalcErrorValue.ref = '#REF!';
jsCalcValue.jsCalcErrorValue.divideByZero = '#DIV/0!';
jsCalcValue.jsCalcErrorValue.nameErr = '#NAME!';
jsCalcValue.jsCalcErrorValue.num = '#NUM!';
jsCalcValue.jsCalcErrorValue.calc = '#CALCERROR!';
jsCalcValue.jsCalcErrorValue.value = '#VALUE!';
jsCalcValue.jsCalcErrorValue.build = -5;
jsCalcValue.jsCalcErrorValue.na = '#N/A';
jsCalcValue.jsCalcErrorValue.prototype.num = function (ctx) {
    if (ctx) {
        if (!ctx.errorStatus || ctx.errorStatus && !ctx.errorStatus.errorContext)
            ctx.errorStatus = this;
    }
    return this.data;
};
jsCalcValue.jsCalcErrorValue.prototype.b = function (ctx) {
    if (ctx) {
        if (!ctx.errorStatus || ctx.errorStatus && !ctx.errorStatus.errorContext)
            ctx.errorStatus = this;
    }
    return this.data;
};
jsCalcValue.jsCalcErrorValue.prototype.s = function (ctx) {
    if (ctx) {
        if (!ctx.errorStatus || ctx.errorStatus && !ctx.errorStatus.errorContext)
            ctx.errorStatus = this;
    }
    return this.data.toString();
};
jsCalcValue.jsCalcErrorValue.prototype.index = function () {
    return this;
};
jsCalcValue.jsCalcErrorValue.prototype.v = function (ctx) {
    return this;
};
jsCalcValue.jsCalcErrorValue.prototype.toString = function () {
    return this.data;
};
jsCalcValue.jsCalcErrorValue.prototype.each = function (func, ctx) {
    func.call(this);
};
jsCalcValue.jsCalcErrorValue.prototype.eachCell = function (func, ctx) {
};
jsCalcValue.jsCalcMulticellReferenceValue = function (refArray, cellCtx) {
    this.refs = [];
    for (var i = 0; i < refArray.length; i++) {
        var curArrayItem = refArray[i];
        this.refs.push(jsCalcValue.ReferenceValue(curArrayItem.startRow, curArrayItem.startCol, curArrayItem.endRow, curArrayItem.endCol, cellCtx, curArrayItem.sheetName));
    }
};
jsCalcValue.jsCalcMulticellReferenceValue.prototype.each = function (func, ctx) {
    for (var i = 0; i < this.refs.length; i++) {
        this.refs[i].each(func, ctx);
    }
};

var WorksheetFunctions = {};
var numeral$2 = require('numeral');
var moment = require('moment');
WorksheetFunctions.sqrt2PI = Math.sqrt(2 * Math.PI);
WorksheetFunctions.recipSqrt2PI = 1 / Math.sqrt(2 * Math.PI);
WorksheetFunctions.SUM = function (argArray, ctx) {
    var curSum = 0;
    var curCtx = ctx;
    if (ctx && ctx.formula && ctx.formula.indexOf('XLOOKUP') > -1) {
        return jsCalcValue.NumValue(ctx.origValue);
    }
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        curRange.each(function () {
            curSum += this.num(curCtx);
        });
    }
    return jsCalcValue.NumValue(curSum);
};
WorksheetFunctions.PRODUCT = function (argArray, ctx) {
    var curProduct = 1;
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        curRange.each(function () {
            curProduct *= this.s(ctx) != '' ? this.num(curCtx) : 1;
        });
    }
    return jsCalcValue.NumValue(curProduct);
};
WorksheetFunctions.IF = function (argArray, ctx) {
    if (argArray[0](ctx).b(ctx)) {
        return argArray[1](ctx);
    } else {
        if (argArray[2])
            return argArray[2](ctx);
        return jsCalcValue.NumValue(0);
    }
};
WorksheetFunctions.LARGE = function (argArray, ctx) {
    var valArray = [];
    var initialRef = argArray[0](ctx);
    var numIndex = Math.floor(argArray[1](ctx).num(ctx));
    var curCtx = ctx;
    argArray[0](ctx).each(function () {
        valArray.push(this.num(curCtx));
    });
    valArray = valArray.sort(function (a, b) {
        if (b < a)
            return -1;
        if (b > a)
            return 1;
        return 0;
    });
    if (numIndex > valArray.length)
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx, 'LARGE had index greater than array size');
    return jsCalcValue.NumValue(valArray[numIndex - 1]);
};
WorksheetFunctions.NOT = function (argArray, ctx) {
    var Bval = argArray[0](ctx).b(ctx);
    var Vval = argArray[0](ctx).v();
    return jsCalcValue.BooleanValue(!Bval);
};
WorksheetFunctions.ROW = function (argArray, ctx) {
    var row = argArray[0](ctx).index(1, 1).getSingleCellReference().row;
    if (row) {
        return jsCalcValue.NumValue(row);
    }
};
WorksheetFunctions.INDEX = function (argArray, ctx) {
    var targ = argArray[0](ctx);
    var ind = argArray[1](ctx).num(ctx);
    if (argArray[2]) {
        var ind2 = argArray[2](ctx).num(ctx);
        if (targ.h == 1) {
            return targ.index(ind2, ctx);
        } else if (targ.w == 1) {
            return targ.index(ind, ctx);
        } else {
            return targ.index(ind, ind2, ctx);
        }
    } else {
        return targ.index(ind, ctx);
    }
};
WorksheetFunctions.ISERROR = function (argArray, ctx) {
    var testVal = argArray[0](ctx).v(ctx);
    if (testVal.errorContext) {
        ctx.errorStatus = null;
        return jsCalcValue.BooleanValue(true);
    } else
        return jsCalcValue.BooleanValue(false);
};
WorksheetFunctions.ISBLANK = function (argArray, ctx) {
    var testVal = argArray[0](ctx).v();
    return jsCalcValue.BooleanValue(!testVal);
};
WorksheetFunctions.IFERROR = function (argArray, ctx) {
    var testVal = argArray[0](ctx).v(ctx);
    if (testVal.errorContext) {
        ctx.errorStatus = null;
        return argArray[1](ctx);
    } else
        return argArray[0](ctx);
};
WorksheetFunctions.VLOOKUP = function (argArray, ctx) {
    var exact = false;
    if (argArray[3])
        exact = !argArray[3](ctx).b(ctx);
    var colOffset = argArray[2](ctx).num(ctx);
    var testRange = argArray[1](ctx);
    if (exact) {
        var out = null;
        var testValue = argArray[0](ctx).s(ctx);
        var isNumber = !isNaN(testValue);
        for (var i = 0; i < testRange.h; i++) {
            var curTestCell = testRange.index(1 + i, 1).getSingleCellReference();
            if (!curTestCell.isBlank) {
                var curTestVal = curTestCell.s();
                var curIsNumber = !isNaN(curTestVal);
                if (isNumber || curIsNumber) {
                    if (curTestVal == testValue) {
                        out = testRange.index(1 + i, colOffset);
                        break;
                    }
                } else {
                    if (curTestVal.toLowerCase() == testValue.toLowerCase()) {
                        out = testRange.index(1 + i, colOffset);
                        break;
                    }
                }
            }
        }
    } else {
        var out = null;
        var last = null;
        var testValue = argArray[0](ctx).num(ctx);
        var isNumber = !isNaN(testValue);
        if (!isNumber) {
            testValue = argArray[0](ctx).s(ctx);
        }
        for (var i = 0; i < testRange.h; i++) {
            var curTestVal = testRange.index(i + 1, 1).num(ctx);
            var curIsNumber = !isNaN(curTestVal);
            if (!curIsNumber) {
                var curTestVal = testRange.index(i + 1, 1).s(ctx);
            }
            if (isNumber || curIsNumber) {
                if (curTestVal == testValue) {
                    out = testRange.index(i + 1, colOffset);
                    break;
                } else if (curTestVal > testValue) {
                    out = last;
                    break;
                }
            } else {
                if (curTestVal.toLowerCase() > testValue.toLowerCase()) {
                    out = testRange.index(i, colOffset);
                    break;
                }
            }
            last = testRange.index(i + 1, colOffset);
        }
        if (out == null) {
            out = testRange.index(testRange.h, colOffset);
        }
    }
    if (out) {
        return out;
    } else {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, 'VLOOKUP didn\'t find valid result');
    }
};
WorksheetFunctions.HLOOKUP = function (argArray, ctx) {
    var exact = false;
    if (argArray[3])
        exact = !argArray[3](ctx).b(ctx);
    var rowOffset = argArray[2](ctx).num(ctx);
    var testRange = argArray[1](ctx);
    if (exact) {
        var out = null;
        var testValue = argArray[0](ctx).s(ctx);
        var isNumber = !isNaN(testValue);
        for (var i = 0; i < testRange.w; i++) {
            var curTestCell = testRange.index(1, 1 + i).getSingleCellReference();
            if (!curTestCell.isBlank) {
                var curTestVal = curTestCell.s();
                var curIsNumber = !isNaN(curTestVal);
                if (isNumber || curIsNumber) {
                    if (curTestVal == testValue) {
                        out = testRange.index(rowOffset, 1 + i);
                        break;
                    }
                } else {
                    if (curTestVal.toLowerCase() == testValue.toLowerCase()) {
                        out = testRange.index(rowOffset, 1 + i);
                        break;
                    }
                }
            }
        }
    } else {
        var out = null;
        var last = null;
        var testValue = argArray[0](ctx).num(ctx);
        var isNumber = !isNaN(testValue);
        if (!isNumber) {
            testValue = argArray[0](ctx).s(ctx);
        }
        for (var i = 0; i < testRange.w; i++) {
            var curTestVal = testRange.index(1, 1 + i).num(ctx);
            var curIsNumber = !isNaN(curTestVal);
            if (!curIsNumber) {
                var curTestVal = testRange.index(1, i + 1).s(ctx);
            }
            if (isNumber || curIsNumber) {
                if (curTestVal == testValue) {
                    out = testRange.index(rowOffset, i + 1);
                    break;
                } else if (curTestVal > testValue) {
                    out = last;
                    break;
                }
            } else {
                if (curTestVal.toLowerCase() > testValue.toLowerCase()) {
                    out = testRange.index(rowOffset, i);
                    break;
                }
            }
            last = testRange.index(rowOffset, i + 1);
        }
        if (out == null) {
            out = testRange.index(rowOffset, testRange.w);
        }
    }
    if (out) {
        return out;
    } else {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, 'HLOOKUP didn\'t find valid result');
    }
};
WorksheetFunctions.ABS = function (argArray, ctx) {
    return jsCalcValue.NumValue(Math.abs(argArray[0](ctx).num(ctx)));
};
WorksheetFunctions.AND = function (argArray, ctx) {
    var out = true;
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        var curVal = curRange.each(function () {
            out = out && this.b(curCtx);
        });
    }
    return jsCalcValue.BooleanValue(out);
};
WorksheetFunctions.OR = function (argArray, ctx) {
    var out = false;
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        var curVal = curRange.each(function () {
            out = out || this.b(curCtx);
        });
    }
    return jsCalcValue.BooleanValue(out);
};
WorksheetFunctions.IFNA = function (argArray, ctx) {
    var testVal = argArray[0](ctx).v(ctx);
    if (testVal.errorContext) {
        ctx.errorStatus = null;
        return argArray[1](ctx);
    } else
        return argArray[0](ctx);
};
WorksheetFunctions.AVERAGE = function (argArray, ctx) {
    var out = 0;
    var count = 0;
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        var curVal = curRange.each(function () {
            count = count + 1;
            out = out + this.num(curCtx);
        });
    }
    if (count == 0) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.divideByZero, ctx, 'AVERAGE had divided by zero Value');
    }
    return jsCalcValue.NumValue(out / count);
};
WorksheetFunctions.CHOOSE = function (argArray, ctx) {
    var choice = argArray[0](ctx).num(ctx);
    return argArray[choice](ctx);
};
var calcHelper = {};
calcHelper.createConditionFunction = function (condition) {
    if (condition.s) {
        var conditionRef = condition;
        return function (val, ctx) {
            return val.s(ctx) == conditionRef.s(ctx);
        };
    } else if (condition.toUpperCase() == 'TRUE' || condition.toUpperCase() == '=TRUE') {
        return function (val, ctx) {
            return val.b(ctx);
        };
    } else if (condition.toUpperCase() == 'FALSE' || condition.toUpperCase() == '=FALSE') {
        return function (val, ctx) {
            return !val.b(ctx);
        };
    } else {
        var regex = /^(\=|\<\=|\>\=|\<\>|\<|\>)*([0-9\.A-Za-z\*]+)$/i;
        if (regex.test(condition)) {
            var regOut = regex.exec(condition);
            var cmpNum = parseFloat(regOut[2]);
            var cmpStr = regOut[2];
            switch (regOut[1]) {
            case '<':
                return function (a, ctx) {
                    if (!isNaN(a.num(ctx))) {
                        return a.num(ctx) < cmpNum;
                    } else {
                        return a.s(ctx) < cmpStr;
                    }
                };
                break;
            case '>':
                return function (a, ctx) {
                    if (!isNaN(a.num(ctx))) {
                        return a.num(ctx) > cmpNum;
                    } else {
                        return a.s(ctx) > cmpStr;
                    }
                };
                break;
            case '>=':
                return function (a, ctx) {
                    if (!isNaN(a.num(ctx))) {
                        return a.num(ctx) >= cmpNum;
                    } else {
                        return a.s(ctx) >= cmpStr;
                    }
                };
                break;
            case '<=':
                return function (a, ctx) {
                    if (!isNaN(a.num(ctx))) {
                        return a.num(ctx) <= cmpNum;
                    } else {
                        return a.s(ctx) <= cmpStr;
                    }
                };
                break;
            case '<>':
                return function (a, ctx) {
                    if (!isNaN(a.num(ctx))) {
                        return a.num(ctx) != cmpNum;
                    } else {
                        return a.s(ctx) != cmpStr;
                    }
                };
                break;
            case '=':
            default:
                return function (a, ctx) {
                    if (!isNaN(a.num(ctx))) {
                        return a.num(ctx) == cmpNum;
                    } else {
                        if (cmpStr.indexOf('*') != -1) {
                            var newStr = '^' + cmpStr.split('*').join('');
                            var regex2 = new RegExp(newStr);
                            return regex2.test(a.s(ctx));
                        } else {
                            return a.s(ctx).toUpperCase() == cmpStr.toUpperCase();
                        }
                    }
                };
                break;
            }
        } else {
            var condString = condition;
            return function (a, ctx) {
                return a.s(ctx) == condString;
            };
        }
    }
};
WorksheetFunctions.COUNTIF = function (argArray, ctx) {
    var curCtx = ctx;
    var v2 = argArray[1](ctx);
    var curRange = argArray[0](ctx);
    curRange.each(function () {
        var tmpNum = Number(this.num(curCtx));
    });
    var range = argArray[0](ctx);
    var condition = argArray[1](ctx).s(ctx);
    var condFunc = calcHelper.createConditionFunction(condition);
    var count = 0;
    var v1 = argArray[0];
    var v2 = v1(ctx);
    var curRange = argArray[0](ctx);
    curRange.each(function () {
        var tmpNum = Number(this.num(curCtx));
    });
    var curVal = curRange.each(function () {
        var val = this;
        if (condFunc(val, ctx))
            count = count + 1;
    });
    return jsCalcValue.NumValue(count);
};
WorksheetFunctions.SUMIF = function (argArray, ctx) {
    var range = argArray[0](ctx);
    var condition = argArray[1](ctx).s(ctx);
    var condFunc = calcHelper.createConditionFunction(condition);
    var sum = 0;
    if (argArray[2]) {
        var range2 = argArray[2](ctx);
        var count = range.count > range2.count ? range2.count : range.count;
        for (var i = 0; i < count; i++) {
            var testVal = range.get(i);
            if (condFunc(testVal, ctx))
                sum = sum + range2.get(i).num(ctx);
        }
    } else {
        for (var i = 0; i < range.count; i++) {
            var testVal = range.get(i);
            if (condFunc(testVal, ctx))
                sum = sum + testVal.num(ctx);
        }
    }
    return jsCalcValue.NumValue(sum);
};
WorksheetFunctions.SUMIFS = function (argArray, ctx) {
    var sumRange = argArray[0](ctx);
    var sum = 0;
    var i = 1;
    if (argArray[i + 1]) {
        var condRange = argArray[i](ctx);
        var count = sumRange.count > condRange.count ? condRange.count : sumRange.count;
        for (var j = 0; j < count; j++) {
            i = 1;
            var condResult = true;
            while (i < argArray.length) {
                condRange = argArray[i](ctx);
                var condition = argArray[i + 1](ctx).s(ctx);
                var condFunc = calcHelper.createConditionFunction(condition);
                var testVal = condRange.get(j);
                condResult = condResult && condFunc(testVal, ctx);
                i = i + 2;
            }
            if (condResult) {
                sum = sum + sumRange.get(j).num(ctx);
            }
        }
    } else {
        for (var i = 0; i < sumRange.count; i++) {
            var testVal = sumRange.get(i);
            if (condFunc(testVal, ctx))
                sum = sum + testVal.num(ctx);
        }
    }
    return jsCalcValue.NumValue(sum);
};
WorksheetFunctions.MATCH = function (argArray, ctx) {
    var val = argArray[0](ctx);
    var range = argArray[1](ctx);
    var mode = argArray[2] ? argArray[2](ctx).num(ctx) : 0;
    if (mode < 0) {
        for (var i = 0; i < range.count; i++) {
            var testVal = range.get(i);
            var testNum = testVal.num(ctx);
            if (val.num(ctx) == testVal.num(ctx))
                return jsCalcValue.NumValue(i + 1);
            else if (val.num(ctx) > testVal.num(ctx)) {
                if (i == 0) {
                    break;
                }
                return jsCalcValue.NumValue(i);
            }
        }
        if (val.num(ctx) < testVal.num(ctx) && i != 0)
            return jsCalcValue.NumValue(i);
    } else if (mode > 0) {
        for (var i = 0; i < range.count; i++) {
            var testVal = range.get(i);
            var testNum = testVal.num(ctx);
            if (testVal.num(ctx) > val.num(ctx)) {
                if (i == 0) {
                    break;
                }
                return jsCalcValue.NumValue(i);
            }
        }
        if (val.num(ctx) >= testVal.num(ctx) && i != 0)
            return jsCalcValue.NumValue(i);
    } else {
        for (var i = 0; i < range.count; i++) {
            var testVal = range.get(i);
            var testNum = testVal.num(ctx);
            if (testVal.s(ctx) == val.s(ctx)) {
                return jsCalcValue.NumValue(i + 1);
            }
        }
    }
    return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, 'Match didn\'t find valid result');
};
WorksheetFunctions.MAX = function (argArray, ctx) {
    var max = jsCalcValue.NumValue(-99999999999999);
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        if (curRange instanceof calcCell) {
            curRange = curRange.value;
        }
        curRange.eachCell(function () {
            if (!this.isBlank)
                max = this.num(curCtx) > max.num(curCtx) ? this : max;
        });
    }
    return max;
};
WorksheetFunctions.MIN = function (argArray, ctx) {
    var min = jsCalcValue.NumValue(99999999999999);
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var v1 = argArray[i];
        var v2 = v1(ctx);
        var curRange = argArray[i](ctx);
        if (curRange instanceof calcCell) {
            curRange = curRange.value;
        }
        curRange.eachCell(function () {
            if (!this.isBlank)
                min = this.num(curCtx) < min.num(curCtx) ? this : min;
        });
    }
    return min;
};
WorksheetFunctions.NA = function (argArray, ctx) {
    return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, 'NA Function Manually Called');
};
WorksheetFunctions.NORM = {};
WorksheetFunctions.NORM.INV = function (argArray, ctx) {
    return WorksheetFunctions.NORMINV(argArray, ctx);
};
WorksheetFunctions.NORMINV = function (argArray, ctx) {
    var p = argArray[0](ctx).num(ctx);
    var mu = argArray[1](ctx).num(ctx);
    var sigma = argArray[2](ctx).num(ctx);
    var val = 0;
    if (p < 0 || p > 1) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx, 'The probability p must be greater than 0 and lower than 1');
    } else if (sigma <= 0) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx, 'The standard deviation sigma must be positive');
    } else if (mu == 0 && sigma == 1) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx, 'NORMSINV not yet implemented');
    } else {
        var q = p - 0.5;
        if (Math.abs(q) <= 0.425) {
            var r = 0.180625 - q * q;
            var a0 = 3.3871328727963665;
            var a1 = 133.14166789178438;
            var a2 = 1971.5909503065513;
            var a3 = 13731.69376550946;
            var a4 = 45921.95393154987;
            var a5 = 67265.7709270087;
            var a6 = 33430.57558358813;
            var a7 = 2509.0809287301227;
            var b0 = 1;
            var b1 = 42.31333070160091;
            var b2 = 687.1870074920579;
            var b3 = 5394.196021424751;
            var b4 = 21213.794301586597;
            var b5 = 39307.89580009271;
            var b6 = 28729.085735721943;
            var b7 = 5226.495278852854;
            val = q * (((((((a7 * r + a6) * r + a5) * r + a4) * r + a3) * r + a2) * r + a1) * r + a0) / (((((((b7 * r + b6) * r + b5) * r + b4) * r + b3) * r + b2) * r + b1) * r + b0);
        } else {
            var r = Math.sqrt(-Math.log(q > 0 ? 1 - p : p));
            if (r <= 5) {
                var a0 = 1.4234371107496835;
                var a1 = 4.630337846156546;
                var a2 = 5.769497221460691;
                var a3 = 3.6478483247632045;
                var a4 = 1.2704582524523684;
                var a5 = 0.2417807251774506;
                var a6 = 0.022723844989269184;
                var a7 = 0.0007745450142783414;
                var b0 = 1;
                var b1 = 2.053191626637759;
                var b2 = 1.6763848301838038;
                var b3 = 0.6897673349851;
                var b4 = 0.14810397642748008;
                var b5 = 0.015198666563616457;
                var b6 = 0.0005475938084995345;
                var b7 = 1.0507500716444169e-9;
                var r1 = r - 1.6;
                val = (((((((a7 * r1 + a6) * r1 + a5) * r1 + a4) * r1 + a3) * r1 + a2) * r1 + a1) * r1 + a0) / (((((((b7 * r1 + b6) * r1 + b5) * r1 + b4) * r1 + b3) * r1 + b2) * r1 + b1) * r1 + b0);
            } else {
                var a0 = 6.657904643501103;
                var a1 = 5.463784911164114;
                var a2 = 1.7848265399172913;
                var a3 = 0.29656057182850487;
                var a4 = 0.026532189526576124;
                var a5 = 0.0012426609473880784;
                var a6 = 0.000027115555687434876;
                var a7 = 2.0103343992922881e-7;
                var b0 = 1;
                var b1 = 0.599832206555888;
                var b2 = 0.1369298809227358;
                var b3 = 0.014875361290850615;
                var b4 = 0.0007868691311456133;
                var b5 = 0.000018463183175100548;
                var b6 = 1.421511758316446e-7;
                var b7 = 2.0442631033899397e-15;
                var r1 = r - 5;
                val = (((((((a7 * r1 + a6) * r1 + a5) * r1 + a4) * r1 + a3) * r1 + a2) * r1 + a1) * r1 + a0) / (((((((b7 * r1 + b6) * r1 + b5) * r1 + b4) * r1 + b3) * r1 + b2) * r1 + b1) * r1 + b0);
            }
            if (q < 0) {
                val = -val;
            }
        }
    }
    return jsCalcValue.NumValue(sigma * val + mu);
};
WorksheetFunctions.NORM.DIST = function (argArray, ctx) {
    return WorksheetFunctions.NORMDIST(argArray, ctx);
};
WorksheetFunctions.NORMDIST = function (argArray, ctx) {
    var x = argArray[0](ctx).num(ctx);
    var mu = argArray[1](ctx).num(ctx);
    var sigma = argArray[2](ctx).num(ctx);
    var cum = argArray[3](ctx).b(ctx);
    return jsCalcValue.NumValue(stdNormal((x - mu) / sigma));
};
function stdNormal(z) {
    var j, k, kMax, m, values, total, subtotal, item, z2, z4, a, b;
    if (z < -6) {
        return 0;
    }
    if (z > 6) {
        return 1;
    }
    m = 1;
    b = z;
    z2 = z * z;
    z4 = z2 * z2;
    values = [];
    for (k = 0; k < 100; k += 2) {
        a = 2 * k + 1;
        item = b / (a * m);
        item *= 1 - a * z2 / ((a + 1) * (a + 2));
        values.push(item);
        m *= 4 * (k + 1) * (k + 2);
        b *= z4;
    }
    total = 0;
    for (k = 49; k >= 0; k--) {
        total += values[k];
    }
    return 0.5 + 0.3989422804014327 * total;
}
WorksheetFunctions.NETWORKDAYS = function (argArray, ctx) {
    var rawStartDate = TimeToJavaScript(argArray[0](ctx).num(ctx));
    var rawEndDate = TimeToJavaScript(argArray[1](ctx).num(ctx));
    var startDate = new Date(rawStartDate);
    var endDate = new Date(rawEndDate);
    var haveHolidays = argArray.length > 2;
    var numHolidays = haveHolidays ? argArray[2](ctx).count : 0;
    var excelHolidays = haveHolidays ? argArray[2](ctx) : 0;
    var holidays = [];
    for (var i = 0; i < numHolidays; i++) {
        var newHoliday = new Date(TimeToJavaScript(excelHolidays.get(i).num(ctx)));
        newHoliday.setHours(12);
        newHoliday.setMinutes(0);
        newHoliday.setSeconds(0);
        holidays.push(newHoliday.valueOf());
    }
    startDate.setHours(12);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    endDate.setHours(12);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        var skipHoliday = false;
        for (var i = 0; i < numHolidays; i++) {
            skipHoliday = haveHolidays && holidays[i] == curDate.valueOf();
            if (skipHoliday) {
                break;
            }
        }
        if (!(dayOfWeek == 6 || dayOfWeek == 0) && !skipHoliday) {
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
        curDate.setHours(12);
        curDate.setMinutes(0);
        curDate.setSeconds(0);
    }
    return jsCalcValue.NumValue(count);
};
WorksheetFunctions.NOW = function (argArray, ctx) {
    var d = new Date();
    var localOffset = d.getTimezoneOffset() * 60 * 1000;
    return jsCalcValue.NumValue(TimeToExcel(Date.now() - localOffset));
};
WorksheetFunctions.TODAY = function (argArray, ctx) {
    var d = new Date();
    var localOffset = d.getTimezoneOffset() * 60 * 1000;
    return jsCalcValue.NumValue(Math.floor(TimeToExcel(Date.now() - localOffset)));
};
WorksheetFunctions.DAY = function (argArray, ctx) {
    var time = argArray[0](ctx).num(ctx);
    var date = new Date();
    date.setTime(TimeToJavaScript(time));
    return jsCalcValue.NumValue(date.getDate());
};
WorksheetFunctions.DATE = function (argArray, ctx) {
    var year = argArray[0](ctx).num(ctx);
    var month = argArray[1](ctx).num(ctx);
    var day = argArray[2](ctx).num(ctx);
    var date = new Date();
    date.setMonth(month - 1);
    date.setFullYear(year);
    date.setDate(day);
    return jsCalcValue.NumValue(TimeToExcel(date.getTime()));
};
WorksheetFunctions.MONTH = function (argArray, ctx) {
    var time = argArray[0](ctx).num(ctx);
    var date = new Date();
    date.setTime(TimeToJavaScript(time));
    return jsCalcValue.NumValue(date.getMonth() + 1);
};
WorksheetFunctions.EOMONTH = function (argArray, ctx) {
    var time = argArray[0](ctx).num(ctx);
    var offset = argArray.length > 1 ? argArray[1](ctx).num(ctx) : 0;
    var date = new Date();
    date.setTime(TimeToJavaScript(time));
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var nextMonth = month + offset + 1;
    date.setMonth(nextMonth);
    date.setDate(1);
    var newTime = date.getTime();
    newTime = newTime - 86400000;
    date.setTime(newTime);
    return jsCalcValue.NumValue(TimeToExcel(date.getTime()));
};
WorksheetFunctions.YEAR = function (argArray, ctx) {
    var time = argArray[0](ctx).num(ctx);
    var date = new Date();
    date.setTime(TimeToJavaScript(time));
    return jsCalcValue.NumValue(date.getFullYear());
};
WorksheetFunctions.WEEKDAY = function (argArray, ctx) {
    var time = argArray[0](ctx).num(ctx);
    var date = new Date();
    date.setTime(TimeToJavaScript(time));
    return jsCalcValue.NumValue(date.getDay() + 1);
};
Date.prototype.getWeek = function (startDay) {
    var excelStartDay = 7;
    switch (startDay) {
    case 1:
        excelStartDay = 7;
        break;
    case 2:
        excelStartDay = 1;
        break;
    case 11:
        excelStartDay = 1;
        break;
    case 12:
        excelStartDay = 2;
        break;
    case 13:
        excelStartDay = 3;
        break;
    case 14:
        excelStartDay = 4;
        break;
    case 15:
        excelStartDay = 5;
        break;
    case 16:
        excelStartDay = 6;
        break;
    case 17:
        excelStartDay = 7;
        break;
    case 21:
        excelStartDay = 1;
        break;
    default:
        excelStartDay = 7;
        break;
    }
    var target = new Date(this.valueOf());
    var dayNr = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstDay = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != excelStartDay) {
        target.setMonth(0, 1 + (excelStartDay - target.getDay() + 7) % 7);
    }
    return 1 + Math.ceil((firstDay - target) / 604800000);
};
WorksheetFunctions.WEEKNUM = function (argArray, ctx) {
    var time = argArray[0](ctx).num(ctx);
    var date = new Date();
    date.setTime(TimeToJavaScript(time));
    var startDay = argArray.length > 2 ? argArray[2](ctx).num(ctx) : 1;
    return jsCalcValue.NumValue(date.getWeek(startDay));
};
var TimeToExcel = function (time) {
    return time / 86400 / 1000 + 25569;
};
var TimeToJavaScript = function (time) {
    return (time - (25567 + 1)) * 86400 * 1000;
};
WorksheetFunctions.STDEV = {};
WorksheetFunctions.STDEV.P = function (argArray, ctx) {
    return WorksheetFunctions.STDEVP(argArray, ctx);
};
WorksheetFunctions.STDEVP = function (argArray, ctx) {
    var mean = 0;
    var count = 0;
    var SSD = 0;
    var nodes = argArray[0](ctx);
    var curCtx = ctx;
    for (var i = 0; i < argArray.length; i++) {
        var curRange = argArray[i](ctx);
        curRange.each(function () {
            mean += this.num(curCtx);
            count += 1;
        });
    }
    mean /= count;
    for (var i = 0; i < argArray.length; i++) {
        var curRange = argArray[i](ctx);
        curRange.each(function () {
            SSD += Math.pow(this.num(curCtx) - mean, 2);
        });
    }
    SSD = SSD /= count;
    var rootPart = Math.sqrt(SSD);
    return jsCalcValue.NumValue(rootPart);
};
WorksheetFunctions.SUMPRODUCT = function (argArray, ctx) {
    var range = argArray[0](ctx);
    var sum = 0;
    if (argArray[1]) {
        var range2 = argArray[1](ctx);
        var count = range.count > range2.count ? range2.count : range.count;
        for (var i = 0; i < count; i++) {
            sum += range.get(i).num(ctx) * range2.get(i).num(ctx);
        }
    } else {
        return WorksheetFunctions.SUM(argArray, ctx);
    }
    return jsCalcValue.NumValue(sum);
};
WorksheetFunctions.FLOOR = function (argArray, ctx) {
    var num = argArray[0](ctx).num(ctx);
    var multiple = 1;
    if (argArray[1])
        multiple = argArray[1](ctx).num(ctx);
    var roundDown = num % multiple;
    num = num - roundDown;
    return jsCalcValue.NumValue(num);
};
WorksheetFunctions.ROUND = function (argArray, ctx) {
    var num = argArray[0](ctx).num(ctx);
    var numPlaces = 0;
    if (argArray[1])
        numPlaces = argArray[1](ctx).num(ctx);
    var mult = Math.pow(10, numPlaces);
    num *= mult;
    num = Math.round(num);
    num /= mult;
    return jsCalcValue.NumValue(num);
};
WorksheetFunctions.MROUND = function (argArray, ctx) {
    var num = argArray[0](ctx).num(ctx);
    var multiple = 1;
    if (argArray[1])
        multiple = argArray[1](ctx).num(ctx);
    if (num < 0 && multiple > 0 || num > 0 && multiple < 0) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx, 'Arguments must have the same sign');
    }
    var offset;
    offset = num % (multiple - 5e-17);
    if (offset < multiple / 2) {
        num = num - Math.abs(offset);
    } else {
        num = num + Math.abs(offset);
    }
    return jsCalcValue.NumValue(num);
};
WorksheetFunctions.ROUNDDOWN = function (argArray, ctx) {
    var num = argArray[0](ctx).num(ctx);
    var sign = num < 0 ? -1 : 1;
    num = Math.abs(num);
    var numPlaces = 0;
    if (argArray[1])
        numPlaces = argArray[1](ctx).num(ctx);
    var mult = Math.pow(10, numPlaces);
    num *= mult;
    num = Math.floor(num);
    num /= mult;
    num *= sign;
    return jsCalcValue.NumValue(num);
};
WorksheetFunctions.ROUNDUP = function (argArray, ctx) {
    var num = argArray[0](ctx).num(ctx);
    var sign = num < 0 ? -1 : 1;
    num = Math.abs(num);
    var numPlaces = 0;
    if (argArray[1])
        numPlaces = argArray[1](ctx).num(ctx);
    var mult = Math.pow(10, numPlaces);
    num *= mult;
    num = Math.ceil(num);
    num /= mult;
    num *= sign;
    return jsCalcValue.NumValue(num);
};
WorksheetFunctions.RANK = function (argArray, ctx) {
    var testVal = argArray[0](ctx).num(ctx);
    var range = argArray[1](ctx);
    var order = 0;
    if (argArray[2])
        order = argArray[2](ctx).num(ctx);
    var greaterCount = 0;
    var lessCount = 0;
    for (var i = 0; i < range.count; i++) {
        var testNum = range.get(i).num(ctx);
        if (testNum > testVal)
            greaterCount++;
        else if (testNum < testVal)
            lessCount++;
    }
    return order ? jsCalcValue.NumValue(lessCount + 1) : jsCalcValue.NumValue(greaterCount + 1);
};
WorksheetFunctions.OFFSET = function (argArray, ctx) {
    var curRange = argArray[0](ctx);
    var moveRowsBy = argArray[1](ctx).num(ctx);
    var moveColsBy = argArray[2](ctx).num(ctx);
    var numRowsToReturn = argArray[3] ? argArray[3](ctx).num(ctx) : 0;
    numRowsToReturn = numRowsToReturn > 0 ? numRowsToReturn - 1 : numRowsToReturn < 0 ? numRowsToReturn + 1 : numRowsToReturn;
    var numColsToReturn = argArray[4] ? argArray[4](ctx).num(ctx) : 0;
    numColsToReturn = numColsToReturn > 0 ? numColsToReturn - 1 : numColsToReturn < 0 ? numColsToReturn + 1 : numColsToReturn;
    var targetRangeStartRow = curRange.startRow + moveRowsBy || 0, targetRangeStartCol = curRange.startCol + moveColsBy || 0, targetRangeEndRow = targetRangeStartRow + numRowsToReturn || 0, targetRangeEndCol = targetRangeStartCol + numColsToReturn || 0, targetRangeSheetName = curRange.targetSheetOb.name || '';
    var targetRange = jsCalcValue.ReferenceValue(targetRangeStartRow, targetRangeStartCol, targetRangeEndRow, targetRangeEndCol, ctx, targetRangeSheetName);
    if (ctx.origValue == '[object Object]')
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.ref, ctx, 'non-existent range on the worksheet');
    return targetRange;
};
WorksheetFunctions.NPV = function (argArray, ctx) {
    var rate = argArray[0](ctx).num(ctx);
    var value = 0;
    for (var j = 1; j < argArray.length; j++) {
        if (argArray[j](ctx) instanceof calcCell) {
            value += argArray[j](ctx).num(ctx) / Math.pow(1 + rate, j);
        } else {
            var idx = 0;
            argArray[j](ctx).eachCell(function () {
                value += this.num(ctx) / Math.pow(1 + rate, j + idx);
                idx++;
            });
        }
    }
    return jsCalcValue.NumValue(value);
};
WorksheetFunctions.FORECAST = function (argArray, ctx) {
    var x = argArray[0](ctx).num(ctx), data_y_ranges = argArray[1](ctx), data_x_ranges = argArray[2](ctx), data_y = [], data_x = [];
    for (var i = 0; i < data_y_ranges.count; i++) {
        if (data_y_ranges.get(i).v(ctx).errorContext) {
            break;
        }
        data_y.push(data_y_ranges.get(i).num(ctx) || 0);
    }
    for (var i = 0; i < data_x_ranges.count; i++) {
        if (data_x_ranges.get(i).v(ctx).errorContext) {
            break;
        }
        data_x.push(data_x_ranges.get(i).num(ctx) || 0);
    }
    var xmean = getMean(data_x);
    var ymean = getMean(data_y);
    var n = data_x.length;
    var num = 0;
    var den = 0;
    for (var i = 0; i < n; i++) {
        num += (data_x[i] - xmean) * (data_y[i] - ymean);
        den += Math.pow(data_x[i] - xmean, 2);
    }
    var b = num / den;
    var a = ymean - b * xmean;
    return jsCalcValue.NumValue(a + b * x);
};
function getMean(dataArr) {
    var sum = 0;
    for (var i = 0; i < dataArr.length; i++) {
        sum += dataArr[i];
    }
    return sum / dataArr.length;
}
WorksheetFunctions.VALUE = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx);
    return jsCalcValue.StringValue(text);
};
WorksheetFunctions.LEFT = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx), num = argArray[1] && argArray[1](ctx) && argArray[1](ctx).num(ctx) ? argArray[1](ctx).num(ctx) : 1;
    text = text ? text.substring(0, num) : null;
    return jsCalcValue.StringValue(text);
};
WorksheetFunctions.RIGHT = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx), num = argArray[1] && argArray[1](ctx) && argArray[1](ctx).num(ctx) ? argArray[1](ctx).num(ctx) : 1;
    text = text ? text.substring(text.length - num) : null;
    return jsCalcValue.StringValue(text);
};
WorksheetFunctions.LEN = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx);
    if (typeof text === 'undefined' || text.errorContext) {
        return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating length');
    }
    if (typeof text === 'string') {
        return jsCalcValue.NumValue(text ? text.length : 0);
    }
    if (text.length) {
        return jsCalcValue.NumValue(text.length);
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating length');
};
WorksheetFunctions.SUBSTITUTE = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx), oldText = argArray[1] ? argArray[1](ctx).s(ctx) : '', newText = argArray[2] ? argArray[2](ctx).s(ctx) : '', occurence = argArray[3] ? argArray[3](ctx).num(ctx) : undefined;
    if (typeof text === 'undefined' || typeof oldText === 'undefined' || typeof newText === 'undefined' || text.errorContext || oldText.errorContext || newText.errorContext) {
        return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in substitute function');
    } else if (occurence === undefined) {
        var outVal = text.replace(new RegExp(oldText, 'g'), newText);
        return jsCalcValue.StringValue(outVal);
    } else {
        var index = 0;
        var i = 0;
        while (text.indexOf(oldText, index) > 0) {
            index = text.indexOf(oldText, index + 1);
            i++;
            if (i === occurence) {
                var outVal = text.substring(0, index) + newText + text.substring(index + oldText.length);
                return jsCalcValue.StringValue(outVal);
            }
        }
    }
};
WorksheetFunctions.IRR = function (argArray, ctx) {
    var values = argArray[0](ctx);
    var guess = argArray[1] ? argArray[1](ctx).num(ctx) : 0;
    var valuesArray = [], hasError = false;
    for (var i = 0; i < values.count; i++) {
        if (values.get(i).v(ctx).errorContext) {
            hasError = true;
            break;
        }
        valuesArray.push(values.get(i).num(ctx) || 0);
    }
    if (hasError) {
        return jsCalcValue.jsCalcErrorValue(values, ctx, 'Error in calculating IRR');
    }
    var irrResult = function (values, dates, rate) {
        var r = rate + 1;
        var result = values[0];
        for (var i = 1; i < values.length; i++) {
            result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
        }
        return result;
    };
    var irrResultDeriv = function (values, dates, rate) {
        var r = rate + 1;
        var result = 0;
        for (var i = 1; i < values.length; i++) {
            var frac = (dates[i] - dates[0]) / 365;
            result -= frac * values[i] / Math.pow(r, frac + 1);
        }
        return result;
    };
    var dates = [];
    var positive = false;
    var negative = false;
    for (var i = 0; i < valuesArray.length; i++) {
        dates[i] = i === 0 ? 0 : dates[i - 1] + 365;
        if (valuesArray[i] > 0) {
            positive = true;
        }
        if (valuesArray[i] < 0) {
            negative = true;
        }
    }
    if (!positive || !negative) {
        return jsCalcValue.jsCalcErrorValue(values, ctx, 'Error in calculating IRR');
    }
    guess = guess === undefined ? 0.1 : guess;
    var resultRate = guess;
    var epsMax = 1e-10;
    var newRate, epsRate, resultValue;
    var contLoop = true;
    do {
        resultValue = irrResult(valuesArray, dates, resultRate);
        newRate = resultRate - resultValue / irrResultDeriv(valuesArray, dates, resultRate);
        epsRate = Math.abs(newRate - resultRate);
        resultRate = newRate;
        contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop);
    return jsCalcValue.NumValue(resultRate);
};
function ExcelDateToJSDate(date) {
    return new Date((date - 25569) * 86400 * 1000);
}
WorksheetFunctions.TEXT = function (argArray, ctx) {
    var value = argArray[0](ctx).s(ctx);
    var format = argArray[1](ctx).s(ctx);
    format = format.toUpperCase();
    var convertedDateValue = null;
    if ((format.indexOf('D') != -1 || format.indexOf('M') != -1 || format.indexOf('Y') != -1 || format.indexOf('H') != -1 || format.indexOf('S') != -1) && (moment(value, 'MM/DD/YYYY').isValid() || moment(value, 'DD/MM/YYYY').isValid() || moment(value, 'MM-DD-YYYY').isValid() || moment(value, 'DD-MM-YYYY').isValid())) {
        if (moment(value, 'MM-DD-YYYY').isValid()) {
            convertedDateValue = moment(value, 'MM-DD-YYYY').format('MM/DD/YYYY');
        } else if (moment(value, 'DD/MM/YYYY').isValid()) {
            convertedDateValue = moment(value, 'DD/MM/YYYY').format('MM/DD/YYYY');
        } else if (moment(value, 'DD-MM-YYYY').isValid()) {
            convertedDateValue = moment(value, 'DD-MM-YYYY').format('MM/DD/YYYY');
        } else {
            convertedDateValue = value;
        }
        var actualDate = new Date(convertedDateValue);
        var dateToMinus = new Date('12/30/1899');
        var diffTime = Math.abs(actualDate - dateToMinus);
        value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    var weekFull = [
        'Sunday',
        'Xonday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    var weekPartial = [
        'Sun',
        'Xon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];
    var monthsFull = [
        'January',
        'February',
        'Xarch',
        'April',
        'Xay',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    var monthsPartial = [
        'Jan',
        'Feb',
        'Xar',
        'Apr',
        'Xay',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    var stringOutput = value;
    var regex = /([0#],+)$/i;
    if (regex.test(format)) {
        var regOut = regex.exec(format);
        var offset = regOut[0].length - 1;
        var scale = Math.pow(1000, offset);
        value /= scale;
        format = format.substring(0, format.length - offset);
    }
    var updatedFormat = format;
    regex = /((m+)(.*)(d+)|(d+)(.*)(m+))/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var regOut = regex.exec(updatedFormat);
        var zDFmt = updatedFormat.indexOf('DD') != -1 ? '00' : '0';
        var zMFmt = updatedFormat.indexOf('MM') != -1 ? '00' : '0';
        var dateFormat = date.getUTCDate() < 10 && zDFmt == '00' ? updatedFormat.replace(/(d+)/i, '0' + numeral$2(date.getUTCDate()).format(zDFmt)) : updatedFormat.replace(/(d+)/i, numeral$2(date.getUTCDate()).format(zDFmt));
        var dateMonthFormat = date.getUTCMonth() + 1 < 10 && zMFmt == '00' ? dateFormat.replace(/(m+)/i, '0' + numeral$2(date.getUTCMonth() + 1).format(zMFmt)) : dateFormat.replace(/(m+)/i, numeral$2(date.getUTCMonth() + 1).format(zMFmt));
        updatedFormat = dateMonthFormat;
    }
    regex = /(y+)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var regOut = regex.exec(updatedFormat);
        var fullYear = date.getUTCFullYear().toString();
        var partialYear = fullYear.substring(fullYear.length - 2, fullYear.length);
        var yearFormat = updatedFormat.replace(/(y+)/i, regOut[0].length == 2 ? partialYear : fullYear);
        updatedFormat = yearFormat;
    }
    regex = /(h+)(.*)[^ap](m+)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var regOut = regex.exec(updatedFormat);
        var zMFmt = updatedFormat.indexOf('MM') != -1 ? '00' : '0';
        var minuteFormat = date.getUTCMinutes() < 10 && zMFmt == '00' ? updatedFormat.replace(/(m+)/i, '0' + numeral$2(date.getUTCMinutes()).format(zMFmt)) : updatedFormat.replace(/(m+)/i, numeral$2(date.getUTCMinutes()).format(zMFmt));
        updatedFormat = minuteFormat;
    }
    regex = /(h+)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var regOut = regex.exec(updatedFormat);
        var hours = date.getUTCHours() % 12;
        var am = date.getUTCHours() < 12 ? 1 : 0;
        var hours24 = 1;
        hours = hours == 0 ? 12 : hours;
        var zHFmt = updatedFormat.indexOf('HH') != -1 ? '00' : '0';
        var ampmRegex = /(am)(.*)(pm)/i;
        if (ampmRegex.test(updatedFormat)) {
            hours24 = 0;
            var regOut = ampmRegex.exec(updatedFormat);
            var ampmFormat = updatedFormat.replace(/(am)(.*)(pm)/i, am ? 'AM' : 'PM');
            updatedFormat = ampmFormat;
        }
        var apRegex = /(a)(.*)(p)/i;
        if (apRegex.test(updatedFormat)) {
            hours24 = 0;
            var regOut = apRegex.exec(updatedFormat);
            var apFormat = updatedFormat.replace(/(a)(.*)(p)/i, am ? 'A' : 'P');
            updatedFormat = apFormat;
        }
        var hourFormat = (hours24 ? date.getUTCHours() < 10 && zHFmt == '00' : hours < 10 && zHFmt == '00') ? updatedFormat.replace(/(h+)/i, hours24 ? '0' + numeral$2(date.getUTCHours()).format(zHFmt) : '0' + numeral$2(hours).format(zHFmt)) : updatedFormat.replace(/(h+)/i, hours24 ? numeral$2(date.getUTCHours()).format(zHFmt) : numeral$2(hours).format(zHFmt));
        updatedFormat = hourFormat;
    }
    regex = /[s\x2e]0+/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var regOut = regex.exec(updatedFormat);
        var zSFmt = regOut[0];
        var secondFormat = updatedFormat.replace(/[s\x2e]0+/i, numeral$2(date.getUTCMilliseconds() / 1000).format(zSFmt));
        updatedFormat = secondFormat;
    }
    regex = /(s+)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var regOut = regex.exec(updatedFormat);
        var roundedSeconds = date.getUTCSeconds() + Math.round(date.getUTCMilliseconds() / 1000);
        var zSFmt = updatedFormat.indexOf('SS') != -1 ? '00' : '0';
        var secondFormat = roundedSeconds < 10 && zSFmt == '00' ? updatedFormat.replace(/(s+)/i, '0' + numeral$2(roundedSeconds).format(zSFmt)) : updatedFormat.replace(/(s+)/i, numeral$2(roundedSeconds).format(zSFmt));
        updatedFormat = secondFormat;
    }
    regex = /(mmmmm)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var mmmmmFormat = updatedFormat.replace(/(mmmmm)/i, monthsFull[date.getUTCMonth()].toString().substring(0, 1));
        updatedFormat = mmmmmFormat;
    }
    regex = /(mmmm)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var mmmmFormat = updatedFormat.replace(/(mmmm)/i, monthsFull[date.getUTCMonth()]);
        updatedFormat = mmmmFormat;
    }
    regex = /(mmm)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var mmmFormat = updatedFormat.replace(/(mmm)/i, monthsPartial[date.getUTCMonth()]);
        updatedFormat = mmmFormat;
    }
    regex = /(mm|^m|[^ap][m])/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var zMFmt = updatedFormat.indexOf('MM') != -1 ? '00' : '0';
        var mmFormat = date.getUTCMonth() + 1 < 10 && zMFmt == '00' ? updatedFormat.replace(/(mm|^m|[^ap][m])/i, '0' + numeral$2(date.getUTCMonth() + 1).format(zMFmt)) : updatedFormat.replace(/(mm|^m|[^ap][m])/i, numeral$2(date.getUTCMonth() + 1).format(zMFmt));
        updatedFormat = mmFormat;
    }
    regex = /(dddd)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var ddddFormat = updatedFormat.replace(/(dddd)/i, weekFull[date.getUTCDay()]);
        updatedFormat = ddddFormat;
    }
    regex = /(ddd)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var dddFormat = updatedFormat.replace(/(ddd)/i, weekPartial[date.getUTCDay()]);
        updatedFormat = dddFormat;
    }
    regex = /(dd|^d)/i;
    if (regex.test(updatedFormat)) {
        var date = ExcelDateToJSDate(parseFloat(value));
        var zDFmt = updatedFormat.indexOf('DD') != -1 ? '00' : '0';
        var ddFormat = date.getUTCDate() < 10 && zDFmt == '00' ? updatedFormat.replace(/(dd|^d)/i, '0' + numeral$2(date.getUTCDate()).format(zDFmt)) : updatedFormat.replace(/(dd|^d)/i, numeral$2(date.getUTCDate()).format(zDFmt));
        updatedFormat = ddFormat;
    }
    updatedFormat = updatedFormat.replace('Xonday', 'Monday');
    updatedFormat = updatedFormat.replace('Xon', 'Mon');
    updatedFormat = updatedFormat.replace('Xarch', 'March');
    updatedFormat = updatedFormat.replace('Xay', 'May');
    updatedFormat = updatedFormat.replace('Xar', 'Mar');
    updatedFormat = updatedFormat.replace('X', 'M');
    stringOutput = updatedFormat;
    if (format.indexOf('D') != -1 || format.indexOf('M') != -1 || format.indexOf('Y') != -1 || format.indexOf('H') != -1 || format.indexOf('S') != -1) {
        var date = ExcelDateToJSDate(parseFloat(value));
        if (format.indexOf('M') != -1) {
            
        }
        
    } else if (format.indexOf('E') != -1) {
        if (ctx && ctx.origValue) {
            stringOutput = String(ctx.origValue);
        } else {
            var originalnum = '';
            if (value && value.indexOf('.') !== -1) {
                value = roundNum(value, 0.01);
                originalnum = value;
                value = String(value).replace('.', '');
            }
            var numberOfDigitsBeforeDot = format.split('.')[0].length;
            var numberOfDigitsAfterDot = format.split('.')[1].split('E')[0].length;
            stringOutput = formatNum(numberOfDigitsBeforeDot, numberOfDigitsAfterDot, String(parseFloat(value)), String(originalnum));
        }
    } else {
        stringOutput = numeral$2(value).format(format);
    }
    return jsCalcValue.StringValue(stringOutput);
};
WorksheetFunctions.TRIM = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx);
    if (typeof text === 'undefined' || text.errorContext) {
        return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in trimming string');
    }
    if (typeof text === 'string') {
        var tmptext = text.replace(/\s+/g, ' ');
        return jsCalcValue.StringValue(tmptext.trim());
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in trimming string');
};
WorksheetFunctions.INT = function (argArray, ctx) {
    var val = Math.floor(argArray[0](ctx).num(ctx));
    return jsCalcValue.NumValue(val);
};
WorksheetFunctions.MOD = function (argArray, ctx) {
    var val1 = argArray[0](ctx).num(ctx);
    var val2 = argArray[1](ctx).num(ctx);
    var mod = val1 % val2;
    return jsCalcValue.NumValue(mod);
};
WorksheetFunctions.PI = function (argArray, ctx) {
    return jsCalcValue.NumValue(Math.PI);
};
function formatNum(before, after, number, originalnum) {
    var result = '';
    if (originalnum != '' && originalnum.indexOf('.') !== -1 && originalnum.indexOf('.') < before) {
        result += number.substring(0, originalnum.indexOf('.')) + '.';
    } else {
        result += number.substring(0, before) + '.';
    }
    if (originalnum != '' && originalnum.indexOf('.') !== -1) {
        if (before < after) {
            result += number.substring(before, after + 1) + 'E+' + (originalnum.split('.')[0].length - result.indexOf('.'));
        } else {
            result += number.substring(after, before) + 'E+' + (result.indexOf('.') - originalnum.split('.')[0].length);
        }
    } else {
        if (before < after) {
            result += number.substring(before, after + 1) + 'E+' + (number.length - before);
        } else {
            result += number.substring(after, before) + 'E+' + (number.length - before);
        }
    }
    return result;
}
function roundNum(value, roundformat) {
    var step = roundformat || 1;
    var inv = 1 / step;
    return Math.round(value * inv) / inv;
}
WorksheetFunctions.AVERAGEIF = function (argArray, ctx) {
    var range = argArray[0](ctx);
    var condition = argArray[1](ctx).s(ctx);
    var condFunc = calcHelper.createConditionFunction(condition);
    var sum = 0;
    var totalCount = 0;
    if (argArray[2]) {
        var range2 = argArray[2](ctx);
        var count = range.count > range2.count ? range2.count : range.count;
        for (var i = 0; i < count; i++) {
            var testVal = range.get(i);
            if (condFunc(testVal, ctx)) {
                sum = sum + range2.get(i).num(ctx);
                totalCount++;
            }
        }
    } else {
        for (var i = 0; i < range.count; i++) {
            var testVal = range.get(i);
            if (condFunc(testVal, ctx)) {
                sum = sum + testVal.num(ctx);
                totalCount++;
            }
        }
    }
    if (totalCount == 0) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.divideByZero, ctx, 'AVERAGEIF had divided by zero Value');
    }
    return jsCalcValue.NumValue(sum / totalCount);
};
WorksheetFunctions.AVERAGEIFS = function (argArray, ctx) {
    var sumRange = argArray[0](ctx);
    var sum = 0;
    var i = 1;
    var totalCount = 0;
    if (argArray[i + 1]) {
        var condRange = argArray[i](ctx);
        var count = sumRange.count > condRange.count ? condRange.count : sumRange.count;
        for (var j = 0; j < count; j++) {
            i = 1;
            var condResult = true;
            while (i < argArray.length) {
                condRange = argArray[i](ctx);
                var condition = argArray[i + 1](ctx).s(ctx);
                var condFunc = calcHelper.createConditionFunction(condition);
                var testVal = condRange.get(j);
                condResult = condResult && condFunc(testVal, ctx);
                i = i + 2;
            }
            if (condResult) {
                sum = sum + sumRange.get(j).num(ctx);
                totalCount++;
            }
        }
    } else {
        for (var i = 0; i < sumRange.count; i++) {
            var testVal = sumRange.get(i);
            if (condFunc(testVal, ctx)) {
                sum = sum + testVal.num(ctx);
                totalCount++;
            }
        }
    }
    if (totalCount == 0) {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.divideByZero, ctx, 'AVERAGEIFS had divided by zero Value');
    }
    return jsCalcValue.NumValue(sum / totalCount);
};
WorksheetFunctions.SMALL = function (argArray, ctx) {
    var valArray = [];
    var initialRef = argArray[0](ctx);
    var numIndex = Math.ceil(argArray[1](ctx).num(ctx));
    var curCtx = ctx;
    argArray[0](ctx).each(function () {
        valArray.push(this.num(curCtx));
    });
    valArray = valArray.sort(function (a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });
    if (numIndex > valArray.length)
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx, 'SMALL had index greater than array size');
    return jsCalcValue.NumValue(valArray[numIndex - 1]);
};
WorksheetFunctions.XLOOKUP = function (argArray, ctx) {
    if (ctx && ctx.formula && ctx.formula.match(/XLOOKUP/g).length > 1) {
        return jsCalcValue.NumValue(ctx.origValue);
    }
    var testRange2 = argArray[2](ctx);
    var testRange = argArray[1](ctx);
    var ifnotfound = argArray[3] ? argArray[3](ctx) : '0';
    var mode = argArray[4] ? argArray[4](ctx).num(ctx) : 0;
    var search_mode = argArray[5] ? argArray[5](ctx).num(ctx) : 1;
    var testValue = argArray[0](ctx).num(ctx);
    var out = null;
    var valuesRegex = new RegExp(argArray[0](ctx).num(ctx) + '.*');
    var isNumber = !isNaN(testValue);
    if (!isNumber) {
        testValue = argArray[0](ctx).s(ctx);
    }
    if (mode == 1 || mode == -1 || mode == 0 || mode == 2 || mode == -2) {
        if (isNumber) {
            var numArray = [];
            for (var i = 0; i < testRange.h; i++) {
                var testNum = testRange.get(i).num(ctx);
                numArray.push(testNum);
            }
            var numbers = numArray.concat().sort(function (a, b) {
                return Math.abs(testValue - a) - Math.abs(testValue - b);
            });
            for (var i = 0; i < numbers.length; i++) {
                if (mode == 0) {
                    if (numbers[i] == testValue) {
                        if (search_mode == 1) {
                            out = testRange2.index(numArray.indexOf(numbers[i]) + 1, 1);
                        } else {
                            out = testRange2.index(numArray.lastIndexOf(numbers[i]) + 1, 1);
                        }
                        break;
                    }
                } else if (mode == 1) {
                    if (numbers[i] >= testValue) {
                        if (search_mode == 1) {
                            out = testRange2.index(numArray.indexOf(numbers[i]) + 1, 1);
                        } else {
                            out = testRange2.index(numArray.lastIndexOf(numbers[i]) + 1, 1);
                        }
                        break;
                    }
                } else if (mode == -1) {
                    if (numbers[i] <= testValue) {
                        if (search_mode == 1) {
                            out = testRange2.index(numArray.indexOf(numbers[i]) + 1, 1);
                        } else {
                            out = testRange2.index(numArray.lastIndexOf(numbers[i]) + 1, 1);
                        }
                        break;
                    }
                }
            }
        } else {
            if (search_mode == 1 || search_mode == 2) {
                for (var i = 0; i < testRange.h; i++) {
                    var curTestCell = testRange.index(1 + i, 1);
                    if (!curTestCell.isBlank) {
                        var curTestVal = curTestCell.s();
                        if (curTestVal.toLowerCase() == testValue.toLowerCase()) {
                            out = testRange2.index(1 + i, 1);
                            break;
                        }
                        if (curTestCell.num(ctx).toString().match(valuesRegex)) {
                            out = testRange2.index(1 + i, 1);
                            break;
                        }
                    }
                }
            } else {
                for (var i = testRange.h; i >= 0; i--) {
                    var curTestCell = testRange.index(1 + i, 1);
                    if (!curTestCell.isBlank) {
                        var curTestVal = curTestCell.s();
                        if (curTestVal.toLowerCase() == testValue.toLowerCase()) {
                            out = testRange2.index(1 + i, 1);
                            break;
                        }
                        if (curTestCell.num(ctx).toString().match(valuesRegex)) {
                            out = testRange2.index(1 + i, 1);
                            break;
                        }
                    }
                }
            }
        }
    }
    if (out) {
        return out;
    } else {
        return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, 'XLOOKUP didn\'t find valid result');
    }
};
WorksheetFunctions.XMATCH = function (argArray, ctx) {
    var isContainArray = false;
    var range = null;
    var mode = 0;
    var search_mode = 1;
    var numArray = [];
    var val = argArray[0](ctx);
    var isNumber = isNaN(parseFloat(val.s(ctx)));
    var valuesRegex = new RegExp(val.num(ctx) + '.*');
    if (ctx && ctx.formula && ctx.formula.indexOf('{') > -1 && ctx.formula.indexOf('}') > -1) {
        isContainArray = true;
        numArray = ctx.formula.substring(ctx.formula.indexOf('{') + 1, ctx.formula.indexOf('}')).split(',');
    }
    if (!isContainArray) {
        range = argArray[1](ctx);
        mode = argArray[2] ? argArray[2](ctx).num(ctx) : 0;
        search_mode = argArray[3] ? argArray[3](ctx).num(ctx) : 1;
    } else {
        mode = argArray[numArray.length + 1] ? argArray[numArray.length + 1](ctx).num(ctx) : 0;
        search_mode = argArray[numArray.length + 2] ? argArray[numArray.length + 2](ctx).num(ctx) : 1;
    }
    if (mode == 1 || mode == -1 || mode == 0 || mode == 2 || mode == -2) {
        if (!isNumber) {
            if (!isContainArray) {
                for (var i = 0; i < range.count; i++) {
                    var testNum = range.get(i).num(ctx);
                    numArray.push(testNum);
                }
            }
            var numbers = [];
            if (numArray.length > 0) {
                numbers = numArray.concat().sort(function (a, b) {
                    return Math.abs(val.s(ctx) - a) - Math.abs(val.s(ctx) - b);
                });
            }
            for (var i = 0; i < numbers.length; i++) {
                if (mode == 0) {
                    if (numbers[i] == val.s(ctx)) {
                        if (search_mode == 1) {
                            return jsCalcValue.NumValue(numArray.indexOf(numbers[i]) + 1);
                        } else {
                            return jsCalcValue.NumValue(numArray.lastIndexOf(numbers[i]) + 1);
                        }
                    }
                } else if (mode == 1) {
                    if (numbers[i] >= val.s(ctx)) {
                        if (search_mode == 1) {
                            return jsCalcValue.NumValue(numArray.indexOf(numbers[i]) + 1);
                        } else {
                            return jsCalcValue.NumValue(numArray.lastIndexOf(numbers[i]) + 1);
                        }
                    }
                } else if (mode == -1) {
                    if (numbers[i] <= val.s(ctx)) {
                        if (search_mode == 1) {
                            return jsCalcValue.NumValue(numArray.indexOf(numbers[i]) + 1);
                        } else {
                            return jsCalcValue.NumValue(numArray.lastIndexOf(numbers[i]) + 1);
                        }
                    }
                }
            }
        } else {
            if (search_mode == 1 || search_mode == 2) {
                for (var i = 0; i < range.count; i++) {
                    var testVal = range.get(i);
                    if (testVal.s(ctx) == val.s(ctx)) {
                        return jsCalcValue.NumValue(i + 1);
                    }
                    if (testVal.num(ctx).toString().match(valuesRegex)) {
                        return jsCalcValue.NumValue(i + 1);
                    }
                }
            } else {
                for (var i = range.count; i >= 0; i--) {
                    var testVal = range.get(i);
                    if (testVal.s(ctx) == val.s(ctx)) {
                        return jsCalcValue.NumValue(i + 1);
                    }
                    if (testVal.num(ctx).toString().match(valuesRegex)) {
                        return jsCalcValue.NumValue(i + 1);
                    }
                }
            }
        }
    }
    return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, 'XMATCH didn\'t find valid result');
};
WorksheetFunctions.MID = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx);
    var startNum = argArray[1](ctx).v(ctx);
    var textLen = argArray[2](ctx).v(ctx);
    if (typeof text === 'undefined' || text.errorContext) {
        return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating mid');
    }
    if (typeof text === 'string') {
        if (typeof startNum === 'undefined' || Number(startNum) < 1) {
            return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating mid');
        }
        if (typeof textLen === 'undefined' || Number(textLen) < 0) {
            return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating mid');
        }
        if (Number(text.length) < Number(startNum)) {
            return jsCalcValue.StringValue(text.substr(text.length));
        }
        if (Number(startNum) < text.length && text.length < Number(startNum) + Number(textLen)) {
            return jsCalcValue.StringValue(text.substring(startNum - 1));
        }
        return jsCalcValue.StringValue(text.substring(startNum - 1, textLen));
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating mid');
};
WorksheetFunctions.COUNT = function (argArray, ctx) {
    var count = 0;
    if (argArray.length) {
        for (var i = 0; i < argArray.length; i++) {
            var curRange = argArray[i](ctx);
            if (i === 0) {
                curRange.each(function () {
                    var val = this;
                    var vall = val.s(ctx);
                    if (vall != null && !isNaN(vall))
                        count++;
                });
            } else {
                var vall = curRange.s(ctx);
                if (vall != null) {
                    if (vall.toLowerCase() == 'true') {
                        vall = true;
                    } else if (vall.toLowerCase() == 'false') {
                        vall = false;
                    }
                }
                if (vall != null && !isNaN(vall))
                    count++;
            }
        }
        return jsCalcValue.NumValue(Number(count));
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating COUNT');
};
WorksheetFunctions.COUNTA = function (argArray, ctx) {
    var count = 0;
    if (argArray.length) {
        var curRange = argArray[0](ctx);
        curRange.each(function () {
            var val = this;
            var vall = val.s(ctx);
            if (vall !== '')
                count++;
        });
        return jsCalcValue.NumValue(count);
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in calculating COUNTA');
};
WorksheetFunctions.LOWER = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx);
    if (typeof text === 'undefined' || text.errorContext) {
        return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in converting to lowercase');
    }
    if (typeof text !== 'undefined') {
        return jsCalcValue.NumValue(text ? text.toLowerCase() : '');
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in converting to lowercase');
};
WorksheetFunctions.UPPER = function (argArray, ctx) {
    var text = argArray[0](ctx).s(ctx);
    if (typeof text === 'undefined' || text.errorContext) {
        return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in converting to uppercase');
    }
    if (typeof text !== 'undefined') {
        return jsCalcValue.NumValue(text ? text.toUpperCase() : '');
    }
    return jsCalcValue.jsCalcErrorValue(text, ctx, 'Error in converting to uppercase');
};
WorksheetFunctions.XIRR = function (argArray, ctx) {
    var values = argArray[0](ctx);
    var dates = argArray[1](ctx);
    var guess = argArray[2] ? argArray[2](ctx).num(ctx) : 0;
    var valuesArray = [], hasError = false;
    for (var i = 0; i < values.count; i++) {
        if (values.get(i).v(ctx).errorContext) {
            hasError = true;
            break;
        }
        valuesArray.push(values.get(i).num(ctx) || 0);
    }
    if (hasError) {
        return jsCalcValue.jsCalcErrorValue(values, ctx, 'Error in calculating XIRR');
    }
    var irrResult = function (values, dates, rate) {
        var r = rate + 1;
        var result = values[0];
        var date0 = dates.get(0).num(ctx);
        for (var i = 1; i < values.length; i++) {
            result += values[i] / Math.pow(r, (dates.get(i).num(ctx) - date0) / 365);
        }
        return result;
    };
    var irrResultDeriv = function (values, dates, rate) {
        var r = rate + 1;
        var result = 0;
        var date0 = dates.get(0).num(ctx);
        for (var i = 1; i < values.length; i++) {
            var frac = (dates.get(i).num(ctx) - date0) / 365;
            result -= frac * values[i] / Math.pow(r, frac + 1);
        }
        return result;
    };
    var positive = false;
    var negative = false;
    for (var i = 0; i < valuesArray.length; i++) {
        if (valuesArray[i] > 0) {
            positive = true;
        }
        if (valuesArray[i] < 0) {
            negative = true;
        }
    }
    if (!positive || !negative) {
        return jsCalcValue.jsCalcErrorValue(values, ctx, 'Error in calculating XIRR');
    }
    guess = guess === undefined ? 0.1 : guess;
    var resultRate = guess;
    var epsMax = 1e-10;
    var newRate, epsRate, resultValue;
    var contLoop = true;
    do {
        resultValue = irrResult(valuesArray, dates, resultRate);
        newRate = resultRate - resultValue / irrResultDeriv(valuesArray, dates, resultRate);
        epsRate = Math.abs(newRate - resultRate);
        resultRate = newRate;
        contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop);
    return jsCalcValue.NumValue(resultRate);
};
WorksheetFunctions.XNPV = function (argArray, ctx) {
    var rate = argArray[0](ctx).num(ctx);
    var values = argArray[1](ctx);
    var dates = argArray[2](ctx);
    var valuesArray = [], hasError = false;
    for (var i = 0; i < values.count; i++) {
        if (values.get(i).v(ctx).errorContext) {
            hasError = true;
            break;
        }
        valuesArray.push(values.get(i).num(ctx) || 0);
    }
    if (hasError) {
        return jsCalcValue.jsCalcErrorValue(values, ctx, 'Error in calculating XNPV');
    }
    var result = 0;
    var date0 = dates.get(0).num(ctx);
    for (var i = 0; i < valuesArray.length; i++) {
        result += valuesArray[i] / Math.pow(1 + rate, (dates.get(i).num(ctx) - date0) / 365);
    }
    return jsCalcValue.NumValue(result);
};

var ExpressionBuilder = function () {
};
if (!window.log) {
    if (window.console) {
        window.log = console.log;
    } else {
        window.log = function () {
        };
    }
}
ExpressionBuilder.valueFunctions = {};
ExpressionBuilder.valueConstructorFunctions = {};
ExpressionBuilder.operatorConstructorFunctions = {};
ExpressionBuilder.resultTypes = {};
ExpressionBuilder.resultTypes.value = 0;
ExpressionBuilder.resultTypes.generic = 1;
ExpressionBuilder.activeWorkbook;
ExpressionBuilder.worksheetFunctions = WorksheetFunctions;
ExpressionBuilder.getEvalFunction = function (expression, cellCtx, asValue) {
    var asValue = asValue ? true : false;
    switch (expression.type) {
    case 'binary':
        var constructFunc = ExpressionBuilder.operatorConstructorFunctions[expression.operator];
        return constructFunc(expression.A, expression.B, cellCtx, expression);
    case 'value':
        if (expression.value == 'TRUE') {
            alert('Oops!');
        }
        if (ExpressionBuilder.valueFunctions[expression.value]) {
            return ExpressionBuilder.valueFunctions[expression.value];
        } else {
            var type = 'number';
            var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
            ExpressionBuilder.valueFunctions[expression.value] = constructFunc(expression.value);
            return ExpressionBuilder.valueFunctions[expression.value];
        }
    case 'string':
        if (expression.value.length == 0) {
            if (ExpressionBuilder.emptyStringFunction)
                return ExpressionBuilder.emptyStringFunction;
            var type = 'string';
            var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
            ExpressionBuilder.emptyStringFunction = constructFunc(expression.value);
            return ExpressionBuilder.emptyStringFunction;
        } else if (ExpressionBuilder.valueFunctions[expression.value]) {
            return ExpressionBuilder.valueFunctions[expression.value];
        } else {
            var type = 'string';
            var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
            ExpressionBuilder.valueFunctions[expression.value] = constructFunc(expression.value);
            return ExpressionBuilder.valueFunctions[expression.value];
        }
    case 'bool':
        if (ExpressionBuilder.valueFunctions[expression.value]) {
            return ExpressionBuilder.valueFunctions[expression.value];
        } else {
            var type = 'bool';
            var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
            ExpressionBuilder.valueFunctions[expression.value] = constructFunc(expression.value);
            return ExpressionBuilder.valueFunctions[expression.value];
        }
    case 'reference':
        return ExpressionBuilder.referenceConstructorFunction(expression, cellCtx, asValue);
    case 'namedRangeReference':
        return ExpressionBuilder.namedReferenceConstructorFunction(expression, cellCtx, asValue);
    case 'wsFunc':
        return ExpressionBuilder.worksheetFunctionConstructor(expression, cellCtx);
    }
};
ExpressionBuilder.valueConstructorFunctions.number = function (value) {
    var val = jsCalcValue.NumValue(parseFloat(value));
    return function () {
        return val;
    };
};
ExpressionBuilder.valueConstructorFunctions.string = function (value) {
    var val = jsCalcValue.StringValue(value);
    return function () {
        return val;
    };
};
ExpressionBuilder.valueConstructorFunctions.bool = function (value) {
    var val = jsCalcValue.BooleanValue(value);
    return function () {
        return val;
    };
};
ExpressionBuilder.operatorConstructorFunctions.add = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var A = funcA(ctx);
        if (A.errorContext)
            return A;
        var B = funcB(ctx);
        if (B.errorContext)
            return B;
        curExpression.curVal = jsCalcValue.NumValue(A.num(ctx) + B.num(ctx));
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.sub = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        curExpression.curVal = jsCalcValue.NumValue(funcA(ctx).num(ctx) - funcB(ctx).num(ctx));
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.mul = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx);
        var b = funcB(ctx);
        curExpression.curVal = jsCalcValue.NumValue(funcA(ctx).num(ctx) * funcB(ctx).num(ctx));
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.exp = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).num(ctx);
        var b = funcB(ctx).num(ctx);
        var c = Math.pow(a, b);
        curExpression.curVal = isNaN(c) || c == Number.POSITIVE_INFINITY || c == Number.NEGATIVE_INFINITY ? jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx, 'Div0 within exp function') : jsCalcValue.NumValue(c);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.div = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).num(ctx);
        var b = funcB(ctx).num(ctx);
        curExpression.curVal = b ? jsCalcValue.NumValue(funcA(ctx).num(ctx) / funcB(ctx).num(ctx)) : jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.divideByZero, ctx);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.eq = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).s(ctx);
        var b = funcB(ctx).s(ctx);
        curExpression.curVal = jsCalcValue.BooleanValue(a == b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.neq = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).s(ctx);
        var b = funcB(ctx).s(ctx);
        curExpression.curVal = jsCalcValue.BooleanValue(a != b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.lt = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).num(ctx);
        var b = funcB(ctx).num(ctx);
        curExpression.curVal = jsCalcValue.BooleanValue(a < b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.gt = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).num(ctx);
        var b = funcB(ctx).num(ctx);
        curExpression.curVal = jsCalcValue.BooleanValue(a > b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.lte = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).num(ctx);
        var b = funcB(ctx).num(ctx);
        curExpression.curVal = jsCalcValue.BooleanValue(a <= b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.gte = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).num(ctx);
        var b = funcB(ctx).num(ctx);
        curExpression.curVal = jsCalcValue.BooleanValue(a >= b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.operatorConstructorFunctions.cat = function (A, B, cellCtx, expression) {
    var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
    var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
    var curExpression = expression;
    return function (ctx) {
        var a = funcA(ctx).s(ctx);
        var b = funcB(ctx).s(ctx);
        curExpression.curVal = jsCalcValue.StringValue(a + b);
        return curExpression.curVal;
    };
};
ExpressionBuilder.namedReferenceConstructorFunction = function (expression, cellCtx, asValue) {
    var workbookOb = cellCtx.workbook;
    var name = expression.name;
    if (name in workbookOb.namedRanges) {
        var refOb = workbookOb.namedRanges[name];
        if (asValue) {
            refOb = refOb.getReferenceAsValueReference(cellCtx);
        }
        cellCtx.parents.push(refOb);
    } else {
        window.log('Named range \'' + name + '\' is referenced in a formula, but is not defined in the workbook.', cellCtx.address());
    }
    var curExpression = expression;
    return function (ctx) {
        curExpression.curVal = name in workbookOb.namedRanges ? workbookOb.namedRanges[name] : jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.nameErr, ctx);
        return curExpression.curVal;
    };
};
ExpressionBuilder.referenceConstructorFunction = function (expression, cellCtx, asValue) {
    var startRow = expression.startRow;
    var startCol = expression.startCol;
    var endRow = expression.endRow ? expression.endRow : startRow;
    var endCol = expression.endCol ? expression.endCol : startCol;
    var targetSheet = expression.worksheet ? expression.worksheet : null;
    var refOb = jsCalcValue.ReferenceValue(startRow, startCol, endRow, endCol, cellCtx, targetSheet);
    if (asValue) {
        refOb = refOb.getReferenceAsValueReference(cellCtx);
    }
    cellCtx.parents.push(refOb);
    return ExpressionBuilder.referenceReturnFunction(refOb, expression);
};
ExpressionBuilder.referenceReturnFunction = function (refOb, expression) {
    return function (ctx) {
        return refOb;
    };
};
ExpressionBuilder.worksheetFunctionConstructor = function (expression, cellCtx) {
    var wsFunc = ExpressionBuilder.worksheetFunctions[expression.name];
    if (!wsFunc) {
        var errStr = 'Unsupported worksheet function in ' + cellCtx.verboseAddress() + ': ' + expression.name;
        cellCtx.workbook.buildErrors.push(errStr);
        if (!cellCtx.workbook.unsupportedFunctionList[expression.name])
            cellCtx.workbook.unsupportedFunctionList[expression.name] = 1;
        else
            cellCtx.workbook.unsupportedFunctionList[expression.name] = cellCtx.workbook.unsupportedFunctionList[expression.name] + 1;
        cellCtx.errorStatus = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, cellCtx, errStr);
        return function (ctx) {
            return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, ctx, errStr);
        };
    } else {
        var expArgFuncArray = [];
        if (expression.argExpressionArray.length) {
            for (var i = 0; i < expression.argExpressionArray.length; i++) {
                var funcA = ExpressionBuilder.getEvalFunction(expression.argExpressionArray[i], cellCtx);
                expArgFuncArray.push(funcA);
            }
        } else {
            expArgFuncArray.push(ExpressionBuilder.getEvalFunction(expression.argExpressionArray, cellCtx));
        }
        return ExpressionBuilder.worksheetFunctionReturnFunction(wsFunc, expArgFuncArray, cellCtx, expression);
    }
};
ExpressionBuilder.worksheetFunctionReturnFunction = function (func, args, cellCtx, expression) {
    var curArgs = args;
    var curFunc = func;
    var curExpression = expression;
    return function (ctx) {
        curExpression.curVal = curFunc(curArgs, ctx, expression);
        return curExpression.curVal;
    };
};
ExpressionBuilder.replaceWorksheetFunctions = function (newWorksheetFunctions) {
    ExpressionBuilder.worksheetFunctions = newWorksheetFunctions;
};

calcCell = function (worksheet, row, col, expressionData, isBlank) {
    this.debugExpressionData = expressionData;
    var self = this;
    this.workbook = worksheet.parent;
    this.worksheet = worksheet;
    this.row = parseInt(row);
    this.col = parseInt(col);
    this.parents = [];
    this.children = [];
    this.cleanParentCount = 0;
    this.isBlank = expressionData == 0 ? true : false;
    this.parentsAttemptCount = 0;
    this.breakIf();
    if (expressionData) {
        if (expressionData.type == 'value' || expressionData.type == 'string' || expressionData.type == 'bool') {
            this.workbook.valueCells.push(this);
            this.isValue = true;
        } else
            this.isValue = false;
        this.errorStatus = null;
        try {
            this.expression = ExpressionBuilder.getEvalFunction(expressionData, this, true);
        } catch (e) {
            var err = e;
            this.workbook.buildErrors.push(e.toString());
            this.expression = function (ctx) {
                return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.ref, self, err.toString());
            };
        }
        if (this.errorStatus) {
            this.workbook.buildErrors.push('Error building ' + this.address() + ': ' + this.errorStatus.text);
            this.expression = function (ctx) {
                var out = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.ref, self, 'Error building ' + self.address());
                return out;
            };
        }
        this.value = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.uninitialized, this, 'Not yet initialized');
        if (!this.isValue && this.parents.length == 0 && !this.errorStatus) {
            this.isValue = true;
            this.workbook.valueCells.push(this);
        }
        this.isBlank = false;
    } else {
        var tExpressionData = {
            type: 'string',
            value: ''
        };
        this.isValue = true;
        this.isBlank = true;
        this.workbook.valueCells.push(this);
        this.expression = ExpressionBuilder.getEvalFunction(tExpressionData, this, true);
    }
    if (this.isValue) {
        this.value = this.expression(this);
        this.errorStatus = null;
    }
    this.dirty = true;
};
calcCell.prototype.reinit = function (expressionData, isBlank) {
    this.debugExpressionData = expressionData;
    var self = this;
    this.removeParents();
    this.cleanParentCount = 0;
    this.parentsAttemptCount = 0;
    this.workbook.removeValueCell(this);
    this.isBlank = expressionData == 0 ? true : false;
    this.breakIf();
    if (expressionData) {
        if (expressionData.type == 'value' || expressionData.type == 'string') {
            this.workbook.valueCells.push(this);
            this.isValue = true;
        } else
            this.isValue = false;
        this.errorStatus = null;
        try {
            this.expression = ExpressionBuilder.getEvalFunction(expressionData, this, true);
        } catch (e) {
            var err = e;
            this.workbook.buildErrors.push(e.toString());
            this.expression = function (ctx) {
                return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.ref, self, err.toString());
            };
        }
        if (this.errorStatus) {
            this.workbook.buildErrors.push('Error building ' + this.address() + ': ' + this.errorStatus.text);
            this.expression = function (ctx) {
                var out = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.ref, self, 'Error building ' + self.address());
                return out;
            };
        }
        this.value = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.uninitialized, this, 'Not yet initialized');
        if (!this.isValue && this.parents.length == 0 && !this.errorStatus) {
            this.isValue = true;
            this.workbook.valueCells.push(this);
        }
        this.isBlank = false;
    } else {
        var tExpressionData = {
            type: 'string',
            value: ''
        };
        this.isValue = true;
        this.isBlank = true;
        this.workbook.valueCells.push(this);
        this.expression = ExpressionBuilder.getEvalFunction(tExpressionData, this, true);
    }
    if (this.isValue) {
        this.value = this.expression(this);
        this.errorStatus = null;
    }
    this.processParents();
    this.endirten();
};
calcCell.prototype.setFromString = function (expString) {
};
calcCell.prototype.setValue = function (value) {
    if (value.toString() != this.value.s(this) && this.isValue) {
        var curVal = jsCalcValue.makeValue(value);
        this.expression = function () {
            return curVal;
        };
        this.value = this.expression(this);
        this.endirten();
        this.workbook.calculationQueue.push(this);
    }
};
calcCell.prototype.parentMadeUnclean = function () {
    this.cleanParentCount--;
};
calcCell.prototype.parentMadeClean = function () {
    this.cleanParentCount++;
};
calcCell.prototype.endirten = function () {
    if (!this.dirty) {
        this.dirty = true;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].parentMadeUnclean();
            this.children[i].endirten();
        }
    }
};
calcCell.prototype.processParents = function () {
    this.breakIf();
    if (!this.isValue) {
        var unique = {};
        var outArray = [];
        for (var i = 0; i < this.parents.length; i++) {
            var curParentRef = this.parents[i];
            if (curParentRef) {
                try {
                    curParentRef.eachCell(function () {
                        var addStr = this.address();
                        if (!unique.hasOwnProperty(addStr)) {
                            if (!this.isBlank) {
                                outArray.push(this);
                                unique[addStr] = 1;
                            }
                        }
                    });
                } catch (e) {
                    debugger;
                    console.log('Error processing ', e);
                    console.log(curParentRef);
                }
            }
        }
        this.parents = outArray;
        var hasNonValueParent = false;
        for (var i = 0; i < this.parents.length; i++) {
            this.parents[i].addChild(this);
            hasNonValueParent = hasNonValueParent || !this.parents[i].isValue;
            
        }
        if (!hasNonValueParent)
            this.workbook.valueCells.push(this);
    }
    if (this.parents.length > 30) {
        this.workbook.lotsOfParents.push(this.address() + ': ' + this.parents.length);
    }
};
calcCell.prototype.verboseAddress = function () {
    return this.worksheet.name + '!R' + this.row + 'C' + this.col;
};
calcCell.prototype.v = function () {
    if (this.value && this.value.data === '#UNINITIALIZED!') {
        try {
            this.value = this.expression(this);
            var curVal = this.value.num(this);
            if (curVal === '#UNINITIALIZED!') {
                curVal = this.value.v(this);
            }
            this.errorStatus = null;
            this.dirty = false;
            return curVal;
        } catch (e) {
            return this.value.v(this);
        }
    }
    return this.value.v(this);
};
calcCell.prototype.b = function () {
    return this.value.b(this);
};
calcCell.prototype.num = function () {
    return this.value.num(this);
};
calcCell.prototype.s = function () {
    return this.value.s(this);
};
calcCell.prototype.breakIf = function () {
    
};
calcCell.prototype.calculate = function () {
    this.breakIf();
    if (this.dirty) {
        this.errorStatus = null;
        this.value = this.expression(this);
        this.dirty = false;
        if (this.errorStatus) {
            this.value = this.errorStatus;
        } else {
            var curVal = this.value.num(this);
        }
        this.flagChildrenToCalculate();
    }
};
calcCell.prototype.flagChildrenToCalculate = function () {
    for (var i = 0; i < this.children.length; i++) {
        var curChild = this.children[i];
        curChild.parentMadeClean();
        this.children[i].flagCalculateIfParentsClean();
    }
};
calcCell.prototype.flagCalculateIfParentsClean = function () {
    var ready = this.parents.length == this.cleanParentCount;
    if (ready)
        this.workbook.calculationQueue.push(this);
    else {
        this.parentsAttemptCount++;
    }
    if (this.parents.length === this.parentsAttemptCount) {
        this.forceCalculateParent();
    }
};
calcCell.prototype.forceCalculateParent = function () {
    this.breakIf();
    try {
        if (this.dirty && this.value && this.value.data === '#UNINITIALIZED!') {
            this.value = this.expression(this);
            var curVal = this.value.num(this);
            this.dirty = false;
            this.errorStatus = null;
        }
    } catch (e) {
        console.log(e);
    }
};
calcCell.prototype.addParent = function (parentCell) {
};
calcCell.prototype.addChild = function (childCell) {
    this.children.push(childCell);
};
calcCell.prototype.removeParents = function (parentCell) {
    for (var i = 0; i < this.parents.length; i++) {
        this.parents[i].removeChild(this);
    }
};
calcCell.prototype.removeChild = function (childCell) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i] == childCell) {
            this.children.splice(i, 1);
        }
    }
};
calcCell.prototype.address = function () {
    return this.worksheet.name + '!R' + this.row + 'C' + this.col;
};

var numeral$1 = require('numeral');
var calcWorksheet = function (parentBook, worksheetName) {
    this.parent = parentBook;
    this.name = worksheetName;
    this.rows = {};
    this.namedRanges = {};
    this.cellCount = 0;
    this.cellArray = [];
    this.hierarchyBuildCount = 0;
    this.hierarchyReady = false;
};
calcWorksheet.prototype.init = function (worksheetJson) {
    this.initializeNamedRanges(worksheetJson.namedRanges);
    for (var i = 0; i < worksheetJson.cells.length; i++) {
        this.addCell(worksheetJson.cells[i]);
    }
    for (var row in this.rows) {
        for (var col in this.rows[row]) {
            this.cellArray.push(this.rows[row][col]);
        }
    }
};
calcWorksheet.prototype.initializeNamedRanges = function (namedRangeJson) {
    for (var namedRange in namedRangeJson) {
        var namedRangeOb = namedRangeJson[namedRange];
        var startRow = namedRangeOb.startRow;
        var startCol = namedRangeOb.startCol;
        var endRow = namedRangeOb.endRow ? namedRangeOb.endRow : startRow;
        var endCol = namedRangeOb.endCol ? namedRangeOb.endCol : startCol;
        var targetSheet = namedRangeOb.worksheet ? namedRangeOb.worksheet : this.name;
        var refOb = jsCalcValue.ReferenceValue(startRow, startCol, endRow, endCol, { workbook: this.parent }, targetSheet);
        this.namedRanges[namedRange] = refOb;
    }
};
calcWorksheet.prototype.addCell = function (cellJson) {
    var targRow = cellJson.row;
    var targCol = cellJson.col;
    if (!this.rows[targRow])
        this.rows[targRow] = {};
    this.rows[targRow][targCol] = new calcCell(this, cellJson.row, cellJson.col, cellJson.expression);
    if (cellJson.v)
        this.rows[targRow][targCol].origValue = cellJson.v;
    if (cellJson.f)
        this.rows[targRow][targCol].formula = cellJson.f;
    if (cellJson.nf)
        this.rows[targRow][targCol].nf = cellJson.nf;
    this.cellCount++;
};
calcWorksheet.prototype.getCell = function (row, col) {
    if (this.rows[row] && this.rows[row][col])
        return this.rows[row][col];
    else {
        if (!this.rows[row])
            this.rows[row] = {};
        this.rows[row][col] = new calcCell(this, row, col, null, true);
        return this.rows[row][col];
    }
};
calcWorksheet.prototype.initializeHierarchies = function () {
    for (var row in this.rows) {
        for (var col in this.rows[row]) {
            this.rows[row][col].processParents();
        }
    }
    this.hierarchyReady = true;
};
calcWorksheet.prototype.initializeSingleCellHierarchyAsync = function () {
    if (this.hierarchyBuildCount < this.cellArray.length) {
        this.cellArray[this.hierarchyBuildCount].processParents();
        this.hierarchyBuildCount++;
    } else {
        this.hierarchyReady = true;
        this.parent.numBuilt--;
    }
};

var lastTime = 0;
var vendors = [
    'webkit',
    'moz'
];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };

var parseUtils = {};
parseUtils.range1Regex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*))?$/i;
parseUtils.rangeRCRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?R([1-9][0-9]*)\$?C([1-9][0-9]*)(?::\$?R([1-9][0-9]*)\$?C([1-9][0-9]*))?$/i;
parseUtils.rangeColRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})(?::\$?([a-zA-Z]{1,2}))?$/i;
parseUtils.rangeRowRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([1-9][0-9]*)(?::\$?([1-9][0-9]*))?$/i;
parseUtils.rangeMultiRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*))(\,(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)))+?$/i;
parseUtils.getRCColumn = function (columnCode) {
    var ACode = 'A'.charCodeAt(0) - 1;
    var mult = 1;
    var total = 0;
    for (var i = columnCode.length - 1; i >= 0; i--) {
        var curCharCode = columnCode.charCodeAt(i) - ACode;
        total += curCharCode * mult;
        mult *= 26;
    }
    return total;
};
parseUtils.getRangeOb = function (address) {
    if (parseUtils.rangeRCRegex.test(address)) {
        var out = {};
        var regexOut = parseUtils.rangeRCRegex.exec(address);
        out.sheetName = regexOut[1];
        out.startRow = regexOut[2];
        out.startCol = regexOut[3];
        out.endRow = regexOut[4] ? regexOut[4] : out.startRow;
        out.endCol = regexOut[5] ? regexOut[5] : out.startCol;
        return out;
    } else if (parseUtils.range1Regex.test(address)) {
        var regexCapture = parseUtils.range1Regex.exec(address);
        if (!regexCapture) {
            if (parseUtils.rangeMultiRegex.test(address)) {
                var addresses = address.split(',');
                var outRanges = [];
                for (var i = 0; i < addresses.length; i++) {
                    var testRange = parseUtils.getRangeOb(addresses[i]);
                    if (testRange)
                        outRanges.push(testRange);
                }
                return outRanges;
            } else if (parseUtils.rangeColRegex.test(address)) {
                regexCapture = parseUtils.rangeColRegex.exec(address);
                var out = {};
                if (regexCapture[1])
                    out.sheetName = regexCapture[1];
                out.startCol = parseInt(regexCapture[2]);
                out.endCol = parseInt(regexCapture[3]);
                out.startRow = 1;
                out.endRow = 65000;
                return out;
            } else if (parseUtils.rangeRowRegex.test(address)) {
                regexCapture = parseUtils.rangeRowRegex.exec(address);
                var out = {};
                if (regexCapture[1])
                    out.sheetName = regexCapture[1];
                out.startRow = parseInt(regexCapture[2]);
                out.endRow = parseInt(regexCapture[3]);
                out.startCol = 1;
                out.endCol = 216;
                return out;
            } else {
                parseUtils.errorLog.push('Error attempting to parse address: ' + address);
                return;
            }
        }
        var out = {};
        if (regexCapture[1])
            out.sheetName = regexCapture[1];
        out.startCol = parseInt(parseUtils.getRCColumn(regexCapture[2].toUpperCase()));
        out.startRow = parseInt(regexCapture[3]);
        if (regexCapture[4]) {
            out.endCol = parseInt(parseUtils.getRCColumn(regexCapture[4].toUpperCase()));
            out.endRow = parseInt(regexCapture[5]);
        }
        return out;
    }
};

var calcWorkbook = function (params) {
    this.init(params);
};
calcWorkbook.prototype.init = function (params) {
    if (!params)
        params = {};
    this.calculationBreakpointObject = null;
    if (params.modelJSON) {
        this.workbookJson = params.modelJSON;
    }
    if (this.nextAnimFrame)
        window.cancelAnimationFrame(this.nextAnimFrame);
    if (!this.workbookJson)
        return -1;
    this.buildAsync = params.buildAsync ? true : false;
    this.buildProgressCallback = params.buildProgressCallback;
    this.name = this.workbookJson.name;
    this.buildErrors = [];
    this.calculationErrors = [];
    this.expressionBuilder = ExpressionBuilder;
    this.namedRanges = {};
    this.worksheets = {};
    this.valueCells = [];
    this.animFrameTimes = [];
    this.unsupportedFunctionList = {};
    this.calcCB = null;
    this.calculationTimePerFrame = 20;
    this.cellCount = 0;
    this.queueEmpty = true;
    this.startTime = 0;
    this.endTime = 0;
    this.calcTimeElapsed = 0;
    this.calcCount = 0;
    this.buildStartTime = new Date().getTime();
    this.buildQueue = [];
    this.buildStage = 0;
    this.numBuilt = 0;
    this.lotsOfParents = [];
    this.buildMessage = 'Reticulating Splines';
    this.addressReference = {};
    this.expressionBuilder.activeWorkbook = this;
    this.customWorksheetFunctions = params.customWorksheetFunctions;
    var self = this;
    if (this.customWorksheetFunctions) {
        Object.keys(this.customWorksheetFunctions).forEach(function (key) {
            self.expressionBuilder.worksheetFunctions[key] = params.customWorksheetFunctions[key].bind(jsCalcValue);
        });
    }
    var worksheetName;
    for (worksheetName in this.workbookJson.worksheets) {
        this.worksheets[worksheetName] = new calcWorksheet(this, worksheetName);
    }
    this.initializeNamedRanges(this.workbookJson.namedRanges);
    if (!this.buildAsync) {
        for (worksheetName in this.workbookJson.worksheets) {
            this.worksheets[worksheetName].init(this.workbookJson.worksheets[worksheetName]);
            this.cellCount += this.worksheets[worksheetName].cellCount;
        }
        for (worksheetName in this.workbookJson.worksheets) {
            this.worksheets[worksheetName].initializeHierarchies();
        }
        this.calculationQueue = this.valueCells.slice(0);
        var self = this;
        this.nextAnimFrame = window.requestAnimationFrame(function () {
            self.processCalculation();
        });
    } else {
        this.buildQueue.push({
            buildFunc: function () {
                self.buildStage = 1;
                self.numBuilt = 0;
                self.buildQueueOrigLength = self.cellCount + 1;
                self.buildMessage = 'Building Cell Calculation Functions';
            }
        });
        for (worksheetName in this.workbookJson.worksheets) {
            this.buildQueue.push({
                buildFunc: function (sheetName) {
                    self.worksheets[sheetName].init(self.workbookJson.worksheets[sheetName]);
                    self.cellCount += self.worksheets[sheetName].cellCount;
                },
                args: worksheetName
            });
        }
        this.buildQueue.push({
            buildFunc: function () {
                self.buildStage = 1;
                self.numBuilt = 0;
                self.buildQueueOrigLength = self.cellCount + 1;
                self.buildMessage = 'Calculating cell hierarchies';
            }
        });
        for (worksheetName in this.workbookJson.worksheets) {
            this.buildQueue.push({
                buildFunc: function (args, ob) {
                    self.asynchHierarchyBuildFunc(args, ob);
                },
                args: worksheetName
            });
        }
        this.buildQueue.push({
            buildFunc: function () {
                self.calculationQueue = self.valueCells.slice(0);
                self.nextAnimFrame = window.requestAnimationFrame(function () {
                    self.processCalculation();
                });
            }
        });
        this.nextAnimFrame = window.requestAnimationFrame(function () {
            self.asyncBuildWorkbook();
        });
        this.buildQueueOrigLength = this.buildQueue.length;
    }
};
calcWorkbook.prototype.asynchHierarchyBuildFunc = function (sheetName, buildOperationOb) {
    this.worksheets[sheetName].initializeSingleCellHierarchyAsync();
    if (!this.worksheets[sheetName].hierarchyReady) {
        this.buildQueue.unshift(buildOperationOb);
    }
};
calcWorkbook.prototype.asyncBuildWorkbook = function () {
    var startTime = new Date().getTime();
    while (new Date().getTime() - startTime <= this.calculationTimePerFrame && this.buildQueue.length > 0) {
        var curBuildOb = this.buildQueue.shift();
        this.numBuilt++;
        curBuildOb.buildFunc(curBuildOb.args, curBuildOb);
    }
    if (this.buildProgressCallback) {
        var progOb = {
            numComplete: this.numBuilt,
            numTotal: this.buildQueueOrigLength,
            message: this.buildMessage + ' (' + this.numBuilt + '/' + this.buildQueueOrigLength + ')',
            curStage: this.buildStage
        };
        this.buildProgressCallback(progOb);
    }
    var self = this;
    if (this.buildQueue.length > 0) {
        this.nextAnimFrame = window.requestAnimationFrame(function () {
            self.asyncBuildWorkbook();
        });
    } else {
        this.calculationQueue = this.valueCells.slice(0);
        this.nextAnimFrame = window.requestAnimationFrame(function () {
            self.processCalculation();
        });
    }
};
calcWorkbook.prototype.calculationPending = function () {
    return this.calculationQueue.length > 0;
};
calcWorkbook.prototype.processCalculation = function () {
    var startTime = new Date().getTime();
    if (this.calculationQueue.length > 0) {
        if (this.queueEmpty) {
            this.startTime = new Date().getTime();
            this.endTime = 0;
            this.calcTimeElapsed = 0;
            this.calcCount = 0;
            this.queueEmpty = false;
        }
        while (new Date().getTime() - startTime <= this.calculationTimePerFrame && this.calculationQueue.length > 0) {
            var curCell = this.calculationQueue.shift();
            try {
                curCell.calculate();
            } catch (e) {
                this.calculationErrors.push(curCell.address() + ': ' + e.message);
                var err = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.calc, curCell, e.message);
                curCell.errorStatus = err;
            }
            this.calcCount++;
        }
        if (this.calculationQueue.length == 0) {
            this.endTime = new Date().getTime();
            this.calcTimeElapsed = this.endTime - this.startTime;
            this.queueEmpty = true;
            if (this.calcCB) {
                if (this.calcCBOb) {
                    this.calcCB.call(this.calcCBOb);
                } else {
                    this.calcCB();
                }
            }
        }
    }
    var self = this;
    this.nextAnimFrame = window.requestAnimationFrame(function () {
        self.processCalculation();
    });
};
calcWorkbook.prototype.forceCalculate = function () {
    this.startTime = new Date().getTime();
    this.calcCount = 0;
    var timeOut = 20000;
    while (this.calculationQueue.length > 0 && new Date().getTime() - this.startTime < timeOut) {
        var curCell = this.calculationQueue.shift();
        curCell.calculate();
        this.calcCount++;
        if (this.calculationQueue.length == 0) {
            this.endTime = new Date().getTime();
            this.calcTimeElapsed = this.endTime - this.startTime;
            if (this.calcCB) {
                if (this.calcCBOb) {
                    this.calcCB.call(this.calcCBOb);
                } else {
                    this.calcCB();
                }
            }
        }
    }
};
calcWorkbook.prototype.onCalculationDone = function (calcCB) {
    if (calcCB.length && calcCB.length >= 2 && typeof calcCB[1] == 'function') {
        this.calcCBOb = calcCB[0];
        this.calcCB = calcCB[1];
    } else {
        this.calcCBOb = null;
        this.calcCB = calcCB;
    }
};
calcWorkbook.prototype.initializeNamedRanges = function (namedRangeJson) {
    for (var namedRange in namedRangeJson) {
        var namedRangeOb = namedRangeJson[namedRange];
        var startRow = namedRangeOb.startRow;
        var startCol = namedRangeOb.startCol;
        var endRow = namedRangeOb.endRow ? namedRangeOb.endRow : startRow;
        var endCol = namedRangeOb.endCol ? namedRangeOb.endCol : startCol;
        var targetSheet = namedRangeOb.worksheet ? namedRangeOb.worksheet : null;
        var refOb = jsCalcValue.ReferenceValue(startRow, startCol, endRow, endCol, { workbook: this }, targetSheet);
        var addressRef = refOb.address();
        this.namedRanges[namedRange] = refOb;
        this.addressReference[addressRef] = namedRange;
    }
};
calcWorkbook.prototype.getRangeReferenceByAddress = function (rangeSpecifierOb) {
    var refOb = jsCalcValue.ReferenceValue(rangeSpecifierOb.startRow, rangeSpecifierOb.startCol, rangeSpecifierOb.endRow, rangeSpecifierOb.endCol, { workbook: this }, rangeSpecifierOb.sheetName);
    return refOb;
};
calcWorkbook.prototype.getRange = function (rangeID) {
    if (this.namedRanges[rangeID]) {
        return this.namedRanges[rangeID];
    } else {
        var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
        return this.getRangeReferenceByAddress(rangeSpecifierOb);
    }
};
calcWorkbook.prototype.getFriendlyName = function (range) {
    var self = this;
    if (typeof self.addressReference[range] !== 'undefined') {
        return self.addressReference[range];
    }
    return null;
};
calcWorkbook.prototype.getNames = function (regex) {
    var out = [];
    for (var curName in this.namedRanges) {
        if (typeof regex === 'RegExp' || regex instanceof RegExp) {
            if (regex.test(curName)) {
                out.push(curName);
            }
        }
    }
    return out;
};
calcWorkbook.prototype.getValue = function (rangeID) {
    var targRange = null;
    if (this.isNamedRange(rangeID)) {
        targRange = this.getRange(rangeID);
    } else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
        var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
        targRange = this.getRangeReferenceByAddress(rangeSpecifierOb);
    }
    if (!targRange)
        return -1;
    if (targRange.count == 1) {
        var cell = targRange.getSingleCellReference();
        return cell.v();
    } else {
        var out = [];
        targRange.eachCell(function () {
            out.push(this.v());
        });
        return out;
    }
};
calcWorkbook.prototype.removeValueCell = function (cell) {
    for (var i = 0; i < this.valueCells.length; i++) {
        if (this.valueCells[i] == cell) {
            this.valueCells.splice(i, 1);
            return;
        }
    }
};
calcWorkbook.prototype.getContextualValue = function (rangeID, cellCtx) {
    var targRange = null;
    if (this.isNamedRange(rangeID)) {
        targRange = this.getRange(rangeID);
    } else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
        var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
        targRange = this.getRangeReferenceByAddress(rangeSpecifierOb);
    }
    if (!targRange)
        return -1;
    if (targRange.count == 1) {
        var cell = targRange.getSingleCellReference();
        return cell.v(cellCtx);
    } else {
        return targRange.v(cellCtx);
    }
};
calcWorkbook.prototype.isNamedRange = function (name) {
    return name in this.namedRanges;
};
calcWorkbook.prototype.isWorksheet = function (name) {
    return name in this.worksheets;
};
calcWorkbook.prototype.recalculate = function (name) {
    for (var i = 0; i < this.valueCells.length; i++) {
        this.valueCells[i].endirten();
    }
    this.calculationQueue = this.valueCells.slice(0);
};

var jsCalcVersion = '1.0.19';
var numeral = require('numeral');
if (!window.isArray) {
    window.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}
var jsCalc = function (params) {
    this.versionNumber = jsCalcVersion;
    this.periodName = params.hasOwnProperty('periodName') ? params.periodName : 'xxYear';
    this.curPeriod = -1;
    this.loadCallback = params.loadCallback;
    this.buildProgressCallback = params.buildProgressCallback ? params.buildProgressCallback : null;
    this.modelURL = params.modelURL ? params.modelURL : null;
    this.model = params.model ? params.model : null;
    this.buildAsync = params.hasOwnProperty('buildAsync') ? params.buildAsync : true;
    this.workbook = null;
    this.ready = false;
    this.calculationCallbacks = [];
    this.singletonCalculationCallbacks = [];
    this.courseActions = params.customActions ? params.customActions : null;
    this.stateVariables = {};
    this.historicalData = {};
    this.customWorksheetFunctions = params.customWorksheetFunctions ? params.customWorksheetFunctions : null;
    var self = this;
    if (this.modelURL && this.loadCallback) {
        $.ajax({
            url: this.modelURL,
            dataType: 'json',
            complete: function (response) {
                self.model = response.responseJSON;
                self.buildFromJSON();
            },
            error: onError
        });
        this.initialized = true;
    } else if (this.model && this.loadCallback) {
        this.buildFromJSON();
        this.initialized = true;
    }
};
function onError(e) {
    alert('Error: ' + e.toString());
}
jsCalc.prototype.onNextRecalculate = function (nextRecalcFunc) {
    this.singletonCalculationCallbacks.push(nextRecalcFunc);
};
jsCalc.prototype.completeCalculation = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!self.workbook.calculationPending() && self.ready) {
            resolve();
        } else {
            self.singletonCalculationCallbacks.push(function () {
                self.completeCalculation().then(resolve);
            });
        }
    });
};
jsCalc.prototype.buildFromJSON = function (json) {
    var self = this;
    this.workbook = new calcWorkbook({
        modelJSON: this.model,
        buildProgressCallback: function (e) {
            self.onBuildProgress(e);
        },
        buildAsync: this.buildAsync,
        customWorksheetFunctions: this.customWorksheetFunctions
    });
    var self = this;
    this.workbook.onCalculationDone(function () {
        self.curPeriod = self.getRawValue(self.periodName);
        self.workbook.onCalculationDone([
            self,
            jsCalc.onCalculationDone
        ]);
        self.loadCallback();
    });
    this.ready = true;
};
jsCalc.prototype.reset = function (params) {
    var self = this;
    this.ready = false;
    params = params ? params : {};
    this.loadCallback = params.loadCallback;
    this.buildProgressCallback = params.buildProgressCallback ? params.buildProgressCallback : null;
    this.workbook.init({
        buildProgressCallback: function (e) {
            self.onBuildProgress(e);
        },
        buildAsync: this.buildAsync
    });
    var self = this;
    this.workbook.onCalculationDone(function () {
        self.workbook.onCalculationDone([
            self,
            jsCalc.onCalculationDone
        ]);
        self.ready = true;
        self.loadCallback();
    });
};
jsCalc.prototype.setValue = function (rangeID, value) {
    var targRange = this.getRangeRef(rangeID);
    if (!targRange || !targRange.targetSheetOb) {
        return Promise.reject('Cannot set value: ' + value + '. No valid range found for: ' + rangeID);
    }
    if (window.isArray(value)) {
        var endRow = targRange.h > value.length ? value.length : targRange.h;
        for (var r = 0; r < endRow; r++) {
            if (window.isArray(value[r])) {
                var endCol = targRange.w > value[r].length ? value[r].length : targRange.w;
                for (var c = 0; c < endCol; c++) {
                    var targetRow = targRange.startRow + r;
                    var targetCol = targRange.startCol + c;
                    var address = targRange.targetSheetOb.name + '!R' + targetRow + 'C' + targetCol;
                    this.setValue(address, value[r][c]);
                }
            }
        }
    } else {
        var targRangeAddressString = targRange.targetSheetOb.name + '!R' + targRange.startRow + 'C' + targRange.startCol;
        if (value == null)
            value = '';
        if (typeof value == 'string') {
            var parsedVal = parseFloat(value);
            if (!isNaN(parsedVal) && !isNaN(Number(value)))
                value = parsedVal;
        }
        this.stateVariables[targRangeAddressString] = value;
        targRange.get(0).setValue(value);
    }
    return this.completeCalculation();
};
jsCalc.prototype.getRawValue = function (rangeID) {
    var sourceRangeRef = this.getRangeRef(rangeID);
    if (!sourceRangeRef)
        return null;
    var out = sourceRangeRef.valueArray();
    if (out.length == 1 && out[0].length == 1)
        return out[0][0];
    return out;
};
jsCalc.prototype.getValue = function (rangeID, period) {
    if (period != 0 && period !== undefined && period.toString() != this.curPeriod.toString()) {
        if (period < 0) {
            period = this.curPeriod + period;
        }
        return this.getHistoricalValue(rangeID, period);
    }
    var sourceRangeRef = this.getRangeRef(rangeID);
    if (!sourceRangeRef)
        return null;
    if (sourceRangeRef.h == 1 && sourceRangeRef.w == 1) {
        var curCell = sourceRangeRef.getSingleCellReference();
        var nf = curCell.nf;
        var val = curCell.v();
        if (curCell && curCell.formula && (curCell.formula.indexOf('TEXT(') > -1 || curCell.formula.indexOf('AVERAGE') > -1 || curCell.formula.indexOf('LARGE(') > -1 || curCell.formula.indexOf('SMALL(') > -1)) {
            return val;
        }
        if (curCell && curCell.formula && curCell.formula.indexOf('OFFSET(') > -1 && val == '') {
            return '0';
        }
        if (!isNaN(parseFloat(val))) {
            var nfCode = nf;
            if (nf == 'General')
                nfCode = '0,0';
            var string = numeral(val).format(nfCode);
            return string;
        } else {
            return val;
        }
    } else {
        var out = sourceRangeRef.valueArray();
        return out;
    }
};
jsCalc.prototype.getHistoricalValue = function (rangeID, period) {
    if (this.historicalData[period]) {
        if (this.historicalData[period].hasOwnProperty(rangeID)) {
            return this.historicalData[period][rangeID];
        } else {
            return 'N/A';
        }
    } else {
        return 'N/A';
    }
};
jsCalc.prototype.getSeriesValue = function (rangeID, period) {
    if (period != 0 && period !== undefined && period.toString() != this.curPeriod.toString()) {
        if (period < 0) {
            period = this.curPeriod + period;
        }
        var out = this.getHistoricalValue(rangeID, period);
        if (!window.isArray(out))
            return [out];
        var outArr = [];
        for (var i = 0; i < out.length; i++) {
            var curRow = out[i];
            if (!window.isArray(curRow)) {
                outArr.push(curRow);
                continue;
            }
            for (var j = 0; j < curRow.length; j++) {
                var curVal = curRow[j];
                outArr.push(curVal);
            }
        }
        return outArr;
    }
    var sourceRangeRef = this.getRangeRef(rangeID);
    if (!sourceRangeRef)
        return null;
    if (sourceRangeRef.h == 1 && sourceRangeRef.w == 1) {
        var curCell = sourceRangeRef.getSingleCellReference();
        var val = curCell.v();
        return [val];
    } else {
        var out = [];
        sourceRangeRef.eachCell(function () {
            out.push(this.v());
        });
        return out;
    }
};
jsCalc.prototype.addCalculationCallback = function (cbFunc) {
    var found = false;
    for (var i = 0; i < this.calculationCallbacks.length; i++) {
        if (jsCalc.cbCompare(this.calculationCallbacks[i], cbFunc))
            found = true;
    }
    if (!found) {
        this.calculationCallbacks.push(cbFunc);
    }
};
jsCalc.prototype.removeCalculationCallback = function (cbFunc) {
    for (var i = 0; i < this.calculationCallbacks.length; i++) {
        if (jsCalc.cbCompare(this.calculationCallbacks[i], cbFunc)) {
            this.calculationCallbacks.splice(i, 1);
            i--;
        }
    }
};
jsCalc.prototype.runCourseAction = function (actionName) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (self.courseActions[actionName]) {
            var prom = self.courseActions[actionName].call(self);
            prom.then(function () {
                resolve();
            });
        } else {
            reject();
        }
    });
};
jsCalc.prototype.getFullState = function () {
    var outOb = {};
    outOb.cells = {};
    for (var trackedCell in this.stateVariables) {
        var trackedVal = this.getRawValue(trackedCell);
        outOb.cells[trackedCell] = trackedVal.toString();
    }
    outOb.historicalData = this.historicalData;
    return outOb;
};
jsCalc.prototype.getState = function () {
    var outOb = {};
    outOb = {};
    for (var trackedCell in this.stateVariables) {
        var trackedVal = this.getRawValue(trackedCell);
        outOb[trackedCell] = trackedVal.toString();
    }
    return outOb;
};
jsCalc.prototype.getHistoricalState = function () {
    var outOb = {};
    outOb.cells = {};
    outOb = this.historicalData;
    return outOb;
};
jsCalc.prototype.getJSONState = function () {
    return JSON.stringify(this.getState());
};
jsCalc.prototype.setState = function (state, historicalState, callback) {
    var stateObject = {};
    stateObject.cells = state;
    if (historicalState === undefined || historicalState === null) {
        stateObject.historicalData = {};
    } else {
        stateObject.historicalData = historicalState;
    }
    var setCallback = callback;
    this.reset({
        loadCallback: function () {
            for (cellAddress in stateObject.cells) {
                var targRange = this.getRangeRef(cellAddress);
                targRange.get(0).setValue(stateObject.cells[cellAddress]);
            }
            this.historicalData = stateObject.historicalData;
            this.stateVariables = stateObject.cells;
            if (setCallback)
                setCallback();
        }
    });
};
jsCalc.prototype.setJSONState = function (stateJSON, callback) {
    var stateOb = JSON.parse(stateJSON);
    this.setState(stateOb, callback);
};
jsCalc.prototype.copyAndPasteByValue = function (sourceDataRange, destinationRange) {
    var sourceRangeRef = this.getRangeRef(sourceDataRange);
    var destinationRangeRef = this.getRangeRef(destinationRange);
    if (!sourceRangeRef || !destinationRangeRef)
        return -1;
    if (sourceRangeRef.count == 1) {
        var sourceValue = sourceRangeRef.getSingleCellReference().v();
        for (var i = 0; i < destinationRangeRef.count; i++) {
            this.setValue(destinationRangeRef.get(i).getSingleCellReference().address(), sourceValue);
        }
    } else {
        var destTopLeft = destinationRangeRef.getSingleCellReference();
        for (var r = 0; r < sourceRangeRef.h; r++) {
            for (var c = 0; c < sourceRangeRef.w; c++) {
                var targetRow = destTopLeft.row + r;
                var targetCol = destTopLeft.col + c;
                var targetAddress = destTopLeft.worksheet.name + '!R' + targetRow + 'C' + targetCol;
                var sourceValue = sourceRangeRef.getCellByIndex(r, c).v();
                this.setValue(targetAddress, sourceValue);
            }
        }
    }
};
jsCalc.prototype.isNamedRange = function (name) {
    return this.workbook.isNamedRange(name);
};
jsCalc.onCalculationDone = function () {
    this.curPeriod = this.getRawValue(this.periodName);
    for (var i = 0; i < this.singletonCalculationCallbacks.length; i++) {
        var cbOb = this.singletonCalculationCallbacks[i];
        if (cbOb.length >= 2 && typeof cbOb[1] == 'function') {
            cbOb[1].call(cbOb[0]);
        } else {
            cbOb();
        }
    }
    this.singletonCalculationCallbacks = [];
    for (var i = 0; i < this.calculationCallbacks.length; i++) {
        var cbOb = this.calculationCallbacks[i];
        if (cbOb.length >= 2 && typeof cbOb[1] == 'function') {
            cbOb[1].call(cbOb[0]);
        } else {
            cbOb();
        }
    }
};
jsCalc.prototype.getRangeRef = function (rangeID) {
    var targRange = null;
    if (this.workbook.isNamedRange(rangeID)) {
        targRange = this.workbook.getRange(rangeID);
    } else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
        var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
        targRange = this.workbook.getRangeReferenceByAddress(rangeSpecifierOb);
    }
    return targRange;
};
jsCalc.prototype.setBuildProgressCallback = function (cbFunc) {
    this.buildProgressCallback = cbFunc;
};
jsCalc.prototype.onBuildProgress = function (progOb) {
    if (this.buildProgressCallback) {
        this.buildProgressCallback(progOb);
    }
};
jsCalc.cbCompare = function (a, b) {
    if (typeof a == 'function' && typeof b == 'function') {
        return a == b;
    } else if (window.isArray(a) && window.isArray(b) && a.length >= 2 && b.length >= 2) {
        return a[0] == b[0] && a[1] == b[1];
    } else
        return false;
};
jsCalc.prototype.saveCurrentPeriodHistoricalData = function (periodRange) {
    var periodRangeName = periodRange ? periodRange : 'xxYear';
    var periodVal = this.getValue(periodRangeName);
    var tlOutputRegex = /^tlOutput.*$/i;
    var outputNames = this.workbook.getNames(tlOutputRegex);
    var curDataSet = {};
    for (var i = 0; i < outputNames.length; i++) {
        var curName = outputNames[i];
        curDataSet[curName] = this.getValue(curName);
        if (typeof curDataSet[curName] == 'object' && !window.isArray(curDataSet[curName])) {
            curDataSet[curName] = curDataSet[curName].data;
        }
    }
    this.historicalData[periodVal] = curDataSet;
};
jsCalc.prototype.getErrorList = function () {
    var tlOutputRegex = '.';
    var outputNames = this.workbook.getNames(tlOutputRegex);
    for (var i = 0; i < outputNames.length; i++) {
        var curName = outputNames[i];
        if (this.getValue(curName) == '#UNINITIALIZED!') {
            console.log(curName + ' = ' + this.getValue(curName));
        }
    }
};
jsCalc.prototype.getBook = function () {
    return this.workbook;
};
jsCalc.prototype.isNamedRange = function (name) {
    return this.workbook.isNamedRange(name);
};
jsCalc.prototype.getFriendlyRangeName = function (address) {
    return this.workbook.getFriendlyName(address);
};
jsCalc.prototype.getNames = function (regExp) {
    return this.workbook.getNames(regExp);
};
jsCalc.prototype.addCourseActionBlock = function (actionObject) {
    for (actionName in actionObject) {
        this.addCourseAction(actionName, actionObject[actionName]);
    }
};
jsCalc.prototype.addCourseAction = function (name, actionFunction) {
    this.courseActions[actionName] = actionFunction;
};
jsCalc.prototype.getExpressionBuilder = function () {
    return this.workbook.expressionBuilder;
};

return jsCalc;

})));
//# sourceMappingURL=jsCalc.src.js.map

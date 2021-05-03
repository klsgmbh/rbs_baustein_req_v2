/* $Id: commons.js 27880 2013-08-26 12:46:17Z jschwarze $ */

/* print("loading commons.js..."); */

var My = new function () {

    this.strictEmpty = function (value) {
        return value === undefined || value === null || value === "";
    };

    this.empty = function (value) {
        return this.strictEmpty(value) || typeof(value) === "string" && /\S/.test(value) === false;
    };

    this.undefinedReplacement = function (value) {
        return value == undefined ? '\u2015' : value;
    };

    this.isCustomReason = function (fieldname) {
        switch (assistants.request.getReason(fieldname)) {
            case 'validation':
            case 'pattern':
                return true;
            case undefined:
            case null:
                return undefined;
            default:
                return false;
        }
    };

    this.checkXssChars = function (value) {
        return !/[<>'"&]/.test(value);
    };

    this.formatEidPlaceType = function (scope) {
        if (scope && scope.FreetextPlace != undefined) {
            return scope.FreetextPlace;
        }
        var value = "";
        if (!My.empty(scope.Street)) {
            value = value + scope.Street;
        }
        if (!My.empty(scope.City)) {
            var city = scope.City;
            if (!My.empty(scope.ZipCode)) {
                city = scope.ZipCode + " " + city;
            }
            if (value.length != 0) {
                value = value + ", ";
            }
            value = value + city;
        }
        if (!My.empty(scope.State)) {
            if (value.length != 0) {
                value = value + ", ";
            }
            value = value + scope.State;
        }
        if (!My.empty(scope.Country)) {
            if (value.length != 0) {
                value = value + ", ";
            }
            value = value + scope.Country;
        }
        return value;
    };

    this.formatEidDocumentType = function (value) {
        return value == undefined ? "" : value;
    };

    this.isDraftVersionUpgrade = function () {
        if (!(assistants.version && assistants.version.restored)) {
            return false;
        }
        var oldMajor = assistants.version.loaded ? Math.floor(assistants.version.loaded) : undefined;
        var newMajor = assistants.version.current ? Math.floor(assistants.version.current) : undefined;
        return oldMajor == undefined && newMajor != undefined || oldMajor != undefined && newMajor != undefined && newMajor > oldMajor;
    };

    this.isValidationPassed = function (result) {
        // Standard and old-style validation functions return just true or false
        if (result === true || result === false) {
            return result;
        }
        // New-style validation functions may return a map or a FailInfo object if the validation failed
        if (result instanceof Object) {
            return false;
        }
        // Convert all other values to boolean for backward compatibility
        return !!result;
    };

    this.mapFieldValidationResult = function (result, rule) {
        return {
            id: rule.id,
            mode: rule.mode, // todo: result instanceof FailInfo? get mode from there.
            // title: "TESTTITLE-" + rule.id,
            // styleClass: "TESTCLASS-" + rule.id,
            styleClass: rule.mode == "loose" ? "invalid loose" : "invalid",
            params: result instanceof Object ? result : undefined // todo: result instanceof FailInfo? get params from there.
        };
    };

    // TODO: By default, stop after first failed strict rule. Unless that rule has a "Resume" flag. If all strict rules pass, apply all loose rules.

    this.doTest = function (test, condition) {
        if (!(submit == "forward" || submit == "finish")) {
            // perform page validation only when leaving the page with forward or finish, ie not when entering a sub-dialog or loop item
            return true;
        }
        if (typeof(assistants.request.validity) == "function") /* new-style validation */ {
            // don't perform page validation if a previous strict field validation or a previous strict page validation has failed
            // note that all loose page validations will be applied at the same time
            if (!assistants.request.validity('fields-strict') || !assistants.request.validity('page-strict')) {
                return true;
            }
        } else /* old-style validation */ {
            if (!assistants.request.valid) {
                // don't perform page validation if a previous field or page validation has failed, see also ASSI-265, ASSI-365
                return true;
            }
        }
        if (condition && !condition()) {
            return true; // don't perform page validaton if pre-condition is false
        }
        // print("doTest: testing " + test);
        var result = test();
        // print("doTest: result=" + result);
        var passed = My.isValidationPassed(result);
        if (passed) {
            // print("doTest: returning " + true);
            return true;
        }
        var mappedResult = {
            result: false,
            params: result instanceof Object ? result : undefined
        };
        // print("doTest: returning " + mappedResult);
        return mappedResult;
    };

    this.doOnValidate = function (rulesList, value) {
        // print("Validating value " + value);
        var failsList = [];
        var strictFails = false;
        // we assume that rulesList contains all strict rules before any loose rules
        for (var i = 0; i < rulesList.length; ++i) {
            var rule = rulesList[i];
            if (rule.mode == "loose" && strictFails) {
                // don't apply loose rules if previous strict rules have failed
                break;
            }
            // print("Considering rule #" + rule.id);
            var result = rule.f(value);
            if (My.isValidationPassed(result)) {
                // print("PASS");
                continue;
            }
            // print("FAIL");
            var item = My.mapFieldValidationResult(result, rule);
            failsList.push(item);
            if (rule.mode != "loose") {
                strictFails = true;
                if (!rule.resume) {
                    // continue only if resume-on-fail is set
                    break;
                }
            }
        }
        if (failsList.length == 0) {
            // print("Returning " + true);
            return true;
        }
        // print("Returning " + failsList);
        return failsList;
    };

};

/* print("commons.js loaded."); */

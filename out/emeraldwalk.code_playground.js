var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        function inject() {
            var injectableKeys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                injectableKeys[_i - 0] = arguments[_i];
            }
            return function (injectableConstructor) {
                injectableConstructor.$inject = injectableKeys;
            };
        }
        Codeground.inject = inject;
        function injected() {
            var injectables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                injectables[_i - 0] = arguments[_i];
            }
            return function (injectableConstructor) {
                injectableConstructor.$inject = injectables.map(function (inj) { return inj.injectAs; });
            };
        }
        Codeground.injected = injected;
        function service(ngModule, injectAs) {
            return function (serviceConstructor) {
                serviceConstructor.injectAs = injectAs;
                ngModule.service(injectAs, serviceConstructor);
            };
        }
        Codeground.service = service;
        function decorator(ngModule, injectAs, directiveOverrides) {
            return function (decoratorConstructor) {
                // tag constructor function with injector key
                decoratorConstructor.injectAs = injectAs;
                // register a directive using decoratorConstructor for controller
                ngModule.directive(injectAs, function () {
                    // defaults
                    var directive = {
                        scope: false,
                        controller: decoratorConstructor,
                        bindToController: true
                    };
                    // overrides
                    if (directiveOverrides) {
                        for (var prop in directiveOverrides) {
                            directive[prop] = directiveOverrides[prop];
                        }
                    }
                    return directive;
                });
            };
        }
        Codeground.decorator = decorator;
        function controller(ngModule, injectAs) {
            return function (controllerConstructor) {
                controllerConstructor.injectAs = injectAs;
                ngModule.controller(injectAs, controllerConstructor);
            };
        }
        Codeground.controller = controller;
        function component(ngModule, injectAs, directiveOverrides) {
            return function (componentConstructor) {
                // tag constructor function with injector key
                componentConstructor.injectAs = injectAs;
                var directiveFactory = function () {
                    // defaults
                    var directive = {
                        scope: {},
                        replace: true,
                        controllerAs: 'vm',
                        controller: componentConstructor,
                        bindToController: true,
                        link: function (scope, element) {
                            element.addClass(injectAs);
                        }
                    };
                    // overrides
                    if (directiveOverrides) {
                        for (var prop in directiveOverrides) {
                            directive[prop] = directiveOverrides[prop];
                        }
                    }
                    return directive;
                };
                // register a directive using componentConstructor for controller
                ngModule.directive(injectAs, directiveFactory);
            };
        }
        Codeground.component = component;
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var codegroundModule = angular.module('emeraldwalk.code-playground', []);
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Components;
        (function (Components) {
            var AceEditorComponent = (function () {
                function AceEditorComponent($scope, $element, $timeout) {
                    var _this = this;
                    $element.addClass('ew-ace-editor');
                    var sourceEditor = ace.edit($element.find('div').get(0));
                    sourceEditor.$blockScrolling = Infinity;
                    sourceEditor.setTheme('ace/theme/monokai');
                    this._session = sourceEditor.getSession();
                    $scope.$watch(function () { return _this.mode; }, function () {
                        _this._session.setMode("ace/mode/" + _this.mode);
                    });
                    $scope.$watch(function () { return _this.source; }, function () {
                        var source = _this.source || '';
                        if (source !== _this.editorValue) {
                            _this.editorValue = source;
                        }
                    });
                    // ace editor changes (with a typing delay)
                    var timeoutPromise;
                    this._session.on('change', function (e) {
                        $timeout.cancel(timeoutPromise);
                        timeoutPromise = $timeout(function () {
                            if (_this.source !== _this.editorValue) {
                                _this.source = _this.editorValue;
                            }
                        }, 1000);
                    });
                }
                Object.defineProperty(AceEditorComponent.prototype, "editorValue", {
                    get: function () {
                        return this._session.getValue();
                    },
                    set: function (value) {
                        this._session.setValue(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AceEditorComponent.prototype, "mode", {
                    get: function () {
                        return this._mode || 'html';
                    },
                    set: function (value) {
                        this._mode = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AceEditorComponent = __decorate([
                    Codeground.component(codegroundModule, 'ewAceEditor', {
                        scope: {
                            mode: '@',
                            source: '=?'
                        },
                        template: "<div><h2>{{vm.mode}}</h2><div></div></div>"
                    }),
                    Codeground.inject('$scope', '$element', '$timeout')
                ], AceEditorComponent);
                return AceEditorComponent;
            }());
            Components.AceEditorComponent = AceEditorComponent;
        })(Components = Codeground.Components || (Codeground.Components = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Components;
        (function (Components) {
            var CodeSample = (function () {
                function CodeSample($scope, $element, $compile) {
                    var _this = this;
                    this.styleUrls = [];
                    this.jsUrls = [];
                    this._$scope = $scope;
                    this._iframeElement = $('<iframe></iframe>').appendTo($element);
                    this._$compile = $compile;
                    $scope.$watchGroup([
                        function () { return _this.styleUrls; },
                        function () { return _this.jsUrls; },
                        function () { return _this.cssContent; },
                        function () { return _this.jsContent; },
                        function () { return _this.htmlContent; }
                    ], function () { return _this._rebuild(); });
                }
                CodeSample.prototype._rebuild = function () {
                    this._buildHead();
                    this._buildBody();
                };
                CodeSample.prototype._buildHead = function () {
                    var iHeadElement = this._iframeElement.contents().find('head').empty();
                    var iElementRaw = this._iframeElement.get(0);
                    // clone page styles to iframe head
                    $("head link[type='text/css']").clone().appendTo(iHeadElement);
                    $("head style").clone().appendTo(iHeadElement);
                    // create links for style urls
                    this.styleUrls.forEach(function (url) {
                        iHeadElement.append("<link rel=\"" + (url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet') + "\" type=\"text/css\" href=\"" + url + "\">");
                    });
                    // create style tag for raw css wrapped in a sandboxed context
                    if (this.cssContent) {
                        iHeadElement.append("<style type=\"text/css\">" + this.cssContent + "</style>");
                    }
                    // create script tags for all .js urls
                    this.jsUrls.forEach(function (url) {
                        // creating script tags via jQuery doesn't load the scripts, so have to use createElement
                        var script = iElementRaw.contentWindow.document.createElement('script');
                        script.type = "text/javascript";
                        script.src = url;
                        iElementRaw.contentWindow.document.head.appendChild(script);
                    });
                    // create script tag for raw .js
                    if (this.jsContent) {
                        iHeadElement.append("<script type=\"text/javascript\">" + this.jsContent + "</script>");
                    }
                };
                CodeSample.prototype._buildBody = function () {
                    var iBodyElement = this._iframeElement.contents().find('body');
                    iBodyElement.empty();
                    try {
                        var templateFn = this._$compile(this.htmlContent);
                        var html = templateFn(this._$scope);
                        iBodyElement.append(html);
                    }
                    catch (e) {
                        console.log(e);
                    }
                };
                CodeSample = __decorate([
                    Codeground.component(codegroundModule, 'ewCodeSample', {
                        scope: {
                            styleUrls: '=?',
                            jsUrls: '=?',
                            cssContent: '=?',
                            jsContent: '=?',
                            htmlContent: '=?',
                        },
                        template: "<div></div>"
                    }),
                    Codeground.inject('$scope', '$element', '$compile')
                ], CodeSample);
                return CodeSample;
            }());
            Components.CodeSample = CodeSample;
        })(Components = Codeground.Components || (Codeground.Components = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Components;
        (function (Components) {
            var JsEditorComponent = (function (_super) {
                __extends(JsEditorComponent, _super);
                function JsEditorComponent($scope, $element, $timeout) {
                    _super.call(this, $scope, $element, $timeout);
                    this.mode = 'javascript';
                }
                JsEditorComponent = __decorate([
                    Codeground.component(codegroundModule, 'ewJsEditor', {
                        scope: {
                            source: '=?'
                        },
                        template: "<div><h2>{{vm.mode}}</h2><div></div></div>"
                    }),
                    Codeground.inject('$scope', '$element', '$timeout')
                ], JsEditorComponent);
                return JsEditorComponent;
            }(Components.AceEditorComponent));
            Components.JsEditorComponent = JsEditorComponent;
        })(Components = Codeground.Components || (Codeground.Components = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Components;
        (function (Components) {
            var LessEditorComponent = (function (_super) {
                __extends(LessEditorComponent, _super);
                function LessEditorComponent($scope, $element, $timeout, lessService) {
                    var _this = this;
                    _super.call(this, $scope, $element, $timeout);
                    this.mode = 'less';
                    $scope.$watch(function () { return _this.source; }, function () {
                        if (_this.source !== undefined) {
                            var css = lessService.compile(_this.source);
                            _this.onCompileExpression({ value: css });
                        }
                    });
                }
                LessEditorComponent = __decorate([
                    Codeground.component(codegroundModule, 'ewLessEditor', {
                        scope: {
                            source: '=?',
                            onCompileExpression: '&onCompile'
                        },
                        template: "<div><h2>{{vm.mode}}</h2><div></div></div>"
                    }),
                    Codeground.inject('$scope', '$element', '$timeout', 'lessService')
                ], LessEditorComponent);
                return LessEditorComponent;
            }(Components.AceEditorComponent));
            Components.LessEditorComponent = LessEditorComponent;
        })(Components = Codeground.Components || (Codeground.Components = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Components;
        (function (Components) {
            var TsEditorComponent = (function (_super) {
                __extends(TsEditorComponent, _super);
                function TsEditorComponent($scope, $element, $timeout) {
                    var _this = this;
                    _super.call(this, $scope, $element, $timeout);
                    this.mode = 'typescript';
                    $scope.$watch(function () { return _this.source; }, function () {
                        if (_this.source !== undefined) {
                            var out = ts.transpile(_this.source);
                            _this.onCompileExpression({ value: out });
                        }
                    });
                }
                TsEditorComponent = __decorate([
                    Codeground.component(codegroundModule, 'ewTsEditor', {
                        scope: {
                            source: '=?',
                            onCompileExpression: '&onCompile'
                        },
                        template: "<div><h2>{{vm.mode}}</h2><div></div></div>"
                    }),
                    Codeground.inject('$scope', '$element', '$timeout')
                ], TsEditorComponent);
                return TsEditorComponent;
            }(Components.AceEditorComponent));
            Components.TsEditorComponent = TsEditorComponent;
        })(Components = Codeground.Components || (Codeground.Components = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Services;
        (function (Services) {
            var LessService = (function () {
                function LessService() {
                }
                /** Compile less to css using a temporary <style> tag and less compiler. */
                LessService.prototype.compile = function (lessStr) {
                    var style = $("<style id=\"less-service-tmp\" type=\"text/less\">" + lessStr + "</style>");
                    style.appendTo('body');
                    // clear any less errors and recompile
                    $('.less-error-message').remove();
                    less.refresh();
                    var result = style.text();
                    style.remove();
                    return result;
                };
                LessService = __decorate([
                    Codeground.service(codegroundModule, 'lessService')
                ], LessService);
                return LessService;
            }());
            Services.LessService = LessService;
        })(Services = Codeground.Services || (Codeground.Services = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var simpleSampleModule = angular.module('simpleSampleModule', ['emeraldwalk.code-playground']);
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Samples;
        (function (Samples) {
            var SimpleController = (function () {
                function SimpleController($scope) {
                    var _this = this;
                    $scope.$watch(function () { return _this.tsOutput; }, function () {
                        console.log(_this.tsOutput);
                    });
                }
                SimpleController = __decorate([
                    Codeground.controller(codegroundModule, 'SimpleController'),
                    Codeground.inject('$scope')
                ], SimpleController);
                return SimpleController;
            }());
            Samples.SimpleController = SimpleController;
        })(Samples = Codeground.Samples || (Codeground.Samples = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
//# sourceMappingURL=emeraldwalk.code_playground.js.map
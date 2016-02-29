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
    var CodePlayground;
    (function (CodePlayground) {
        function inject() {
            var injectableKeys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                injectableKeys[_i - 0] = arguments[_i];
            }
            return function (injectableConstructor) {
                injectableConstructor.$inject = injectableKeys;
            };
        }
        CodePlayground.inject = inject;
        function injected() {
            var injectables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                injectables[_i - 0] = arguments[_i];
            }
            return function (injectableConstructor) {
                injectableConstructor.$inject = injectables.map(function (inj) { return inj.injectAs; });
            };
        }
        CodePlayground.injected = injected;
        function service(ngModule, injectAs) {
            return function (serviceConstructor) {
                serviceConstructor.injectAs = injectAs;
                ngModule.service(injectAs, serviceConstructor);
            };
        }
        CodePlayground.service = service;
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
        CodePlayground.decorator = decorator;
        function controller(ngModule, injectAs) {
            return function (controllerConstructor) {
                controllerConstructor.injectAs = injectAs;
                ngModule.controller(injectAs, controllerConstructor);
            };
        }
        CodePlayground.controller = controller;
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
        CodePlayground.component = component;
    })(CodePlayground = Emeraldwalk.CodePlayground || (Emeraldwalk.CodePlayground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var codePlaygroundModule = angular.module('emeraldwalk.code-playground', []);
var Emeraldwalk;
(function (Emeraldwalk) {
    var CodePlayground;
    (function (CodePlayground) {
        var Components;
        (function (Components) {
            var AceEditorComponent = (function () {
                function AceEditorComponent($scope, $element, $timeout) {
                    var _this = this;
                    $element.addClass('ew-ace-editor');
                    var sourceEditor = ace.edit($element.get(0));
                    sourceEditor.$blockScrolling = Infinity;
                    sourceEditor.setTheme('ace/theme/monokai');
                    this._session = sourceEditor.getSession();
                    $scope.$watch(function () { return _this.mode; }, function () {
                        _this._session.setMode("ace/mode/" + (_this.mode || 'html'));
                    });
                    $scope.$watch(function () { return _this.source; }, function () {
                        console.log('source:', _this.source);
                        var value = _this._session.getValue();
                        var source = _this.source || '';
                        if (source !== value) {
                            _this._session.setValue(source);
                        }
                    });
                    this._session.on('change', function (e) {
                        $timeout(function () {
                            var value = _this._session.getValue();
                            console.log('value:', value);
                            if (_this.source !== value) {
                                _this.source = value;
                            }
                        });
                    });
                }
                AceEditorComponent = __decorate([
                    CodePlayground.component(codePlaygroundModule, 'ewAceEditor', {
                        scope: {
                            mode: '@',
                            source: '=?'
                        },
                        template: "<div></div>"
                    }),
                    CodePlayground.inject('$scope', '$element', '$timeout')
                ], AceEditorComponent);
                return AceEditorComponent;
            }());
            Components.AceEditorComponent = AceEditorComponent;
        })(Components = CodePlayground.Components || (CodePlayground.Components = {}));
    })(CodePlayground = Emeraldwalk.CodePlayground || (Emeraldwalk.CodePlayground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var CodePlayground;
    (function (CodePlayground) {
        var Components;
        (function (Components) {
            var CodeSample = (function () {
                function CodeSample($scope, $element, $timeout, $compile) {
                    var _this = this;
                    this._$scope = $scope;
                    this._iframeElement = $('<iframe></iframe>').appendTo($element);
                    this._$timeout = $timeout;
                    this._$compile = $compile;
                    $scope.$watch(function () { return _this.htmlContent; }, function () { return _this._buildBody(); });
                    $scope.$watch(function () { return _this.jsContent; }, function () { return _this._buildHead(); });
                }
                CodeSample.prototype._buildHead = function () {
                    var headElement = this._iframeElement.contents().find('head');
                    headElement.append("<script type=\"text/javascript\">" + this.jsContent + "</script>");
                };
                CodeSample.prototype._buildBody = function () {
                    var _this = this;
                    this._$timeout(function () {
                        var bodyElement = _this._iframeElement.contents().find('body').empty();
                        try {
                            var templateFn = _this._$compile(_this.htmlContent);
                            var html = templateFn(_this._$scope);
                            bodyElement.append(html);
                        }
                        catch (e) { }
                    });
                };
                CodeSample = __decorate([
                    CodePlayground.component(codePlaygroundModule, 'ewCodeSample', {
                        scope: {
                            htmlContent: '=',
                            jsContent: '='
                        },
                        template: "<div></div>"
                    }),
                    CodePlayground.inject('$scope', '$element', '$timeout', '$compile')
                ], CodeSample);
                return CodeSample;
            }());
            Components.CodeSample = CodeSample;
        })(Components = CodePlayground.Components || (CodePlayground.Components = {}));
    })(CodePlayground = Emeraldwalk.CodePlayground || (Emeraldwalk.CodePlayground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var CodePlayground;
    (function (CodePlayground) {
        var Components;
        (function (Components) {
            var JsEditorComponent = (function (_super) {
                __extends(JsEditorComponent, _super);
                function JsEditorComponent($scope, $element, $timeout) {
                    _super.call(this, $scope, $element, $timeout);
                    this.mode = 'javascript';
                }
                JsEditorComponent = __decorate([
                    CodePlayground.component(codePlaygroundModule, 'ewJsEditor', {
                        scope: {
                            source: '=?'
                        },
                        template: "<div></div>"
                    }),
                    CodePlayground.inject('$scope', '$element', '$timeout')
                ], JsEditorComponent);
                return JsEditorComponent;
            }(Components.AceEditorComponent));
            Components.JsEditorComponent = JsEditorComponent;
        })(Components = CodePlayground.Components || (CodePlayground.Components = {}));
    })(CodePlayground = Emeraldwalk.CodePlayground || (Emeraldwalk.CodePlayground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var CodePlayground;
    (function (CodePlayground) {
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
                            _this.outputExpression({ value: out });
                        }
                    });
                    // this._session.on('change', (e) => {
                    // 	var out = ts.transpile(this._session.getValue());
                    // 	$timeout(() => {
                    // 		this.outputExpression({value: out});
                    // 	});
                    // });
                }
                TsEditorComponent = __decorate([
                    CodePlayground.component(codePlaygroundModule, 'ewTsEditor', {
                        scope: {
                            source: '=?',
                            outputExpression: '&output'
                        },
                        template: "<div></div>"
                    }),
                    CodePlayground.inject('$scope', '$element', '$timeout')
                ], TsEditorComponent);
                return TsEditorComponent;
            }(Components.AceEditorComponent));
            Components.TsEditorComponent = TsEditorComponent;
        })(Components = CodePlayground.Components || (CodePlayground.Components = {}));
    })(CodePlayground = Emeraldwalk.CodePlayground || (Emeraldwalk.CodePlayground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var CodePlayground;
    (function (CodePlayground) {
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
                    CodePlayground.controller(codePlaygroundModule, 'SimpleController'),
                    CodePlayground.inject('$scope')
                ], SimpleController);
                return SimpleController;
            }());
            Samples.SimpleController = SimpleController;
        })(Samples = CodePlayground.Samples || (CodePlayground.Samples = {}));
    })(CodePlayground = Emeraldwalk.CodePlayground || (Emeraldwalk.CodePlayground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
//# sourceMappingURL=emeraldwalk.code_playground.js.map
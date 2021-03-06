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
/*! *****************************************************************************
Copyright (c) Emeraldwalk. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ 
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        /*
         * Expose decorators on a namespace.
         */
        function exposeDecorators(ns) {
            ns.inject = inject;
            ns.injected = injected;
            ns.service = service;
            ns.decorator = decorator;
            ns.controller = controller;
            ns.component = component;
        }
        Codeground.exposeDecorators = exposeDecorators;
        // exposing on window to make it easier to use
        // decorators inside ts editor
        exposeDecorators(window);
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
var ewCodegroundModule = angular.module('ewCodegroundModule', []);
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
                    Codeground.component(ewCodegroundModule, 'ewAceEditor', {
                        scope: {
                            mode: '@',
                            source: '=?'
                        },
                        template: "<div><header>{{vm.mode}}</header><div></div></div>"
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
                function CodeSample($scope, $element, $compile, $timeout) {
                    var _this = this;
                    this._id = ++CodeSample._lastId;
                    $element.attr('id', this.id);
                    $element.append("<header>Code Sample (" + this.moduleName + " module)</header>");
                    this.styleUrls = [];
                    this.jsUrls = [];
                    this._$scope = $scope;
                    this._iframeElement = $('<iframe></iframe>').appendTo($element);
                    this._$compile = $compile;
                    this._$timeout = $timeout;
                    $scope.$watchGroup([
                        function () { return $('head style').length; },
                        function () { return _this.styleUrls; },
                        function () { return _this.jsUrls; },
                        function () { return _this.cssContent; },
                        function () { return _this.jsContent; },
                        function () { return _this.htmlContent; }
                    ], function () { return _this._rebuild(); });
                    $scope.$watch(function () { return _this._iBodyElement && _this._iBodyElement.get(0).offsetHeight; }, function () {
                        _this._resizeIframe();
                    });
                }
                Object.defineProperty(CodeSample.prototype, "id", {
                    get: function () {
                        return "code-sample-" + this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CodeSample.prototype, "moduleName", {
                    get: function () {
                        return this._moduleName || 'codeSampleModule';
                    },
                    set: function (value) {
                        this._moduleName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                CodeSample.prototype._resizeIframe = function () {
                    var _this = this;
                    this._$timeout.cancel(this._resizeIframePromise);
                    this._resizeIframePromise = this._$timeout(function () {
                        var height = _this._iBodyElement.get(0).offsetHeight;
                        _this._iframeElement.height(height);
                    });
                };
                CodeSample.prototype._getModuleCreationString = function () {
                    var moduleName = this.moduleName;
                    var dependencyStr = this.moduleDependencies && this.moduleDependencies.length > 0
                        ? "'" + this.moduleDependencies.join("', '") + "'"
                        : '';
                    return "var " + moduleName + " = angular.module('" + moduleName + "', [" + dependencyStr + "]);";
                };
                CodeSample.prototype._rebuild = function () {
                    this._iframeElement.height(0);
                    this._iHeadElement = this._iframeElement.contents().find('head').empty();
                    this._iBodyElement = this._iframeElement.contents().find('body').empty();
                    this._buildHead();
                    // adding a sub element that can be removed and re-bootstrapped
                    var appWrapperElement = $('<div class="app-wrapper"></div>');
                    appWrapperElement.appendTo(this._iBodyElement);
                    appWrapperElement.append(this.htmlContent);
                    angular.bootstrap(appWrapperElement.get(0), [this.moduleName]);
                    this._resizeIframe();
                };
                CodeSample.prototype._buildHead = function () {
                    var _this = this;
                    var iElementRaw = this._iframeElement.get(0);
                    // clone page styles to iframe head
                    $("head link[type='text/css']").clone().appendTo(this._iHeadElement);
                    $("head style").clone().appendTo(this._iHeadElement);
                    // create links for style urls
                    this.styleUrls.forEach(function (url) {
                        _this._iHeadElement.append("<link rel=\"" + (url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet') + "\" type=\"text/css\" href=\"" + url + "\">");
                    });
                    // create style tag for raw css
                    if (this.cssContent) {
                        this._iHeadElement.append("<style type=\"text/css\">" + this.cssContent + "</style>");
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
                    // includes a codeSampleModule declaration + any jsContent provided to the directive
                    var jsContent = this._getModuleCreationString();
                    if (this.jsContent) {
                        jsContent = jsContent + " " + this.jsContent;
                    }
                    this._iHeadElement.append("<script type=\"text/javascript\">" + jsContent + "</script>");
                };
                CodeSample._lastId = 0;
                CodeSample = __decorate([
                    Codeground.component(ewCodegroundModule, 'ewCodeSample', {
                        scope: {
                            styleUrls: '=?',
                            jsUrls: '=?',
                            cssContent: '=?',
                            jsContent: '=?',
                            htmlContent: '=?',
                            moduleName: '@',
                            moduleDependencies: '=?'
                        },
                        template: "<div></div>"
                    }),
                    Codeground.inject('$scope', '$element', '$compile', '$timeout')
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
                    Codeground.component(ewCodegroundModule, 'ewJsEditor', {
                        scope: {
                            source: '=?'
                        },
                        template: "<div><header>{{vm.mode}}</header><div></div></div>"
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
                    Codeground.component(ewCodegroundModule, 'ewLessEditor', {
                        scope: {
                            source: '=?',
                            onCompileExpression: '&onCompile'
                        },
                        template: "<div><header>{{vm.mode}}</header><div></div></div>"
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
                    Codeground.component(ewCodegroundModule, 'ewTsEditor', {
                        scope: {
                            source: '=?',
                            onCompileExpression: '&onCompile'
                        },
                        template: "<div><header>{{vm.mode}}</header><div></div></div>"
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
            /**
             * Helper to instantiate a LazyLoadChain.
             */
            function lazyLoad(module) {
                return new LazyLoadChain(module);
            }
            Services.lazyLoad = lazyLoad;
            /**
             * Registering angular services, controllers, etc. can usually only be done pre-bootstrapping.
             * The underlying registration code is available at config time via various providers.
             * This class can swap out the standard registration methods with ones that can be used for
             * registering providers after bootstrapping occurs.
             */
            var LazyLoadChain = (function () {
                function LazyLoadChain(module) {
                    this._module = module;
                }
                /*
                 * Replacing controller function with a version that will stick around for lazy loading.
                 */
                LazyLoadChain.prototype.controller = function () {
                    var module = this._module;
                    module.config(['$controllerProvider', function ($controllerProvider) {
                            module.controller = function (name, controllerConstructor) {
                                $controllerProvider.register(name, controllerConstructor);
                                return this;
                            };
                        }]);
                    return this;
                };
                /*
                 * Replacing service function with a version that will stick around for lazy loading.
                 */
                LazyLoadChain.prototype.service = function () {
                    var module = this._module;
                    module.config(['$provide', function ($provide) {
                            module.service = function (name, serviceConstructor) {
                                $provide.service(name, serviceConstructor);
                                return this;
                            };
                        }]);
                    return this;
                };
                return LazyLoadChain;
            }());
            Services.LazyLoadChain = LazyLoadChain;
        })(Services = Codeground.Services || (Codeground.Services = {}));
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
                    Codeground.service(ewCodegroundModule, 'lessService')
                ], LessService);
                return LessService;
            }());
            Services.LessService = LessService;
        })(Services = Codeground.Services || (Codeground.Services = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
var Emeraldwalk;
(function (Emeraldwalk) {
    var Codeground;
    (function (Codeground) {
        var Samples;
        (function (Samples) {
            var BasicTsNgSample = (function () {
                function BasicTsNgSample() {
                    this.htmlOutput = '<div ng-controller="MyController as vm">{{vm.message}}</div>';
                    this.lessSource =
                        "body {\n\tpadding: 10px;\n\tbackground: green;\n\tcolor: white;\n\n\tdiv {\n\t\theight: 400px;\n\t}\n}";
                    this.tsSource =
                        "@controller(codeSampleModule, 'MyController')\nclass MyController {\n\tpublic message: string = 'Hello';\n}";
                }
                BasicTsNgSample = __decorate([
                    Codeground.component(ewCodegroundModule, 'ewBasicTsNgSample', {
                        template: "<div>\n\t<h1>Codeground Sample</h1>\n\t<p>This sample shows .less and .ts compilation components with angular.js support.</p>\n\t<div class=\"clearfix\">\n\t\t<div class=\"pull-left\">\n\t\t\t<div class=\"split-editor\">\n\t\t\t\t<ew-ace-editor source=\"vm.htmlOutput\"></ew-ace-editor>\n\t\t\t\t<ew-less-editor source=\"vm.lessSource\" on-compile=\"vm.lessOutput = value\"></ew-less-editor>\n\t\t\t</div>\n\t\t\t<div class=\"split-editor\">\n\t\t\t\t<ew-ts-editor source=\"vm.tsSource\" on-compile=\"vm.tsOutput = value\"></ew-ts-editor>\n\t\t\t\t<ew-js-editor source=\"vm.tsOutput\"></ew-js-editor>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"pull-left output\">\n\t\t\t<ew-code-sample module-name=\"codeSampleModule\"\n\t\t\t\t\t\t\tmodule-dependencies=\"['ewCodegroundModule']\"\n\t\t\t\t\t\t\tcss-content=\"vm.lessOutput\"\n\t\t\t\t\t\t\tjs-content=\"vm.tsOutput\"\n\t\t\t\t\t\t\thtml-content=\"vm.htmlOutput\"></ew-code-sample>\n\t\t</div>\n\t</div>\n</div>"
                    })
                ], BasicTsNgSample);
                return BasicTsNgSample;
            }());
            Samples.BasicTsNgSample = BasicTsNgSample;
        })(Samples = Codeground.Samples || (Codeground.Samples = {}));
    })(Codeground = Emeraldwalk.Codeground || (Emeraldwalk.Codeground = {}));
})(Emeraldwalk || (Emeraldwalk = {}));
//# sourceMappingURL=emeraldwalk-codeground.js.map
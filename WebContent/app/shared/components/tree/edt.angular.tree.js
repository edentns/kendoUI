(function () {
    angular.module("edtApp.ui")
        .controller("edtTreeController", ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
            var self = this,
                options = $scope.edtTree;

            options.element = $element[0];
            self.tree = new collection.Tree(options);
            self.tree.appScope = self.tree.appScope || $scope.$parent.$parent;

            $scope.$parent.$watchCollection(function() { return $scope.edtTree.data; }, function (newVal) {
                if (newVal) {
                    self.tree.data = newVal;
                    self.tree._requestParse();
                }
            });
        }])

        .directive("edtTree", ["$compile", "$templateCache", "$window", function ($compile, $templateCache, $window) {
            return {
                restrict    : "A",
                templateUrl : "edtTree/template",
                scope       : {
                    edtTree : "="
                },
                controller  : "edtTreeController",
                compile     : function () {
                    return {
                        post : function (scope, element, attrs, treeCtrl) {
                            scope.tree = treeCtrl.tree;

                            if (scope.tree.onRegisterApi) {
                                scope.tree.onRegisterApi(scope.tree);
                            }

                            angular.element($window).on("resize", function ($event) {
                                scope.tree._resize();
                            });
                        }
                    };
                },
                replace     : true
            };
        }])

        .directive("edtTreeHeader", ["$compile", "$templateCache", "$window", function ($compile, $templateCache, $window) {
            return {
                restrict    : "A",
                templateUrl : "edtTreeHeader/template",
                scope       : false,
                require     : "^edtTree",
                compile     : function () {
                    return {
                        post : function (scope, element, attrs, treeCtrl) {
                            var container = scope.container;
                            container.headerElement = element[0];
                        }
                    };
                }
            };
        }])

        .directive("edtTreeView", ["$compile", "$templateCache", "$window", function ($compile, $templateCache, $window) {
            return {
                restrict    : "A",
                templateUrl : "edtTreeView/template",
                scope       : false,
                require     : "^edtTree",
                compile     : function () {
                    return {
                        post : function (scope, element, attrs, treeCtrl) {
                            var containers  = scope.tree.containers,
                                container   = scope.container;
                            elem        = element[0];

                            container.viewElement = element[0];

                            elem.addEventListener("scroll", function (event) {
                                var i, lng, o;
                                for (i=0, lng=containers.length; i<lng; i+=1) {
                                    o = containers[i];
                                    if (o.isRender()) {
                                        o.viewElement.scrollTop    = edt.getScrollTop(elem);
                                        o.headerElement.scrollLeft = edt.getScrollLeft(elem);
                                    }
                                }
                            });
                        }
                    };
                }
            };
        }])

        .directive("edtTreeViewRow", ["$compile", "$templateCache", "$window", function ($compile, $templateCache, $window) {
            return {
                restrict    : "A",
                templateUrl : "edtTreeViewRow/template",
                scope       : false,
                require     : "^edtTree",
                compile     : function () {
                    return {
                        post : function (scope, element, attrs, treeCtrl) {

                        }
                    };
                }
            };
        }])

        .directive("edtTreeViewCol", ["$compile", "$templateCache", "$window", function ($compile, $templateCache, $window) {
            return {
                restrict    : "A",
                scope       : false,
                require     : "^edtTree",
                compile     : function () {
                    return {
                        pre  : function (scope, element, attrs, treeCtrl) {
                            scope.row.colElements.push(element[0]);

                            var col = scope.col;
                            if (!col.colTemplate) { col.templateHtml = $templateCache.get(scope.col.template); }
                            else { col.templateHtml = col.colTemplate; }

                            col.templateHtml = col.templateHtml.replace("COL_FILTER", col.filter ? "|"+ col.filter : "");
                            col.templateHtml = col.templateHtml.replace("COL_FIELD", "row.entity[col.field]");

                        },
                        post : function (scope, element, attrs, treeCtrl) {
                            var col = scope.col,
                                row = scope.row,
                                sCompile = $compile(col.templateHtml)(scope);

                            if (col.className) { element.addClass(col.className); }

                            scope.$watch(function () { return row.entity[col.field]; }, function (newVal, oldVal) {
                                if (newVal !== oldVal) {
                                    row.dirty = true;
                                }
                            });

                            element.append(sCompile);
                        }
                    };
                }
            };
        }])

        .directive("edtTreeModel", ["$compile", "$templateCache", function ($compile, $templateCache) {
            return {
                restrict    : "A",
                scope       : {
                    ngModel : "="
                },
                compile     : function () {
                    return {
                        post : function (scope, element, attrs) {

                        }
                    };
                }
            };
        }])

        .run(["$templateCache", function ($templateCache) {
            $templateCache.put("edtTree/template",
                "<div class=\"edt-tree\">" +
                "   <div class=\"edt-tree-container\" data-ng-if=\"container.isRender()\" data-ng-repeat=\"container in tree.containers\" data-ng-style=\"{width: container.width}\">" +
                "       <div class=\"edt-tree-header\" data-edt-tree-header data-ng-style=\"{width: container.width}\">" +
                "       </div>" +
                "       <div class=\"edt-tree-view\" data-edt-tree-view data-ng-style=\"{'overflow': container.scroll, width: container.width, height: container.height}\">" +
                "       </div>" +
                "   </div>" +
                "</div>"
            );

            $templateCache.put("edtTreeHeader/template",
                "<div class=\"edt-tree-header-row\" data-ng-style=\"{width: container.headerRowWidth, height: tree.rowHeight}\">" +
                "   <div class=\"edt-tree-header-col\" data-ng-repeat=\"col in container.cols track by $index\" data-ng-style=\"{width: col.width}\">" +
                "       <div class=\"edt-tree-header-col-content\">{{col.displayName}}</div>" +
                "   </div>" +
                "   <div class=\"edt-tree-header-col\" data-ng-if=\"container.hasScroll()\" data-ng-style=\"{width:tree.scrollWidth}\">" +
                "   </div>" +
                "</div>"
            );

            $templateCache.put("edtTreeView/template",
                "<div class=\"edt-tree-view-row\" data-ng-repeat=\"row in container.rows |filter:{visible:true} track by $index\" data-edt-tree-view-row data-ng-style=\"{width: container.viewRowWidth, height: tree.rowHeight}\">" +
                "</div>"
            );

            $templateCache.put("edtTreeViewRow/template",
                "<div class=\"edt-tree-view-col\" data-ng-repeat=\"col in container.cols track by $index\" data-edt-tree-view-col data-ng-style=\"{width: col.width}\">" +
                "</div>"
            );

            $templateCache.put("edtTreeViewCol/template",
                "<div class=\"edt-tree-view-col-content\"><span>{{COL_FIELD COL_FILTER}}<span></div>"
            );


            $templateCache.put("edtTreeViewColHierarchy/template",
                "<div class=\"edt-tree-view-col-content edt-tree-view-col-tree-content\">" +
                "   <a href=\"#\" class=\"edt-tree-hierarchy-icon\" data-ng-style=\"{'padding-left': (row.depth-1)*15}\" data-ng-click=\"row.toggleOpen($event, row)\">" +
                "       <i class=\"fa\" data-ng-class=\"{'fa-chevron-down': row.open && row.hasChildren(), 'fa-chevron-right': !row.open && row.hasChildren()}\"></i>" +
                "       <i class=\"fa\" data-ng-class=\"{'fa-folder-open': row.open && row.hasChildren(), 'fa-folder': !row.open && row.hasChildren(), 'fa-file-text-o': !row.hasChildren()}\"></i>" +
                "   </a>" +
                "   <span>{{COL_FIELD COL_FILTER}}</span>" +
                "</div>"
            );

            $templateCache.put("edtTreeViewColSelect/template",
                "<div class=\"edt-tree-view-col-content\">" +
                "   <select data-ng-model=\"COL_FIELD\">" +
                "       <option data-ng-repeat=\"option in col.selectOptions.options track by $index\" data-ng-selected=\"COL_FIELD==option[col.selectOptions.id]\" value=\"{{option[col.selectOptions.id]}}\">{{option[col.selectOptions.name]}}</option>" +
                "   </select>" +
                "</div>"
            );
        }]);



    var model = {},
        collection = {};

    /**
     * @constructor
     */
    model.Container = function (config) {
        var self = this;
        self.side = "default";
        self.rows = [];
        self.cols = [];
        self.scroll = "hidden";
        self.width = 0;
        self.height = 0;
        self.headerRowWidth = 0;
        self.viewRowWidth   = 0;
        self.element = null;

        self = edt.extend(config, self);
    };

    model.Container.prototype = {
        isRender : function () {
            return this.width > 0;
        },

        hasScroll : function () {
            return this.scroll === "scroll";
        }
    };

    /**
     * @constructor
     */
    model.Row = function (config) {
        var self = this;

        self.id 	 = "";
        self.entity  = null;
        self.open 	 = true;
        self.visible = true;
        self.depth 	 = 0;
        self.dirty 	 = false;

        self.primaryName = "";
        self.parentName  = "";
        self._parent 	 = null;
        self._children 	 = [];
        self.colElements = [];

        self = edt.extend(config, self);
    };

    model.Row.prototype = {
        isRoot : function () {
            return this.entity[this.parentName] === null || this.entity[this.parentName]===0;
        },

        getChildren : function () {
            return this._children;
        },

        hasChildren : function () {
            return this._children.length > 0;
        },

        toggleOpen : function ($event) {
            $event.preventDefault();

            var self = this,
	            parent;

            self.open = !self.open;

            if (self._children.length > 0) {
                edt.each(self._children, "_children", function (child) {
	                parent = child._parent || self;
                    child.visible = parent.open && parent.visible;
                });
            }
        }
    };

    /**
     * @constructor
     */
    model.Col = function ( config ) {
        var self = this;

        self._edit 	= false;
        self._dirty = false;

        self.id 	 = "";
        self.type 	 = "text";

        self.width 	 = 0;
        self.field 	 = "";
        self.displayName = "";
        self.className 	 = "";
        self.colTemplate = "";
        self.template 	 = "edtTreeViewCol/template";
        self.pinned	 	 = "default";

        self = edt.extend(config, self);

        if (!config.colTemplate) {
            switch (self.type) {
                case "tree" :
                    self.template = "edtTreeViewColHierarchy/template";
                    break;

                case "select" :
                    self.template = "edtTreeViewColSelect/template";
                    break;
            }
        }
    };



    /**
     * @param {object} options
     * @constructor
     */
    collection.Tree = function ( options ) {
        var self = this;

        self.data 	  = options.data;
        self.showData = [];
        self.colDefs  = options.colDefs;
        self.cols 	  = [];

        self.primaryName = "";
        self.parentName  = "";
        self.open = true;

        self.element = null;
        self.width   = 0;
        self.height  = 300;
        self.rowHeight = 30;
        self.scrollWidth = edt.constant.element.scrollWidth;

        self.onRegisterApi = null;

        self = edt.extend(options, self);
        self.width 		= edt.getClientWidth(self.element);
        self.containers = [
            new model.Container({side: "left", height: self.height, rowHeight: self.rowHeight}),
            new model.Container({side: "default", height: self.height, rowHeight: self.rowHeight}),
            new model.Container({side: "right", height: self.height, rowHeight: self.rowHeight})
        ];


        self._requestParse();
    };

    collection.Tree.prototype = {
        _requestParse : function () {
            var self = this,
                workedList = self._createWorkedList(self.data),
                treeData   = self._createTree(workedList);

            self.cols  = self._createWorkedColdefs(self.colDefs);

            self.showData = [];
            self.each(treeData, function (child) {
                self.showData.push(child);
            });
            self._setRenderConfig();
        },

        _createWorkedColdefs : function (colDefs) {
            var cols = [],
                i, lng;

            for (i=0, lng=colDefs.length; i<lng; i+=1) {
                cols.push((new model.Col(colDefs[i])));
            }

            return cols;
        },

        _createWorkedList : function (rowList) {
            //rowList = edt.sort(rowList, "POS", "ASC");
            var self = this,
                workedList = [],
                i, lng, entity, row;

            for (i=0, lng=rowList.length; i<lng; i+=1) {
                entity = rowList[i];
                row = new model.Row({
                    id 	   		: i+1,
                    primaryName : self.primaryName,
                    parentName  : self.parentName,
                    entity 		: entity
                });

                workedList.push(row);
            }

            return workedList;
        },

        _createTree : function (treeList) {
            var self 	  	= this,
                primaryName = self.primaryName,
                parentName 	= self.parentName,
                parent 	  	= null,
                treeData	= [],
                rootList  	= [],
                keyGroup  	= {},
                i, lng, row, entity;

            for (i=0, lng=treeList.length; i<lng; i+=1) {
                row    = treeList[i];
                entity = row.entity;

                keyGroup[entity[primaryName]] = row;

                row.open   = self.open;
                if (row.isRoot()) {
                    row._parent = null;
                    row.depth  = 1;
                    rootList.push(row);

                } else {
                    parent = keyGroup[entity[parentName]];
                    row._parent  = parent;
                    row.depth   = parent.depth + 1;
                    row.visible = parent.open && parent.visible;

                    if (parent._children && parent._children.length>0) { parent._children.push(row); }
                    else { parent._children = [row]; }
                }
            }

            for (i=0, lng=rootList.length; i<lng; i+=1) {
                treeData.push(rootList[i]);
            }

            return treeData;
        },


        _init : function () {
            var self = this,
                lContainer = self.containers[0],
                dContainer = self.containers[1],
                rContainer = self.containers[2];

            lContainer.cols = dContainer.cols = rContainer.cols = [];

        },


        _setRenderConfig : function () {
            this._init();

            var self = this,
                lContainer = self.containers[0],
                dContainer = self.containers[1],
                rContainer = self.containers[2],
                cols = self.cols,
                rows = self.showData,
                ltWid = 0, rtWid = 0, dtWid = 0,
                colDef, i, lng;

            for (i=0, lng=cols.length; i<lng; i+=1) {
                colDef = cols[i];

                if (colDef.pinned === "left") {
                    ltWid += colDef.width;
                    lContainer.cols.push(colDef);
                } else if (colDef.pinned === "right") {
                    rtWid += colDef.width;
                    rContainer.cols.push(colDef);
                } else {
                    dtWid += colDef.width;
                    dContainer.cols.push(colDef);
                }
            }

            lContainer.rows	= rows;
            rContainer.rows	= rows;
            dContainer.rows	= rows;

            lContainer.width = lContainer.headerRowWidth = lContainer.viewRowWidth = ltWid;
            rContainer.width = rContainer.headerRowWidth = rContainer.viewRowWidth = rtWid;
            dContainer.width = dContainer.headerRowWidth = dContainer.viewRowWidth = dtWid;

            if (rContainer.width > 0) {
                dContainer.scroll = "hidden";
                rContainer.scroll = "scroll";
                rContainer.headerRowWidth  = rtWid + self.scrollWidth;
            } else {
                rContainer.scroll = "hidden";
                dContainer.scroll = "scroll";
                dContainer.headerRowWidth  = dtWid + self.scrollWidth;
            }

            dContainer.width = self.width - (lContainer.width + rContainer.width);

        },

        _resize : function () {
            var self = this,
                element 	= self.element,
                cols 		= self.cols,
                resizeWidth = edt.getClientWidth(element),
                lContainer  = self.containers[0],
                dContainer  = self.containers[1],
                rContainer  = self.containers[2],
                ltWid = 0, rtWid = 0, dtWid = 0,
                i, lng, colDef;

            for (i=0, lng=cols.length; i<lng; i+=1) {
                colDef = cols[i];

                if (colDef.pinned === "left") {
                    ltWid += colDef.width;
                } else if (colDef.pinned === "right") {
                    rtWid += colDef.width;
                } else {
                    dtWid += colDef.width;
                }
            }

            lContainer.width = lContainer.headerRowWidth = lContainer.viewRowWidth = ltWid;
            rContainer.width = rContainer.headerRowWidth = rContainer.viewRowWidth = rtWid;
            dContainer.width = dContainer.headerRowWidth = dContainer.viewRowWidth = dtWid;

            if (rtWid > 0) {
                dContainer.scroll = "hidden";
                rContainer.scroll = "scroll";
                rContainer.headerRowWidth  = rtWid + self.scrollWidth;
            } else {
                rContainer.scroll = "hidden";
                dContainer.scroll = "scroll";
                dContainer.headerRowWidth  = dtWid + self.scrollWidth;
            }

            dContainer.width = resizeWidth - (lContainer.width + rContainer.width);
        },


        each : function (treeData, fCallback) {
            var self = this,
                i, lng;

            for (i=0, lng=treeData.length; i<lng; i+=1) {
                self._traverse(treeData[i], fCallback);
            }
        },

        _traverse : function (tree, fCallback) {
            var self = this,
                children = tree.getChildren(),
                i, lng;

            if (typeof fCallback === "function") { fCallback(tree); }

            for (i=0, lng=children.length; i<lng; i+=1) {
                self._traverse(children[i], fCallback);
            }
        },

        toggleAll : function (opened) {
            var showData = this.showData,
                i, lng, row, parent;

            for (i=0, lng=showData.length; i<lng; i+=1) {
                row = showData[i];

                row.open = opened;
                if (row._parent) {
                    parent      = row._parent;
                    row.visible = parent.open && parent.visible;
                }
            }
        }
    };
}());

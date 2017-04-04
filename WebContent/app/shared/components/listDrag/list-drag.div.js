(function () {
    'use strict';

    angular.module('edtApp.common.directive')
        
        .directive('edenList', [function() {
            return {
                restrict    : 'AE',
                controller  : EdenListManager,
                templateUrl : 'edenListContainer/template',
                scope       : {
                    edenList : '=',
                    edenListDraggable : '@'
                },
                link        : function(scope, element, attrs, edenListCtrl) {
                }
            };
        }])
        
        .directive('edenListContainer', [function() {
            return {
                restrict    : 'AE',
                require     : '^edenList',
                compile     : function(tElement, tAttrs) {
                    return function(scope, element, attrs, edenListCtrl) {
                        edenListCtrl.rootElement    = element;
                        scope.dataList              = edenListCtrl.data;
                        scope.edenDraggable         = edenListCtrl.drag.draggable;
                        
                        var NODE_CLASS_NAME         = edenListCtrl.drag.className.node;
                        var DRAG_CLASS_NAME         = edenListCtrl.drag.className.nodeDragging;
                        
                        if (scope.edenDraggable) {
                            element.on('dragenter', function(event) {
                                event = event.originalEVent || event;
                                event.preventDefault();
                               
                                var dragNode = angular.element(edenListCtrl.drag.draggedNode);

                                if (!dragNode.hasClass(DRAG_CLASS_NAME)) {
                                    dragNode.addClass(DRAG_CLASS_NAME);
                                }
                            });
                            
                            element.on('dragleave', function(event) {
                                event = event.originalEVent || event;
                                event.preventDefault();
                            });
                            
                            element.on('dragover', function(event) {
                                event = event.originalEvent || event;
                                event.preventDefault();
                            
                                var draggedNode = edenListCtrl.drag.draggedNode,
                                    nodeElement = angular.element(event.target),
                                    isTop;
                                
                                if (!nodeElement.hasClass(NODE_CLASS_NAME)) {
                                    nodeElement = angular.element(event.target).parents('.'+ NODE_CLASS_NAME);
                                }

                                isTop = edenListCtrl.isMouseInFirstHalf(event, nodeElement);
                                

                                if(isTop) {
                                    nodeElement.before(draggedNode);
                                }
                                else {
                                    nodeElement.after(draggedNode);
                                }
                                
                                return false;
                            });
                            
                            element.on('drop', function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                            });
                        }
                    };
                }
            };
        }])
    
        .directive('edenListNode', [function() {
            return {
                restrict    : 'AE',
                require     : '^edenList',
                templateUrl : 'edenListNode/template',
                compile     : function(tElement, tAttrs) {
                    return function(scope, element, attrs, edenListCtrl) {
                        element.on('click', function(event) {
                            edenListCtrl.selectItem(element, scope.list);
                        });
                        
                        edenListCtrl.addElement(element);
                    };
                }
            };
        }])
        
        .directive('edenNodeDraggable', [function() {
            return {
                restrict    : 'A',
                require     : '^edenList',
                replace     : false,
                scope       : {
                    edenNodeDraggable: '='    
                },
                link        : function(scope, element, attrs, edenListCtrl) {
                    if (scope.edenNodeDraggable) {
                        element.attr('draggable', true);
                        
                        element.on('dragstart', function(event) {
                            event = event.originalEvent || event;
                            event.stopPropagation();
                        
                            edenListCtrl.drag.draggedNode = event.target;
                            event.dataTransfer.effectAllowed = 'move';
                            event.dataTransfer.setData("text/html", event.target);
                        });
                        
                        element.on('dragend', function(event) {
                            event = event.originalEvent || event;
                            event.preventDefault();
                            event.stopPropagation();
                        
                            var DRAG_CLASS_NAME = edenListCtrl.drag.className.nodeDragging;
                            var dragNode        = angular.element(edenListCtrl.drag.draggedNode);
                           
                            if (dragNode.hasClass(DRAG_CLASS_NAME)) {
                                dragNode.removeClass(DRAG_CLASS_NAME);
                            }
                            
                            edenListCtrl.processOrder();
                        });
                    }
                }
            };
       }])

        .run(["$templateCache", function ($templateCache) {
            $templateCache.put('edenListContainer/template',
                '<ul eden-list-container class="list-container list-horizon">' +
                    '<li data-ng-repeat="list in dataList" class="list-node" data-uuid="{{list.uuid}}" eden-list-node="list" eden-node-draggable="edenListDraggable"></li>' +
                '</ul>'
            );

            $templateCache.put('edenListNode/template',
                '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                        '<input type="checkbox" data-ng-model="list.visible">' +
                    '</span>' +
                    '<span class="form-control">{{list.displayName}}</span>' +
                '</div>'
            );
        }]);
    
    
    EdenListManager.$inject = ['$scope', '$element', '$attrs']; 
    function EdenListManager($scope, $element, $attrs) {
        var me = this;
        me.listOptions = $scope.edenList;
        me.rootElement  = null;
        me.data = me.orderBy($scope.edenList.data, 'order');
        me.elementData  = [];
        me.drag = {
            className   : {
                node        : 'list-node',
                nodeDragging: 'node-dragging'    
            },
            draggable   : !!$scope.edenListDraggable,
            draggedNode : null
        };
        me.select = {
            className       : {
                selected    : 'selected'
            },
            cachedItem      : null,
            selectedItem    : null
        };

        me.addUUID(me.data);
        me.addApi();
    }
    EdenListManager.prototype = {
        addApi : function() {
            this.listOptions.api = this;
        },
        orderBy: function(edenList, key) {
            return edenList.sort(function(d1, d2) {
                var d1Value = d1[key],
                    d2Value = d2[key];
                
                if (d1Value > d2Value) {
                    return 1;
                } else if (d1Value < d2Value) {
                    return -1;
                } else {
                    return 0;   
                }
            });
            
        },
        addUUID: function(data) {
            angular.forEach(data, function(o) {
                o.uuid = 'list-'+ (1 * new Date() + Math.floor(Math.random()*1000)) +'-'+ o.order;
            });
        },
        processOrder: function() {
            var me              = this;
            var NODE_CLASS_NAME = me.drag.className.node;
            
            me.rootElement.children('.'+ NODE_CLASS_NAME).each(function (idx) {
                var uuid = this.dataset.uuid;
                me.data.forEach(function(data) {
                    if (data.uuid === uuid) {
                        data.order = idx + 1;
                    }
                });
            });
        },
        addElement: function(element) {
            this.elementData.push(element);
        },
        isMouseInFirstHalf: function(event, nodeElement) {
            var mousePointer    = event.offsetY || event.layerY,
                targetSize      = nodeElement.outerHeight();
            
            return mousePointer < targetSize / 2;
        },
        isSelectedItem: function() {
            return !!this.select.selectedItem;
        },
        selectItem: function(element, data) {
            var me = this;
            
            if (me.select.cachedItem) {
                me.select.cachedItem.removeClass(me.select.className.selected);
            }
            element.addClass(me.select.className.selected);
            
            me.select.cachedData    = data;
            me.select.cachedItem    = element;
            me.select.selectedData  = data;
            me.select.selectedItem  = element;
        },
        upSelectedItem: function() {
            var me = this;
            if (!me.isSelectedItem()) {
                return;
            }
            
            var prevElement = me.select.selectedItem.prev();
            prevElement.before(me.select.selectedItem);
            me.processOrder();
        },
        downSelectedItem: function() {
            var me = this;
            if (!me.isSelectedItem()) {
                return;
            }
            
            var afterElement = me.select.selectedItem.next();
            afterElement.after(me.select.selectedItem);
            me.processOrder();
            
        }
    };

    /**
     * @typedef {object} ListDataSet 
     * @property {boolean} visible - show/hide status
     * @property {number} order - order to show
     * @property {string} name - field name
     * @property {string} displayName - displayed name to screen
     * @property {string} templateURL - included the template
     */

    /**
     * 
     * @param {ListDataSet} data - list data property
     * @constructor
     */
    function EdenList(data) {
        var me = this;
        me.uuid         = 'list-'+ (1 * new Date() + Math.floor(Math.random()*1000)) +'-'+ data.order;
        me.entity       = data;
        me.visible      = data.visible;
        me.order        = data.order;
        me.name         = data.name;
        me.displayName  = data.displayName;
        me.templateURL  = data.templateURL;
    }
})();

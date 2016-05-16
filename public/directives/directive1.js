angular.module('directive1',[]).directive('draggable1', function() {
   return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
            element.attr("draggable", true);
            console.log(element);
 
            element.bind("dragstart", function(eventObject) {
                eventObject.dataTransfer.setData("text", attributes.itemid);
            });
        }
    };
});
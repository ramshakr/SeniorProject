angular.module('directive2',[]).directive('droppable1', function() {
  return {
        restrict: "A",
        link: function (scope, element, attributes, ctlr) {
 
            element.bind("dragover", function(eventObject){
                eventObject.preventDefault();
                // console.log(element);
            });
 
            element.bind("drop", function(eventObject) {
                scope.moveToBox(eventObject.dataTransfer.getData("text"));
                eventObject.preventDefault();
            });
        }
    };
});
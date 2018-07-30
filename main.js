controller = (function () {
   var minFloorNumber = 0;
   var maxFloorNumber = 4
   var cabinSets = [];
   // represent the individual moving unit.
   // will handle primary requirement.
   function cabin() {
      var direction = 0;
      var stopAt = [false, false, false, false];
      // can use enum in TS/ES6.
      var currentFloor = 0;
      // accept floor request from cabin or floor controller.
      function goToFloor(floorNumber) {
         if (floorNumber === currentFloor) {
            console.log('Already on same floor');
         } else {
            stopAt[floorNumber] = true;
            if (!direction) {
               if (floorNumber > currentFloor) {
                  direction = 1;
               } else {
                  direction = -1;
               }
               setTimeout(scanQueueForNextFloor, 2000);
            }
         }
      }
      
      function scanQueueForNextFloor() {
         if (hasPendingStops()) {
            if (direction > 0) {
               currentFloor++;
            } else {
               currentFloor--;
            }
            console.log('Reached floor ' + currentFloor);
            stopAt[currentFloor] = false;
            setTimeout(scanQueueForNextFloor, 2000);
         } else {
            // scan in reverse order
            direction = -direction;
            if (hasPendingStops()) {
               // found pending request.
               setTimeout(scanQueueForNextFloor, 2000);
            } else {
               // no pending request in either direction.
               direction = 0;
            }
         }
      }

      function hasPendingStops() {
         if (direction > 0) {
            for (var i = currentFloor + 1; i <= maxFloorNumber; i++) {
               if (stopAt[i]) {
                  return true;
               }
            }
         } else {
            for (var i = currentFloor - 1; i >= minFloorNumber; i--) {
               if (stopAt[i]) {
                  return true;
               }
            }
         }

         return false;
      }

      return {
         goToFloor: goToFloor
      }
   }


   // can have multiple instances based on multiplex system.
   cabinSets.push(new cabin());
   
   function takeMeUpFromFloor(floorNumber) {
      // scan for moving cabins.
      cabinSets.forEach(cabin => {
         if (cabin.direction > 0 && cabin.currentFloor < floorNumber) {
            cabin.goToFloor(floorNumber);
            return;
         }
      });
      // scan for stopped cabins.
      cabinSets.forEach(cabin => {
         if (!cabin.direction) {
            cabin.goToFloor(floorNumber);
            return;
         }
      });
      // force set to first cabin, can be optimized based on current position.
      cabinSets[0].goToFloor(floorNumber);
   }

   function takeMeDownFromFloor(floorNumber) {
      // scan for moving cabins.
      cabinSets.forEach(cabin => {
         if (cabin.direction < 0 && cabin.currentFloor > floorNumber) {
            cabin.goToFloor(floorNumber);
            return;
         }
      });
      // scan for stopped cabins.
      cabinSets.forEach(cabin => {
         if (!cabin.direction) {
            cabin.goToFloor(floorNumber);
            return;
         }
      });
      // force set to first cabin, can be optimized based on current position.
      cabinSets[0].goToFloor(floorNumber);
   }

   return {
      floorUp: takeMeUpFromFloor,
      floorDown: takeMeDownFromFloor,
      cabins: cabinSets
   }

})();
let UpgradedMutationObserver = (function() 
{
        // private variable/property to store the instance's current status; WeakMap is used to improve memory 
        // management as it sheds its value pairs as soon as the instance is not referenced any more:
  const _targetsArrayWeakMap = new WeakMap(), // new WeakMap([[this, []]]) would not work as "this" here is a window object
        // private method-function wrapper that provides access for the object's instance to class prototype
        // methods as well as to an earlier-declared private variable;
        // this wrapper is designed as a function factory as it returns functions that get assigned to the object
        // instance's public methods:
        _callPrototypeMethod = function(prototypeMethod, instance, args)
        {
          // actual type of the private variable/property is set here; runs only once:
          if (typeof _targetsArrayWeakMap.get(instance) === 'undefined')
          {
            _targetsArrayWeakMap.set(instance, []);
          } 
          return function()
          {
            const returnedObject = Object.getPrototypeOf(instance)[prototypeMethod](instance, _targetsArrayWeakMap.get(instance), ...arguments);
            _targetsArrayWeakMap.set(instance, returnedObject.privateVariable);
            return returnedObject.returnValue;
          }
        };
  class UpgradedMutationObserver
  {
    constructor(callback)
    {
      // an arrow function version of the way to attach the object's instance would not need .bind(this)
      // as there is no own "this" in arrow functions, "this" would mean the instance of the object
      this.MutationObserver = new MutationObserver(function( ...args)
      {
        return callback( ...args, this);
      }.bind(this)); 
      this.observe = _callPrototypeMethod('observe', this, arguments); // bind(this);
      this.takeRecords = _callPrototypeMethod('takeRecords', this, arguments); // bind(this);
      this.disconnect = _callPrototypeMethod('disconnect', this, arguments); //.bind(this);
      this.isConnected = _callPrototypeMethod('isConnected', this, arguments); //.bind(this);
      // ... other standard methods like takeRecords() can also taken care of, if necessary
    }
    observe(instance, targetsArray, targetObserve, optionsObserve)
    { 
      // many targets can be observed, though callback function is always the same
      // for the same instance of (Upgraded)MutationObserver:
      instance.MutationObserver.observe(targetObserve, optionsObserve); 
      // before adding targetObserve to the list of observed,
      // it is checked that it exists (at least for now):
      if (document.contains(targetObserve))
      {
        targetsArray.push(targetObserve);
      }
      return {privateVariable: targetsArray};
    }
    takeRecords(instance, targetsArray)
    { 
      // returns a list of all matching DOM changes that have been detected but not yet processed by the observer's callback function, leaving the mutation queue empty      
      return {returnValue: instance.MutationObserver.takeRecords(),
                            privateVariable: targetsArray};
    }
    disconnect(instance, targetsArray)
    { 
      // the method stops observation of all targets at once
      instance.MutationObserver.disconnect();
      targetsArray = [];
      return {privateVariable: targetsArray};
    }
    isConnected(instance, targetsArray, targetToCheck)
    {
      // in case of observed nodes removed from DOM (destroyed), they are filtered out:
      targetsArray = targetsArray.filter(function(e)
      {
        return document.contains(e);
      });
      // maximum versatily of return results is provided 
      // all while maintaining false/"truthy" quasi-boolean dichotomy:
      return {
                privateVariable: targetsArray,
                returnValue: targetsArray.length == 0
                ? false
                : (targetToCheck
                   ? targetsArray.includes(targetToCheck)
                   : targetsArray)
             };
    }
  }
  return UpgradedMutationObserver;
})();
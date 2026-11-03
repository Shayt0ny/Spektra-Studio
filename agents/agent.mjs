var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/react@19.3.0/node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/.pnpm/react@19.3.0/node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop2() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement2(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape2(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index2) {
      return "object" === typeof element && null !== element && null != element.key ? escape2("" + element.key) : index2.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop2, noop2) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement2(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result, thenable = ctor();
        thenable.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = thenable);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    function startTransition(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      currentTransition.types = null !== prevTransition ? prevTransition.types : null;
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop2, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    }
    function addTransitionType(type) {
      var transition = ReactSharedInternals.T;
      if (null !== transition) {
        var transitionTypes = transition.types;
        null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
      } else startTransition(addTransitionType.bind(null, type));
    }
    var Children2 = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement2(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children2;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.addTransitionType = addTransitionType;
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement2;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = startTransition;
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init2) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init2);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.3.0";
  }
});

// node_modules/.pnpm/react@19.3.0/node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/.pnpm/react@19.3.0/node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop2() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
          case REACT_VIEW_TRANSITION_TYPE:
            return "ViewTransition";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement2(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement2(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement2(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape2(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index2) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape2("" + element.key)) : index2.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop2, noop2) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement2(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement2(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var resolveDebugValue = null, rejectDebugValue = null, ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now(), ioInfo.value = new Promise(function(resolve3, reject) {
            resolveDebugValue = resolve3;
            rejectDebugValue = reject;
          }));
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                if (null != _ioInfo) {
                  _ioInfo.end = performance.now();
                  var debugValue = null == moduleObject ? void 0 : moduleObject.default;
                  resolveDebugValue(debugValue);
                  _ioInfo.value.status = "fulfilled";
                  _ioInfo.value.value = debugValue;
                }
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now(), _ioInfo2.value.then(noop2, noop2), rejectDebugValue(error), _ioInfo2.value.status = "rejected", _ioInfo2.value.reason = error);
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function startTransition(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition.types = null !== prevTransition ? prevTransition.types : null;
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop2, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      }
      function addTransitionType(type) {
        var transition = ReactSharedInternals.T;
        if (null !== transition) {
          var transitionTypes = transition.types;
          null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
        } else
          0 === ReactSharedInternals.asyncTransitions && console.error(
            "addTransitionType can only be called inside a `startTransition()` callback. It must be associated with a specific Transition."
          ), startTransition(addTransitionType.bind(null, type));
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve3, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve3, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve3(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement2(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve3, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve3,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve3(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve3, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve3,
                reject
              );
            })) : resolve3(returnValue$jscomp$0);
          }
        };
      };
      exports.addTransitionType = addTransitionType;
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        var propName;
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        (propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++) ? (childArray = Error.stackTraceLimit, Error.stackTraceLimit = 10, childrenLength = Error("react-stack-top-frame"), Error.stackTraceLimit = childArray) : childrenLength = unknownOwnerDebugStack;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          childrenLength,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement2;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = startTransition;
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init2) {
        return resolveDispatcher().useReducer(reducer, initialArg, init2);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.3.0";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/.pnpm/react@19.3.0/node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/.pnpm/react@19.3.0/node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/.pnpm/use-sync-external-store@1.7.0_react@19.3.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var require_use_sync_external_store_shim_production = __commonJS({
  "node_modules/.pnpm/use-sync-external-store@1.7.0_react@19.3.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js"(exports) {
    "use strict";
    var React3 = require_react();
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var useState2 = React3.useState;
    var useEffect2 = React3.useEffect;
    var useLayoutEffect = React3.useLayoutEffect;
    var useDebugValue = React3.useDebugValue;
    function useSyncExternalStore$2(subscribe, getSnapshot) {
      var value = getSnapshot(), _useState = useState2({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
      useLayoutEffect(
        function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        },
        [subscribe, value, getSnapshot]
      );
      useEffect2(
        function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          return subscribe(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          });
        },
        [subscribe]
      );
      useDebugValue(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
      return getSnapshot();
    }
    var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    exports.useSyncExternalStore = void 0 !== React3.useSyncExternalStore ? React3.useSyncExternalStore : shim;
  }
});

// node_modules/.pnpm/use-sync-external-store@1.7.0_react@19.3.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/.pnpm/use-sync-external-store@1.7.0_react@19.3.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
      }
      function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React3.startTransition || (didWarnOld18Alpha = true, console.error(
          "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
        ));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
          var cachedValue = getSnapshot();
          objectIs(value, cachedValue) || (console.error(
            "The result of getSnapshot should be cached to avoid an infinite loop"
          ), didWarnUncachedGetSnapshot = true);
        }
        cachedValue = useState2({
          inst: { value, getSnapshot }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect(
          function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          },
          [subscribe, value, getSnapshot]
        );
        useEffect2(
          function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
            return subscribe(function() {
              checkIfSnapshotChanged(inst) && forceUpdate({ inst });
            });
          },
          [subscribe]
        );
        useDebugValue(value);
        return value;
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(inst, nextValue);
        } catch (error) {
          return true;
        }
      }
      function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var React3 = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState2 = React3.useState, useEffect2 = React3.useEffect, useLayoutEffect = React3.useLayoutEffect, useDebugValue = React3.useDebugValue, didWarnOld18Alpha = false, didWarnUncachedGetSnapshot = false, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
      exports.useSyncExternalStore = void 0 !== React3.useSyncExternalStore ? React3.useSyncExternalStore : shim;
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/.pnpm/use-sync-external-store@1.7.0_react@19.3.0/node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/.pnpm/use-sync-external-store@1.7.0_react@19.3.0/node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_use_sync_external_store_shim_production();
    } else {
      module.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// agent/main.ts
import { readFile as readFile4, copyFile } from "node:fs/promises";
import { createInterface as createInterface2 } from "node:readline";
import { constants } from "node:fs";

// agent/workspace.ts
import { readFile as readFile2, mkdtemp, rm, stat } from "node:fs/promises";
import { join as join2, resolve as resolve2 } from "node:path";
import { tmpdir } from "node:os";

// agent/io.ts
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// src/shared/retiredMaterials.ts
function isRetiredResearchPaper(value) {
  return value === "research_ilford_fb_warmtone" || value === "research_ilford_art_300";
}

// src/shared/geometry.ts
var CROP_FULL = { x: 0, y: 0, width: 1, height: 1 };
var RATIOS = {
  square: 1,
  r3x2: 3 / 2,
  r2x3: 2 / 3,
  r4x3: 4 / 3,
  r3x4: 3 / 4,
  r16x9: 16 / 9,
  r9x16: 9 / 16,
  r5x4: 5 / 4,
  r4x5: 4 / 5,
  r7x5: 7 / 5,
  r5x7: 5 / 7
};
var TRANSPOSE = {
  free: "free",
  square: "square",
  original: "originalPortrait",
  originalPortrait: "original",
  r3x2: "r2x3",
  r2x3: "r3x2",
  r4x3: "r3x4",
  r3x4: "r4x3",
  r16x9: "r9x16",
  r9x16: "r16x9",
  r5x4: "r4x5",
  r4x5: "r5x4",
  r7x5: "r5x7",
  r5x7: "r7x5"
};
function aspectRatio(a, sourceAspect) {
  if (a === "original") return sourceAspect;
  if (a === "originalPortrait") return 1 / Math.max(sourceAspect, Number.MIN_VALUE);
  return RATIOS[a] ?? null;
}
var GEOMETRY_DEFAULT = {
  crop: CROP_FULL,
  angle: 0,
  quarterTurns: 0,
  flipH: false,
  flipV: false,
  aspect: "free",
  intendedSize: null,
  lockedRatio: null
};
var mod4 = (n) => (Math.round(n) % 4 + 4) % 4;
var isIdentity = (g) => g.crop.x === 0 && g.crop.y === 0 && g.crop.width === 1 && g.crop.height === 1 && g.angle === 0 && mod4(g.quarterTurns) === 0 && !g.flipH && !g.flipV;
var centre = (g) => ({ x: g.crop.x + g.crop.width / 2, y: g.crop.y + g.crop.height / 2 });
function lockRatio(g, sourceAspect) {
  return g.lockedRatio ?? aspectRatio(g.aspect, sourceAspect);
}
function outputSize(g, image) {
  const w = Math.max(Math.round(g.crop.width * image.width), 1);
  const h = Math.max(Math.round(g.crop.height * image.height), 1);
  return mod4(g.quarterTurns) % 2 === 0 ? { width: w, height: h } : { width: h, height: w };
}
function corners(g, image) {
  const w = Math.max(image.width, 1);
  const h = Math.max(image.height, 1);
  const c = centre(g);
  const hw = g.crop.width / 2 * w;
  const hh = g.crop.height / 2 * h;
  const a = g.angle * Math.PI / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  return [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ].map(([sx, sy]) => {
    const px = sx * hw;
    const py = sy * hh;
    return { x: c.x + (px * ca - py * sa) / w, y: c.y + (px * sa + py * ca) / h };
  });
}
function fits(g, image, eps = 1e-6) {
  return corners(g, image).every((p) => p.x >= -eps && p.y >= -eps && p.x <= 1 + eps && p.y <= 1 + eps);
}
function snappedToFrame(g, eps = 1e-5) {
  if (g.angle !== 0) return g;
  const crop = { ...g.crop };
  const snap = (o, l) => {
    if (crop[o] < 0 && crop[o] > -eps) {
      crop[l] += crop[o];
      crop[o] = 0;
    }
    if (crop[o] + crop[l] > 1 && crop[o] + crop[l] < 1 + eps) crop[l] = 1 - crop[o];
  };
  snap("x", "width");
  snap("y", "height");
  return { ...g, crop };
}
function fitted(g0, image) {
  const g = { ...g0, crop: { ...g0.crop } };
  g.crop.x = clamp(g.crop.x + g.crop.width / 2, 0, 1) - g.crop.width / 2;
  g.crop.y = clamp(g.crop.y + g.crop.height / 2, 0, 1) - g.crop.height / 2;
  if (fits(g, image)) return snappedToFrame(g);
  const c = centre(g);
  let lo = 0;
  let hi = 1;
  const at = (k) => ({
    ...g,
    crop: {
      x: c.x - g.crop.width * k / 2,
      y: c.y - g.crop.height * k / 2,
      width: g.crop.width * k,
      height: g.crop.height * k
    }
  });
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (fits(at(mid), image)) lo = mid;
    else hi = mid;
  }
  return snappedToFrame(at(lo));
}
function constrained(g, image, anchor = { x: 0.5, y: 0.5 }) {
  const w = Math.max(image.width, 1);
  const h = Math.max(image.height, 1);
  const ratio = lockRatio(g, w / h);
  if (ratio == null) return fitted(g, image);
  const pw = g.crop.width * w;
  const ph = g.crop.height * h;
  const area = Math.max(pw * ph, 1);
  const nw = Math.sqrt(area * ratio);
  const nh = nw / ratio;
  const x1 = g.crop.x + g.crop.width * anchor.x;
  const y1 = g.crop.y + g.crop.height * anchor.y;
  const out = {
    ...g,
    crop: { x: x1 - nw / w * anchor.x, y: y1 - nh / h * anchor.y, width: nw / w, height: nh / h }
  };
  return { ...fitted(out, image), intendedSize: { width: out.crop.width, height: out.crop.height } };
}
function decodeGeometry(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const c = o.crop && typeof o.crop === "object" ? o.crop : {};
  const num3 = (v, d) => typeof v === "number" && Number.isFinite(v) ? v : d;
  const size = (v) => Array.isArray(v) && v.length === 2 && typeof v[0] === "number" && typeof v[1] === "number" ? { width: v[0], height: v[1] } : null;
  return {
    crop: { x: num3(c.x, 0), y: num3(c.y, 0), width: num3(c.width, 1), height: num3(c.height, 1) },
    angle: num3(o.angle, 0),
    quarterTurns: mod4(num3(o.quarterTurns, 0)),
    flipH: o.flipH === true,
    flipV: o.flipV === true,
    aspect: typeof o.aspect === "string" && o.aspect in TRANSPOSE ? o.aspect : "free",
    intendedSize: size(o.intendedSize),
    lockedRatio: typeof o.lockedRatio === "number" ? o.lockedRatio : null
  };
}
function encodeGeometry(g) {
  const out = {
    crop: g.crop,
    angle: g.angle,
    quarterTurns: mod4(g.quarterTurns),
    flipH: g.flipH,
    flipV: g.flipV,
    aspect: g.aspect
  };
  if (g.intendedSize) out.intendedSize = [g.intendedSize.width, g.intendedSize.height];
  if (g.lockedRatio != null) out.lockedRatio = g.lockedRatio;
  return out;
}

// src/shared/filmEdge.ts
var EDGE_FORMATS = [
  { id: "135", label: "135", long: 36, short: 24, gauge: "135" },
  { id: "135_half", label: "Half frame", long: 24, short: 18, gauge: "135" },
  { id: "120_645", label: "645", long: 56, short: 41.5, gauge: "120" },
  { id: "120_6x6", label: "6\xD76", long: 56, short: 56, gauge: "120" },
  { id: "120_6x7", label: "6\xD77", long: 69.5, short: 56, gauge: "120" },
  { id: "120_6x8", label: "6\xD78", long: 76, short: 56, gauge: "120" },
  { id: "120_6x9", label: "6\xD79", long: 84, short: 56, gauge: "120" },
  { id: "135_xpan", label: "XPan", long: 65, short: 24, gauge: "135", panoramic: true },
  { id: "120_6x12", label: "6\xD712", long: 112, short: 56, gauge: "120", panoramic: true },
  { id: "120_6x17", label: "6\xD717", long: 168, short: 56, gauge: "120", panoramic: true }
];
var edgeFormat = (id) => EDGE_FORMATS.find((f) => f.id === id);
function edgeEffective(edge, gate, noFilm = false) {
  return !noFilm && gate?.overscan !== false && edge.active && !!edgeFormat(edge.format);
}
function dateCamera(d, edge, gate) {
  return edgeFormat(edgeEffective(edge, gate) ? edge.format : d.camera ?? "");
}
function datePrints(face, d, edge, gate) {
  const camera = dateCamera(d, edge, gate);
  return !!camera && !("panoramic" in camera) && (face !== "data" && camera.gauge !== "120" || edgeEffective(edge, gate));
}
function dateEffective(d, edge, gate, noFilm = false) {
  return !noFilm && gate?.dateImprint !== false && d.active && datePrints(d.face, d, edge, gate) && (d.face === "data" || d.placement === "frame" || edgeEffective(edge, gate));
}
function sourceGeometryFor(p, g, gate, noFilm = false) {
  return !noFilm && (edgeEffective(p.filmEdge, gate) || dateEffective(p.dateBack, p.filmEdge, gate) && !isIdentity(g)) ? g : null;
}
function canvasGeometryFor(p, g, gate, noFilm = false) {
  return sourceGeometryFor(p, g, gate, noFilm) ? GEOMETRY_DEFAULT : g;
}
function gateFramed(g, edge, size, landscape) {
  if (edge.followCrop && !edge.pair) return g;
  const f = edgeFormat(edge.format);
  if (!f || !(size.width > 0 && size.height > 0)) return g;
  const along = edge.pair ? 37 : f.long, across = edge.pair ? 24 : f.short;
  const horizontal = landscape ?? g.crop.width * size.width >= g.crop.height * size.height;
  return constrained({ ...g, lockedRatio: horizontal ? along / across : across / along }, size);
}
function framingKey(g) {
  const c = g.crop;
  return [
    c.x.toFixed(6),
    c.y.toFixed(6),
    c.width.toFixed(6),
    c.height.toFixed(6),
    g.angle.toFixed(4),
    (g.quarterTurns % 4 + 4) % 4,
    Number(g.flipH),
    Number(g.flipV)
  ].join(",");
}
function captureDate(text, order) {
  const match = /^(\d{4})[:-](\d{2})[:-](\d{2})(?:[T\s]|$)/.exec(text ?? "");
  if (!match) return "";
  const [year, month, day] = match.slice(1).map(Number);
  if (year <= 1800 || month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate()) return "";
  const yy = `'${String(year % 100).padStart(2, "0")}`;
  return order === "us" ? `${month} ${day} ${yy}` : `${yy} ${month} ${day}`;
}
function dateBackText(d, metadata) {
  if (d.face === "data") return shootingText(metadata);
  const clock = d.customDateTime ?? metadata?.datetime_original;
  const date = captureDate(clock, d.order);
  const match = /[T\s](\d{2}):(\d{2})/.exec(clock ?? "");
  const time = date && match && Number(match[1]) < 24 && Number(match[2]) < 60 ? `${match[1]}:${match[2]}` : "";
  return d.content === "time" ? time : d.content === "date_time" ? [date, time].filter(Boolean).join(" ") : date;
}
function shootingText(m) {
  if (!m) return "";
  const extra = m;
  const trim = (n) => n.toFixed(1).replace(/\.0$/, "");
  const fields2 = [];
  if (m.shutter_s && Number.isFinite(m.shutter_s) && m.shutter_s > 0)
    fields2.push(m.shutter_s >= 1 ? `${trim(m.shutter_s)}s` : `1/${Math.round(1 / m.shutter_s)}`);
  if (m.aperture && Number.isFinite(m.aperture) && m.aperture > 0) fields2.push(`F${trim(m.aperture)}`);
  const mode = { 1: "M", 2: "P", 3: "A", 4: "S" }[extra.exposure_program ?? 0];
  if (mode) fields2.push(mode);
  if (Number.isFinite(extra.exposure_bias_ev)) {
    const b = Math.round(extra.exposure_bias_ev * 10) / 10;
    if (b !== 0) fields2.push(`${b > 0 ? "+" : ""}${b.toFixed(1)}`);
  }
  if (extra.focal_35mm && Number.isFinite(extra.focal_35mm) && extra.focal_35mm > 0) fields2.push(`${Math.round(extra.focal_35mm)}mm`);
  while (fields2.join(" ").length > 22) fields2.pop();
  return fields2.join(" ");
}
var EDGE_WORDS = {
  kodak_gold_200: ["KODAK GB 200-7", "KODAK 200"],
  kodak_portra_800: ["KODAK PORTRA 800-3", "KODAK PORTRA 800"],
  kodak_portra_800_push1: ["KODAK PORTRA 800-3", "KODAK PORTRA 800"],
  kodak_portra_800_push2: ["KODAK PORTRA 800-3", "KODAK PORTRA 800"],
  kodak_ultramax_400: ["KODAK GC 400"],
  kodak_ektachrome_100: ["KODAK E100"],
  fujifilm_c200: ["FUJI 200"],
  fujifilm_xtra_400: ["S-400", "FUJI S-400"],
  fujifilm_pro_400h: ["PRO400H", "FUJI PRO400H"],
  fujifilm_provia_100f: ["FUJI RDPIII"],
  fujifilm_velvia_100: ["RVP100", "FUJI RVP100"],
  kodak_vision3_50d: ["EASTMAN 5203"],
  kodak_vision3_250d: ["EASTMAN 5207"],
  kodak_vision3_200t: ["EASTMAN 5213"],
  kodak_vision3_500t: ["EASTMAN 5219"],
  cinestill_800t: ["CINESTILL 800T"],
  // CineStill prints its own name on both gauges (1.3.4)
  kodak_tri_x_400: ["KODAK 400TX"],
  kodak_tmax_100: ["KODAK 100TMX"],
  fujifilm_neopan_acros_100_ii: ["FUJI 100 ACROS II"],
  ilford_hp5_plus_400: ["ILFORD HP5 PLUS"]
};
function edgeText(stock, format) {
  if (!stock) return "";
  const own = EDGE_WORDS[stock.id];
  return own ? edgeFormat(format)?.gauge === "120" ? own[1] ?? own[0] : own[0] : stock.name.split("(")[0].trim().toUpperCase();
}
function resolveFilmEdgeParams(p, geometry, metadata, catalog, native) {
  const dataText = shootingText(metadata), f = p.filmEdge;
  const sourceAspect = native ? Math.max(native.width, native.height) / Math.max(1, Math.min(native.width, native.height)) : 1.5;
  const camera = edgeEffective(f) ? f.format : EDGE_FORMATS.filter((v) => ["135", "135_half", "120_645"].includes(v.id)).find((v) => Math.abs(v.long - p.filmFormatMM) <= 1 && Math.abs(v.short - p.filmFormatMM / sourceAspect) <= 1)?.id ?? null;
  const cut = native ? outputSize(geometry, native) : null;
  return { ...p, filmEdge: {
    ...f,
    edgeText: edgeText(catalog.stock(p.filmStock), f.format),
    fNumber: metadata?.aperture ?? 0,
    framing: framingKey(geometry)
  }, dateBack: {
    ...p.dateBack,
    camera,
    dataText,
    text: dateBackText(p.dateBack, metadata),
    framing: isIdentity(geometry) ? "" : framingKey(geometry),
    frameScale: cut && native ? Math.max(cut.width, cut.height) / Math.max(native.width, native.height) : 1
  } };
}
function filmFormatForWire(p, gate) {
  return !edgeEffective(p.filmEdge, gate) && dateEffective(p.dateBack, p.filmEdge, gate) && p.dateBack.framing ? p.filmFormatMM * p.dateBack.frameScale : p.filmFormatMM;
}
function dateScale(p, gate) {
  const camera = dateCamera(p.dateBack, p.filmEdge, gate);
  return !edgeEffective(p.filmEdge, gate) && dateEffective(p.dateBack, p.filmEdge, gate) && p.dateBack.framing && camera ? Math.max(0.05, Math.min(1, filmFormatForWire(p, gate) / camera.long)) : 1;
}

// src/shared/params.ts
var clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
var FILM_FRAMES_CINE = [
  { id: "Super 8", short: 4.01, long: 5.79, isCine: true },
  { id: "16mm", short: 7.49, long: 10.26, isCine: true },
  { id: "Super 16", short: 7.41, long: 12.52, isCine: true },
  { id: "Super 35", short: 14, long: 24.89, isCine: true },
  { id: "65mm", short: 23.01, long: 52.63, isCine: true }
];
var FILM_FRAME_CUSTOM = { id: "Custom", short: 24, long: 36, isCine: false };
var FILM_FRAMES_STILL = [
  { id: "110", short: 13, long: 17, isCine: false },
  { id: "APS", short: 16.7, long: 30.2, isCine: false },
  { id: "135", short: 24, long: 36, isCine: false },
  { id: "120", short: 56, long: 56, isCine: false },
  FILM_FRAME_CUSTOM
];
var FILM_FRAMES = [...FILM_FRAMES_CINE, ...FILM_FRAMES_STILL];
var filmFrameNamed = (id) => FILM_FRAMES.find((f) => f.id === id) ?? FILM_FRAME_CUSTOM;
function filmFormatMM(side, sideLengthMM, aspect, cropScale = 1) {
  const long = side === "long" ? sideLengthMM : sideLengthMM * Math.max(aspect, 1);
  return clamp(long * Math.max(cropScale, 1), 4, 200);
}
var EXPOSURE_METHODS = ["balanced", "center", "protect_highlights", "protect_shadows", "center_weighted"];
var CONTRAST_MASK_DEFAULT = {
  active: false,
  highlights: 0,
  shadows: 0,
  core: 1,
  scale: 0.03,
  scheme: "gaussian"
};
var CONTRAST_MASK_SCALE = [2e-3, 0.12];
var SCENE_LATITUDE_DEFAULT = {
  highlightPullBack: 0,
  shadowPullBack: 0,
  shadowPercentile: 0.1,
  highlightPercentile: 99.9,
  active: false,
  norm: "power",
  highlightKnee: 2,
  highlightRoom: 0,
  shadowKnee: -2,
  shadowRoom: 0,
  rolloff: 2,
  maxLift: 4
};
var EFFECTS_DEFAULT = {
  grain: 1,
  grainModel: "standard",
  grainLayered: true,
  halation: 1,
  antihalationRemoved: false,
  highlightBoost: 0,
  highlightHeadroom: 4,
  scatter: 1,
  couplersActive: true,
  couplers: 1,
  glare: 1
};
var EFFECT_RANGES = {
  grain: [0, 2],
  halation: [0, 4],
  scatter: [0, 1],
  highlightBoost: [0, 8],
  highlightHeadroom: [0, 8],
  // Not the wire's 0…4: above ≈1.736 the coupler inverse is not monotonic
  // (AGENTS.md trap 22), so the slider stops short of it.
  couplers: [0, 1.5],
  glare: [0, 30]
};
var FILM_EDGE_FORMATS = [
  "135",
  "135_half",
  "135_xpan",
  "120_645",
  "120_6x6",
  "120_6x7",
  "120_6x8",
  "120_6x9",
  "120_6x12",
  "120_6x17"
];
var FILM_EDGE_DEFAULT = {
  active: false,
  followCrop: true,
  format: "135",
  view: "strip",
  gate: "auto",
  holes: "white",
  cameraSeed: 1,
  frameSeed: 1,
  frameNumber: 0,
  fog: 1,
  leaks: 0,
  edgeText: "",
  fNumber: 0,
  framing: "",
  pair: false,
  seeded: false
};
var DATE_BACK_DEFAULT = {
  active: false,
  face: "lcd",
  order: "japan",
  placement: "frame",
  corner: "br",
  insetXMM: 3,
  insetYMM: 2.4,
  size: 1,
  brightnessEV: 3.5,
  text: "",
  textB: "",
  withData: false,
  dataText: "",
  customText: null,
  customDateTime: null,
  content: "date",
  camera: "135",
  framing: "",
  frameScale: 1
};
var FILM_PARAMS_DEFAULT = {
  filmStock: "kodak_portra_400",
  printStock: "kodak_supra_endura",
  exposureCompensationEV: 0,
  exposureBaselineEV: 0,
  autoExposureMethod: "balanced",
  autoExposure: true,
  filmFormatMM: 36,
  filmFrame: "135",
  filmSide: "short",
  sideLengthMM: 24,
  grainActive: true,
  cameraLensBlurUm: 0,
  grainBlur: 0.65,
  enlargerLensBlur: 0,
  scannerUnsharpRadius: 0.7,
  scannerUnsharpAmount: 0.7,
  densityCurveGamma: 1,
  scannerWhiteCorrection: false,
  scannerBlackCorrection: false,
  scannerLensBlur: 0,
  halationActive: true,
  printBrightnessStops: 0,
  yFilterShift: 0,
  mFilterShift: 0,
  glareActive: true,
  scanFilm: false,
  digitalIntermediate: false,
  extendedDynamicRange: false,
  preflashExposure: 0,
  contrastMask: CONTRAST_MASK_DEFAULT,
  sceneLatitude: SCENE_LATITUDE_DEFAULT,
  sceneLatitudeOther: SCENE_LATITUDE_DEFAULT,
  placementIsRight: false,
  pairSplit: 0,
  effects: EFFECTS_DEFAULT,
  printEffects: true,
  filmEdge: FILM_EDGE_DEFAULT,
  dateBack: DATE_BACK_DEFAULT
};
var FILTER_SHIFT_CC = 40;
var printExposure = (stops) => clamp(Math.pow(2, -stops), 0.05, 20);
function obj(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}
function decodeShape(raw, d) {
  const o = obj(raw);
  const out = { ...d };
  for (const k of Object.keys(d)) {
    const v = o[k];
    const dv = d[k];
    if (v === void 0) continue;
    if (dv === null || dv === void 0) {
      if (v === null || typeof v === "string" || typeof v === "number") out[k] = v;
    } else if (typeof v === typeof dv) out[k] = v;
  }
  return out;
}
function decodeFilmParams(raw) {
  const o = obj(raw);
  const base = decodeShape(o, FILM_PARAMS_DEFAULT);
  if (isRetiredResearchPaper(base.printStock)) base.printStock = "ilford_multigrade_iv_rc";
  for (const [key, lo, hi] of [
    ["exposureBaselineEV", -64, 64],
    ["cameraLensBlurUm", 0, 200],
    ["grainBlur", 0, 10],
    ["enlargerLensBlur", 0, 20],
    ["scannerUnsharpRadius", 0, 20],
    ["scannerUnsharpAmount", 0, 4]
  ]) base[key] = Number.isFinite(base[key]) ? clamp(base[key], lo, hi) : FILM_PARAMS_DEFAULT[key];
  base.autoExposureMethod = "autoExposureMethod" in o ? typeof o.autoExposureMethod === "string" ? o.autoExposureMethod : null : null;
  if (!("filmStock" in o)) base.autoExposureMethod = FILM_PARAMS_DEFAULT.autoExposureMethod;
  base.filmSide = base.filmSide === "long" ? "long" : "short";
  base.contrastMask = decodeShape(o.contrastMask, CONTRAST_MASK_DEFAULT);
  base.sceneLatitude = decodeShape(o.sceneLatitude, SCENE_LATITUDE_DEFAULT);
  base.sceneLatitudeOther = decodeShape(o.sceneLatitudeOther, SCENE_LATITUDE_DEFAULT);
  base.effects = decodeShape(o.effects, EFFECTS_DEFAULT);
  base.effects.grainModel = "standard";
  base.filmEdge = decodeShape(o.filmEdge, FILM_EDGE_DEFAULT);
  base.dateBack = decodeShape(o.dateBack, DATE_BACK_DEFAULT);
  if (obj(o.dateBack).camera === null) base.dateBack.camera = null;
  if (o.filmEdge && !("seeded" in obj(o.filmEdge))) base.filmEdge.seeded = "frameSeed" in obj(o.filmEdge);
  return base;
}
var ALL_FEATURES = {
  noFilm: true,
  digitalIntermediate: true,
  sceneLatitude: true,
  contrastMask: true,
  overscan: true,
  dateImprint: true,
  diBlueCompensation: false,
  toneMask: false
};
function featureGate(unsupported, diBlue = false, noFilm = false) {
  const u = new Set(unsupported ?? []);
  return {
    noFilm,
    digitalIntermediate: !u.has("digital_intermediate"),
    sceneLatitude: !u.has("scene_latitude_mapping"),
    contrastMask: !u.has("contrast_mask"),
    overscan: !u.has("overscan"),
    dateImprint: !u.has("date_imprint"),
    diBlueCompensation: diBlue,
    toneMask: false
  };
}
function effectiveEDR(p, catalog) {
  return p.extendedDynamicRange && !p.scanFilm && !p.digitalIntermediate && !catalog?.isMonochrome(p.printStock) && !catalog?.isInstant(p.filmStock) && !catalog?.stock(p.printStock)?.research;
}
function normalizeStockPair(p, catalog) {
  const scanFilm = p.scanFilm || catalog.isPositive(p.filmStock);
  let printStock = isRetiredResearchPaper(p.printStock) ? "ilford_multigrade_iv_rc" : p.printStock;
  if (!catalog.canPrint(p.filmStock, printStock)) {
    const target = catalog.stock(p.filmStock)?.targetPrint;
    const defaultPaper = FILM_PARAMS_DEFAULT.printStock;
    const replacement = target && catalog.stock(target) && catalog.canPrint(p.filmStock, target) ? target : catalog.stock(defaultPaper) && catalog.canPrint(p.filmStock, defaultPaper) ? defaultPaper : catalog.papers.find((paper) => catalog.canPrint(p.filmStock, paper.id))?.id;
    if (replacement) printStock = replacement;
  }
  return scanFilm === p.scanFilm && printStock === p.printStock ? p : { ...p, scanFilm, printStock };
}
function ownGrain(stock) {
  switch (stock) {
    case "kodak_tri_x_400":
      return 1.7;
    case "ilford_hp5_plus_400":
      return 1.49;
    case "kodak_tmax_100":
      return 0.74;
    case "fujifilm_neopan_acros_100_ii":
      return 0.64;
    default:
      return 1;
  }
}
function wire(p, gate = ALL_FEATURES, catalog) {
  const di = gate.digitalIntermediate && p.digitalIntermediate;
  const placement = p.placementIsRight ? p.sceneLatitudeOther : p.sceneLatitude;
  const f = [
    { name: "film_stock", value: p.filmStock, layer: "shoot" },
    { name: "print_stock", value: p.printStock, layer: "print" },
    { name: "exposure_compensation_ev", value: p.exposureCompensationEV, layer: "shoot" },
    { name: "exposure_baseline_ev", value: clamp(p.exposureBaselineEV, -64, 64), layer: "shoot" }
  ];
  if (p.autoExposureMethod != null) f.push({ name: "auto_exposure_method", value: p.autoExposureMethod, layer: "shoot" });
  f.push(
    { name: "auto_exposure", value: p.autoExposure, layer: "shoot" },
    { name: "film_format_mm", value: clamp(filmFormatForWire(p, gate), 4, 200), layer: "shoot" },
    { name: "grain_active", value: p.grainActive, layer: "shoot" },
    { name: "grain_model", value: "standard", layer: "shoot" },
    { name: "lens_blur_um", value: clamp(p.cameraLensBlurUm ?? 0, 0, 200), layer: "shoot" },
    { name: "grain_blur", value: clamp(p.grainBlur ?? 0.65, 0, 10), layer: "shoot" },
    { name: "enlarger_lens_blur", value: p.printEffects ? clamp(p.enlargerLensBlur ?? 0, 0, 20) : 0, layer: "print" },
    { name: "scanner_unsharp_radius", value: clamp(p.scannerUnsharpRadius ?? 0.7, 0, 20), layer: "print" },
    { name: "scanner_unsharp_amount", value: clamp(p.scannerUnsharpAmount ?? 0.7, 0, 4), layer: "print" },
    { name: "density_curve_gamma", value: clamp(p.densityCurveGamma ?? 1, 0.2, 4), layer: "shoot" },
    { name: "scanner_white_correction", value: !!p.scannerWhiteCorrection && !p.scanFilm && !p.digitalIntermediate && !catalog?.isPositive(p.filmStock), layer: "print" },
    { name: "scanner_black_correction", value: !!p.scannerBlackCorrection && !p.scanFilm && !p.digitalIntermediate && !catalog?.isPositive(p.filmStock), layer: "print" },
    { name: "scanner_lens_blur", value: p.printEffects ? clamp(p.scannerLensBlur ?? 0, 0, 20) : 0, layer: "print" },
    { name: "grain_sublayers_active", value: p.grainActive && p.effects.grainLayered && !catalog?.isMonochrome(p.filmStock), layer: "shoot" },
    { name: "halation_active", value: p.halationActive, layer: "shoot" },
    { name: "print_exposure", value: printExposure(p.printBrightnessStops), layer: "print" },
    { name: "y_filter_shift", value: clamp(p.yFilterShift, -1, 1), layer: "print" },
    { name: "m_filter_shift", value: clamp(p.mFilterShift, -1, 1), layer: "print" },
    { name: "filter_shift_scale", value: FILTER_SHIFT_CC, layer: "print" },
    { name: "glare_active", value: p.glareActive && p.printEffects, layer: "print" },
    { name: "scan_film", value: p.scanFilm, layer: "print" },
    { name: "extended_dynamic_range", value: effectiveEDR(p, catalog), layer: "print" },
    { name: "preflash_exposure", value: p.printEffects ? clamp(p.preflashExposure, 0, 1) : 0, layer: "print" }
  );
  if (gate.contrastMask) {
    f.push(
      {
        name: "contrast_mask_active",
        value: p.contrastMask.active && p.printEffects && gate.toneMask,
        layer: "print"
      },
      { name: "contrast_mask_highlights", value: p.contrastMask.highlights, layer: "print" },
      { name: "contrast_mask_shadows", value: p.contrastMask.shadows, layer: "print" },
      { name: "contrast_mask_core", value: p.contrastMask.core, layer: "print" },
      {
        name: "contrast_mask_scale",
        value: clamp(p.contrastMask.scale, CONTRAST_MASK_SCALE[0], CONTRAST_MASK_SCALE[1]),
        layer: "print"
      },
      { name: "contrast_mask_scheme", value: p.contrastMask.scheme, layer: "print" }
    );
  }
  if (gate.sceneLatitude) {
    f.push(
      { name: "scene_latitude_active", value: placement.active && !(di && !p.scanFilm), layer: "shoot" },
      { name: "scene_latitude_norm", value: placement.norm, layer: "shoot" },
      { name: "scene_latitude_highlight_knee", value: placement.highlightKnee, layer: "shoot" },
      { name: "scene_latitude_highlight_room", value: placement.highlightRoom, layer: "shoot" },
      { name: "scene_latitude_shadow_knee", value: placement.shadowKnee, layer: "shoot" },
      { name: "scene_latitude_shadow_room", value: placement.shadowRoom, layer: "shoot" },
      { name: "scene_latitude_rolloff", value: placement.rolloff, layer: "shoot" },
      { name: "scene_latitude_max_lift", value: placement.maxLift, layer: "shoot" },
      { name: "scene_latitude_split", value: p.filmEdge.pair ? clamp(p.pairSplit, 0, 1) : 0, layer: "shoot" }
    );
    if (p.filmEdge.pair) {
      const second = p.placementIsRight ? p.sceneLatitude : p.sceneLatitudeOther;
      f.push(
        { name: "scene_latitude_b_active", value: second.active && !(di && !p.scanFilm), layer: "shoot" },
        { name: "scene_latitude_b_highlight_knee", value: second.highlightKnee, layer: "shoot" },
        { name: "scene_latitude_b_highlight_room", value: second.highlightRoom, layer: "shoot" },
        { name: "scene_latitude_b_shadow_knee", value: second.shadowKnee, layer: "shoot" },
        { name: "scene_latitude_b_shadow_room", value: second.shadowRoom, layer: "shoot" }
      );
    }
  }
  const e = p.effects;
  const r = EFFECT_RANGES;
  f.push(
    { name: "halation_amount", value: clamp(e.halation, r.halation[0], r.halation[1]), layer: "shoot" },
    { name: "halation_scatter_amount", value: clamp(e.scatter, r.scatter[0], r.scatter[1]), layer: "shoot" },
    { name: "grain_amount", value: clamp(e.grain * ownGrain(p.filmStock), r.grain[0], r.grain[1]), layer: "shoot" },
    { name: "dir_couplers_active", value: e.couplersActive, layer: "shoot" },
    { name: "dir_couplers_amount", value: clamp(e.couplers, r.couplers[0], r.couplers[1]), layer: "shoot" },
    { name: "glare_amount", value: clamp(e.glare, r.glare[0], r.glare[1]), layer: "print" },
    { name: "antihalation_removed", value: e.antihalationRemoved, layer: "shoot" },
    { name: "halation_boost_ev", value: clamp(e.highlightBoost, r.highlightBoost[0], r.highlightBoost[1]), layer: "shoot" },
    // 1.3.4 (API-SPEC §18): sent always; every film with an anti-halation layer ignores it.
    { name: "halation_headroom_ev", value: clamp(e.highlightHeadroom, r.highlightHeadroom[0], r.highlightHeadroom[1]), layer: "shoot" }
  );
  if (catalog?.isMonochrome(p.filmStock) && catalog.isMonochrome(p.printStock)) {
    f.push(
      { name: "c_filter_neutral", value: 0, layer: "print" },
      { name: "m_filter_neutral", value: 0, layer: "print" },
      { name: "y_filter_neutral", value: 68, layer: "print" }
    );
  }
  if (catalog?.stock(p.filmStock)?.research || catalog?.stock(p.printStock)?.research) {
    const pack = p.printStock === "ilford_multigrade_iv_rc" && catalog.isMonochrome(p.filmStock) ? [0, 0, 68] : [0, 0, 0];
    for (const [i, name] of ["c_filter_neutral", "m_filter_neutral", "y_filter_neutral"].entries()) {
      const existing = f.find((field) => field.name === name);
      if (existing) existing.value = pack[i];
      else f.push({ name, value: pack[i], layer: "print" });
    }
  }
  if (gate.digitalIntermediate) {
    f.push(
      { name: "digital_intermediate", value: p.digitalIntermediate, layer: "print" },
      {
        name: "digital_intermediate_blue_compensation",
        value: p.digitalIntermediate && gate.diBlueCompensation,
        layer: "print"
      }
    );
  }
  if (gate.overscan) {
    const fe = p.filmEdge;
    f.push({ name: "overscan_active", value: edgeEffective(fe, gate), layer: "shoot" });
    f.push({ name: "overscan_pair", value: fe.pair, layer: "shoot" });
    if (edgeEffective(fe, gate)) {
      f.push(
        { name: "overscan_follow_crop", value: fe.followCrop && !fe.pair, layer: "shoot" },
        { name: "overscan_format", value: fe.format, layer: "shoot" },
        { name: "overscan_mode", value: fe.view, layer: "shoot" },
        { name: "overscan_gate", value: fe.gate, layer: "shoot" },
        { name: "overscan_holes", value: fe.holes, layer: "shoot" },
        { name: "overscan_camera_seed", value: clamp(Math.round(fe.cameraSeed), 0, 2147483647), layer: "shoot" },
        { name: "overscan_frame_seed", value: clamp(Math.round(fe.frameSeed), 0, 2147483647), layer: "shoot" },
        { name: "overscan_frame_number", value: clamp(Math.round(fe.frameNumber), 0, 99), layer: "shoot" },
        { name: "overscan_fog", value: clamp(fe.fog, 0, 4), layer: "shoot" },
        { name: "overscan_leaks", value: clamp(fe.leaks, 0, 4), layer: "shoot" },
        { name: "overscan_edge_text", value: fe.edgeText, layer: "shoot" },
        { name: "overscan_f_number", value: clamp(fe.fNumber, 0, 64), layer: "shoot" }
      );
    }
  }
  if (gate.dateImprint) {
    const d = p.dateBack;
    const on = dateEffective(d, p.filmEdge, gate), camera = dateCamera(d, p.filmEdge, gate), scale = dateScale(p, gate);
    f.push({ name: "date_imprint_active", value: on, layer: "shoot" });
    if (on) {
      if (!(gate.overscan && p.filmEdge.active))
        f.push({ name: "overscan_format", value: d.camera ?? "135", layer: "shoot" });
      f.push(
        { name: "date_imprint_style", value: d.face, layer: "shoot" },
        { name: "date_imprint_text", value: d.customText ?? d.text, layer: "shoot" },
        { name: "date_imprint_text_b", value: p.filmEdge.pair ? d.textB : "", layer: "shoot" },
        { name: "date_imprint_placement", value: d.placement, layer: "shoot" },
        { name: "date_imprint_corner", value: d.corner, layer: "shoot" },
        { name: "date_imprint_inset_x", value: clamp(d.insetXMM * scale, 0, 30), layer: "shoot" },
        { name: "date_imprint_inset_y", value: clamp(d.insetYMM * scale, 0, 30), layer: "shoot" },
        { name: "date_imprint_size", value: clamp((d.face === "data" && camera?.id === "135_half" ? Math.min(d.size, 1) : d.size) * scale, 0.4, 3), layer: "shoot" },
        { name: "date_imprint_ev", value: clamp(d.brightnessEV, -2, 8), layer: "shoot" },
        { name: "date_imprint_data_text", value: d.withData && d.face !== "data" && datePrints("data", d, p.filmEdge, gate) ? d.dataText : "", layer: "shoot" }
      );
    }
  }
  if (catalog?.isInstant(p.filmStock)) {
    for (const item of f) {
      if (item.name === "scan_film") item.value = true;
      if (["digital_intermediate", "extended_dynamic_range", "overscan_active", "overscan_pair", "date_imprint_active"].includes(item.name)) item.value = false;
    }
  }
  return f;
}
function fullDelta(p, gate, catalog) {
  const out = {};
  for (const f of wire(p, gate, catalog)) out[f.name] = f.value;
  return out;
}

// src/shared/localMasks.ts
var LOCAL_GRADE_DEFAULT = { exposure: 0, contrast: 0, brightness: 0, saturation: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0 };
var MAX_MASKS = 8;
function decodeLocalMasks(raw) {
  if (raw === void 0) return [];
  if (!Array.isArray(raw) || raw.length > MAX_MASKS) throw Error("Invalid local masks / \u5C40\u90E8\u8499\u7248\u6570\u636E\u65E0\u6548");
  let total = 0;
  const ids = /* @__PURE__ */ new Set();
  const num3 = (v, lo, hi) => {
    if (typeof v !== "number" || !Number.isFinite(v) || v < lo || v > hi) throw Error("Invalid mask value / \u8499\u7248\u6570\u503C\u65E0\u6548");
    return v;
  };
  const point = (v) => {
    const p = v;
    return { x: num3(p?.x, 0, 1), y: num3(p?.y, 0, 1) };
  };
  return raw.map((v) => {
    const m = v;
    if (!m || typeof m.id !== "string" || !m.id || m.id.length > 80 || ids.has(m.id) || !["linear", "radial", "brush"].includes(m.kind) || typeof m.name !== "string" || m.name.length > 100 || typeof m.enabled !== "boolean" || typeof m.inverted !== "boolean") throw Error("Invalid local mask / \u5C40\u90E8\u8499\u7248\u6570\u636E\u65E0\u6548");
    ids.add(m.id);
    if (!Array.isArray(m.strokes) || m.strokes.length > 128) throw Error("Too many brush strokes / \u753B\u7B14\u7B14\u753B\u8FC7\u591A");
    const strokes = m.strokes.map((s) => {
      if (!s || !Array.isArray(s.points) || !s.points.length || s.points.length > 1024 || typeof s.erase !== "boolean") throw Error("Invalid brush stroke / \u753B\u7B14\u7B14\u753B\u65E0\u6548");
      total += s.points.length;
      if (total > 8192) throw Error("Brush point limit reached / \u753B\u7B14\u70B9\u6570\u5DF2\u8FBE\u4E0A\u9650");
      return { points: s.points.map(point), radius: num3(s.radius, 2e-3, 0.4), erase: s.erase };
    });
    const adjustments = { ...LOCAL_GRADE_DEFAULT };
    for (const k of Object.keys(adjustments)) {
      const range = k === "exposure" ? 3 : k === "contrast" || k === "brightness" ? 50 : 100;
      adjustments[k] = num3(m.adjustments?.[k], -range, range);
    }
    return { id: m.id, name: m.name, kind: m.kind, enabled: m.enabled, inverted: m.inverted, amount: num3(m.amount, 0, 1), feather: num3(m.feather, 0, 1), start: point(m.start), end: point(m.end), radius: num3(m.radius, 2e-3, 0.4), strokes, adjustments };
  });
}

// src/shared/colorDetail.ts
var HSL_NAMES = ["red", "orange", "yellow", "green", "aqua", "blue", "purple", "magenta"];
var clamp2 = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
function decodeDetail(raw) {
  const result = {}, num3 = (v, limit) => typeof v === "number" && Number.isFinite(v) ? clamp2(v, -limit, limit) : 0;
  if (raw.hsl && typeof raw.hsl === "object") {
    result.hsl = {};
    for (const name of HSL_NAMES) {
      const b = raw.hsl[name];
      if (b && typeof b === "object") {
        const band = b;
        result.hsl[name] = { hue: num3(band.hue, 30), saturation: num3(band.saturation, 100), luminance: num3(band.luminance, 100) };
      }
    }
  }
  if (raw.texture !== void 0) result.texture = num3(raw.texture, 100);
  if (raw.clarity !== void 0) result.clarity = num3(raw.clarity, 100);
  return result;
}

// src/shared/instantPaper.ts
var INSTANT_PLACEMENT = { x: 0.5, y: 0.5, zoom: 1, turns: 0, flipH: false };
var INSTANT_PAPERS = {
  // Overall/window sizes are published. Top placement (~7 mm) follows the
  // manufacturer's front-on product illustration, not a measured tolerance.
  mini: { width: 54, height: 86, x: 4, y: 7, imageWidth: 46, imageHeight: 62 },
  polaroid600: { width: 88.9, height: 107.95, x: 4.7625, y: 4.7625, imageWidth: 79.375, imageHeight: 79.375 }
};
function decodeInstantFraming(raw) {
  const result = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return result;
  for (const kind of ["mini", "polaroid600"]) {
    const row = raw[kind];
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    const value = { ...INSTANT_PLACEMENT, ...row };
    if (![value.x, value.y, value.zoom, value.turns].every(Number.isFinite) || value.x < 0 || value.x > 1 || value.y < 0 || value.y > 1 || value.zoom < 1 || value.zoom > 8 || !Number.isInteger(value.turns) || value.turns < 0 || value.turns > 3 || typeof value.flipH !== "boolean") continue;
    result[kind] = { x: value.x, y: value.y, zoom: value.zoom, turns: value.turns, flipH: value.flipH };
  }
  return result;
}
function decodeInstantNotes(raw) {
  const result = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return result;
  for (const kind of ["mini", "polaroid600"]) {
    const layer = raw[kind];
    if (!layer || typeof layer !== "object" || Array.isArray(layer)) continue;
    const value = layer, paper = INSTANT_PAPERS[kind];
    if (!Array.isArray(value.strokes) || value.strokes.length > 128) continue;
    let count = 0, travel = 0, valid = true;
    const strokes = [];
    for (const s of value.strokes) {
      if (!s || !["gold", "silver", "black"].includes(s.color) || !["fine", "paint", "chisel"].includes(s.tip) || !Number.isFinite(s.width) || s.width < 0.2 || s.width > 3 || !Array.isArray(s.points) || !s.points.length || s.points.length > 2048) {
        valid = false;
        break;
      }
      const points = [];
      for (const p of s.points) {
        if (!Array.isArray(p) || p.length !== 3 || !p.every(Number.isFinite) || p[0] < 0 || p[0] > paper.width || p[1] < 0 || p[1] > paper.height || p[2] < 0.1 || p[2] > 1) {
          valid = false;
          break;
        }
        const last = points.at(-1);
        if (last) travel += Math.hypot(p[0] - last[0], p[1] - last[1]);
        points.push([p[0], p[1], p[2]]);
        if (++count > 8192 || travel > 5e3) {
          valid = false;
          break;
        }
      }
      if (!valid) break;
      strokes.push({ color: s.color, tip: s.tip, width: s.width, points });
    }
    if (valid) result[kind] = { allowImage: value.allowImage === true, strokes };
  }
  return result;
}

// src/shared/adjustments.ts
var ZONE = { hue: 0, saturation: 0, luminance: 0 };
var CURVE_IDENTITY = {
  points: [
    [0, 0],
    [1, 1]
  ]
};
var CURVES_IDENTITY = {
  rgb: CURVE_IDENTITY,
  luma: CURVE_IDENTITY,
  red: CURVE_IDENTITY,
  green: CURVE_IDENTITY,
  blue: CURVE_IDENTITY
};
var ADJUSTMENTS_DEFAULT = {
  enabled: true,
  temperature: 0,
  tint: 0,
  exposure: 0,
  contrast: 0,
  brightness: 0,
  saturation: 0,
  highlights: 0,
  shadows: 0,
  blackPoint: 0,
  whitePoint: 0,
  curves: CURVES_IDENTITY,
  colorBalance: { master: ZONE, shadows: ZONE, midtones: ZONE, highlights: ZONE },
  vignette: { amount: 0, midpoint: 50 }
};
function obj2(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}
var num = (v, d) => typeof v === "number" && Number.isFinite(v) ? v : d;
function decodeCurve(v) {
  const pts = obj2(v).points;
  if (!Array.isArray(pts) || pts.length < 2) return CURVE_IDENTITY;
  const points = [];
  for (const p of pts) {
    if (Array.isArray(p) && p.length === 2) points.push([num(p[0], 0), num(p[1], 0)]);
    else if (p && typeof p === "object") points.push([num(p.x, 0), num(p.y, 0)]);
  }
  return points.length >= 2 ? { points } : CURVE_IDENTITY;
}
function decodeZone(v) {
  const o = obj2(v);
  return { hue: num(o.hue, 0), saturation: num(o.saturation, 0), luminance: num(o.luminance, 0) };
}
function decodeAdjustments(raw) {
  const o = obj2(raw);
  const d = ADJUSTMENTS_DEFAULT;
  const c = obj2(o.curves);
  const cb = obj2(o.colorBalance);
  const v = obj2(o.vignette);
  return {
    ...o.localMasks === void 0 ? {} : { localMasks: decodeLocalMasks(o.localMasks) },
    ...o.instantNotes === void 0 ? {} : { instantNotes: decodeInstantNotes(o.instantNotes) },
    ...o.instantFraming === void 0 ? {} : { instantFraming: decodeInstantFraming(o.instantFraming) },
    ...decodeDetail(o),
    enabled: typeof o.enabled === "boolean" ? o.enabled : true,
    temperature: num(o.temperature, d.temperature),
    tint: num(o.tint, d.tint),
    exposure: num(o.exposure, d.exposure),
    contrast: num(o.contrast, d.contrast),
    brightness: num(o.brightness, d.brightness),
    saturation: num(o.saturation, d.saturation),
    highlights: num(o.highlights, d.highlights),
    shadows: num(o.shadows, d.shadows),
    blackPoint: num(o.blackPoint, d.blackPoint),
    whitePoint: num(o.whitePoint, d.whitePoint),
    curves: {
      rgb: decodeCurve(c.rgb),
      luma: decodeCurve(c.luma),
      red: decodeCurve(c.red),
      green: decodeCurve(c.green),
      blue: decodeCurve(c.blue)
    },
    colorBalance: {
      master: decodeZone(cb.master),
      shadows: decodeZone(cb.shadows),
      midtones: decodeZone(cb.midtones),
      highlights: decodeZone(cb.highlights)
    },
    vignette: { amount: num(v.amount, 0), midpoint: num(v.midpoint, 50) }
  };
}

// src/shared/rawTone.ts
function decodeRawTone(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const number = (key, limit) => typeof o[key] === "number" && Number.isFinite(o[key]) ? Math.max(-limit, Math.min(limit, o[key])) : 0;
  const decoded = decodeAdjustments({ curves: o.curves, colorBalance: o.colorBalance, hsl: o.hsl });
  for (const zone of Object.values(decoded.colorBalance)) {
    zone.hue = Math.max(-360, Math.min(360, zone.hue));
    zone.saturation = Math.max(-1, Math.min(1, zone.saturation));
    zone.luminance = Math.max(-1, Math.min(1, zone.luminance));
  }
  return {
    exposure: number("exposure", 5),
    contrast: number("contrast", 100),
    highlights: number("highlights", 100),
    shadows: number("shadows", 100),
    whites: number("whites", 100),
    blacks: number("blacks", 100),
    curves: decoded.curves,
    ...o.colorBalance ? { colorBalance: decoded.colorBalance } : {},
    ...o.hsl ? { hsl: decoded.hsl } : {}
  };
}

// src/shared/sidecar.ts
var DECODE_DEFAULT = {
  whiteBalance: "As Shot",
  temperature: 5500,
  tint: 0,
  lensCorrection: false,
  apply_camera_curve: false
};
function newSidecar() {
  return {
    schemaVersion: 3,
    decoder: "libraw",
    decode: DECODE_DEFAULT,
    params: FILM_PARAMS_DEFAULT,
    adjustments: ADJUSTMENTS_DEFAULT,
    geometry: GEOMETRY_DEFAULT,
    noFilm: false,
    filmStrength: 1,
    solvedEV: null,
    placementNeedsFit: false,
    state: "unprocessed",
    raw: {}
  };
}
function decodeState(v) {
  if (typeof v === "string" && ["unprocessed", "processed", "stale"].includes(v)) return v;
  if (v && typeof v === "object") {
    const k = Object.keys(v)[0];
    if (k === "processed" || k === "stale" || k === "unprocessed") return k;
  }
  return "unprocessed";
}
function decodeSidecar(raw) {
  const o = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const carry = { ...o };
  delete carry.spektraHistory;
  const d = o.decode && typeof o.decode === "object" ? o.decode : {};
  let geometry = GEOMETRY_DEFAULT;
  if (o.geometry) geometry = decodeGeometry(o.geometry);
  else if (o.crop) geometry = decodeGeometry({ crop: o.crop });
  const result = {
    schemaVersion: 3,
    decoder: typeof o.decoder === "string" ? o.decoder : "coreimage",
    decode: {
      whiteBalance: typeof d.whiteBalance === "string" ? d.whiteBalance : DECODE_DEFAULT.whiteBalance,
      temperature: typeof d.temperature === "number" ? d.temperature : DECODE_DEFAULT.temperature,
      tint: typeof d.tint === "number" ? d.tint : DECODE_DEFAULT.tint,
      lensCorrection: d.lensCorrection === true,
      ...d.lensProfile && typeof d.lensProfile === "object" ? { lensProfile: d.lensProfile } : {},
      apply_camera_curve: d.apply_camera_curve === true,
      ...["auto", "libraw", "candidate"].includes(String(d.rawDecoder)) ? { rawDecoder: d.rawDecoder } : {},
      ...d.cameraCurve && typeof d.cameraCurve === "object" ? { cameraCurve: d.cameraCurve } : {},
      ...d.rawTone && typeof d.rawTone === "object" ? { rawTone: decodeRawTone(d.rawTone) } : {}
    },
    params: o.params ? decodeFilmParams(o.params) : FILM_PARAMS_DEFAULT,
    adjustments: o.adjustments ? decodeAdjustments(o.adjustments) : ADJUSTMENTS_DEFAULT,
    geometry,
    noFilm: o.noFilm === true,
    filmStrength: typeof o.filmStrength === "number" && Number.isFinite(o.filmStrength) ? Math.max(0, Math.min(1, o.filmStrength)) : 1,
    heldCrop: o.heldCrop ? decodeGeometry(o.heldCrop) : null,
    solvedEV: typeof o.solvedEV === "number" ? o.solvedEV : null,
    placementNeedsFit: o.placementNeedsFit === true,
    state: decodeState(o.state),
    raw: carry
  };
  const oldParams = o.params && typeof o.params === "object" ? o.params : {};
  const oldEdge = oldParams.filmEdge && typeof oldParams.filmEdge === "object" ? oldParams.filmEdge : {};
  if (result.params.filmEdge.active && oldEdge.followCrop === void 0 && result.heldCrop) {
    result.geometry = result.heldCrop;
    result.heldCrop = null;
  }
  return result;
}
function preserveUnknownParams(raw, current) {
  if (!current || typeof current !== "object" || Array.isArray(current)) return current;
  const old = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const out = { ...old, ...current };
  for (const [key, value] of Object.entries(current)) out[key] = preserveUnknownParams(old[key], value);
  return out;
}
function encodeSidecar(s) {
  const out = { ...s.raw };
  delete out.crop;
  out.schemaVersion = 3;
  out.decoder = s.decoder;
  out.decode = s.decode;
  out.params = preserveUnknownParams(s.raw.params, s.params);
  out.adjustments = s.adjustments;
  out.geometry = encodeGeometry(s.geometry);
  if (s.noFilm) out.noFilm = true;
  else delete out.noFilm;
  if (s.filmStrength !== 1) out.filmStrength = s.filmStrength;
  else delete out.filmStrength;
  if (s.heldCrop) out.heldCrop = encodeGeometry(s.heldCrop);
  else delete out.heldCrop;
  if (s.solvedEV != null) out.solvedEV = s.solvedEV;
  else delete out.solvedEV;
  if (s.placementNeedsFit) out.placementNeedsFit = true;
  else delete out.placementNeedsFit;
  out.state = { [s.state]: {} };
  return out;
}
function filmStrengthWire(s) {
  return !s.noFilm && !s.params.digitalIntermediate && s.filmStrength !== 1 ? { film_strength: s.filmStrength } : {};
}
function portableRecipe(s) {
  const value = encodeSidecar(s);
  delete value.source;
  delete value._spkRevision;
  delete value.spektraHistory;
  return value;
}

// src/shared/fileTypes.ts
var RAW_EXTENSIONS = [
  "3fr",
  "ari",
  "arw",
  "bay",
  "cr2",
  "cr3",
  "crw",
  "dcr",
  "dng",
  "erf",
  "fff",
  "gpr",
  "iiq",
  "k25",
  "kdc",
  "mef",
  "mos",
  "mrw",
  "nef",
  "nrw",
  "orf",
  "pef",
  "raf",
  "raw",
  "rw2",
  "rwl",
  "sr2",
  "srf",
  "srw",
  "x3f"
];
var RASTER_EXTENSIONS = ["tif", "tiff", "jpg", "jpeg", "png", "heic", "heif", "hif", "exr"];
var PHOTO_PICKER_EXTENSIONS = [...RAW_EXTENSIONS, ...RASTER_EXTENSIONS].flatMap((ext) => [ext, ext.toUpperCase()]);

// src/shared/whiteBalance.ts
var WB_MODES = ["As Shot", "Daylight", "Cloudy", "Shade", "Tungsten", "Fluorescent", "Custom"];
var WB_KELVIN = {
  Daylight: 5500,
  Cloudy: 6500,
  Shade: 7500,
  Tungsten: 3200,
  Fluorescent: 4e3
};
function modeOf(d) {
  return WB_MODES.includes(d.whiteBalance) ? d.whiteBalance : "As Shot";
}
var RAW_EXT = new Set(RAW_EXTENSIONS);
function isRawPath(path2) {
  return RAW_EXT.has((path2.split(".").pop() ?? "").toLowerCase());
}
function decodeWire(d, isRaw) {
  if (!isRaw) return null;
  const lens = {
    ...d.rawTone ? { raw_tone: d.rawTone } : {},
    ...d.rawDecoder ? { raw_decoder: d.rawDecoder } : {},
    ...d.lensCorrection ? { lens_correction: true, ...d.lensProfile ? { lens_profile: d.lensProfile } : {} } : {},
    ...d.apply_camera_curve ? { apply_camera_curve: true, ...d.cameraCurve?.profile ? { camera_profile: d.cameraCurve.profile } : {} } : {}
  };
  if (modeOf(d) === "As Shot") return { white_balance: { mode: "as_shot" }, ...lens };
  const clamp3 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  return { white_balance: { mode: "custom", temperature_k: clamp3(d.temperature, 2e3, 5e4), tint: clamp3(d.tint, -150, 150) }, ...lens };
}

// agent/schema.ts
var Refused = class extends Error {
  refused = true;
};
function document2(s) {
  return structuredClone({ params: s.params, adjustments: s.adjustments, geometry: s.geometry, decode: s.decode });
}
function fields(catalog) {
  const out = /* @__PURE__ */ new Map();
  const add = (path2, type, range, choices) => out.set(path2, { path: path2, type, doc: path2.replaceAll(".", " / "), ...range ? { min: range[0], max: range[1] } : {}, ...choices ? { enum: choices } : {} });
  const numbers = (prefix, entries) => Object.entries(entries).forEach(([key, r]) => add(`${prefix}.${key}`, "number", r));
  const bools = (prefix, keys) => keys.split(" ").forEach((k) => add(`${prefix}.${k}`, "boolean"));
  add("params.filmStock", "string", void 0, catalog.films.map((s) => s.id));
  add("params.printStock", "string", void 0, catalog.papers.map((s) => s.id));
  numbers("params", { exposureCompensationEV: [-4, 4], sideLengthMM: [1, 500], printBrightnessStops: [-3, 3], yFilterShift: [-1, 1], mFilterShift: [-1, 1], preflashExposure: [0, 0.03] });
  bools("params", "autoExposure grainActive halationActive glareActive scanFilm digitalIntermediate extendedDynamicRange printEffects");
  add("params.autoExposureMethod", "string", void 0, EXPOSURE_METHODS);
  add("params.filmFrame", "string", void 0, [...FILM_FRAMES.map((f) => f.id), "Custom"]);
  add("params.filmSide", "string", void 0, ["short", "long"]);
  numbers("params.effects", EFFECT_RANGES);
  bools("params.effects", "grainLayered antihalationRemoved couplersActive");
  bools("params.filmEdge", "active");
  add("params.filmEdge.format", "string", void 0, FILM_EDGE_FORMATS);
  for (const [key, values] of Object.entries({ view: ["strip", "carrier"], gate: ["auto", "square", "rounded", "eared", "shouldered", "kicked"], holes: ["white", "black"] })) add(`params.filmEdge.${key}`, "string", void 0, values);
  for (const key of ["cameraSeed", "frameSeed"]) add(`params.filmEdge.${key}`, "integer", [0, 2147483647]);
  add("params.filmEdge.frameNumber", "integer", [0, 99]);
  numbers("params.filmEdge", { fog: [0, 4], leaks: [0, 4] });
  bools("params.dateBack", "active withData");
  for (const [key, values] of Object.entries({ face: ["lcd", "dots", "data"], order: ["us", "japan"], placement: ["frame", "rebate"], corner: ["tl", "tr", "bl", "br"] })) add(`params.dateBack.${key}`, "string", void 0, values);
  numbers("params.dateBack", { insetXMM: [0, 30], insetYMM: [0, 30], size: [0.4, 3], brightnessEV: [-2, 8] });
  bools("adjustments", "enabled");
  numbers("adjustments", { temperature: [-100, 100], tint: [-100, 100], exposure: [-3, 3], contrast: [-50, 50], brightness: [-50, 50], saturation: [-100, 100], highlights: [-100, 100], shadows: [-100, 100], blackPoint: [-50, 50], whitePoint: [-50, 50] });
  numbers("adjustments.vignette", { amount: [-100, 100], midpoint: [0, 100] });
  for (const c of ["rgb", "luma", "red", "green", "blue"]) add(`adjustments.curves.${c}.points`, "points");
  for (const z of ["master", "shadows", "midtones", "highlights"]) numbers(`adjustments.colorBalance.${z}`, { hue: [0, 360], saturation: [0, 1], luminance: [-1, 1] });
  numbers("geometry.crop", { x: [0, 1], y: [0, 1], width: [0, 1], height: [0, 1] });
  numbers("geometry", { angle: [-45, 45] });
  add("geometry.quarterTurns", "integer", [0, 3]);
  bools("geometry", "flipH flipV");
  add("geometry.aspect", "string", void 0, ["free", "original", "originalPortrait", "square", "r3x2", "r2x3", "r4x3", "r3x4", "r16x9", "r9x16", "r5x4", "r4x5", "r7x5", "r5x7"]);
  add("decode.whiteBalance", "string", void 0, WB_MODES);
  numbers("decode", { temperature: [2e3, 12e3], tint: [-150, 150] });
  bools("decode", "lensCorrection");
  function walk(v, path2) {
    if (out.has(path2)) return;
    if (v && typeof v === "object" && !Array.isArray(v)) for (const [k, x] of Object.entries(v)) walk(x, path2 ? `${path2}.${k}` : k);
    else out.set(path2, { path: path2, type: typeof v, doc: path2, readOnly: path2.startsWith("params.sceneLatitude") ? "Use place_scene: a solved placement must pass the engine Fit." : path2.startsWith("params.contrastMask") ? "Tone Mask is withdrawn in this version." : "Derived by the application." });
  }
  walk(document2(newSidecar()), "");
  for (const key of ["geometry.lockedRatio", "geometry.intendedSize"]) if (!out.has(key)) out.set(key, { path: key, type: "derived", doc: key, readOnly: "Derived by crop and film edge." });
  return [...out.values()];
}
function validate(patch, catalog) {
  const map = new Map(fields(catalog).map((f) => [f.path, f])), leaves = [];
  const branches = new Set([...map.keys()].flatMap((p) => p.split(".").slice(0, -1).map((_, i) => p.split(".").slice(0, i + 1).join("."))));
  const object = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  if (!object(patch)) throw new Refused("The patch must be an object.");
  function walk(v, path2) {
    const f = map.get(path2);
    if (!f) {
      if (!branches.has(path2) || !object(v)) throw new Refused(`${path2} is not an editable field or object.`);
      for (const [k, x] of Object.entries(v)) walk(x, `${path2}.${k}`);
      return;
    }
    if (f.readOnly) throw new Refused(`${path2} is read-only: ${f.readOnly}`);
    if (f.type === "points") {
      if (!Array.isArray(v) || v.length < 2 || v.length > 256 || v.some((p) => !Array.isArray(p) || p.length !== 2 || p.some((x) => typeof x !== "number" || !Number.isFinite(x) || x < 0 || x > 1)) || v[0][0] !== 0 || v.at(-1)[0] !== 1 || v.some((p, i) => i > 0 && p[0] <= v[i - 1][0])) throw new Refused(`${path2} needs 2\u2013256 ascending [x,y] points within 0..1, starting 0 ending 1.`);
    } else if (f.type === "number" || f.type === "integer") {
      if (typeof v !== "number" || !Number.isFinite(v) || f.type === "integer" && !Number.isInteger(v) || v < f.min || v > f.max) throw new Refused(`${path2} must be ${f.type} in ${f.min}..${f.max}.`);
    } else if (typeof v !== f.type || f.enum && !f.enum.includes(v)) throw new Refused(`${path2} must be ${f.enum?.join(", ") ?? f.type}.`);
    leaves.push(path2);
  }
  for (const [k, v] of Object.entries(patch)) walk(v, k);
  return leaves;
}
function merge(original, patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return structuredClone(patch);
  const out = structuredClone(original);
  for (const [k, v] of Object.entries(patch)) {
    if (k === "__proto__" || k === "prototype" || k === "constructor") throw new Refused("Invalid object key");
    out[k] = v && typeof v === "object" && !Array.isArray(v) ? merge(out[k] ?? {}, v) : structuredClone(v);
  }
  return out;
}

// agent/io.ts
var here = dirname(fileURLToPath(import.meta.url));
var appExe = process.env.SPEKTRALAB_AGENT_APP ?? [
  join(here, "..", process.platform === "win32" ? "Spektra Studio.exe" : "spektralab"),
  join(here, "..", "spektralab.exe"),
  ...process.platform === "linux" ? [join(process.env.APPDIR ?? "", "usr/bin/spektralab"), "/usr/bin/spektralab"] : []
].find((p) => existsSync(p)) ?? join(here, "..", "spektralab.exe");
var Child = class {
  process;
  next = 1;
  waiting = /* @__PURE__ */ new Map();
  constructor(executable, args) {
    this.process = spawn(executable, args, { stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    this.process.stderr.on("data", (b) => process.stderr.write(b));
    this.process.on("error", (e) => this.fail(e));
    this.process.on("exit", () => this.fail(new Error("SpektraLab service exited.")));
  }
  fail(e) {
    for (const w of this.waiting.values()) {
      clearTimeout(w.timer);
      w.reject(e);
    }
    this.waiting.clear();
  }
  receive(q, payload = Buffer.alloc(0)) {
    const w = this.waiting.get(q.id ?? -1);
    if (!w) return;
    this.waiting.delete(q.id ?? -1);
    clearTimeout(w.timer);
    if (q.ok === false) w.reject(Object.assign(new Error(typeof q.error === "string" ? q.error : (typeof q.error === "object" ? q.error.message : void 0) ?? "Service failed"), { code: typeof q.error === "object" ? q.error.code : void 0 }));
    else w.resolve({ result: q.result, payload });
  }
  send(method, params, binary, timeout = 3e5) {
    const id = this.next++, json = Buffer.from(JSON.stringify({ id, method, params }));
    return new Promise((resolve3, reject) => {
      const timer = setTimeout(() => {
        this.waiting.delete(id);
        this.process.kill();
        reject(new Error(`Timed out: ${method}`));
      }, timeout);
      this.waiting.set(id, { resolve: resolve3, reject, timer });
      if (binary) {
        const prefix = Buffer.alloc(8);
        prefix.writeUInt32LE(json.length);
        this.process.stdin.write(Buffer.concat([prefix, json]));
      } else this.process.stdin.write(json.toString() + "\n");
    });
  }
  stop() {
    this.process.stdin.end();
    setTimeout(() => this.process.kill(), 2e3).unref();
  }
};
var FileService = class extends Child {
  constructor() {
    super(appExe, ["--agent-files"]);
    createInterface({ input: this.process.stdout }).on("line", (line) => {
      try {
        this.receive(JSON.parse(line));
      } catch {
        this.fail(new Error("Invalid file-service response"));
      }
    });
  }
  async call(method, params = {}) {
    try {
      return (await this.send(method, params, false)).result;
    } catch (e) {
      throw new Refused(e.message);
    }
  }
};
var NativeHost = class extends Child {
  buffered = Buffer.alloc(0);
  constructor() {
    const dir2 = process.env.SPEKTRALAB_HOST_DIR ?? dirname(appExe);
    const executable = process.env.SPEKTRALAB_AGENT_HOST ?? join(dir2, process.platform === "win32" ? "spektralab-host.exe" : "spektralab-host");
    const resources = process.env.SPEKTRALAB_AGENT_RESOURCES ?? [join(dir2, "engine"), join(dir2, "host", "engine"), join(here, "..", "host", "engine")].find((p) => existsSync(p));
    if (!resources) throw new Error("Engine resources are missing. Reinstall the complete application.");
    super(executable, ["--resources", resources]);
    this.process.stdout.on("data", (b) => {
      this.buffered = Buffer.concat([this.buffered, b]);
      while (this.buffered.length >= 8) {
        const h = this.buffered.readUInt32LE(0), p = this.buffered.readUInt32LE(4);
        if (h > 8 * 1024 * 1024 || p > 128 * 1024 * 1024) {
          this.fail(new Error("Oversized engine response"));
          this.process.kill();
          return;
        }
        if (this.buffered.length < 8 + h + p) return;
        try {
          this.receive(JSON.parse(this.buffered.subarray(8, 8 + h).toString()), this.buffered.subarray(8 + h, 8 + h + p));
        } catch (e) {
          this.fail(e);
        }
        this.buffered = this.buffered.subarray(8 + h + p);
      }
    });
  }
  request = (method, params = {}, opts) => this.send(method, params, true, opts?.timeoutMs ?? 3e5);
  async result(method, params = {}) {
    return (await this.request(method, params)).result;
  }
};
function absolute(path2) {
  return resolve(path2.startsWith("~/") ? join(process.env.USERPROFILE ?? process.env.HOME ?? "", path2.slice(2)) : path2);
}

// agent/platform.ts
import { mkdir, access, readFile } from "node:fs/promises";
var service;
function setFiles(s) {
  service = s;
}
var baseName = (p) => p.split(/[\\/]/).pop() ?? p;
var dirName = (p) => {
  const i = Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\"));
  return i > 0 ? p.slice(0, i) : p;
};
var joinPath = (dir2, name) => dir2.replace(/[\\/]$/, "") + "/" + name;
var platform = () => ({
  sidecarLoad: (image) => service.call("sidecar_load", { path: image }),
  pairLoad: async (path2) => {
    const b = await readFile(path2);
    if (b.length > 1024 * 1024) throw new Refused("Pair document too large");
    return JSON.parse(b.toString());
  },
  ensureDir: async (path2) => {
    await mkdir(path2, { recursive: true });
  },
  pathExists: async (path2) => {
    try {
      await access(path2);
      return true;
    } catch {
      return false;
    }
  },
  log: (_level, message) => process.stderr.write(message + "\n")
});

// agent/host.ts
var connection;
function setHost(h) {
  connection = h;
}
var host = () => ({ transport: connection, probe: (path2) => connection.result("probe", { path: path2 }) });

// src/shared/stocks.ts
var StockCatalog = class {
  stocks;
  constructor(stocks) {
    this.stocks = stocks;
  }
  get films() {
    return this.stocks.filter((s) => s.stage === "filming");
  }
  get papers() {
    return this.stocks.filter((s) => s.stage === "printing");
  }
  stock(id) {
    return this.stocks.find((s) => s.id === id);
  }
  isPositive(id) {
    return this.stock(id)?.type === "positive";
  }
  isInstant(id) {
    return this.stock(id)?.instant === true;
  }
  isMonochrome(id) {
    return this.stock(id)?.monochrome === true;
  }
  /** The film has no anti-halation layer to switch (`Session.filmHasNoAntihalationLayer`). */
  hasNoAntihalationLayer(id) {
    return this.stock(id)?.noAntihalationLayer === true;
  }
  canPrint(film, paper) {
    const f = this.stock(film), p = this.stock(paper);
    return !f || !p || !!f.monochrome === !!p.monochrome;
  }
  /** Still first, then cine, as the Mac picker orders them; then by polarity. */
  filmGroups() {
    const ordinary = this.films.filter((s) => !s.research);
    const ordered = [...ordinary.filter((s) => s.use !== "cine"), ...ordinary.filter((s) => s.use === "cine")];
    const groups = [
      { title: "Positive", films: ordered.filter((s) => s.type === "positive") },
      { title: "Negative", films: ordered.filter((s) => s.type !== "positive" && !s.monochrome) }
    ];
    const mono = ordered.filter((s) => s.type !== "positive" && s.monochrome);
    if (mono.length) groups.push({ title: "Black & White", films: mono });
    const studies = this.films.filter((s) => s.research);
    if (studies.length) groups.push({ title: "Research", films: studies });
    return groups;
  }
  paperGroups() {
    const groups = [
      { title: "Still", papers: this.papers.filter((s) => !s.research && s.use !== "cine") },
      { title: "Cine", papers: this.papers.filter((s) => !s.research && s.use === "cine") }
    ];
    const studies = this.papers.filter((s) => s.research);
    if (studies.length) groups.push({ title: "Research", papers: studies });
    return groups;
  }
  coverURL(id) {
    const c = this.stock(id)?.cover;
    return c ? `assets/FilmCovers/${c}` : null;
  }
};
var EMPTY_CATALOG = new StockCatalog([]);

// src/shared/pair.ts
var PLACEMENT_DEFAULT = { scale: 1, x: 0, y: 0, quarterTurns: 0 };
var PAIR_SIDES = ["left", "right"];
function isPairPath(path2) {
  return /\.spektrapair$/i.test(path2);
}
var pairSpacing = (p) => p.onStrip ? 1 : clamp(p.spacingMM, 0.5, 2);
var pairAspect = (p) => p.turned ? 4 / 3 : 3 / 4;
function newHole(path2) {
  return { path: path2, placement: { ...PLACEMENT_DEFAULT }, exposureEV: 0, decode: { ...DECODE_DEFAULT }, geometry: GEOMETRY_DEFAULT, autoExposure: true, printScope: "film", exposureScope: "frame" };
}
var obj3 = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
var num2 = (v, fallback, lo = -Infinity, hi = Infinity) => typeof v === "number" && Number.isFinite(v) ? clamp(v, lo, hi) : fallback;
function decodePair(raw) {
  const p = obj3(raw);
  if (typeof p.folder !== "string" || p.schemaVersion !== void 0 && p.schemaVersion !== 1) return null;
  function hole(raw2) {
    if (raw2 == null) return null;
    const h = obj3(raw2), pl = obj3(h.placement), pr = obj3(h.print);
    if (typeof h.path !== "string" || !h.path || isPairPath(h.path)) throw new Error("A half-frame hole must reference a photograph.");
    const out = {
      ...newHole(h.path),
      placement: { scale: num2(pl.scale, 1, 1, 4), x: num2(pl.x, 0, -1, 1), y: num2(pl.y, 0, -1, 1), quarterTurns: (Math.round(num2(pl.quarterTurns, 0)) % 4 + 4) % 4 },
      exposureEV: num2(h.exposureEV, 0, -5, 5),
      decode: decodeSidecar({ decode: h.decode }).decode,
      exposureBaselineEV: num2(h.exposureBaselineEV, 0, -64, 64),
      geometry: decodeGeometry(h.geometry),
      autoExposure: h.autoExposure !== false,
      printScope: h.printScope === "frame" ? "frame" : "film",
      exposureScope: h.exposureScope === "film" ? "film" : "frame"
    };
    if (typeof h.meteredEV === "number" && Number.isFinite(h.meteredEV)) out.meteredEV = h.meteredEV;
    if (typeof h.meteredFor === "string") out.meteredFor = h.meteredFor;
    if (typeof h.meterMethod === "string") out.meterMethod = h.meterMethod;
    if (h.adjustments) out.adjustments = decodeAdjustments(h.adjustments);
    if (h.print) out.print = { brightnessStops: num2(pr.brightnessStops, 0, -3, 3), yFilterShift: num2(pr.yFilterShift, 0, -1, 1), mFilterShift: num2(pr.mFilterShift, 0, -1, 1), preflashExposure: num2(pr.preflashExposure, 0, 0, 0.03) };
    return out;
  }
  try {
    return { schemaVersion: 1, folder: p.folder, left: hole(p.left), right: hole(p.right), spacingMM: num2(p.spacingMM, 1, 0.5, 2), onStrip: p.onStrip === true, turned: p.turned === true };
  } catch {
    return null;
  }
}
function pairLayout(across, spacingMM = 1, turned = false) {
  const a = Math.max(8, Math.floor(across)), along = Math.max(6, Math.round(a * 18 / 24));
  const advance = Math.round(along * (18 + spacingMM) / 18);
  const hole = turned ? { width: a, height: along } : { width: along, height: a };
  return {
    hole,
    advance,
    size: turned ? { width: hole.width, height: advance + hole.height } : { width: advance + hole.width, height: hole.height },
    rects: { left: { x: 0, y: 0, ...hole }, right: { x: turned ? 0 : advance, y: turned ? advance : 0, ...hole } }
  };
}
function pairRects(p, across = 2400) {
  const l = pairLayout(across, pairSpacing(p), p.turned);
  const rect = (r) => ({ x: r.x / l.size.width, y: r.y / l.size.height, width: r.width / l.size.width, height: r.height / l.size.height });
  return { left: rect(l.rects.left), right: rect(l.rects.right) };
}
function placementSourceRect(p, source, aspect = 0.75) {
  let w = source.width, h = source.height;
  if (w <= 0 || h <= 0) return { x: 0, y: 0, width: 0, height: 0 };
  if (w / h > aspect) w = h * aspect;
  else h = w / aspect;
  const scale = clamp(p.scale, 1, 4);
  w /= scale;
  h /= scale;
  const cx = source.width / 2 + clamp(p.x, -1, 1) * (source.width - w) / 2;
  const cy = source.height / 2 + clamp(p.y, -1, 1) * (source.height - h) / 2;
  return { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
}
var placementTurnedSize = (p, size) => p.quarterTurns % 2 ? { width: size.height, height: size.width } : size;
function sourcePairLayout(p, sizes) {
  const across = [];
  let longest = 0;
  for (const side of PAIR_SIDES) {
    const h = p[side], size = sizes[side];
    if (!h || !size) continue;
    const framed = outputSize(h.geometry, size), turned = placementTurnedSize(h.placement, framed);
    const cut = placementSourceRect({ ...h.placement, scale: 1 }, turned, pairAspect(p));
    across.push(p.turned ? cut.width : cut.height);
    longest = Math.max(longest, framed.width, framed.height);
  }
  let a = across.length ? Math.min(...across) : 2400;
  if (longest > 0) a = Math.min(a, longest / (37 / 24));
  return pairLayout(a, pairSpacing(p), p.turned);
}
function pairSnapshotFor(pair, p) {
  return { ...structuredClone(pair), printEffects: p.printEffects };
}
function pairFitRegion(pair, right) {
  const r = pairRects(pair)[right ? "right" : "left"];
  return [r.x, r.y, r.x + r.width, r.y + r.height];
}
function pairFilmFormat(p, pair) {
  return clamp((36 + pairSpacing(pair)) * filmFormatMM(p.filmSide, p.sideLengthMM, 24 / 18, 1) / 24, 4, 200);
}
function resolvePairParams(p, pair, first, second, catalog) {
  if (p.filmFrame === FILM_PARAMS_DEFAULT.filmFrame && p.filmSide === FILM_PARAMS_DEFAULT.filmSide && p.sideLengthMM === FILM_PARAMS_DEFAULT.sideLengthMM)
    p = { ...p, filmFrame: FILM_FRAME_CUSTOM.id, filmSide: "long", sideLengthMM: 24 };
  const base = resolveFilmEdgeParams(p, GEOMETRY_DEFAULT, first, catalog);
  return {
    ...base,
    autoExposure: false,
    exposureBaselineEV: 0,
    filmFormatMM: pairFilmFormat(p, pair),
    pairSplit: 0.5,
    filmEdge: { ...base.filmEdge, format: "135_half", pair: true },
    dateBack: {
      ...base.dateBack,
      camera: "135_half",
      frameScale: 1,
      framing: "",
      textB: dateBackText(p.dateBack, second)
    }
  };
}

// src/shared/latitude.ts
function latitudeRequest(s) {
  return {
    highlight_pull_back: s.highlightPullBack,
    shadow_pull_back: s.shadowPullBack,
    rolloff: s.rolloff,
    max_lift: s.maxLift,
    norm: s.norm,
    shadow_percentile: s.shadowPercentile,
    highlight_percentile: s.highlightPercentile
  };
}
function applyLatitudeFit(base, fit) {
  const d = fit?.params_delta;
  if (!fit?.valid || !d || typeof d.scene_latitude_active !== "boolean" || !["power", "y", "max"].includes(d.scene_latitude_norm)) return null;
  const out = {
    ...base,
    highlightPullBack: fit.highlight?.pull_back,
    shadowPullBack: fit.shadow?.pull_back,
    active: d.scene_latitude_active,
    norm: d.scene_latitude_norm,
    highlightKnee: d.scene_latitude_highlight_knee,
    highlightRoom: d.scene_latitude_highlight_room,
    shadowKnee: d.scene_latitude_shadow_knee,
    shadowRoom: d.scene_latitude_shadow_room,
    rolloff: d.scene_latitude_rolloff,
    maxLift: d.scene_latitude_max_lift
  };
  return [
    out.highlightPullBack,
    out.shadowPullBack,
    out.highlightKnee,
    out.highlightRoom,
    out.shadowKnee,
    out.shadowRoom,
    out.rolloff,
    out.maxLift
  ].every(Number.isFinite) ? out : null;
}

// node_modules/.pnpm/i18next@26.4.2_typescript@6.0.3/node_modules/i18next/dist/esm/i18next.js
var isString = (obj4) => typeof obj4 === "string";
var defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve3, reject) => {
    res = resolve3;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
var makeString = (object) => {
  if (object == null) return "";
  return String(object);
};
var copy = (a, s, t2) => {
  a.forEach((m) => {
    if (s[m]) t2[m] = s[m];
  });
};
var lastOfPathSeparatorRegExp = /###/g;
var cleanKey = (key) => key && key.includes("###") ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
var canNotTraverseDeeper = (object) => !object || isString(object);
var getLastOfPath = (object, path2, Empty) => {
  const stack = !isString(path2) ? path2 : path2.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
var setPath = (object, path2, newValue) => {
  const {
    obj: obj4,
    k
  } = getLastOfPath(object, path2, Object);
  if (obj4 !== void 0 || path2.length === 1) {
    obj4[k] = newValue;
    return;
  }
  let e = path2[path2.length - 1];
  let p = path2.slice(0, path2.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === void 0 && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
var pushPath = (object, path2, newValue, concat) => {
  const {
    obj: obj4,
    k
  } = getLastOfPath(object, path2, Object);
  obj4[k] = obj4[k] || [];
  obj4[k].push(newValue);
};
var getPath = (object, path2) => {
  const {
    obj: obj4,
    k
  } = getLastOfPath(object, path2);
  if (!obj4) return void 0;
  if (!Object.prototype.hasOwnProperty.call(obj4, k)) return void 0;
  return obj4[k];
};
var getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
var deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
var regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
var escape = (data) => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
};
var RegExpCache = class {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
};
var chars = [" ", ",", "?", "!", ";"];
var looksLikeObjectPathRegExpCache = new RegExpCache(20);
var looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => !nsSeparator.includes(c) && !keySeparator.includes(c));
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
var deepFind = (obj4, path2, keySeparator = ".") => {
  if (!obj4) return void 0;
  if (obj4[path2]) {
    if (!Object.prototype.hasOwnProperty.call(obj4, path2)) return void 0;
    return obj4[path2];
  }
  const tokens = path2.split(keySeparator);
  let current = obj4;
  for (let i = 0; i < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].includes(typeof next) && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
var getCleanedCode = (code) => code?.replace(/_/g, "-");
var consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    console?.[type]?.apply?.(console, args);
  }
};
var Logger = class _Logger {
  constructor(concreteLogger, options = {}) {
    this.init(concreteLogger, options);
  }
  init(concreteLogger, options = {}) {
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log(...args) {
    return this.forward(args, "log", "", true);
  }
  warn(...args) {
    return this.forward(args, "warn", "", true);
  }
  error(...args) {
    return this.forward(args, "error", "");
  }
  deprecate(...args) {
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    args = args.map((a) => isString(a) ? a.replace(/[\r\n\x00-\x1F\x7F]/g, " ") : a);
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new _Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new _Logger(this.logger, options);
  }
};
var baseLogger = new Logger();
var EventEmitter = class {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    return this;
  }
  emit(event, ...args) {
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(event, ...args);
        }
      });
    }
  }
};
var ResourceStore = class extends EventEmitter {
  constructor(data, options = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (!this.options.ns.includes(ns)) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index2 = this.options.ns.indexOf(ns);
    if (index2 > -1) {
      this.options.ns.splice(index2, 1);
    }
  }
  getResource(lng, ns, key, options = {}) {
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path2;
    if (lng.includes(".")) {
      path2 = lng.split(".");
    } else {
      path2 = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path2.push(...key);
        } else if (isString(key) && keySeparator) {
          path2.push(...key.split(keySeparator));
        } else {
          path2.push(key);
        }
      }
    }
    const result = getPath(this.data, path2);
    if (!result && !ns && !key && lng.includes(".")) {
      lng = path2[0];
      ns = path2[1];
      key = path2.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
  }
  addResource(lng, ns, key, value, options = {
    silent: false
  }) {
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path2 = [lng, ns];
    if (key) path2 = path2.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.includes(".")) {
      path2 = lng.split(".");
      value = ns;
      ns = path2[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path2, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources, options = {
    silent: false
  }) {
    for (const m in resources) {
      if (isString(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite, options = {
    silent: false,
    skipCopy: false
  }) {
    let path2 = [lng, ns];
    if (lng.includes(".")) {
      path2 = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path2[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path2) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path2, pack);
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
};
var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      value = this.processors[processor]?.process(value, key, options, translator) ?? value;
    });
    return value;
  }
};
var PATH_KEY = /* @__PURE__ */ Symbol("i18next/PATH_KEY");
function createProxy() {
  const state = [];
  const handler = /* @__PURE__ */ Object.create(null);
  let proxy;
  handler.get = (target, key) => {
    proxy?.revoke?.();
    if (key === PATH_KEY) return state;
    state.push(key);
    proxy = Proxy.revocable(target, handler);
    return proxy.proxy;
  };
  return Proxy.revocable(/* @__PURE__ */ Object.create(null), handler).proxy;
}
function keysFromSelector(selector, opts) {
  const {
    [PATH_KEY]: path2
  } = selector(createProxy());
  const keySeparator = opts?.keySeparator ?? ".";
  const nsSeparator = opts?.nsSeparator ?? ":";
  const strict = opts?.enableSelector === "strict";
  if (path2.length > 1 && nsSeparator) {
    const ns = opts?.ns;
    const nsList = strict ? Array.isArray(ns) ? ns : ns ? [ns] : null : Array.isArray(ns) ? ns : null;
    if (nsList) {
      const candidates = strict ? nsList : nsList.length > 1 ? nsList.slice(1) : [];
      if (candidates.includes(path2[0])) {
        return `${path2[0]}${nsSeparator}${path2.slice(1).join(keySeparator)}`;
      }
    }
  }
  return path2.join(keySeparator);
}
var shouldHandleAsObject = (res) => !isString(res) && typeof res !== "boolean" && typeof res !== "number";
var Translator = class _Translator extends EventEmitter {
  constructor(services, options = {}) {
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
    this.checkedLoadedFor = {};
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key, o = {
    interpolation: {}
  }) {
    const opt = {
      ...o
    };
    if (key == null) return false;
    const resolved = this.resolve(key, opt);
    if (resolved?.res === void 0) return false;
    const isObject2 = shouldHandleAsObject(resolved.res);
    if (opt.returnObjects === false && isObject2) {
      return false;
    }
    return true;
  }
  extractFromKey(key, opt) {
    let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
    let namespaces = opt.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.includes(nsSeparator);
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.includes(parts[0])) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, o, lastKey) {
    let opt = typeof o === "object" ? {
      ...o
    } : o;
    if (typeof opt !== "object" && this.options.overloadTranslationOptionHandler) {
      opt = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof opt === "object") opt = {
      ...opt
    };
    if (!opt) opt = {};
    if (keys == null) return "";
    if (typeof keys === "function") keys = keysFromSelector(keys, {
      ...this.options,
      ...opt
    });
    if (!Array.isArray(keys)) keys = [String(keys)];
    keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
      ...this.options,
      ...opt
    }) : String(k));
    const returnDetails = opt.returnDetails !== void 0 ? opt.returnDetails : this.options.returnDetails;
    const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], opt);
    const namespace = namespaces[namespaces.length - 1];
    let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const lng = opt.lng || this.language;
    const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng?.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(opt)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(opt)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, opt);
    let res = resolved?.res;
    const resUsedKey = resolved?.usedKey || key;
    const resExactUsedKey = resolved?.exactUsedKey || key;
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = opt.joinArrays !== void 0 ? opt.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const needsPluralHandling = opt.count !== void 0 && !isString(opt.count);
    const hasDefaultValue = _Translator.hasDefaultValue(opt);
    const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : "";
    const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, {
      ordinal: false
    }) : "";
    const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
    const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
    let resForObjHndl = res;
    if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
      resForObjHndl = defaultValue;
    }
    const handleAsObject = shouldHandleAsObject(resForObjHndl);
    const resType = Object.prototype.toString.apply(resForObjHndl);
    if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && !noObject.includes(resType) && !(isString(joinArrays) && Array.isArray(resForObjHndl))) {
      if (!opt.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
          ...opt,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(opt);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(resForObjHndl);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in resForObjHndl) {
          if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            if (hasDefaultValue && !res) {
              copy2[m] = this.translate(deepKey, {
                ...opt,
                defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            } else {
              copy2[m] = this.translate(deepKey, {
                ...opt,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            }
            if (copy2[m] === deepKey) copy2[m] = resForObjHndl[m];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, opt, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, needsPluralHandling && !updateMissing ? `${key}${this.pluralResolver.getSuffix(lng, opt.count, opt)}` : key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...opt,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
        } else {
          lngs.push(opt.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
          } else if (this.backendConnector?.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
          }
          this.emit("missingKey", l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              const suffixes = this.pluralResolver.getSuffixes(language, opt);
              if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && !suffixes.includes(`${this.options.pluralSeparator}zero`)) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, opt, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) {
        res = `${namespace}${nsSeparator}${key}`;
      }
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : void 0, opt);
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(opt);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, opt, resolved, lastKey) {
    if (this.i18nFormat?.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...opt
      }, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!opt.skipInterpolation) {
      if (opt.interpolation) this.interpolator.init({
        ...opt,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...opt.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (opt?.interpolation?.skipOnVariables !== void 0 ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = opt.replace && !isString(opt.replace) ? opt.replace : opt;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) opt.nest = false;
      }
      if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
      if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
        if (lastKey?.[0] === args[0] && !opt.context) {
          this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return this.translate(...args, key);
      }, opt);
      if (opt.interpolation) this.interpolator.reset();
    }
    const postProcess = opt.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(opt)
        },
        ...opt
      } : opt, this);
    }
    return res;
  }
  resolve(keys, opt = {}) {
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    if (Array.isArray(keys)) keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
      ...this.options,
      ...opt
    }) : k);
    keys.forEach((k) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, opt);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = opt.count !== void 0 && !isString(opt.count);
      const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
      const needsContextHandling = opt.context !== void 0 && (isString(opt.context) || typeof opt.context === "number") && opt.context !== "";
      const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!this.checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
          this.checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat?.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              finalKeys.push(key + pluralSuffix);
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator || "_"}${opt.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                finalKeys.push(contextKey + pluralSuffix);
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, opt);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key, options = {}) {
    if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails(options = {}) {
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data = {
        ...data,
        count: options.count
      };
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && option.startsWith(prefix) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
};
var LanguageUtil = class {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
    this.resolveHierarchyCache = {};
  }
  clearCache() {
    this.resolveHierarchyCache = {};
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || !code.includes("-")) return null;
    const p = code.split("-");
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || !code.includes("-")) return code;
    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.includes("-")) {
      let formattedCode;
      try {
        formattedCode = Intl.getCanonicalLocales(code)[0];
      } catch (e) {
      }
      if (formattedCode && this.options.lowerCaseLng) {
        formattedCode = formattedCode.toLowerCase();
      }
      if (formattedCode) return formattedCode;
      if (this.options.lowerCaseLng) {
        return code.toLowerCase();
      }
      return code;
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(code);
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngScOnly = this.getScriptPartFromCode(code);
        if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return true;
          if (!supportedLng.includes("-") && !lngOnly.includes("-")) return false;
          if (supportedLng.includes("-") && !lngOnly.includes("-") && supportedLng.slice(0, supportedLng.indexOf("-")) === lngOnly) return true;
          if (supportedLng.startsWith(lngOnly) && lngOnly.length > 1) return true;
          return false;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackLng = this.options.fallbackLng;
    const fallbackLngKey = Array.isArray(fallbackLng) ? fallbackLng.join("|") : fallbackLng;
    if (fallbackLngKey !== this._cachedFallbackLng) {
      this.resolveHierarchyCache = {};
      this._cachedFallbackLng = fallbackLngKey;
    }
    const hasCacheableFallback = fallbackCode === void 0 || fallbackCode === false || isString(fallbackCode);
    const usesUncacheableOptionsFallback = fallbackCode === void 0 && typeof this.options.fallbackLng === "function";
    const cacheable = isString(code) && hasCacheableFallback && !usesUncacheableOptionsFallback;
    let cacheKey = null;
    if (cacheable) {
      let fallbackCacheKey;
      if (fallbackCode === void 0) fallbackCacheKey = "undefined";
      else if (fallbackCode === false) fallbackCacheKey = "boolean:false";
      else fallbackCacheKey = `string:${fallbackCode}`;
      cacheKey = `${code.length}:${code}|${fallbackCacheKey}`;
    }
    if (cacheKey !== null) {
      const cached = this.resolveHierarchyCache[cacheKey];
      if (cached !== void 0) return cached.slice();
    }
    const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString(code) && (code.includes("-") || code.includes("_"))) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (!codes.includes(fc)) addCode(this.formatLanguageCode(fc));
    });
    if (cacheKey !== null) {
      this.resolveHierarchyCache[cacheKey] = codes;
      return codes.slice();
    }
    return codes;
  }
};
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
var dummyRule = {
  select: (count) => count === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
var PluralResolver = class {
  constructor(languageUtils, options = {}) {
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    this.pluralRulesCache = {};
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code, options = {}) {
    const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
    const type = options.ordinal ? "ordinal" : "cardinal";
    const cacheKey = JSON.stringify({
      cleanedCode,
      type
    });
    if (cacheKey in this.pluralRulesCache) {
      return this.pluralRulesCache[cacheKey];
    }
    let rule;
    try {
      rule = new Intl.PluralRules(cleanedCode, {
        type
      });
    } catch (err) {
      if (typeof Intl === "undefined") {
        this.logger.error("No Intl support, please use an Intl polyfill!");
        return dummyRule;
      }
      if (!code.match(/-|_/)) return dummyRule;
      const lngPart = this.languageUtils.getLanguagePartFromCode(code);
      rule = this.getRule(lngPart, options);
    }
    this.pluralRulesCache[cacheKey] = rule;
    return rule;
  }
  needsPlural(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    return rule?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(code, key, options = {}) {
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    if (!rule) return [];
    return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
  }
  getSuffix(code, count, options = {}) {
    const rule = this.getRule(code, options);
    if (rule) {
      return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return this.getSuffix("dev", count, options);
  }
};
var deepFindWithDefaults = (data, defaultData, key, keySeparator = ".", ignoreJSONStructure = true) => {
  let path2 = getPathWithDefaults(data, defaultData, key);
  if (!path2 && ignoreJSONStructure && isString(key)) {
    path2 = deepFind(data, key, keySeparator);
    if (path2 === void 0) path2 = deepFind(defaultData, key, keySeparator);
  }
  return path2;
};
var regexSafe = (val) => val.replace(/\$/g, "$$$$");
var Interpolator = class {
  constructor(options = {}) {
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options?.interpolation?.format || ((value) => value);
    this.init(options);
  }
  init(options = {}) {
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix ? regexEscape(unescapePrefix) : "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix ? regexEscape(unescapeSuffix) : "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp?.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (!key.includes(this.formatSeparator)) {
        const path2 = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path2, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path2;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    if (!this.escapeValue && typeof str === "string" && /\$t\([^)]*\{[^}]*\{\{/.test(str)) {
      this.logger.warn("nesting options string contains interpolated variables with escapeValue: false \u2014 if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.");
    }
    const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => val
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? this.escape(val) : val
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], regexSafe(safeValue));
        if (skipOnVariables) {
          todo.regex.lastIndex += safeValue.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc, options = {}) {
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (!key.includes(sep)) return key;
      const c = key.split(new RegExp(`${regexEscape(sep)}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || (matchedDoubleQuotes?.length ?? 0) % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.includes(this.prefix)) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      const keyEndIndex = /{.*}/s.test(match[1]) ? match[1].lastIndexOf("}") + 1 : match[1].indexOf(this.formatSeparator);
      if (keyEndIndex !== -1) {
        formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map((elem) => elem.trim()).filter(Boolean);
        match[1] = match[1].slice(0, keyEndIndex);
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (formatters.length) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], regexSafe(makeString(value)));
      this.regexp.lastIndex = 0;
    }
    return str;
  }
};
var parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.includes("(")) {
    const p = formatStr.split("(");
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].slice(0, -1);
    if (formatName === "currency" && !optStr.includes(":")) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && !optStr.includes(":")) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
var createCachedFormatter = (fn) => {
  const cache = {};
  return (v, l, o) => {
    let optForCache = o;
    if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [o.interpolationkey]: void 0
      };
    }
    const key = l + JSON.stringify(optForCache);
    let frm = cache[key];
    if (!frm) {
      frm = fn(getCleanedCode(l), o);
      cache[key] = frm;
    }
    return frm(v);
  };
};
var createNonCachedFormatter = (fn) => (v, l, o) => fn(getCleanedCode(l), o)(v);
var Formatter = class {
  constructor(options = {}) {
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.init(options);
  }
  init(services, options = {
    interpolation: {}
  }) {
    this.formatSeparator = options.interpolation.formatSeparator || ",";
    const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
    this.formats = {
      number: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: cf((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: cf((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: cf((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng, options = {}) {
    if (!format) return value;
    if (value == null) return value;
    const rawFormats = format.split(this.formatSeparator);
    const formats = [];
    for (let i = 0; i < rawFormats.length; i++) {
      let f = rawFormats[i];
      while (f.indexOf("(") > -1 && !f.includes(")") && i + 1 < rawFormats.length) {
        f = `${f}${this.formatSeparator}${rawFormats[++i]}`;
      }
      formats.push(f);
    }
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options?.formatParams?.[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
};
var removePending = (q, name) => {
  if (q.pending[name] !== void 0) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
var Connector = class extends EventEmitter {
  constructor(backend, store, services, options = {}) {
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    this.backend?.init?.(services, options.backend, options);
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q) => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach((l) => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach((n) => {
              if (loaded[l][n] === void 0) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q) => !q.done);
  }
  read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read(lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === "function") {
          r.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces, options = {}, callback) {
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name, prefix = "") {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {
  }) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend?.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === "function") {
            r.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
};
var get = () => ({
  debug: false,
  initAsync: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  enableSelector: false,
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  },
  cacheInBuiltFormats: true
});
var transformOptions = (options) => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && !options.supportedLngs.includes("cimode")) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
};
var noop = () => {
};
var bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
var I18n = class _I18n extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initAsync) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init(options = {}, callback) {
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options.defaultNS == null && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (!options.ns.includes("translation")) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    this.options.interpolation = {
      ...defOpts.interpolation,
      ...this.options.interpolation
    };
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    if (typeof this.options.overloadTranslationOptionHandler !== "function") {
      this.options.overloadTranslationOptionHandler = defOpts.overloadTranslationOptionHandler;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator
      });
      if (formatter) {
        s.formatter = createClassOnDemand(formatter);
        if (s.formatter.init) s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", (event, ...args) => {
        this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", (event, ...args) => {
        this.emit(event, ...args);
      });
      this.modules.external.forEach((m) => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = (...args) => this.store[fcName](...args);
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = (...args) => {
        this.store[fcName](...args);
        return this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t2) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err, t2);
      };
      if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initAsync) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language, callback = noop) {
    let usedCallback = callback;
    const usedLng = isString(language) ? language : this.language;
    if (typeof language === "function") usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (l === "cimode") return;
          if (!toLoad.includes(l)) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l) => append(l));
      } else {
        append(usedLng);
      }
      this.options.preload?.forEach?.((l) => append(l));
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module.type === "backend") {
      this.modules.backend = module;
    }
    if (module.type === "logger" || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === "languageDetector") {
      this.modules.languageDetector = module;
    }
    if (module.type === "i18nFormat") {
      this.modules.i18nFormat = module;
    }
    if (module.type === "postProcessor") {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === "formatter") {
      this.modules.formatter = module;
    }
    if (module.type === "3rdParty") {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (["cimode", "dev"].includes(l)) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].includes(lngInLngs)) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
    if (!this.resolvedLanguage && !this.languages.includes(l) && this.store.hasLanguageSomeTranslations(l)) {
      this.resolvedLanguage = l;
      this.languages.unshift(l);
    }
  }
  changeLanguage(lng, callback) {
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l) => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        if (this.isLanguageChangingTo === lng) {
          setLngProps(l);
          this.translator.changeLanguage(l);
          this.isLanguageChangingTo = void 0;
          this.emit("languageChanged", l);
          this.logger.log("languageChanged", l);
        }
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve((...args) => this.t(...args));
      if (callback) callback(err, (...args) => this.t(...args));
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const fl = isString(lngs) ? lngs : lngs && lngs[0];
      const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString(lngs) ? [lngs] : lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        this.services.languageDetector?.cacheUserLanguage?.(l);
      }
      this.loadResources(l, (err) => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix, fixedOpts) {
    const scopeNs = fixedOpts?.scopeNs;
    const fixedT = (key, opts, ...rest) => {
      let o;
      if (typeof opts !== "object") {
        o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        o = {
          ...opts
        };
      }
      o.lng = o.lng || fixedT.lng;
      o.lngs = o.lngs || fixedT.lngs;
      const explicitCallNs = o.ns !== void 0 && o.ns !== null;
      o.ns = o.ns || fixedT.ns;
      if (o.keyPrefix !== "") o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const selectorOpts = {
        ...this.options,
        ...o
      };
      if (Array.isArray(scopeNs) && !explicitCallNs) selectorOpts.ns = scopeNs;
      if (typeof o.keyPrefix === "function") o.keyPrefix = keysFromSelector(o.keyPrefix, selectorOpts);
      const keySeparator = this.options.keySeparator || ".";
      let resultKey;
      if (o.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k) => {
          if (typeof k === "function") k = keysFromSelector(k, selectorOpts);
          return `${o.keyPrefix}${keySeparator}${k}`;
        });
      } else {
        if (typeof key === "function") key = keysFromSelector(key, selectorOpts);
        resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
      }
      return this.t(resultKey, o);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t(...args) {
    return this.translator?.translate(...args);
  }
  exists(...args) {
    return this.translator?.exists(...args);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns, options = {}) {
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach((n) => {
      if (!this.options.ns.includes(n)) this.options.ns.push(n);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => !preloaded.includes(lng) && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    try {
      const l = new Intl.Locale(lng);
      if (l && l.getTextInfo) {
        const ti = l.getTextInfo();
        if (ti && ti.direction) return ti.direction;
      }
    } catch (e) {
    }
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
    if (lng.toLowerCase().indexOf("-latn") > 1) return "ltr";
    return rtlLngs.includes(languageUtils.getLanguagePartFromCode(lng)) || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(options = {}, callback) {
    const instance2 = new _I18n(options, callback);
    instance2.createInstance = _I18n.createInstance;
    return instance2;
  }
  cloneInstance(options = {}, callback = noop) {
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new _I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m) => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
        prev[l] = {
          ...this.store.data[l]
        };
        prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
          acc[n] = {
            ...prev[l][n]
          };
          return acc;
        }, prev[l]);
        return prev;
      }, {});
      clone.store = new ResourceStore(clonedData, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    if (options.interpolation) {
      const defOpts = get();
      const mergedInterpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation,
        ...options.interpolation
      };
      const mergedForInterpolator = {
        ...mergedOptions,
        interpolation: mergedInterpolation
      };
      clone.services.interpolator = new Interpolator(mergedForInterpolator);
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", (event, ...args) => {
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
};
var instance = I18n.createInstance();
var createInstance = instance.createInstance;
var dir = instance.dir;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/Trans.js
var import_react3 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/TransWithoutContext.js
var import_react = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/utils.js
var warn = (i18n, code, msg, rest) => {
  const args = [msg, {
    code,
    ...rest || {}
  }];
  if (i18n?.services?.logger?.forward) {
    return i18n.services.logger.forward(args, "warn", "react-i18next::", true);
  }
  if (isString2(args[0])) args[0] = `react-i18next:: ${args[0]}`;
  if (i18n?.services?.logger?.warn) {
    i18n.services.logger.warn(...args);
  } else if (console?.warn) {
    console.warn(...args);
  }
};
var alreadyWarned = {};
var warnOnce = (i18n, code, msg, rest) => {
  if (isString2(msg) && alreadyWarned[msg]) return;
  if (isString2(msg)) alreadyWarned[msg] = /* @__PURE__ */ new Date();
  warn(i18n, code, msg, rest);
};
var isString2 = (obj4) => typeof obj4 === "string";

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/unescape.js
var matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
var htmlEntities = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "\xA9",
  "&#169;": "\xA9",
  "&reg;": "\xAE",
  "&#174;": "\xAE",
  "&hellip;": "\u2026",
  "&#8230;": "\u2026",
  "&#x2F;": "/",
  "&#47;": "/"
};
var unescapeHtmlEntity = (m) => htmlEntities[m];
var unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/defaults.js
var defaultOptions = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: true,
  unescape,
  transDefaultProps: void 0
};
var setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/i18nInstance.js
var i18nInstance;
var setI18n = (instance2) => {
  i18nInstance = instance2;
};
var getI18n = () => i18nInstance;

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/context.js
var import_react2 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/initReactI18next.js
var initReactI18next = {
  type: "3rdParty",
  init(instance2) {
    setDefaults(instance2.options.react);
    setI18n(instance2);
  }
};

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/context.js
var I18nContext = (0, import_react2.createContext)();

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTrans.js
var import_react6 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTransWithoutContext.js
var import_react5 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTransUtils/TranslationParserError.js
var TranslationParserError = class _TranslationParserError extends Error {
  constructor(message, position, translationString) {
    super(message);
    this.name = "TranslationParserError";
    this.position = position;
    this.translationString = translationString;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _TranslationParserError);
    }
  }
};

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTransUtils/htmlEntityDecoder.js
var commonEntities = {
  "&nbsp;": "\xA0",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&copy;": "\xA9",
  "&reg;": "\xAE",
  "&trade;": "\u2122",
  "&hellip;": "\u2026",
  "&ndash;": "\u2013",
  "&mdash;": "\u2014",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&sbquo;": "\u201A",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
  "&bdquo;": "\u201E",
  "&dagger;": "\u2020",
  "&Dagger;": "\u2021",
  "&bull;": "\u2022",
  "&prime;": "\u2032",
  "&Prime;": "\u2033",
  "&lsaquo;": "\u2039",
  "&rsaquo;": "\u203A",
  "&sect;": "\xA7",
  "&para;": "\xB6",
  "&middot;": "\xB7",
  "&ensp;": "\u2002",
  "&emsp;": "\u2003",
  "&thinsp;": "\u2009",
  "&euro;": "\u20AC",
  "&pound;": "\xA3",
  "&yen;": "\xA5",
  "&cent;": "\xA2",
  "&curren;": "\xA4",
  "&times;": "\xD7",
  "&divide;": "\xF7",
  "&minus;": "\u2212",
  "&plusmn;": "\xB1",
  "&ne;": "\u2260",
  "&le;": "\u2264",
  "&ge;": "\u2265",
  "&asymp;": "\u2248",
  "&equiv;": "\u2261",
  "&infin;": "\u221E",
  "&int;": "\u222B",
  "&sum;": "\u2211",
  "&prod;": "\u220F",
  "&radic;": "\u221A",
  "&part;": "\u2202",
  "&permil;": "\u2030",
  "&deg;": "\xB0",
  "&micro;": "\xB5",
  "&larr;": "\u2190",
  "&uarr;": "\u2191",
  "&rarr;": "\u2192",
  "&darr;": "\u2193",
  "&harr;": "\u2194",
  "&crarr;": "\u21B5",
  "&lArr;": "\u21D0",
  "&uArr;": "\u21D1",
  "&rArr;": "\u21D2",
  "&dArr;": "\u21D3",
  "&hArr;": "\u21D4",
  "&alpha;": "\u03B1",
  "&beta;": "\u03B2",
  "&gamma;": "\u03B3",
  "&delta;": "\u03B4",
  "&epsilon;": "\u03B5",
  "&zeta;": "\u03B6",
  "&eta;": "\u03B7",
  "&theta;": "\u03B8",
  "&iota;": "\u03B9",
  "&kappa;": "\u03BA",
  "&lambda;": "\u03BB",
  "&mu;": "\u03BC",
  "&nu;": "\u03BD",
  "&xi;": "\u03BE",
  "&omicron;": "\u03BF",
  "&pi;": "\u03C0",
  "&rho;": "\u03C1",
  "&sigma;": "\u03C3",
  "&tau;": "\u03C4",
  "&upsilon;": "\u03C5",
  "&phi;": "\u03C6",
  "&chi;": "\u03C7",
  "&psi;": "\u03C8",
  "&omega;": "\u03C9",
  "&Alpha;": "\u0391",
  "&Beta;": "\u0392",
  "&Gamma;": "\u0393",
  "&Delta;": "\u0394",
  "&Epsilon;": "\u0395",
  "&Zeta;": "\u0396",
  "&Eta;": "\u0397",
  "&Theta;": "\u0398",
  "&Iota;": "\u0399",
  "&Kappa;": "\u039A",
  "&Lambda;": "\u039B",
  "&Mu;": "\u039C",
  "&Nu;": "\u039D",
  "&Xi;": "\u039E",
  "&Omicron;": "\u039F",
  "&Pi;": "\u03A0",
  "&Rho;": "\u03A1",
  "&Sigma;": "\u03A3",
  "&Tau;": "\u03A4",
  "&Upsilon;": "\u03A5",
  "&Phi;": "\u03A6",
  "&Chi;": "\u03A7",
  "&Psi;": "\u03A8",
  "&Omega;": "\u03A9",
  "&Agrave;": "\xC0",
  "&Aacute;": "\xC1",
  "&Acirc;": "\xC2",
  "&Atilde;": "\xC3",
  "&Auml;": "\xC4",
  "&Aring;": "\xC5",
  "&AElig;": "\xC6",
  "&Ccedil;": "\xC7",
  "&Egrave;": "\xC8",
  "&Eacute;": "\xC9",
  "&Ecirc;": "\xCA",
  "&Euml;": "\xCB",
  "&Igrave;": "\xCC",
  "&Iacute;": "\xCD",
  "&Icirc;": "\xCE",
  "&Iuml;": "\xCF",
  "&ETH;": "\xD0",
  "&Ntilde;": "\xD1",
  "&Ograve;": "\xD2",
  "&Oacute;": "\xD3",
  "&Ocirc;": "\xD4",
  "&Otilde;": "\xD5",
  "&Ouml;": "\xD6",
  "&Oslash;": "\xD8",
  "&Ugrave;": "\xD9",
  "&Uacute;": "\xDA",
  "&Ucirc;": "\xDB",
  "&Uuml;": "\xDC",
  "&Yacute;": "\xDD",
  "&THORN;": "\xDE",
  "&szlig;": "\xDF",
  "&agrave;": "\xE0",
  "&aacute;": "\xE1",
  "&acirc;": "\xE2",
  "&atilde;": "\xE3",
  "&auml;": "\xE4",
  "&aring;": "\xE5",
  "&aelig;": "\xE6",
  "&ccedil;": "\xE7",
  "&egrave;": "\xE8",
  "&eacute;": "\xE9",
  "&ecirc;": "\xEA",
  "&euml;": "\xEB",
  "&igrave;": "\xEC",
  "&iacute;": "\xED",
  "&icirc;": "\xEE",
  "&iuml;": "\xEF",
  "&eth;": "\xF0",
  "&ntilde;": "\xF1",
  "&ograve;": "\xF2",
  "&oacute;": "\xF3",
  "&ocirc;": "\xF4",
  "&otilde;": "\xF5",
  "&ouml;": "\xF6",
  "&oslash;": "\xF8",
  "&ugrave;": "\xF9",
  "&uacute;": "\xFA",
  "&ucirc;": "\xFB",
  "&uuml;": "\xFC",
  "&yacute;": "\xFD",
  "&thorn;": "\xFE",
  "&yuml;": "\xFF",
  "&iexcl;": "\xA1",
  "&iquest;": "\xBF",
  "&fnof;": "\u0192",
  "&circ;": "\u02C6",
  "&tilde;": "\u02DC",
  "&OElig;": "\u0152",
  "&oelig;": "\u0153",
  "&Scaron;": "\u0160",
  "&scaron;": "\u0161",
  "&Yuml;": "\u0178",
  "&ordf;": "\xAA",
  "&ordm;": "\xBA",
  "&macr;": "\xAF",
  "&acute;": "\xB4",
  "&cedil;": "\xB8",
  "&sup1;": "\xB9",
  "&sup2;": "\xB2",
  "&sup3;": "\xB3",
  "&frac14;": "\xBC",
  "&frac12;": "\xBD",
  "&frac34;": "\xBE",
  "&spades;": "\u2660",
  "&clubs;": "\u2663",
  "&hearts;": "\u2665",
  "&diams;": "\u2666",
  "&loz;": "\u25CA",
  "&oline;": "\u203E",
  "&frasl;": "\u2044",
  "&weierp;": "\u2118",
  "&image;": "\u2111",
  "&real;": "\u211C",
  "&alefsym;": "\u2135"
};
var entityPattern = new RegExp(Object.keys(commonEntities).map((entity) => entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
var decodeHtmlEntities = (text) => text.replace(entityPattern, (match) => commonEntities[match]).replace(/&#(\d+);/g, (_, num3) => String.fromCharCode(parseInt(num3, 10))).replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTransUtils/tokenizer.js
var tokenize = (translation) => {
  const tokens = [];
  let position = 0;
  let currentText = "";
  const flushText = () => {
    if (currentText) {
      tokens.push({
        type: "Text",
        value: currentText,
        position: position - currentText.length
      });
      currentText = "";
    }
  };
  while (position < translation.length) {
    const char = translation[position];
    if (char === "<") {
      const tagMatch = translation.slice(position).match(/^<(\d+)>/);
      if (tagMatch) {
        flushText();
        tokens.push({
          type: "TagOpen",
          value: tagMatch[0],
          position,
          tagNumber: parseInt(tagMatch[1], 10)
        });
        position += tagMatch[0].length;
      } else {
        const closeTagMatch = translation.slice(position).match(/^<\/(\d+)>/);
        if (closeTagMatch) {
          flushText();
          tokens.push({
            type: "TagClose",
            value: closeTagMatch[0],
            position,
            tagNumber: parseInt(closeTagMatch[1], 10)
          });
          position += closeTagMatch[0].length;
        } else {
          currentText += char;
          position += 1;
        }
      }
    } else {
      currentText += char;
      position += 1;
    }
  }
  flushText();
  return tokens;
};

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTransUtils/renderTranslation.js
var import_react4 = __toESM(require_react(), 1);
var renderDeclarationNode = (declaration, children, childDeclarations) => {
  const {
    type,
    props = {}
  } = declaration;
  if (props.children && Array.isArray(props.children) && childDeclarations) {
    const {
      children: _childrenToRemove,
      ...propsWithoutChildren
    } = props;
    return import_react4.default.createElement(type, propsWithoutChildren, ...children);
  }
  if (children.length === 0) {
    return import_react4.default.createElement(type, props);
  }
  if (children.length === 1) {
    return import_react4.default.createElement(type, props, children[0]);
  }
  return import_react4.default.createElement(type, props, ...children);
};
var renderTranslation = (translation, declarations = []) => {
  if (!translation) {
    return [];
  }
  const tokens = tokenize(translation);
  const result = [];
  const stack = [];
  const literalTagNumbers = /* @__PURE__ */ new Set();
  const getCurrentDeclarations = () => {
    if (stack.length === 0) {
      return declarations;
    }
    const parentFrame = stack[stack.length - 1];
    if (parentFrame.declaration.props?.children && Array.isArray(parentFrame.declaration.props.children)) {
      return parentFrame.declaration.props.children;
    }
    return parentFrame.declarations;
  };
  tokens.forEach((token) => {
    switch (token.type) {
      case "Text":
        {
          const decoded = decodeHtmlEntities(token.value);
          const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
          targetArray.push(decoded);
        }
        break;
      case "TagOpen":
        {
          const {
            tagNumber
          } = token;
          const currentDeclarations = getCurrentDeclarations();
          const declaration = currentDeclarations[tagNumber];
          if (!declaration) {
            literalTagNumbers.add(tagNumber);
            const literalText = `<${tagNumber}>`;
            const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
            targetArray.push(literalText);
            break;
          }
          stack.push({
            tagNumber,
            children: [],
            position: token.position,
            declaration,
            declarations: currentDeclarations
          });
        }
        break;
      case "TagClose":
        {
          const {
            tagNumber
          } = token;
          if (literalTagNumbers.has(tagNumber)) {
            const literalText = `</${tagNumber}>`;
            const literalTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
            literalTargetArray.push(literalText);
            literalTagNumbers.delete(tagNumber);
            break;
          }
          if (stack.length === 0) {
            throw new TranslationParserError(`Unexpected closing tag </${tagNumber}> at position ${token.position}`, token.position, translation);
          }
          const frame = stack.pop();
          if (frame.tagNumber !== tagNumber) {
            throw new TranslationParserError(`Mismatched tags: expected </${frame.tagNumber}> but got </${tagNumber}> at position ${token.position}`, token.position, translation);
          }
          const element = renderDeclarationNode(frame.declaration, frame.children, frame.declarations);
          const elementTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
          elementTargetArray.push(element);
        }
        break;
    }
  });
  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    throw new TranslationParserError(`Unclosed tag <${unclosed.tagNumber}> at position ${unclosed.position}`, unclosed.position, translation);
  }
  return result;
};

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTransWithoutContext.js
function IcuTransWithoutContext({
  i18nKey,
  defaultTranslation,
  content,
  ns,
  values = {},
  i18n: i18nFromProps,
  t: tFromProps
}) {
  const i18n = i18nFromProps || getI18n();
  if (!i18n) {
    warnOnce(i18n, "NO_I18NEXT_INSTANCE", `IcuTrans: You need to pass in an i18next instance using i18nextReactModule`, {
      i18nKey
    });
    return import_react5.default.createElement(import_react5.default.Fragment, {}, defaultTranslation);
  }
  const t2 = tFromProps || i18n.t?.bind(i18n) || ((k) => k);
  let namespaces = ns || t2.ns || i18n.options?.defaultNS;
  namespaces = isString2(namespaces) ? [namespaces] : namespaces || ["translation"];
  let mergedValues = values;
  if (i18n.options?.interpolation?.defaultVariables) {
    mergedValues = values && Object.keys(values).length > 0 ? {
      ...values,
      ...i18n.options.interpolation.defaultVariables
    } : {
      ...i18n.options.interpolation.defaultVariables
    };
  }
  const translation = t2(i18nKey || defaultTranslation, {
    defaultValue: defaultTranslation,
    ...mergedValues,
    ns: namespaces
  });
  try {
    const rendered = renderTranslation(translation, content);
    return import_react5.default.createElement(import_react5.default.Fragment, {}, ...rendered);
  } catch (error) {
    warn(i18n, "ICU_TRANS_RENDER_ERROR", `IcuTrans component error for key "${i18nKey}": ${error.message}`, {
      i18nKey,
      error
    });
    return import_react5.default.createElement(import_react5.default.Fragment, {}, translation);
  }
}
IcuTransWithoutContext.displayName = "IcuTransWithoutContext";

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/IcuTrans.js
function IcuTrans({
  i18nKey,
  defaultTranslation,
  content,
  ns,
  values = {},
  i18n: i18nFromProps,
  t: tFromProps
}) {
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = (0, import_react6.useContext)(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  const t2 = tFromProps || i18n?.t.bind(i18n);
  return IcuTransWithoutContext({
    i18nKey,
    defaultTranslation,
    content,
    ns: ns || t2?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
    values,
    i18n,
    t: tFromProps
  });
}
IcuTrans.displayName = "IcuTrans";

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/useTranslation.js
var import_react7 = __toESM(require_react(), 1);
var import_shim = __toESM(require_shim(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/withTranslation.js
var import_react8 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/I18nextProvider.js
var import_react9 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/withSSR.js
var import_react11 = __toESM(require_react(), 1);

// node_modules/.pnpm/react-i18next@17.0.15_i18ne_bc3b487165c9a633bb3fce566b0e0165/node_modules/react-i18next/dist/es/useSSR.js
var import_react10 = __toESM(require_react(), 1);

// src/i18n/en.json
var en_default = {
  actionDeveloped: "Developed",
  actionOriginal: "Original",
  actionProcess: "Process this frame",
  actionRestart: "Restart",
  actionSolve: "Process",
  balanceMidtones: "Midtones",
  cameraFilmExposure: "Film Exposure",
  cameraFilmExposureAsShot: "As Shot",
  cameraLensCorrection: "Lens Correction",
  cameraMetering: "Metering",
  cameraTemperature: "Temperature",
  cameraTint: "Tint",
  cameraVignetting: "Vignetting",
  clipCopy: "Copy",
  clipCopyHelp: "Copy the ticked groups from the frame on the canvas (\u21E7\u2318C).",
  clipEmpty: "The clipboard is empty.",
  clipExposure: "Exposure",
  clipExposureHelp: "Metering method, film exposure and enlarger brightness. Each frame meters itself.",
  clipFilmAndPaper: "Film & Paper",
  clipFilmAndPaperHelp: "Film, paper, No Print Profile and EDR.",
  clipFilmEffects: "Film Effects",
  clipFilmEffectsHelp: "Film format, grain, halation, glare, scatter and couplers.",
  clipHolds: "Holds: %@ \xB7 %d of 7",
  clipMasks: "Masks",
  clipMasksHelp: "The Tone Mask and the local masks.",
  clipPaste: "Paste",
  clipPasteHelp: "Paste what the clipboard holds onto every picked frame (\u21E7\u2318V).",
  clipPasteTo: "Paste to %d",
  clipPrintEffects: "Print Effects",
  clipPrintEffectsHelp: "The Print Effects switch and pre-flash.",
  clipScenePlacement: "Scene Placement",
  clipScenePlacementHelp: "Highlight and shadow pull-back. The curve is fitted again on each frame.",
  clipSync: "Sync",
  clipSyncDone: "Photos synced: %d.",
  clipSyncHelp: "Apply the ticked groups from the current photo to the other selected photos. Crop and Post-Dev adjustments are not included.",
  clipSyncNothing: "Nothing to sync \u2014 the selected photos already have these settings.",
  clipSyncResult: "Photos synced: %d; failed: %d.",
  clipSyncTo: "Sync to %d",
  clipWhiteBalance: "White Balance",
  clipWhiteBalanceHelp: "Camera white balance and the enlarger's yellow and magenta filters. As Shot stays each frame's own camera value.",
  cropAspect: "Aspect",
  cropAspectFree: "Free",
  cropAspectOriginal: "Original",
  cropRotate: "Rotate",
  cropStraighten: "Straighten",
  cropStraightenUnit: "degrees",
  curveBlue: "Blue",
  curveGreen: "Green",
  curveInput: "Input",
  curveLuma: "Luma",
  curveOutput: "Output",
  curveRed: "Red",
  dateBetween: "Between",
  dateBrightness: "Brightness",
  dateCorner: "Corner",
  dateDate: "Date",
  dateFace: "Face",
  dateFaceData: "Data",
  dateFaceDots: "Dots",
  dateFromEXIF: "from EXIF",
  dateImprint: "Imprint",
  dateInFrame: "In frame",
  dateOrderJapan: "Year Month Day",
  dateOrderUS: "Month Day Year",
  dateSize: "Size",
  dateStops: "stops",
  dateWhere: "Where",
  dateWithData: "Shooting data",
  dateWithDataWhere: "beside the frame, with the date",
  edgeAdvance: "Advance",
  edgeAnother: "Another",
  edgeAnotherFrame: "Another frame",
  edgeBody: "Body",
  edgeFog: "Edge fog",
  edgeFormat: "Format",
  edgeFormatHalf: "Half",
  edgeFrameNumber: "Frame no.",
  edgeFrameNumberAuto: "Auto",
  edgeGate: "Gate",
  edgeGateAndScan: "GATE AND SCAN",
  edgeGateAuto: "Auto",
  edgeGateEared: "Eared",
  edgeGateKicked: "Kicked",
  edgeGateRounded: "Rounded",
  edgeGateShouldered: "Shouldered",
  edgeGateSquare: "Square",
  edgeGroup120: "120",
  edgeGroup135: "35 mm",
  edgeGroupPanoramic: "Panoramic",
  edgeHeldByFilmEdge: "Held by Film Edge",
  edgeHoles: "Holes",
  edgeHolesBlack: "Black",
  edgeHolesWhite: "White",
  edgeLeaks: "Spool leaks",
  edgeLight: "LIGHT",
  edgeMeteredOnPicture: "Metered on the picture, never the rebate.",
  edgeOff: "Off",
  edgeSetByFilmEdge: "Set by Film Edge",
  edgeView: "View",
  edgeViewFiled: "Filed",
  edgeViewStrip: "Strip",
  enlargerPreflash: "Pre-flash",
  exposureBlackPoint: "Black Point",
  exposureBrightness: "Brightness",
  exposureContrast: "Contrast",
  exposureHighlights: "Highlights",
  exposureSaturation: "Saturation",
  exposureShadows: "Shadows",
  exposureWhitePoint: "White Point",
  filmAntihalationLayer: "Anti-Halation Layer",
  filmCouplers: "DIR Couplers",
  filmCouplersStrength: "Couplers Strength",
  filmEffectStrength: "Strength",
  filmFormat: "Film Format",
  filmFormatLong: "Long",
  filmFormatShort: "Short",
  filmFormatSide: "Side",
  filmFormatSideLength: "Side Length",
  filmFormatSize: "Size",
  filmGlare: "Glare",
  filmGlareStrength: "Glare Strength",
  filmGrain: "Grain",
  filmGrainLayers: "Sub-layers",
  filmGrainStrength: "Grain Strength",
  filmGroupNegative: "Negative",
  filmGroupPositive: "Positive",
  filmHalation: "Halation",
  filmHalationStrength: "Halation Strength",
  filmHighlightBoost: "Highlight Boost",
  filmHighlightHeadroom: "Highlight Headroom",
  filmScatter: "Scatter",
  filmScatterStrength: "Scatter Strength",
  helpAllEffectsOff: "All effects off",
  helpAllEffectsOn: "All effects on",
  helpBeforeAfter: "Before / after split \u2014 drag the line on the canvas",
  helpCropWholeFrame: "Crop to whole frame",
  helpDevelopRailHide: "Hide the darkroom rail",
  helpDevelopRailShow: "Show the darkroom rail",
  helpEditRailHide: "Hide the adjustments rail",
  helpEditRailShow: "Show the adjustments rail",
  helpExport: "Export",
  helpFastFlip: "Fast flip (baked LUT, no glare, ignores your print grade)",
  helpFit: "Fit",
  helpFullScreenEnter: "Full screen",
  helpFullScreenLeave: "Leave full screen",
  helpOpen: "Open a folder or image",
  helpPan: "Pan",
  helpPickNeutral: "Pick a neutral point on the image",
  helpReset: "Reset",
  helpResetChannels: "Reset all channels",
  helpResetCrop: "Reset crop",
  helpResetDefaults: "Reset to defaults",
  helpResetEffectStrengths: "Reset effect strengths to the film's own",
  helpResetEnlarger: "Reset the enlarger to the solved pack",
  helpResetFilmExposure: "Reset film exposure",
  helpResetFilmFormat: "Reset the film format and its effects",
  helpResetPlacement: "Turn Scene Placement off",
  helpResetToneMask: "Reset the Tone Mask",
  helpRevealInFinder: "Reveal in Finder",
  helpSelect: "Select",
  helpStraightenZero: "Straighten to 0\xB0",
  helpSubLayerGrain: "Sub-layer grain model",
  helpUseFilmPaper: "Use the film's declared paper",
  helpWhiteBalancePreset: "White balance preset",
  helpZoomIn: "Zoom in",
  helpZoomOut: "Zoom out",
  languageFollowSystem: "Follow the system",
  latitudeAbove: "Above",
  latitudeBelow: "Below",
  latitudeEmpty: "Develop the frame to measure it against this film and paper.",
  latitudeFullSeparation: "full separation",
  latitudeHeld: "stops held",
  latitudeNoLight: "The frame has no light in it to measure.",
  latitudeUnmeasurable: "This film and paper do not print a rising tone scale, so there is no latitude to measure. A slide printed onto print film comes out as a negative.",
  latitudeWithin: "Within",
  maskCore: "Core",
  maskCurveCaption: "Change in paper exposure against the blurred negative, stops",
  maskEnable: "Enable",
  maskHighlights: "Highlights",
  maskRadius: "Radius",
  maskShadows: "Shadows",
  meteringBalanced: "Balanced",
  meteringCenter: "Center",
  meteringCenterWeightedLegacy: "center-weighted (legacy)",
  meteringCustom: "Custom",
  meteringProtectHighlights: "Protect highlights",
  meteringProtectShadows: "Protect shadows",
  placementHighlight: "Highlight",
  placementShadow: "Shadow",
  printDigitalIntermediate: "Digital Intermediate",
  printDigitalIntermediateHelp: "The negative with its orange mask removed and reversed on the film's own neutral curve, kept as Cineon log for grading elsewhere. Grain, halation and the film's colour stay; the paper does not.",
  printEDR: "Extended Dynamic Range (EDR)",
  printEffects: "Print Effects",
  printGroupCine: "Cine",
  printGroupDigital: "Digital",
  printGroupStill: "Still",
  printNone: "No Print Profile",
  railDevelop: "Develop",
  railEdit: "Edit",
  railFilmAndPrint: "Film and Print",
  railParameters: "Parameters",
  reasonBetweenNeedsFilmEdge: "Between needs Film Edge.",
  reasonDecodeWBDisabled: "Decode white balance applies to RAW input only.",
  reasonDisabledInDigitalIntermediate: "The Digital Intermediate has no paper, so print effects, the Tone Mask and EDR do not apply.",
  reasonEDRDisabledInScanFilm: "Extended Dynamic Range applies to selected print profiles.",
  reasonEffectOff: "Turn the effect on to set its strength.",
  reasonNoAntihalationLayer: "This film has no anti-halation layer",
  reasonNonCustomSideLength: "Side Length is the film type's own measurement. Choose Custom to type one.",
  reasonNotDeveloped: "Develop the frame first.",
  reasonPlacementInDigitalIntermediate: "Scene Placement fits a scene into a paper's range. The Digital Intermediate keeps the film's whole range.",
  reasonPositiveFilmDisablesPaper: "A slide film is already a positive \u2014 there is nothing for a paper to interpret. Choose a negative film to print onto paper.",
  reasonPrintEffectsOff: "Print Effects is off in the Print section.",
  sectionCamera: "Input / Camera",
  sectionClipboard: "Settings Clipboard",
  sectionColorBalance: "Color Balance",
  sectionCrop: "Crop",
  sectionCurve: "Curve",
  sectionDateBack: "Date Back",
  sectionEnlarger: "Enlarger",
  sectionExposure: "Exposure",
  sectionFilm: "Film",
  sectionFilmEdge: "Film Edge",
  sectionHistogram: "Histogram",
  sectionLatitude: "Latitude",
  sectionNavigator: "Navigator",
  sectionPrint: "Print",
  sectionScenePlacement: "Scene Placement",
  sectionToneMask: "Tone Mask",
  sectionWhiteBalance: "White Balance",
  setAgentsAccess: "Access",
  setAgentsClaudeCode: "Claude Code",
  setAgentsClaudeDesktop: "Claude Desktop",
  setAgentsCommandLine: "Command line",
  setAgentsCopied: "Copied",
  setAgentsCopy: "Copy",
  setAgentsInstall: "Install spektralab",
  setAgentsInstallCaption: "Writes a two-line script to ~/.local/bin/spektralab that runs this app without a window. Try `spektralab help`; every command prints JSON.",
  setAgentsInstalled: "Installed",
  setAgentsInstalledOther: "Installed for another copy of the app",
  setAgentsMCP: "MCP server",
  setAgentsMCPCaption: "Add SpektraLab to an agent with one of these. The agent starts the server itself over stdio when it needs it; nothing runs in the background.",
  setAgentsNotInstalled: "Not installed",
  setAgentsReinstall: "Reinstall",
  setAgentsToggle: "Allow command line and agent access",
  setAgentsToggleCaption: "Lets the spektralab command and MCP agents (Claude Code, Claude Desktop, any MCP client) open, edit, process and export photographs on this Mac \u2014 the same edits this window makes, saved where it reads them. Off, every call is refused, including one from an agent already connected. Local only: nothing listens on the network, and originals are never written.",
  setAgentsTools: "Tools",
  setAgentsUninstall: "Remove",
  setInterface: "Interface",
  setLanguage: "Language",
  setLanguageCaption: "Film, paper, camera and lens names stay in English, as do technical abbreviations. The change applies immediately \u2014 nothing needs restarting.",
  setResetLayout: "Reset All Layout",
  setResetLayoutCaption: "Panel widths, section heights and which sections are open, back to the drawing.",
  setScale: "Scale",
  setScaleCaption: "Scales type across the editor, Settings and Export. Changes apply immediately.",
  setTabAgents: "Agents",
  setTabDiagnostics: "Diagnostics",
  setTabGeneral: "General",
  setTabMemory: "Memory",
  setTabRendering: "Rendering",
  statusEDRScope: "Changes the render \u2014 canvas, proof and file alike",
  statusEmptyFilmstrip: "Drop a folder or images here, or press \u2318O.",
  statusFull: "full",
  statusFullPending: "full\u2026",
  statusRightRailWBScope: "Print \u2014 an adjustment on the scan.",
  tabPostDev: "Post-Dev",
  tabPreDev: "Pre-Dev"
};

// src/i18n/zh-Hans.json
var zh_Hans_default = {
  actionDeveloped: "\u663E\u5F71\u6548\u679C",
  actionOriginal: "\u539F\u56FE",
  actionProcess: "\u81EA\u52A8\u6D4B\u5149\u4E0E\u914D\u5149",
  actionRestart: "\u91CD\u65B0\u542F\u52A8",
  actionSolve: "\u914D\u5149",
  balanceMidtones: "\u4E2D\u95F4\u8C03",
  cameraFilmExposure: "\u80F6\u7247\u66DD\u5149",
  cameraFilmExposureAsShot: "\u62CD\u6444\u65F6\u8BBE\u7F6E",
  cameraLensCorrection: "\u955C\u5934\u6821\u6B63",
  cameraMetering: "\u6D4B\u5149\u65B9\u5F0F",
  cameraTemperature: "\u8272\u6E29",
  cameraTint: "\u8272\u8C03",
  cameraVignetting: "\u6697\u89D2",
  clipCopy: "\u590D\u5236",
  clipCopyHelp: "\u4ECE\u753B\u5E03\u4E0A\u7684\u7167\u7247\u590D\u5236\u52FE\u9009\u7684\u9879\u76EE\uFF08\u21E7\u2318C\uFF09\u3002",
  clipEmpty: "\u526A\u8D34\u677F\u4E3A\u7A7A\u3002",
  clipExposure: "\u66DD\u5149",
  clipExposureHelp: "\u6D4B\u5149\u65B9\u5F0F\u3001\u80F6\u7247\u66DD\u5149\u4E0E\u653E\u5927\u673A\u4EAE\u5EA6\u3002\u6BCF\u5F20\u7167\u7247\u5404\u81EA\u6D4B\u5149\u3002",
  clipFilmAndPaper: "\u80F6\u7247&\u76F8\u7EB8",
  clipFilmAndPaperHelp: "\u80F6\u7247\u3001\u76F8\u7EB8\u3001\u4E0D\u4F7F\u7528\u76F8\u7EB8\u914D\u7F6E\u4E0E EDR\u3002",
  clipFilmEffects: "\u80F6\u7247\u6548\u679C",
  clipFilmEffectsHelp: "\u80F6\u7247\u753B\u5E45\u3001\u9897\u7C92\u3001\u5149\u6655\u3001\u8000\u5149\u3001\u6563\u5C04\u4E0E\u8026\u5408\u5242\u3002",
  clipHolds: "\u526A\u8D34\u677F\uFF1A%@ \xB7 %d/7 \u9879",
  clipMasks: "\u906E\u7F69",
  clipMasksHelp: "\u5F71\u8C03\u8499\u7248\u4E0E\u5C40\u90E8\u8499\u7248\u3002",
  clipPaste: "\u7C98\u8D34",
  clipPasteHelp: "\u628A\u526A\u8D34\u677F\u91CC\u7684\u5185\u5BB9\u7C98\u8D34\u5230\u6240\u6709\u9009\u4E2D\u7684\u7167\u7247\uFF08\u21E7\u2318V\uFF09\u3002",
  clipPasteTo: "\u7C98\u8D34\u5230 %d \u5F20",
  clipPrintEffects: "\u76F8\u7EB8\u6548\u679C",
  clipPrintEffectsHelp: "\u76F8\u7EB8\u6548\u679C\u5F00\u5173\u4E0E\u9884\u95EA\u3002",
  clipScenePlacement: "\u573A\u666F\u7F6E\u4F4D",
  clipScenePlacementHelp: "\u9AD8\u5149\u4E0E\u9634\u5F71\u7684\u56DE\u62C9\u91CF\u3002\u66F2\u7EBF\u5728\u6BCF\u5F20\u7167\u7247\u4E0A\u91CD\u65B0\u62DF\u5408\u3002",
  clipSync: "\u540C\u6B65",
  clipSyncDone: "\u5DF2\u540C\u6B65 %d \u5F20\u3002",
  clipSyncHelp: "\u5C06\u5F53\u524D\u7167\u7247\u4E2D\u52FE\u9009\u7684\u9879\u76EE\u5E94\u7528\u5230\u5176\u4ED6\u9009\u4E2D\u7684\u7167\u7247\u3002\u4E0D\u5305\u542B\u88C1\u526A\u548C\u663E\u5F71\u540E\u8C03\u6574\u3002",
  clipSyncNothing: "\u65E0\u9700\u540C\u6B65\uFF1A\u6240\u9009\u7167\u7247\u7684\u8BBE\u7F6E\u5DF2\u76F8\u540C\u3002",
  clipSyncResult: "\u5DF2\u540C\u6B65 %d \u5F20\uFF0C\u5931\u8D25 %d \u5F20\u3002",
  clipSyncTo: "\u540C\u6B65\u5230 %d \u5F20",
  clipWhiteBalance: "\u767D\u5E73\u8861",
  clipWhiteBalanceHelp: "\u76F8\u673A\u767D\u5E73\u8861\u4E0E\u653E\u5927\u673A\u7684\u9EC4\u3001\u54C1\u6EE4\u8272\u3002\u201C\u62CD\u6444\u65F6\u8BBE\u7F6E\u201D\u4FDD\u6301\u6BCF\u5F20\u7167\u7247\u81EA\u5DF1\u7684\u76F8\u673A\u503C\u3002",
  cropAspect: "\u5BBD\u9AD8\u6BD4",
  cropAspectFree: "\u81EA\u7531",
  cropAspectOriginal: "\u539F\u59CB\u6BD4\u4F8B",
  cropRotate: "\u65CB\u8F6C",
  cropStraighten: "\u62C9\u76F4",
  cropStraightenUnit: "\u5EA6",
  curveBlue: "\u84DD",
  curveGreen: "\u7EFF",
  curveInput: "\u8F93\u5165",
  curveLuma: "\u660E\u5EA6",
  curveOutput: "\u8F93\u51FA",
  curveRed: "\u7EA2",
  dateBetween: "\u7247\u683C\u95F4",
  dateBrightness: "\u4EAE\u5EA6",
  dateCorner: "\u89D2\u843D",
  dateDate: "\u65E5\u671F",
  dateFace: "\u5B57\u4F53",
  dateFaceData: "\u6570\u636E",
  dateFaceDots: "\u70B9\u9635",
  dateFromEXIF: "\u6765\u81EA EXIF",
  dateImprint: "\u5370\u5B57",
  dateInFrame: "\u753B\u9762\u5185",
  dateOrderJapan: "\u5E74 \u6708 \u65E5",
  dateOrderUS: "\u6708 \u65E5 \u5E74",
  dateSize: "\u5927\u5C0F",
  dateStops: "\u6863",
  dateWhere: "\u4F4D\u7F6E",
  dateWithData: "\u62CD\u6444\u6570\u636E",
  dateWithDataWhere: "\u4E0E\u65E5\u671F\u540C\u65F6\u5370\u5728\u753B\u9762\u65C1",
  edgeAdvance: "\u8FC7\u7247",
  edgeAnother: "\u6362\u4E00\u53F0",
  edgeAnotherFrame: "\u6362\u4E00\u683C",
  edgeBody: "\u673A\u8EAB",
  edgeFog: "\u8FB9\u7F18\u7070\u96FE",
  edgeFormat: "\u753B\u5E45",
  edgeFormatHalf: "\u534A\u683C",
  edgeFrameNumber: "\u7247\u53F7",
  edgeFrameNumberAuto: "\u81EA\u52A8",
  edgeGate: "\u7247\u95E8",
  edgeGateAndScan: "\u7247\u95E8\u4E0E\u626B\u63CF",
  edgeGateAuto: "\u81EA\u52A8",
  edgeGateEared: "\u5E26\u8033",
  edgeGateKicked: "\u5916\u6487",
  edgeGateRounded: "\u5706\u89D2",
  edgeGateShouldered: "\u5E26\u80A9",
  edgeGateSquare: "\u65B9\u89D2",
  edgeGroup120: "120",
  edgeGroup135: "35 mm",
  edgeGroupPanoramic: "\u5BBD\u5E45",
  edgeHeldByFilmEdge: "\u7531\u7247\u8FB9\u51B3\u5B9A",
  edgeHoles: "\u9F7F\u5B54",
  edgeHolesBlack: "\u9ED1\u8272",
  edgeHolesWhite: "\u767D\u8272",
  edgeLeaks: "\u7247\u8F74\u6F0F\u5149",
  edgeLight: "\u6F0F\u5149\u4E0E\u7070\u96FE",
  edgeMeteredOnPicture: "\u53EA\u5BF9\u753B\u9762\u6D4B\u5149\uFF0C\u4E0D\u8BA1\u7247\u8FB9\u3002",
  edgeOff: "\u5173",
  edgeSetByFilmEdge: "\u7531\u7247\u8FB9\u8BBE\u5B9A",
  edgeView: "\u89C6\u56FE",
  edgeViewFiled: "\u5355\u683C",
  edgeViewStrip: "\u7247\u6761",
  enlargerPreflash: "\u9884\u66DD\u5149",
  exposureBlackPoint: "\u9ED1\u573A",
  exposureBrightness: "\u4EAE\u5EA6",
  exposureContrast: "\u5BF9\u6BD4\u5EA6",
  exposureHighlights: "\u9AD8\u5149",
  exposureSaturation: "\u9971\u548C\u5EA6",
  exposureShadows: "\u9634\u5F71",
  exposureWhitePoint: "\u767D\u573A",
  filmAntihalationLayer: "\u9632\u5149\u6655\u5C42",
  filmCouplers: "DIR \u6210\u8272\u5242",
  filmCouplersStrength: "\u6210\u8272\u5242\u5F3A\u5EA6",
  filmEffectStrength: "\u5F3A\u5EA6",
  filmFormat: "\u80F6\u7247\u753B\u5E45",
  filmFormatLong: "\u957F\u8FB9",
  filmFormatShort: "\u77ED\u8FB9",
  filmFormatSide: "\u57FA\u51C6\u8FB9",
  filmFormatSideLength: "\u8FB9\u957F",
  filmFormatSize: "\u5C3A\u5BF8",
  filmGlare: "\u8000\u5149",
  filmGlareStrength: "\u8000\u5149\u5F3A\u5EA6",
  filmGrain: "\u9897\u7C92",
  filmGrainLayers: "\u5206\u5C42\u9897\u7C92",
  filmGrainStrength: "\u9897\u7C92\u5F3A\u5EA6",
  filmGroupNegative: "\u8D1F\u7247",
  filmGroupPositive: "\u6B63\u7247",
  filmHalation: "\u5149\u6655",
  filmHalationStrength: "\u5149\u6655\u5F3A\u5EA6",
  filmHighlightBoost: "\u9AD8\u5149\u589E\u5F3A",
  filmHighlightHeadroom: "\u9AD8\u5149\u4F59\u91CF",
  filmScatter: "\u6563\u5C04",
  filmScatterStrength: "\u6563\u5C04\u5F3A\u5EA6",
  helpAllEffectsOff: "\u5173\u95ED\u6240\u6709\u6548\u679C",
  helpAllEffectsOn: "\u5F00\u542F\u6240\u6709\u6548\u679C",
  helpBeforeAfter: "\u539F\u56FE / \u6548\u679C\u5BF9\u6BD4 \u2014 \u5728\u753B\u5E03\u4E0A\u62D6\u52A8\u5206\u754C\u7EBF",
  helpCropWholeFrame: "\u6062\u590D\u5B8C\u6574\u753B\u9762",
  helpDevelopRailHide: "\u9690\u85CF\u663E\u5F71\u680F",
  helpDevelopRailShow: "\u663E\u793A\u663E\u5F71\u680F",
  helpEditRailHide: "\u9690\u85CF\u8C03\u6574\u680F",
  helpEditRailShow: "\u663E\u793A\u8C03\u6574\u680F",
  helpExport: "\u5BFC\u51FA",
  helpFastFlip: "\u5FEB\u901F\u5207\u6362\uFF08\u4F7F\u7528\u9884\u70D8\u7119 LUT\uFF0C\u4E0D\u542B\u8000\u5149\uFF0C\u5FFD\u7565\u5370\u76F8\u8C03\u6574\uFF09",
  helpFit: "\u9002\u5408\u7A97\u53E3",
  helpFullScreenEnter: "\u8FDB\u5165\u5168\u5C4F",
  helpFullScreenLeave: "\u9000\u51FA\u5168\u5C4F",
  helpOpen: "\u6253\u5F00\u6587\u4EF6\u5939\u6216\u56FE\u50CF",
  helpPan: "\u5E73\u79FB",
  helpPickNeutral: "\u5728\u56FE\u50CF\u4E2D\u9009\u53D6\u4E2D\u6027\u8272",
  helpReset: "\u91CD\u7F6E",
  helpResetChannels: "\u91CD\u7F6E\u6240\u6709\u901A\u9053",
  helpResetCrop: "\u91CD\u7F6E\u88C1\u526A",
  helpResetDefaults: "\u6062\u590D\u9ED8\u8BA4\u8BBE\u7F6E",
  helpResetEffectStrengths: "\u5C06\u6548\u679C\u5F3A\u5EA6\u6062\u590D\u4E3A\u80F6\u7247\u9ED8\u8BA4\u503C",
  helpResetEnlarger: "\u5C06\u653E\u5927\u673A\u6062\u590D\u4E3A\u914D\u5149\u7ED3\u679C",
  helpResetFilmExposure: "\u91CD\u7F6E\u80F6\u7247\u66DD\u5149",
  helpResetFilmFormat: "\u91CD\u7F6E\u80F6\u7247\u753B\u5E45\u4E0E\u6548\u679C",
  helpResetPlacement: "\u5173\u95ED\u573A\u666F\u7F6E\u4F4D",
  helpResetToneMask: "\u91CD\u7F6E\u5F71\u8C03\u8499\u7248",
  helpRevealInFinder: "\u5728 Finder \u4E2D\u663E\u793A",
  helpSelect: "\u9009\u62E9",
  helpStraightenZero: "\u62C9\u76F4\u5230 0\xB0",
  helpSubLayerGrain: "\u5206\u5C42\u9897\u7C92\u6A21\u578B",
  helpUseFilmPaper: "\u4F7F\u7528\u80F6\u7247\u9884\u8BBE\u7684\u76F8\u7EB8",
  helpWhiteBalancePreset: "\u767D\u5E73\u8861\u9884\u8BBE",
  helpZoomIn: "\u653E\u5927",
  helpZoomOut: "\u7F29\u5C0F",
  languageFollowSystem: "\u8DDF\u968F\u7CFB\u7EDF",
  latitudeAbove: "\u9AD8\u4E8E",
  latitudeBelow: "\u4F4E\u4E8E",
  latitudeEmpty: "\u663E\u5F71\u540E\u5373\u53EF\u6309\u5F53\u524D\u80F6\u7247\u4E0E\u76F8\u7EB8\u6D4B\u91CF\u3002",
  latitudeFullSeparation: "\u5B8C\u6574\u5C42\u6B21",
  latitudeHeld: "\u6863\u4FDD\u7559",
  latitudeNoLight: "\u753B\u9762\u4E2D\u6CA1\u6709\u53EF\u6D4B\u91CF\u7684\u5149\u3002",
  latitudeUnmeasurable: "\u5F53\u524D\u80F6\u7247\u4E0E\u76F8\u7EB8\u7684\u8F93\u51FA\u4E0D\u968F\u66DD\u5149\u9012\u589E\uFF0C\u65E0\u6CD5\u6D4B\u91CF\u5BBD\u5BB9\u5EA6\u3002\u53CD\u8F6C\u7247\u5370\u5230\u7535\u5F71\u6B63\u7247\u4E0A\u4F1A\u5F97\u5230\u8D1F\u50CF\u3002",
  latitudeWithin: "\u8303\u56F4\u5185",
  maskCore: "\u6838\u5FC3",
  maskCurveCaption: "\u6309\u6A21\u7CCA\u540E\u8D1F\u7247\u7684\u66DD\u5149\u91CF\u8BA1\u7B97\u7684\u76F8\u7EB8\u66DD\u5149\u53D8\u5316\uFF08\u6863\uFF09",
  maskEnable: "\u542F\u7528",
  maskHighlights: "\u9AD8\u5149",
  maskRadius: "\u534A\u5F84",
  maskShadows: "\u9634\u5F71",
  meteringBalanced: "\u5747\u8861",
  meteringCenter: "\u4E2D\u592E\u4E3B\u4F53",
  meteringCenterWeightedLegacy: "\u4E2D\u592E\u91CD\u70B9\uFF08\u65E7\u7248\uFF09",
  meteringCustom: "\u81EA\u5B9A\u4E49",
  meteringProtectHighlights: "\u4FDD\u62A4\u9AD8\u5149",
  meteringProtectShadows: "\u4FDD\u62A4\u9634\u5F71",
  placementHighlight: "\u9AD8\u5149",
  placementShadow: "\u9634\u5F71",
  printDigitalIntermediate: "\u6570\u5B57\u4E2D\u95F4\u7247",
  printDigitalIntermediateHelp: "\u53BB\u9664\u6A59\u8272\u8272\u7F69\u3001\u6309\u80F6\u7247\u81EA\u8EAB\u7684\u4E2D\u6027\u66F2\u7EBF\u53CD\u8F6C\u540E\u7684\u8D1F\u7247\uFF0C\u4EE5 Cineon \u5BF9\u6570\u4FDD\u5B58\uFF0C\u4F9B\u5176\u4ED6\u8F6F\u4EF6\u8C03\u8272\u3002\u4FDD\u7559\u9897\u7C92\u3001\u5149\u6655\u4E0E\u80F6\u7247\u7684\u8272\u5F69\uFF0C\u4E0D\u542B\u76F8\u7EB8\u3002",
  printEDR: "\u6269\u5C55\u52A8\u6001\u8303\u56F4\uFF08EDR\uFF09",
  printEffects: "\u76F8\u7EB8\u6548\u679C",
  printGroupCine: "\u7535\u5F71",
  printGroupDigital: "\u6570\u5B57",
  printGroupStill: "\u9759\u6001\u6444\u5F71",
  printNone: "\u4E0D\u4F7F\u7528\u76F8\u7EB8\u914D\u7F6E",
  railDevelop: "\u663E\u5F71",
  railEdit: "\u8C03\u6574",
  railFilmAndPrint: "\u80F6\u7247\u4E0E\u76F8\u7EB8",
  railParameters: "\u53C2\u6570",
  reasonBetweenNeedsFilmEdge: "\u7247\u683C\u95F4\u9700\u8981\u5F00\u542F\u7247\u8FB9\u3002",
  reasonDecodeWBDisabled: "\u4EC5 RAW \u56FE\u50CF\u652F\u6301\u8C03\u6574\u89E3\u7801\u767D\u5E73\u8861\u3002",
  reasonDisabledInDigitalIntermediate: "\u6570\u5B57\u4E2D\u95F4\u7247\u6CA1\u6709\u76F8\u7EB8\uFF0C\u5370\u76F8\u6548\u679C\u3001\u5F71\u8C03\u8499\u7248\u4E0E\u6269\u5C55\u52A8\u6001\u8303\u56F4\u4E0D\u9002\u7528\u3002",
  reasonEDRDisabledInScanFilm: "\u6269\u5C55\u52A8\u6001\u8303\u56F4\u4EC5\u9002\u7528\u4E8E\u76F8\u7EB8\u5370\u76F8\u3002",
  reasonEffectOff: "\u5F00\u542F\u8BE5\u6548\u679C\u540E\u53EF\u8C03\u8282\u5F3A\u5EA6\u3002",
  reasonNoAntihalationLayer: "\u6B64\u80F6\u7247\u6CA1\u6709\u9632\u5149\u6655\u5C42",
  reasonNonCustomSideLength: "\u9009\u62E9\u201C\u81EA\u5B9A\u4E49\u201D\u753B\u5E45\u540E\u53EF\u4FEE\u6539\u8FB9\u957F\u3002",
  reasonNotDeveloped: "\u8BF7\u5148\u663E\u5F71\u3002",
  reasonPlacementInDigitalIntermediate: "\u573A\u666F\u7F6E\u4F4D\u662F\u628A\u573A\u666F\u653E\u8FDB\u76F8\u7EB8\u7684\u5BBD\u5BB9\u5EA6\u91CC\u3002\u6570\u5B57\u4E2D\u95F4\u7247\u4FDD\u7559\u80F6\u7247\u7684\u5168\u90E8\u5BBD\u5BB9\u5EA6\u3002",
  reasonPositiveFilmDisablesPaper: "\u6B63\u7247\u65E0\u9700\u76F8\u7EB8\u5370\u76F8\u3002\u9009\u62E9\u8D1F\u7247\u540E\u53EF\u4F7F\u7528\u76F8\u7EB8\u914D\u7F6E\u3002",
  reasonPrintEffectsOff: "\u201C\u76F8\u7EB8\u6548\u679C\u201D\u5DF2\u5728\u76F8\u7EB8\u90E8\u5206\u5173\u95ED\u3002",
  sectionCamera: "\u8F93\u5165 / \u76F8\u673A",
  sectionClipboard: "\u8BBE\u7F6E\u526A\u8D34\u677F",
  sectionColorBalance: "\u8272\u5F69\u5E73\u8861",
  sectionCrop: "\u88C1\u526A",
  sectionCurve: "\u66F2\u7EBF",
  sectionDateBack: "\u65E5\u671F\u540E\u80CC",
  sectionEnlarger: "\u653E\u5927\u673A",
  sectionExposure: "\u66DD\u5149",
  sectionFilm: "\u80F6\u7247",
  sectionFilmEdge: "\u7247\u8FB9",
  sectionHistogram: "\u76F4\u65B9\u56FE",
  sectionLatitude: "\u5BBD\u5BB9\u5EA6",
  sectionNavigator: "\u5BFC\u822A",
  sectionPrint: "\u5370\u76F8",
  sectionScenePlacement: "\u573A\u666F\u7F6E\u4F4D",
  sectionToneMask: "\u5F71\u8C03\u8499\u7248",
  sectionWhiteBalance: "\u767D\u5E73\u8861",
  setAgentsAccess: "\u8BBF\u95EE",
  setAgentsClaudeCode: "Claude Code",
  setAgentsClaudeDesktop: "Claude Desktop",
  setAgentsCommandLine: "\u547D\u4EE4\u884C",
  setAgentsCopied: "\u5DF2\u590D\u5236",
  setAgentsCopy: "\u590D\u5236",
  setAgentsInstall: "\u5B89\u88C5 spektralab",
  setAgentsInstallCaption: "\u5728 ~/.local/bin/spektralab \u5199\u5165\u4E00\u4E2A\u4E24\u884C\u811A\u672C\uFF0C\u4EE5\u65E0\u7A97\u53E3\u65B9\u5F0F\u8FD0\u884C\u672C\u5E94\u7528\u3002\u53EF\u5148\u8BD5 `spektralab help`\uFF1B\u6BCF\u6761\u547D\u4EE4\u90FD\u8F93\u51FA JSON\u3002",
  setAgentsInstalled: "\u5DF2\u5B89\u88C5",
  setAgentsInstalledOther: "\u5DF2\u4E3A\u53E6\u4E00\u4EFD\u5E94\u7528\u5B89\u88C5",
  setAgentsMCP: "MCP \u670D\u52A1",
  setAgentsMCPCaption: "\u7528\u4EE5\u4E0B\u4EFB\u4E00\u65B9\u5F0F\u628A SpektraLab \u6DFB\u52A0\u7ED9\u667A\u80FD\u4F53\u3002\u670D\u52A1\u7531\u667A\u80FD\u4F53\u5728\u9700\u8981\u65F6\u901A\u8FC7 stdio \u81EA\u884C\u542F\u52A8\uFF0C\u4E0D\u5728\u540E\u53F0\u5E38\u9A7B\u3002",
  setAgentsNotInstalled: "\u672A\u5B89\u88C5",
  setAgentsReinstall: "\u91CD\u65B0\u5B89\u88C5",
  setAgentsToggle: "\u5141\u8BB8\u547D\u4EE4\u884C\u4E0E\u667A\u80FD\u4F53\u8BBF\u95EE",
  setAgentsToggleCaption: "\u5141\u8BB8 spektralab \u547D\u4EE4\u4E0E MCP \u667A\u80FD\u4F53\uFF08Claude Code\u3001Claude Desktop \u6216\u4EFB\u4F55 MCP \u5BA2\u6237\u7AEF\uFF09\u5728\u672C\u673A\u6253\u5F00\u3001\u7F16\u8F91\u3001\u51B2\u5370\u4E0E\u5BFC\u51FA\u7167\u7247\u2014\u2014\u4E0E\u672C\u7A97\u53E3\u7684\u7F16\u8F91\u5B8C\u5168\u76F8\u540C\uFF0C\u5E76\u4FDD\u5B58\u5728\u672C\u7A97\u53E3\u8BFB\u53D6\u7684\u4F4D\u7F6E\u3002\u5173\u95ED\u65F6\u6240\u6709\u8C03\u7528\u90FD\u4F1A\u88AB\u62D2\u7EDD\uFF0C\u5305\u62EC\u5DF2\u8FDE\u63A5\u7684\u667A\u80FD\u4F53\u3002\u4EC5\u9650\u672C\u673A\uFF1A\u4E0D\u76D1\u542C\u7F51\u7EDC\uFF0C\u4E5F\u4ECE\u4E0D\u6539\u5199\u539F\u7247\u3002",
  setAgentsTools: "\u5DE5\u5177",
  setAgentsUninstall: "\u79FB\u9664",
  setInterface: "\u754C\u9762",
  setLanguage: "\u8BED\u8A00",
  setLanguageCaption: "\u80F6\u7247\u3001\u76F8\u7EB8\u3001\u76F8\u673A\u4E0E\u955C\u5934\u540D\u79F0\u4EE5\u53CA\u6280\u672F\u7F29\u5199\u4FDD\u6301\u82F1\u6587\u3002\u5207\u6362\u7ACB\u5373\u751F\u6548\uFF0C\u65E0\u9700\u91CD\u65B0\u542F\u52A8\u3002",
  setResetLayout: "\u91CD\u7F6E\u5168\u90E8\u5E03\u5C40",
  setResetLayoutCaption: "\u5C06\u9762\u677F\u5BBD\u5EA6\u3001\u5404\u90E8\u5206\u9AD8\u5EA6\u4E0E\u5C55\u5F00\u72B6\u6001\u6062\u590D\u4E3A\u9ED8\u8BA4\u3002",
  setScale: "\u7F29\u653E",
  setScaleCaption: "\u540C\u6B65\u8C03\u6574\u4E3B\u754C\u9762\u3001\u8BBE\u7F6E\u4E0E\u5BFC\u51FA\u9875\u7684\u5B57\u4F53\u5927\u5C0F\uFF1B\u66F4\u6539\u7ACB\u5373\u751F\u6548\u3002",
  setTabAgents: "\u667A\u80FD\u4F53",
  setTabDiagnostics: "\u8BCA\u65AD",
  setTabGeneral: "\u5E38\u89C4",
  setTabMemory: "\u5185\u5B58",
  setTabRendering: "\u6E32\u67D3",
  statusEDRScope: "\u5F71\u54CD\u6E32\u67D3\u7ED3\u679C\uFF1A\u753B\u5E03\u3001\u8F6F\u6253\u6837\u548C\u5BFC\u51FA\u6587\u4EF6\u540C\u6B65\u53D8\u5316\u3002",
  statusEmptyFilmstrip: "\u5C06\u6587\u4EF6\u5939\u6216\u56FE\u50CF\u62D6\u5230\u6B64\u5904\uFF0C\u6216\u6309 \u2318O\u3002",
  statusFull: "\u5168\u5206\u8FA8\u7387",
  statusFullPending: "\u5168\u5206\u8FA8\u7387\u5904\u7406\u4E2D\u2026",
  statusRightRailWBScope: "\u5BF9\u5370\u76F8\u626B\u63CF\u7ED3\u679C\u8FDB\u884C\u8C03\u6574\u3002",
  tabPostDev: "\u663E\u5F71\u540E",
  tabPreDev: "\u663E\u5F71\u524D"
};

// src/i18n/index.ts
void instance.use(initReactI18next).init({
  resources: { en: { translation: en_default }, "zh-Hans": { translation: zh_Hans_default } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnEmptyString: false,
  keySeparator: false,
  nsSeparator: false
});
var tz = (english, chinese) => instance.language === "zh-Hans" && chinese ? chinese : english;

// src/export/recipes.ts
var NAME_TOKENS = ["originalName", "filmStock", "printStock", "date"];
var naming = () => ({ order: [...NAME_TOKENS], tokens: ["originalName", "filmStock", "printStock"], separator: "_" });
var DEFAULT_RECIPES = [
  { id: "jpeg-p3", name: "JPEG \u2014 Display P3", format: "jpeg", bitDepth: 8, colorSpace: "display-p3", quality: 92, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "SpektraLab", existing: "addSuffix", naming: naming() },
  { id: "tiff-prophoto", name: "TIFF 16-bit \u2014 ProPhoto", format: "tiff", bitDepth: 16, colorSpace: "prophoto", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "SpektraLab", existing: "addSuffix", naming: naming() },
  { id: "png-srgb", name: "PNG 8-bit \u2014 sRGB", format: "png", bitDepth: 8, colorSpace: "sRGB", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "SpektraLab", existing: "addSuffix", naming: naming() },
  { id: "di", name: "Digital Intermediate", format: "di", bitDepth: 16, colorSpace: "display-p3", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "_prints", existing: "addSuffix", naming: naming() },
  { id: "share-srgb", name: "Social sharing \u2014 JPEG sRGB", format: "jpeg", bitDepth: 8, colorSpace: "sRGB", quality: 92, longEdge: 2560, folder: { kind: "besideOriginal" }, subfolder: "Spektra Studio", existing: "addSuffix", naming: naming() },
  { id: "jpeg-original", name: "Original size \u2014 JPEG 100%", format: "jpeg", bitDepth: 8, colorSpace: "sRGB", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "Spektra Studio", existing: "addSuffix", naming: naming() },
  { id: "png16-srgb", name: "PNG 16-bit \u2014 sRGB", format: "png", bitDepth: 16, colorSpace: "sRGB", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "Spektra Studio", existing: "addSuffix", naming: naming() },
  { id: "webp-lossless", name: "WebP lossless \u2014 sRGB", format: "webp", bitDepth: 8, colorSpace: "sRGB", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "Spektra Studio", existing: "addSuffix", naming: naming() },
  { id: "raw-master", name: "RAW development master \u2014 TIFF 16-bit", format: "raw-master", bitDepth: 16, colorSpace: "prophoto", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "Spektra Studio", existing: "addSuffix", naming: naming() },
  { id: "original-copy", name: "Original copy + Spektra recipe", format: "original", bitDepth: 16, colorSpace: "prophoto", quality: 100, longEdge: 0, folder: { kind: "besideOriginal" }, subfolder: "Spektra Studio", existing: "addSuffix", naming: naming() }
];
var extensionOf = (r) => r.format === "jpeg" ? "jpg" : r.format === "png" ? "png" : r.format === "webp" ? "webp" : "tif";
function hostFormat(r) {
  if (r.format === "jpeg") return "jpeg";
  if (r.format === "png") return r.bitDepth === 16 ? "png16" : "png";
  if (r.format === "webp") return "webp-lossless";
  if (r.format === "raw-master") return "tiff16";
  return r.bitDepth === 8 ? "tiff8" : "tiff16";
}
var pad = (n) => String(n).padStart(2, "0");
function stem(r, c) {
  const chosen = r.naming.order.filter((t2) => r.naming.tokens.includes(t2));
  const parts = chosen.map((t2) => {
    switch (t2) {
      case "originalName":
        return c.originalName;
      case "filmStock":
        return c.filmStock;
      case "printStock":
        return c.printStock;
      case "date":
        return `${c.date.getFullYear()}-${pad(c.date.getMonth() + 1)}-${pad(c.date.getDate())}`;
    }
  }).filter((s) => s.length > 0);
  const joined = parts.join(r.naming.separator);
  return (joined || c.originalName).replace(/[/\\:]/g, "-");
}
var stockToken = (name) => name.replace(/^(Kodak|Fujifilm|Fuji)\s+(Professional\s+)?/, "").replace(/\s+/g, "_");
async function resolveTarget(dir2, base, ext, policy, exists2, join3) {
  const first = join3(dir2, `${base}.${ext}`);
  if (!await exists2(first)) return { path: first, overwrite: false };
  if (policy === "overwrite") return { path: first, overwrite: true };
  if (policy === "skip") return null;
  for (let i = 2; i < 1e4; i++) {
    const p = join3(dir2, `${base}-${i}.${ext}`);
    if (!await exists2(p)) return { path: p, overwrite: false };
  }
  return null;
}
function decodeRecipes(raw) {
  if (!Array.isArray(raw)) return DEFAULT_RECIPES;
  const out = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r;
    const base = DEFAULT_RECIPES.find((d) => d.format === o.format) ?? DEFAULT_RECIPES[0];
    const n = o.naming;
    out.push({
      ...base,
      ...o,
      id: typeof o.id === "string" ? o.id : `r${out.length}`,
      ...o.tiffCompression !== void 0 ? { tiffCompression: o.tiffCompression === "lzw" ? "lzw" : "none" } : {},
      ...o.embedsPreview !== void 0 ? { embedsPreview: o.embedsPreview === true } : {},
      naming: {
        order: Array.isArray(n?.order) ? [...n.order.filter((t2) => NAME_TOKENS.includes(t2)), ...NAME_TOKENS.filter((t2) => !n.order.includes(t2))] : [...NAME_TOKENS],
        tokens: (() => {
          const on = Array.isArray(n?.tokens) ? n.tokens.filter((t2) => NAME_TOKENS.includes(t2)) : [];
          return on.length ? on : ["originalName"];
        })(),
        separator: typeof n?.separator === "string" ? n.separator : "_"
      }
    });
  }
  const recovered = [];
  for (let i = 0; i < out.length; i++) {
    const r = out[i];
    const builtin = DEFAULT_RECIPES.find((d) => d.id === r.id);
    if (builtin && JSON.stringify(r) !== JSON.stringify(builtin)) {
      recovered.push({ ...r, id: `custom-recovered-${i}`, name: `${r.name} (custom)` });
      out[i] = structuredClone(builtin);
    }
  }
  const missing = DEFAULT_RECIPES.filter((d) => !out.some((r) => r.id === d.id));
  return out.length ? [...out, ...recovered, ...structuredClone(missing)] : DEFAULT_RECIPES;
}

// src/export/exporter.ts
function hostWrites(methods) {
  return !!methods?.includes("export_frame");
}
async function targetFor(r, f, catalog) {
  const dir0 = r.folder.kind === "fixed" ? r.folder.path : dirName(f.path);
  const dir2 = r.subfolder.trim() ? joinPath(dir0, r.subfolder.trim()) : dir0;
  const name = baseName(f.path).replace(/\.[^.]+$/, "");
  const date = f.dateTaken ? new Date(f.dateTaken) : /* @__PURE__ */ new Date();
  const base = stem(r, {
    originalName: name,
    filmStock: stockToken(catalog.stock(f.params.filmStock)?.name ?? f.params.filmStock),
    printStock: f.params.scanFilm ? "Scan" : stockToken(catalog.stock(f.params.printStock)?.name ?? f.params.printStock),
    date: Number.isFinite(date.getTime()) ? date : /* @__PURE__ */ new Date()
  });
  return { dir: dir2, base };
}
function snapshotGeometry(sidecar, params, gate) {
  const noFilm = sidecar.noFilm === true;
  return {
    noFilm,
    filmStrength: sidecar.filmStrength,
    geometry: canvasGeometryFor(params, sidecar.geometry, gate, noFilm),
    sourceGeometry: sourceGeometryFor(params, sidecar.geometry, gate, noFilm) ?? GEOMETRY_DEFAULT,
    filmGeometry: canvasGeometryFor(params, sidecar.geometry, gate),
    filmSourceGeometry: sourceGeometryFor(params, sidecar.geometry, gate) ?? GEOMETRY_DEFAULT
  };
}
async function captureExportFrames(paths, selected, catalog, gate, recalculateEffectsAfterCrop, cancelled = () => false) {
  const current = selected ? structuredClone(selected) : null;
  const frozenGate = structuredClone(gate);
  const result = [];
  for (const path2 of [...paths]) {
    if (cancelled()) break;
    try {
      const active = path2 === current?.path ? current : null;
      const saved = active ? null : await platform().sidecarLoad(path2);
      const sidecar = active?.sidecar ?? structuredClone(saved == null ? newSidecar() : decodeSidecar(saved));
      if (isPairPath(path2)) {
        const pair = active?.pair ?? decodePair(await platform().pairLoad(path2));
        if (!pair) throw new Error(tz("The half-frame pair recipe cannot be read.", "\u65E0\u6CD5\u8BFB\u53D6\u534A\u683C\u62FC\u63A5\u914D\u65B9\u3002"));
        const shots = {};
        for (const side of ["left", "right"]) {
          const hole = pair[side];
          if (!hole) throw new Error(tz("Fill both half-frame holes before exporting.", "\u5BFC\u51FA\u534A\u683C\u62FC\u63A5\u524D\uFF0C\u8BF7\u5148\u586B\u6EE1\u4E24\u683C\u3002"));
          const known = active?.pairInfo?.[side];
          shots[side] = known ?? { ...await host().probe(hole.path), available: true };
          if (!shots[side]?.available) throw new Error(shots[side]?.error ?? tz("A half-frame photograph cannot be read.", "\u65E0\u6CD5\u8BFB\u53D6\u534A\u683C\u4E2D\u7684\u7167\u7247\u3002"));
        }
        const native2 = sourcePairLayout(pair, { left: shots.left, right: shots.right }).size;
        const params2 = resolvePairParams(
          normalizeStockPair(sidecar.params, catalog),
          pair,
          shots.left?.metadata ?? null,
          shots.right?.metadata ?? null,
          catalog
        );
        result.push({ path: path2, frame: structuredClone({
          path: path2,
          session: active?.session,
          params: params2,
          adjustments: sidecar.adjustments,
          ...snapshotGeometry(sidecar, params2, frozenGate),
          decode: sidecar.decode,
          gate: frozenGate,
          native: native2,
          pair: pairSnapshotFor(pair, params2),
          dateTaken: shots.left?.metadata?.datetime_original ?? shots.right?.metadata?.datetime_original,
          recipe: portableRecipe(sidecar),
          scenePlacement: sidecar.placementNeedsFit ? { ...latitudeRequest(params2.sceneLatitude), region: pairFitRegion(pair, params2.placementIsRight) } : void 0,
          scenePlacementSide: sidecar.placementNeedsFit && params2.placementIsRight ? "right" : void 0
        }) });
        continue;
      }
      const info = active?.native && active.metadata !== void 0 ? null : await host().probe(path2);
      const native = active?.native ?? (info ? { width: info.width, height: info.height } : void 0);
      if (!native || native.width <= 0 || native.height <= 0) throw new Error(tz("The photograph has no usable dimensions.", "\u8FD9\u5F20\u7167\u7247\u6CA1\u6709\u53EF\u7528\u7684\u5C3A\u5BF8\u3002"));
      let params = { ...normalizeStockPair(sidecar.params, catalog) };
      const size = recalculateEffectsAfterCrop ? outputSize(sidecar.geometry, native) : native;
      const aspect = Math.max(size.width, size.height) / Math.max(1, Math.min(size.width, size.height));
      const crop = sidecar.geometry.crop;
      const cropScale = recalculateEffectsAfterCrop ? 1 / Math.max(crop.width, crop.height, 1e-3) : 1;
      params.filmFormatMM = filmFormatMM(params.filmSide, params.sideLengthMM, aspect, cropScale);
      params = resolveFilmEdgeParams(params, sidecar.geometry, active?.metadata ?? info?.metadata ?? null, catalog, native);
      result.push({ path: path2, frame: structuredClone({
        path: path2,
        session: active?.session,
        params,
        adjustments: sidecar.adjustments,
        ...snapshotGeometry(sidecar, params, frozenGate),
        decode: sidecar.decode,
        gate: frozenGate,
        native,
        dateTaken: active?.dateTaken ?? info?.metadata.datetime_original,
        recipe: portableRecipe(sidecar),
        scenePlacement: sidecar.placementNeedsFit ? latitudeRequest(params.placementIsRight ? params.sceneLatitudeOther : params.sceneLatitude) : void 0
      }) });
    } catch (e) {
      result.push({ path: path2, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return result;
}
var exportSerial = 0;
function recipeView(r, f, control) {
  const master = r.format === "raw-master" || r.format === "original";
  if (r.format === "raw-master" && !isRawPath(f.path)) throw new Error(tz("RAW development masters require a RAW source.", "RAW \u663E\u5F71\u6BCD\u7248\u4EC5\u9002\u7528\u4E8E RAW \u539F\u7247\u3002"));
  const di = r.format === "di", noFilm = master || !di && f.noFilm;
  if (di && f.noFilm) throw new Error("Enable film simulation before exporting a Digital Intermediate.");
  if (noFilm) {
    if (f.pair || isPairPath(f.path) || f.params.filmEdge.pair)
      throw new Error("Export without film simulation is unavailable for half-frame pairs. Enable film simulation.");
    if (!(control.frameOptions ? control.frameOptions.includes("no-film") : f.gate.noFilm))
      throw new Error("This engine cannot export without film simulation. Update the engine or enable film simulation.");
  }
  return {
    ...noFilm ? { no_film: true } : {},
    geometry: master ? GEOMETRY_DEFAULT : di ? f.filmGeometry : f.geometry,
    source_geometry: master ? GEOMETRY_DEFAULT : di ? f.filmSourceGeometry : f.sourceGeometry ?? GEOMETRY_DEFAULT,
    scene_placement: noFilm ? void 0 : f.scenePlacement,
    scene_placement_side: noFilm ? void 0 : f.scenePlacementSide
  };
}
async function exportFrame(recipe, frame, catalog, methods, control = {}) {
  const r = structuredClone(recipe);
  const f = structuredClone(frame);
  const started = performance.now();
  const cancelled = () => control.cancelled?.() ?? false;
  try {
    if (cancelled()) return { kind: "cancelled" };
    if (r.format === "original") {
      if (!methods?.includes("copy_original")) throw new Error(tz("Update the engine for original copy export.", "\u8BF7\u66F4\u65B0\u5F15\u64CE\u4EE5\u5BFC\u51FA\u539F\u7247\u526F\u672C\u3002"));
      if (f.pair || isPairPath(f.path)) throw new Error(tz("A pair is a recipe, not a single original file.", "\u62FC\u63A5\u914D\u65B9\u4E0D\u662F\u5355\u5F20\u539F\u7247\uFF0C\u4E0D\u80FD\u4F5C\u4E3A\u539F\u7247\u590D\u5236\u3002"));
      const { dir: dir3, base: base2 } = await targetFor(r, f, catalog);
      await platform().ensureDir(dir3);
      const ext = baseName(f.path).split(".").at(-1) ?? "raw";
      const target2 = await resolveTarget(
        dir3,
        base2,
        ext,
        r.existing === "overwrite" ? "addSuffix" : r.existing,
        async (path3) => await platform().pathExists(path3) || await platform().pathExists(`${path3}.spektra-recipe.json`),
        joinPath
      );
      if (cancelled()) return { kind: "cancelled" };
      if (!target2) return { kind: "skipped", path: joinPath(dir3, `${base2}.${ext}`) };
      const job2 = { session: "", progressId: `copy-${Date.now()}-${++exportSerial}` };
      control.active?.(job2);
      const result = await host().transport.request("copy_original", { source_path: f.path, path: target2.path, recipe: f.recipe ?? { schemaVersion: 3, decode: f.decode, params: f.params, adjustments: f.adjustments, geometry: f.geometry, noFilm: f.noFilm }, overwrite: false, progress_id: job2.progressId }, { timeoutMs: 18e5 });
      const copied = result.result;
      if (typeof copied.path !== "string" || typeof copied.width !== "number" || typeof copied.height !== "number") throw new Error("Invalid original copy response");
      return { kind: "written", path: copied.path, width: copied.width, height: copied.height, carriesEdits: false };
    }
    const view = recipeView(r, f, control);
    if (["png16", "webp-lossless"].includes(hostFormat(r)) && !control.exportFormats?.includes(hostFormat(r))) throw new Error(tz("Update the engine for this export format.", "\u8BF7\u66F4\u65B0\u5F15\u64CE\u4EE5\u4F7F\u7528\u6B64\u5BFC\u51FA\u683C\u5F0F\u3002"));
    if (f.pair && !methods?.includes("open_pair")) throw new Error(tz("This engine cannot export half-frame pairs. Update the engine.", "\u6B64\u5F15\u64CE\u65E0\u6CD5\u5BFC\u51FA\u534A\u683C\u62FC\u63A5\uFF0C\u8BF7\u66F4\u65B0\u5F15\u64CE\u3002"));
    if ((r.format === "tiff" || r.format === "di") && (r.tiffCompression === "lzw" && !control.tiffOptions?.includes("lzw") || r.format === "tiff" && r.embedsPreview && !control.tiffOptions?.includes("preview-page")))
      throw new Error(tz("This engine does not support the selected TIFF compression or preview page. Update the engine.", "\u6B64\u5F15\u64CE\u4E0D\u652F\u6301\u6240\u9009\u7684 TIFF \u538B\u7F29\u6216\u9884\u89C8\u9875\uFF0C\u8BF7\u66F4\u65B0\u5F15\u64CE\u3002"));
    if (r.format === "di") {
      if (!methods?.includes("export_cineon") || !f.gate.digitalIntermediate)
        throw new Error(tz("This engine cannot export Cineon Digital Intermediate files.", "\u6B64\u5F15\u64CE\u65E0\u6CD5\u5BFC\u51FA Cineon \u6570\u5B57\u4E2D\u95F4\u7247\u6587\u4EF6\u3002"));
    } else if (!hostWrites(methods)) {
      throw new Error(tz("This engine does not support complete frame export (export_frame). Update the engine before exporting.", "\u6B64\u5F15\u64CE\u4E0D\u652F\u6301\u5B8C\u6574\u753B\u9762\u5BFC\u51FA\uFF08export_frame\uFF09\uFF0C\u8BF7\u66F4\u65B0\u5F15\u64CE\u540E\u518D\u5BFC\u51FA\u3002"));
    }
    const { dir: dir2, base } = await targetFor(r, f, catalog);
    await platform().ensureDir(dir2);
    const target = await resolveTarget(dir2, base, extensionOf(r), r.existing, (p) => platform().pathExists(p), joinPath);
    if (cancelled()) return { kind: "cancelled" };
    if (!target) return { kind: "skipped", path: joinPath(dir2, `${base}.${extensionOf(r)}`) };
    const params = fullDelta(f.params, f.gate, catalog);
    const decode = decodeWire(f.decode, isRawPath(f.path));
    const job = { session: f.session ?? "", progressId: `export-${Date.now()}-${++exportSerial}` };
    control.active?.(job);
    const res = await host().transport.request(r.format === "di" ? "export_cineon" : "export_frame", {
      session: f.session,
      source_path: f.path,
      params,
      decode: decode ?? void 0,
      adjustments: r.format === "raw-master" ? ADJUSTMENTS_DEFAULT : f.adjustments,
      ...view,
      ...r.format === "raw-master" || r.format === "di" ? {} : filmStrengthWire({ ...f, filmStrength: f.filmStrength ?? 1 }),
      pair: f.pair,
      path: target.path,
      format: hostFormat(r),
      quality: r.format === "jpeg" ? r.quality : void 0,
      tiff_compression: r.format === "tiff" || r.format === "di" ? r.tiffCompression ?? "none" : void 0,
      embed_preview: r.format === "tiff" ? r.embedsPreview ?? false : void 0,
      color_space: r.colorSpace,
      long_edge: r.format === "di" || r.format === "raw-master" ? 0 : r.longEdge,
      overwrite: target.overwrite,
      progress_id: job.progressId
    }, { timeoutMs: 18e5 });
    if (res.payload.byteLength) throw new Error(tz("export_frame unexpectedly returned image data.", "export_frame \u610F\u5916\u8FD4\u56DE\u4E86\u56FE\u50CF\u6570\u636E\u3002"));
    const { path: path2, width, height, timings_ms } = res.result;
    if (typeof path2 !== "string" || typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0)
      throw new Error(tz("The engine returned invalid export dimensions.", "\u5F15\u64CE\u8FD4\u56DE\u7684\u5BFC\u51FA\u5C3A\u5BF8\u65E0\u6548\u3002"));
    platform().log("info", `export (${hostFormat(r)}, ${width}x${height}) host ms: ${JSON.stringify(timings_ms ?? {})} \xB7 TOTAL ${Math.round(performance.now() - started)}`);
    return { kind: "written", path: path2, width, height, carriesEdits: r.format !== "di" && r.format !== "raw-master" };
  } catch (e) {
    if (cancelled() && e.code === "cancelled") return { kind: "cancelled" };
    return { kind: "failed", message: e instanceof Error ? e.message : String(e) };
  } finally {
    control.active?.(null);
  }
}

// src/shared/renderPreferences.ts
var RENDER_PREFERENCES_DEFAULT = {
  recalculateEffectsAfterCrop: false,
  diBlueCompensation: false
};
function renderPreferences(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid saved rendering preferences");
  const v = value;
  if (typeof v.recalculateEffectsAfterCrop !== "boolean" || typeof v.diBlueCompensation !== "boolean")
    throw new Error("Invalid saved rendering preferences");
  return { recalculateEffectsAfterCrop: v.recalculateEffectsAfterCrop, diBlueCompensation: v.diBlueCompensation };
}

// agent/workspace.ts
var Workspace = class {
  files = new FileService();
  engine = null;
  catalog = null;
  hello;
  gate;
  path = "";
  sid = "";
  sidecar;
  pair = null;
  info;
  opened;
  frame;
  decodeKey = "";
  sourceStamp = "";
  rendering = { ...RENDER_PREFERENCES_DEFAULT };
  constructor() {
    setFiles(this.files);
  }
  async status() {
    return this.files.call("status");
  }
  async start() {
    if (!this.catalog) {
      const file = process.env.SPEKTRALAB_AGENT_CATALOG ?? join2(here, "StockCatalog.json");
      this.catalog = new StockCatalog(JSON.parse(await readFile2(file, "utf8")).stocks);
    }
    if (!this.engine) {
      this.engine = new NativeHost();
      setHost(this.engine);
      this.hello = await this.engine.result("hello");
      this.gate = featureGate(this.hello.capabilities?.backend?.unsupported_features, this.rendering.diBlueCompensation, this.hello.view_options?.includes("no_film"));
    }
  }
  async load(path2) {
    await this.start();
    path2 = absolute(path2);
    this.sidecar = decodeSidecar(await this.files.call("sidecar_load", { path: path2 }));
    this.pair = isPairPath(path2) ? decodePair(JSON.parse(await readFile2(path2, "utf8"))) : null;
    if (isPairPath(path2) && !this.pair) throw new Refused("Invalid half-frame pair document");
    this.info = await this.engine.result("probe", { path: path2 });
    const md = await stat(path2), stamp = JSON.stringify([md.size, md.mtimeMs]);
    if ((this.path !== path2 || this.sourceStamp !== stamp) && this.sid) {
      await this.engine.result("close", { session: this.sid });
      this.sid = "";
    }
    this.sourceStamp = stamp;
    this.path = path2;
  }
  async prepare() {
    const [item] = await captureExportFrames([this.path], {
      path: this.path,
      sidecar: this.sidecar,
      session: this.sid || void 0,
      native: { width: this.info.width, height: this.info.height },
      metadata: this.info.metadata,
      pair: this.pair,
      pairInfo: this.info.pair_info
    }, this.catalog, this.gate, this.rendering.recalculateEffectsAfterCrop);
    if (!item || "error" in item) throw new Refused(item && "error" in item ? item.error : "Cannot prepare frame");
    this.frame = item.frame;
    this.sidecar.params = structuredClone(this.frame.params);
  }
  async develop(filmOnly = false) {
    const noFilm = this.sidecar.noFilm && !filmOnly;
    if (noFilm && (this.pair || isPairPath(this.path) || this.sidecar.params.filmEdge.pair)) throw new Refused("Developing without film simulation is unavailable for half-frame pairs. Enable film simulation.");
    if (noFilm && !this.gate.noFilm) throw new Refused("This engine cannot develop without film simulation. Update the engine or select a film stock.");
    await this.prepare();
    const params = fullDelta(this.frame.params, this.gate, this.catalog);
    const decode = decodeWire(this.sidecar.decode, isRawPath(this.path));
    const key = JSON.stringify(decode);
    if (!this.sid) {
      this.opened = await this.engine.result(this.pair ? "open_pair" : "open", { path: this.path, params, pair: this.frame.pair, decode: decode ?? void 0 });
      this.sid = this.opened.session;
    } else if (this.pair) this.opened = await this.engine.result("update_pair", { session: this.sid, params, pair: this.frame.pair });
    else if (key !== this.decodeKey) this.opened = await this.engine.result("redecode", { session: this.sid, decode: decode ?? void 0 });
    this.decodeKey = key;
    this.frame.session = this.sid;
    await this.engine.result("render_view", {
      session: this.sid,
      params,
      adjustments: this.frame.adjustments,
      ...noFilm ? { no_film: true } : {},
      geometry: filmOnly ? this.frame.filmGeometry : this.frame.geometry,
      source_geometry: filmOnly ? this.frame.filmSourceGeometry : this.frame.sourceGeometry,
      tier: "preview",
      display: "srgb",
      long_edge: 64,
      generation: 1
    });
  }
  async save() {
    await this.files.call("sidecar_save", { path: this.path, value: encodeSidecar(this.sidecar) });
  }
  async edit(patch) {
    const leaves = validate(patch, this.catalog);
    const has = (prefix) => leaves.some((k) => k === prefix || k.startsWith(prefix + "."));
    const want = merge(document2(this.sidecar), patch), p = want.params;
    if (this.catalog.isPositive(p.filmStock) && (has("params.printStock") || has("params.scanFilm") && !p.scanFilm)) throw new Refused("Slide films are scanned and take no paper.");
    if (has("params.printStock") && !this.catalog.canPrint(p.filmStock, p.printStock)) throw new Refused("Film and paper emulsion types must match.");
    for (const [active, supported, label] of [[p.filmEdge.active, this.gate.overscan, "Film Edge"], [p.dateBack.active, this.gate.dateImprint, "Date Back"], [p.digitalIntermediate, this.gate.digitalIntermediate, "Digital Intermediate"]])
      if (active && !supported) throw new Refused(`${label} is unavailable in this engine.`);
    if (has("decode") && !isRawPath(this.path)) throw new Refused("Decode edits need a RAW photograph; pair-hole decode edits use the app.");
    if (has("geometry.crop") && (want.geometry.crop.width <= 0.01 || want.geometry.crop.height <= 0.01)) throw new Refused("Crop must exceed1% on both sides.");
    if (has("params.filmStock")) {
      p.scanFilm = this.catalog.isPositive(p.filmStock);
      if (!has("params.printStock")) p.printStock = this.catalog.stock(p.filmStock)?.targetPrint ?? p.printStock;
    }
    if (has("params.filmFrame") || has("params.filmSide")) {
      const f = filmFrameNamed(p.filmFrame);
      if (f.id !== "Custom") p.sideLengthMM = p.filmSide === "short" ? f.short : f.long;
    }
    if (has("params.sideLengthMM")) p.filmFrame = "Custom";
    if ((has("decode.temperature") || has("decode.tint")) && !has("decode.whiteBalance")) want.decode.whiteBalance = "Custom";
    else if (has("decode.whiteBalance") && !has("decode.temperature")) {
      const k = WB_KELVIN[want.decode.whiteBalance];
      if (k) want.decode.temperature = k;
    }
    want.params = normalizeStockPair(p, this.catalog);
    if (has("geometry")) {
      if (has("geometry.crop")) want.geometry.intendedSize = { width: want.geometry.crop.width, height: want.geometry.crop.height };
      want.geometry = fitted(want.geometry, this.info);
    }
    if (edgeEffective(want.params.filmEdge, this.gate)) want.geometry = gateFramed(want.geometry, want.params.filmEdge, this.info);
    this.sidecar = { ...this.sidecar, ...want, noFilm: has("params.filmStock") ? false : this.sidecar.noFilm, state: "stale" };
    await this.develop();
    await this.save();
    return { written: leaves, edit: document2(this.sidecar) };
  }
  async preview(output, longEdge = 1024) {
    await this.develop();
    const temporary = output ? void 0 : await mkdtemp(join2(tmpdir(), "spektralab-agent-"));
    const path2 = output ? absolute(output) : join2(temporary, "preview.jpg");
    if (resolve2(path2).toLowerCase() === resolve2(this.path).toLowerCase()) throw new Refused("The source photograph cannot be overwritten.");
    await this.engine.result("export_frame", {
      session: this.sid,
      source_path: this.path,
      pair: this.frame.pair,
      params: fullDelta(this.frame.params, this.gate, this.catalog),
      adjustments: this.frame.adjustments,
      ...this.frame.noFilm ? { no_film: true } : {},
      geometry: this.frame.geometry,
      source_geometry: this.frame.sourceGeometry,
      path: path2,
      format: "jpeg",
      quality: 92,
      color_space: "srgb",
      long_edge: longEdge,
      overwrite: false
    });
    return { body: { preview: path2 }, preview: path2, temporary };
  }
  async call(name, args) {
    await this.files.call("begin");
    try {
      this.rendering = renderPreferences(await this.files.call("rendering"));
      await this.start();
      this.gate = featureGate(this.hello.capabilities?.backend?.unsupported_features, this.rendering.diBlueCompensation, this.hello.view_options?.includes("no_film"));
      if (name === "get_schema") return { body: { version: 1, sections: ["params", "adjustments", "geometry", "decode"], fields: fields(this.catalog) } };
      if (name === "list_stocks") return { body: { films: this.catalog.films, papers: this.catalog.papers } };
      if (name === "list_recipes") return { body: { recipes: decodeRecipes(await this.files.call("recipes")) } };
      if (name === "edit_image") validate(args.patch, this.catalog);
      await this.load(args.path);
      let body;
      if (name === "describe_image") return { body: { path: this.path, ...this.info, state: this.sidecar.state, film: this.sidecar.params.filmStock, paper: this.sidecar.params.scanFilm ? null : this.sidecar.params.printStock } };
      if (name === "get_edit") return { body: document2(this.sidecar) };
      if (name === "edit_image") body = await this.edit(args.patch);
      else if (name === "reset_edit") {
        const defaults = structuredClone(newSidecar());
        this.sidecar = { ...this.sidecar, params: defaults.params, adjustments: defaults.adjustments, geometry: defaults.geometry, placementNeedsFit: false, state: "unprocessed" };
        await this.develop();
        await this.save();
        body = { edit: document2(this.sidecar) };
      } else if (name === "process_image") {
        await this.develop();
        const solved = await this.engine.result("solve", { session: this.sid, target: "both" });
        this.sidecar.params.yFilterShift = 0;
        this.sidecar.params.mFilterShift = 0;
        this.sidecar.state = "processed";
        if (typeof solved.solved_params?.exposure_compensation_ev === "number") this.sidecar.solvedEV = solved.solved_params.exposure_compensation_ev;
        await this.develop();
        await this.save();
        body = { info: this.info, state: this.sidecar.state };
      } else if (name === "measure_latitude" || name === "place_scene") {
        await this.develop();
        const settings = structuredClone(this.sidecar.params.sceneLatitude);
        if (name === "place_scene") {
          settings.highlightPullBack = args.highlight;
          settings.shadowPullBack = args.shadow;
        }
        const request = { ...latitudeRequest(settings), ...this.pair ? { region: pairFitRegion(this.pair, this.sidecar.params.placementIsRight) } : {} };
        const result = await this.engine.result("scene_latitude", { session: this.sid, request });
        if (name === "measure_latitude") return { body: result };
        const placed = applyLatitudeFit(settings, result.fit);
        if (!placed) throw new Refused("Scene Placement fit refused: " + JSON.stringify(result.fit.issues));
        this.sidecar.params.sceneLatitude = placed;
        this.sidecar.placementNeedsFit = false;
        await this.develop();
        await this.save();
        body = result;
      } else if (name === "preview_image") return await this.preview(args.output, args.long_edge ?? 1024);
      else if (name === "export_image") {
        const recipes = decodeRecipes(await this.files.call("recipes"));
        const selected = args.recipe ? recipes.find((r) => r.name === args.recipe) : recipes[0];
        if (!selected) throw new Refused("No export recipe with that name");
        await this.develop(selected.format === "di");
        const recipe = structuredClone(selected);
        if (args.folder) {
          recipe.folder = { kind: "fixed", path: absolute(args.folder) };
          recipe.subfolder = "";
        }
        const written = await exportFrame(recipe, this.frame, this.catalog, this.hello.methods, { tiffOptions: this.hello.tiff_options });
        if (written.kind === "failed") throw new Error(written.message);
        return { body: { files: written.kind === "written" ? [written.path] : [], outcome: written } };
      } else throw new Refused("Unknown tool: " + name);
      if (args.preview !== false) {
        const p = await this.preview();
        return { ...p, body };
      }
      return { body };
    } finally {
      await this.files.call("end");
    }
  }
  async stop() {
    if (this.engine) {
      try {
        await this.engine.result("shutdown");
      } catch {
      }
      this.engine.stop();
    }
    this.files.stop();
  }
};
async function removeTemporary(result) {
  if (result.temporary) await rm(result.temporary, { recursive: true, force: true });
}

// agent/tools.ts
var path = { type: "string", description: "Absolute path of an existing photograph or half-frame pair." };
var preview = { type: "boolean", description: "Return a small preview (default true)." };
var tools = [
  ["get_schema", "schema", "Every editable field, range and read-only rule.", {}, []],
  ["list_stocks", "stocks", "Film and paper stock IDs.", {}, []],
  ["list_recipes", "recipes", "Saved export recipes.", {}, []],
  ["describe_image", "info", "Image dimensions, metadata and processing state.", { path }, ["path"]],
  ["get_edit", "get", "The four edit sections used by the application.", { path }, ["path"]],
  ["edit_image", "edit", "Strict JSON merge patch. Invalid fields are refused without writing. Originals are preserved.", { path, patch: { type: "object" }, preview }, ["path", "patch"]],
  ["reset_edit", "reset", "Reset film, print, grade and geometry; preserve decode.", { path, preview }, ["path"]],
  ["process_image", "process", "Develop, meter and solve the print filter pack; clear Y/M offsets.", { path, preview }, ["path"]],
  ["measure_latitude", "latitude", "Measure the scene and medium latitude and suggested pull-backs.", { path }, ["path"]],
  ["place_scene", "place", "Apply Scene Placement only if the engine Fit accepts it.", { path, highlight: { type: "number", minimum: 0, maximum: 6 }, shadow: { type: "number", minimum: 0, maximum: 6 }, preview }, ["path", "highlight", "shadow"]],
  ["preview_image", "preview", "Render a small finished sRGB JPEG.", { path, output: { type: "string" }, long_edge: { type: "integer", minimum: 64, maximum: 4096 } }, ["path"]],
  ["export_image", "export", "Write with a named saved recipe. Export only when requested.", { path, recipe: { type: "string" }, folder: { type: "string" } }, ["path"]]
].map(([name, command, description, properties, required]) => ({
  name,
  command,
  description,
  inputSchema: { type: "object", properties, required, additionalProperties: false }
}));
function checkTool(name, args) {
  const tool = tools.find((t2) => t2.name === name);
  if (!tool) throw new Refused("Unknown tool: " + name);
  if (!args || typeof args !== "object" || Array.isArray(args)) throw new Refused("Arguments must be an object.");
  const a = args;
  for (const key of tool.inputSchema.required) if (!(key in a)) throw new Refused(`${name} needs ${key}.`);
  for (const [key, value] of Object.entries(a)) {
    const p = tool.inputSchema.properties[key];
    if (!p) throw new Refused(`Unknown argument: ${key}`);
    if (p.type === "object" ? !value || typeof value !== "object" || Array.isArray(value) : p.type === "integer" ? !Number.isInteger(value) : typeof value !== p.type) throw new Refused(`Invalid ${key}: expected ${p.type}.`);
    if (typeof value === "number" && (!Number.isFinite(value) || p.minimum !== void 0 && value < p.minimum || p.maximum !== void 0 && value > p.maximum)) throw new Refused(`Invalid range for ${key}.`);
    if (typeof value === "string" && (!value || value.includes("\0"))) throw new Refused(`Invalid ${key}.`);
  }
  return a;
}
var instructions = "SpektraLab develops film and prints onto paper. Read describe_image and get_schema, process_image once, then use small physical edits and inspect previews. Scene Placement must pass place_scene. Nothing overwrites an original. Export only when requested. Agent access is controlled by Settings > Agents; turning it off refuses the next call.";
var editPrompt = { name: "edit_photo", title: "Edit a photo from one sentence", description: "Edit a photograph with film, paper and physical controls.", arguments: [{ name: "path", description: "Image path", required: true }, { name: "instruction", description: "Desired look", required: true }] };
async function mcp(input, call, image) {
  const message = input;
  if (!message || typeof message !== "object" || Array.isArray(message)) return { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid Request" } };
  if (!("id" in message)) return null;
  const result = (r) => ({ jsonrpc: "2.0", id: message.id, result: r });
  const error = (code, text) => ({ jsonrpc: "2.0", id: message.id, error: { code, message: text } });
  if (message.jsonrpc !== "2.0" || typeof message.method !== "string") return error(-32600, "Invalid Request");
  const p = message.params ?? {};
  switch (message.method) {
    case "initialize":
      return result({ protocolVersion: "2025-06-18", capabilities: { tools: {}, prompts: {} }, serverInfo: { name: "spektralab", title: "SpektraLab", version: "1.3.4-win.8" }, instructions });
    case "ping":
      return result({});
    case "tools/list":
      return result({ tools: tools.map(({ command: _command, ...t2 }) => t2) });
    case "tools/call":
      if (typeof p.name !== "string") return error(-32602, "tools/call needs a name");
      try {
        const a = checkTool(p.name, p.arguments ?? {});
        const r = await call(p.name, a);
        return result({ content: await image(r), isError: false });
      } catch (e) {
        return result({ content: [{ type: "text", text: (e instanceof Refused ? "Refused: " : "Failed: ") + e.message }], isError: true });
      }
    case "prompts/list":
      return result({ prompts: [editPrompt] });
    case "prompts/get": {
      if (p.name !== "edit_photo") return error(-32602, "No such prompt");
      const a = p.arguments ?? {};
      return result({ description: editPrompt.description, messages: [{ role: "user", content: { type: "text", text: `Edit ${a.path ?? "<path>"} to match: ${a.instruction ?? ""}. Read describe_image, get_schema and process_image. Prefer film, paper, exposure and Scene Placement; inspect each preview before refining.` } }] });
    }
    default:
      return error(-32601, "Method not found");
  }
}

// agent/cli.ts
import { readFile as readFile3 } from "node:fs/promises";
async function parse(argv, stdin = async () => {
  let s = "";
  for await (const b of process.stdin) {
    s += b;
    if (s.length > 1024 * 1024) throw new Refused("Patch exceeds1MiB");
  }
  return s;
}) {
  const [command, ...rest] = argv, tool = tools.find((t2) => t2.command === command);
  if (!tool) throw new Refused("Unknown command. Use help.");
  const args = {};
  let previewOut;
  if ("path" in tool.inputSchema.properties) {
    const file = rest.shift();
    if (!file || file.startsWith("-")) throw new Refused("A photograph path is required");
    args.path = absolute(file);
  }
  while (rest.length) {
    const flag = rest.shift(), v = rest.shift();
    if (v === void 0) throw new Refused(flag + " requires a value");
    if (flag === "--patch" && tool.name === "edit_image") {
      const text = v === "-" ? await stdin() : v.startsWith("@") ? await readFile3(absolute(v.slice(1)), "utf8") : v;
      if (text.length > 1024 * 1024) throw new Refused("Patch exceeds1MiB");
      try {
        args.patch = JSON.parse(text);
      } catch {
        throw new Refused("Patch is not valid JSON");
      }
    } else if (flag === "--preview" && "preview" in tool.inputSchema.properties) {
      previewOut = absolute(v);
      args.preview = true;
    } else if ((flag === "-o" || flag === "--output") && tool.name === "preview_image") args.output = absolute(v);
    else if (flag === "--long-edge" && tool.name === "preview_image") args.long_edge = Number(v);
    else if ((flag === "--highlight" || flag === "--shadow") && tool.name === "place_scene") args[flag.slice(2)] = Number(v);
    else if (flag === "--recipe" && tool.name === "export_image") args.recipe = v;
    else if (flag === "--to" && tool.name === "export_image") args.folder = absolute(v);
    else throw new Refused("Unknown option: " + flag);
  }
  if ("preview" in tool.inputSchema.properties && args.preview === void 0) args.preview = false;
  if (tool.name === "preview_image" && !args.output) throw new Refused("preview needs -o OUT.jpg");
  return { name: tool.name, args: checkTool(tool.name, args), previewOut };
}

// agent/main.ts
var usage = `Spektra Studio CLI: status | schema | stocks | recipes | info|get|reset|process|latitude FILE
edit FILE --patch JSON|@FILE|- [--preview OUT.jpg]
place FILE --highlight STOPS --shadow STOPS [--preview OUT.jpg]
preview FILE -o OUT.jpg [--long-edge N]
export FILE [--recipe NAME] [--to DIRECTORY]
mcp  (newline JSON-RPC over stdio)
Enable Settings > Agents first. Source photographs are never overwritten.
`;
async function main() {
  const argv = process.argv.slice(2), command = argv[0];
  if (!command || ["help", "--help", "-h"].includes(command)) {
    process.stdout.write(usage);
    return;
  }
  let ws;
  try {
    if (command === "mcp") {
      ws = new Workspace();
      const lines = createInterface2({ input: process.stdin, crlfDelay: Infinity });
      for await (const line of lines) {
        if (!line.trim()) continue;
        let response;
        if (line.length > 2 * 1024 * 1024) {
          response = { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Request exceeds2MiB" } };
        } else try {
          const message = JSON.parse(line);
          response = await mcp(message, (name, args) => ws.call(name, args), async (r2) => {
            try {
              const content = [{ type: "text", text: JSON.stringify(r2.body) }];
              if (r2.preview) {
                const b = await readFile4(r2.preview);
                if (b.length > 32 * 1024 * 1024) throw new Error("Preview exceeds32MiB");
                content.push({ type: "image", mimeType: "image/jpeg", data: b.toString("base64") });
              }
              return content;
            } finally {
              await removeTemporary(r2);
            }
          });
        } catch {
          response = { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } };
        }
        if (response) process.stdout.write(JSON.stringify(response) + "\n");
      }
      return;
    }
    const parsed = command === "status" ? null : await parse(argv);
    ws = new Workspace();
    if (!parsed) {
      process.stdout.write(JSON.stringify({ ok: true, ...await ws.status() }) + "\n");
      return;
    }
    const r = await ws.call(parsed.name, parsed.args);
    try {
      const body = r.body && typeof r.body === "object" ? r.body : { result: r.body };
      if (parsed.previewOut && r.preview) {
        await copyFile(r.preview, parsed.previewOut, constants.COPYFILE_EXCL);
        body.preview = parsed.previewOut;
      }
      process.stdout.write(JSON.stringify({ ok: true, ...body }) + "\n");
    } finally {
      await removeTemporary(r);
    }
  } catch (e) {
    process.stdout.write(JSON.stringify({ ok: false, refused: e instanceof Refused, error: e.message }) + "\n");
    process.exitCode = e instanceof Refused ? 2 : 1;
  } finally {
    if (ws) await ws.stop();
  }
}
void main();
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-sync-external-store/cjs/use-sync-external-store-shim.production.js:
  (**
   * @license React
   * use-sync-external-store-shim.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-sync-external-store/cjs/use-sync-external-store-shim.development.js:
  (**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/

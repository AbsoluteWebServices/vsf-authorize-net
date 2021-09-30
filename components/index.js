'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compositionApi = require('@vue/composition-api');
var core = require('@vue-storefront/core');

//

const ENV_PROD = 'production';
const sessionKey = 'authnet-acceptui-response';
const nonceValidTimeout = 14.5 * 60000; // 14.5 minutes
let acceptUiScriptLoaded = false;

var script = compositionApi.defineComponent({
  name: 'AcceptUiForm',
  props: {
    settings: {
      type: Object,
      default: null,
    },
    saveInStorage: {
      type: Boolean,
      default: true,
    },
  },
  head() {
    const skip = acceptUiScriptLoaded;
    acceptUiScriptLoaded = true;

    return {
      script: [
        {
          vmid: 'authorize-net',
          once: true,
          skip,
          src: `https://js${
            this.isTest ? 'test' : ''
          }.authorize.net/v3/AcceptUI.js`,
        },
      ],
    };
  },
  setup(props, { emit }) {
    const { $authnet } = core.useVSFContext();

    const { loginId, clientKey, environment } = $authnet.config;
    const isTest = compositionApi.computed(() => environment !== ENV_PROD);

    const acceptUiParams = compositionApi.computed(() => {
      const settings = {
        apiloginid: loginId,
        clientkey: clientKey,
        acceptUIFormBtnTxt: 'Confirm Card Information',
        acceptUIFormHeaderTxt: '',
        responseHandler: 'CommunicationHandler',
        paymentOptions: JSON.stringify({
          showCreditCard: true,
          showBankAccount: false,
        }),
        billingAddressOptions: JSON.stringify({ show: false, required: false }),
        ...props.settings,
      };

      const data = {};

      for (const key in settings) {
        if (Object.hasOwnProperty.call(settings, key)) {
          data[`data-${key}`] = settings[key];
        }
      }

      return data;
    });
    const errors = compositionApi.ref([]);
    const confirmed = compositionApi.ref(false);
    const savedResponse = compositionApi.ref(null);
    const timer = compositionApi.ref(null);
    const cardNumber = compositionApi.computed(
      () => savedResponse.value?.encryptedCardData?.cardNumber
    );
    const iframeUrl = compositionApi.computed(() => {
      const hash = encodeURIComponent(
        JSON.stringify({
          verifyOrigin: 'AcceptUI',
          type: 'SYNC',
          pktData: window.location.origin,
        })
      );
      const base = `https://js${
        isTest.value ? 'test' : ''
      }.authorize.net/v3/acceptMain/acceptMain.html`;

      return `${base}#${hash}`;
    });

    const clearSavedResponse = (expired = true) => {
      savedResponse.value = null;
      confirmed.value = false;
      sessionStorage.removeItem(sessionKey);

      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
      }

      emit('clear');

      if (expired) {
        emit('expired');
      }
    };

    const setupTimer = (timeout = 0) => {
      if (timer.value) {
        clearTimeout(timer.value);
      }

      timer.value = setTimeout(
        clearSavedResponse,
        timeout > 0 ? timeout : nonceValidTimeout
      );
    };

    const loadResponseFromSession = () => {
      try {
        const item = sessionStorage.getItem(sessionKey);

        if (!item) {
          return;
        }

        const { response, time, cartId } = JSON.parse(item);

        if (
          !response ||
          !time ||
          !cartId ||
          Date.now() - time > nonceValidTimeout ||
          cartId !== $authnet.config.state.getCartId()
        ) {
          return clearSavedResponse(false);
        }

        savedResponse.value = response;
        confirmed.value = true;

        emit('success', response);

        setupTimer(time + nonceValidTimeout - Date.now());
      } catch (err) {
        console.error(err);
        clearSavedResponse(false);
      }
    };

    const saveResponseToSession = () => {
      try {
        if (!savedResponse.value) {
          return;
        }

        sessionStorage.setItem(
          sessionKey,
          JSON.stringify({
            response: savedResponse.value,
            time: Date.now(),
            cartId: $authnet.config.state.getCartId(),
          })
        );

        setupTimer();
      } catch (err) {
        console.error(err);
      }
    };

    const editPayment = () => {
      confirmed.value = false;
      emit('clear');
    };

    const cancelEditing = () => {
      confirmed.value = true;
      emit('success', savedResponse.value);
    };

    compositionApi.onMounted(async () => {
      if (props.saveInStorage) {
        loadResponseFromSession();
      }

      const scrollPosition = { x: window.scrollX, y: window.scrollY };

      const resetScroll = (e) => {
        window.scroll(scrollPosition.x, scrollPosition.y);
        e.preventDefault();
        e.stopPropagation();
        window.removeEventListener('scroll', resetScroll);
      };

      window.addEventListener('scroll', resetScroll);

      window.CommunicationHandler = (response) => {
        errors.value = [];
        confirmed.value = false;

        if (response.messages.resultCode === 'Error') {
          for (const error of response.messages.message) {
            errors.value.push(error);
          }

          emit('error', response);

          return false;
        }

        if (props.saveInStorage) {
          confirmed.value = true;
          savedResponse.value = response;
          saveResponseToSession();
        }

        emit('success', response);
        return true;
      };
    });

    compositionApi.onUnmounted(() => {
      if (timer.value) {
        clearTimeout(timer.value);
      }

      const AcceptUIBackground = document.getElementById('AcceptUIBackground');
      if (AcceptUIBackground) {
        AcceptUIBackground.remove();
      }
    });

    return {
      isTest,
      acceptUiParams,
      errors,
      confirmed,
      savedResponse,
      cardNumber,
      iframeUrl,
      editPayment,
      cancelEditing,
    };
  },
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "authnet-acceptui-form" },
    [
      _vm.savedResponse
        ? _c("div", { staticClass: "acceptui-saved-response" }, [
            _vm.confirmed
              ? _c(
                  "div",
                  [
                    _c("p", [
                      _c("span", [_vm._v(_vm._s(_vm.$t("Paying with")))]),
                      _vm._v(" "),
                      _c("span", { staticClass: "card-number" }, [
                        _vm._v(_vm._s(_vm.cardNumber))
                      ])
                    ]),
                    _vm._v(" "),
                    _vm._t(
                      "button-edit",
                      function() {
                        return [
                          _c(
                            "button",
                            {
                              staticClass: "acceptui-button button-edit",
                              on: { click: _vm.editPayment }
                            },
                            [
                              _vm._v(
                                "\n          " +
                                  _vm._s(_vm.$t("Edit")) +
                                  "\n        "
                              )
                            ]
                          )
                        ]
                      },
                      { edit: _vm.editPayment }
                    )
                  ],
                  2
                )
              : _c(
                  "div",
                  [
                    _vm._t(
                      "button-cancel",
                      function() {
                        return [
                          _c(
                            "button",
                            {
                              staticClass: "acceptui-button button-cancel",
                              on: { click: _vm.cancelEditing }
                            },
                            [
                              _vm._v(
                                "\n          " +
                                  _vm._s(_vm.$t("Cancel")) +
                                  "\n        "
                              )
                            ]
                          )
                        ]
                      },
                      { cancel: _vm.cancelEditing }
                    )
                  ],
                  2
                )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.confirmed || !_vm.savedResponse,
              expression: "!confirmed || !savedResponse"
            }
          ],
          staticClass: "acceptui-container"
        },
        [
          _c("div", { staticClass: "close-icon-hider" }),
          _vm._v(" "),
          _c("div", { attrs: { id: "AcceptUIContainer" } }, [
            _c("iframe", { attrs: { src: _vm.iframeUrl, frameborder: "0" } })
          ])
        ]
      ),
      _vm._v(" "),
      _vm._t(
        "errors",
        function() {
          return [
            _vm.errors.length
              ? _c(
                  "div",
                  { staticClass: "acceptui-errors" },
                  _vm._l(_vm.errors, function(error) {
                    return _c("p", { key: error.code }, [
                      _vm._v(_vm._s(error.text))
                    ])
                  }),
                  0
                )
              : _vm._e()
          ]
        },
        { errors: _vm.errors }
      ),
      _vm._v(" "),
      _c(
        "button",
        _vm._b(
          { staticClass: "AcceptUI", attrs: { type: "button" } },
          "button",
          _vm.acceptUiParams,
          false
        )
      )
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-53174a4b_0", { source: "\n#AcceptUIContainer {\n  opacity: 1 !important;\n  visibility: visible !important;\n  position: relative !important;\n  top: 0 !important;\n  margin: 0 !important;\n  left: 0 !important;\n  box-shadow: none !important;\n  width: 100% !important;\n  z-index: 10 !important;\n}\n#AcceptUIContainer iframe {\n  width: 100% !important;\n}\n#AcceptUIBackground {\n  display: none !important;\n}\n.acceptui-container {\n  position: relative;\n}\n.acceptui-container .close-icon-hider {\n  position: absolute;\n  z-index: 20;\n  top: 0;\n  right: 0;\n  width: 40px;\n  height: 40px;\n  background-color: #fff;\n}\n.AcceptUI {\n  display: none;\n}\n", map: {"version":3,"sources":["/Users/dmytro/work/aws/focus-next-theme/packages/vsf-authorize-net/src/components/AcceptUiForm.vue"],"names":[],"mappings":";AAsSA;EACA,qBAAA;EACA,8BAAA;EACA,6BAAA;EACA,iBAAA;EACA,oBAAA;EACA,kBAAA;EACA,2BAAA;EACA,sBAAA;EACA,sBAAA;AACA;AACA;EACA,sBAAA;AACA;AACA;EACA,wBAAA;AACA;AACA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,WAAA;EACA,MAAA;EACA,QAAA;EACA,WAAA;EACA,YAAA;EACA,sBAAA;AACA;AACA;EACA,aAAA;AACA","file":"AcceptUiForm.vue","sourcesContent":["<template>\n  <div class=\"authnet-acceptui-form\">\n    <div v-if=\"savedResponse\" class=\"acceptui-saved-response\">\n      <div v-if=\"confirmed\">\n        <p>\n          <span>{{ $t('Paying with') }}</span>\n          <span class=\"card-number\">{{ cardNumber }}</span>\n        </p>\n        <slot name=\"button-edit\" :edit=\"editPayment\">\n          <button @click=\"editPayment\" class=\"acceptui-button button-edit\">\n            {{ $t('Edit') }}\n          </button>\n        </slot>\n      </div>\n      <div v-else>\n        <slot name=\"button-cancel\" :cancel=\"cancelEditing\">\n          <button @click=\"cancelEditing\" class=\"acceptui-button button-cancel\">\n            {{ $t('Cancel') }}\n          </button>\n        </slot>\n      </div>\n    </div>\n    <div v-show=\"!confirmed || !savedResponse\" class=\"acceptui-container\">\n      <div class=\"close-icon-hider\"></div>\n      <div id=\"AcceptUIContainer\">\n        <iframe :src=\"iframeUrl\" frameborder=\"0\"></iframe>\n      </div>\n    </div>\n    <slot name=\"errors\" :errors=\"errors\">\n      <div v-if=\"errors.length\" class=\"acceptui-errors\">\n        <p v-for=\"error in errors\" :key=\"error.code\">{{ error.text }}</p>\n      </div>\n    </slot>\n    <button v-bind=\"acceptUiParams\" type=\"button\" class=\"AcceptUI\"></button>\n  </div>\n</template>\n\n<script>\nimport {\n  ref,\n  computed,\n  defineComponent,\n  onMounted,\n  onUnmounted,\n  nextTick,\n} from '@vue/composition-api';\nimport { useVSFContext } from '@vue-storefront/core';\n\nconst ENV_PROD = 'production';\nconst sessionKey = 'authnet-acceptui-response';\nconst nonceValidTimeout = 14.5 * 60000; // 14.5 minutes\nlet acceptUiScriptLoaded = false;\n\nexport default defineComponent({\n  name: 'AcceptUiForm',\n  props: {\n    settings: {\n      type: Object,\n      default: null,\n    },\n    saveInStorage: {\n      type: Boolean,\n      default: true,\n    },\n  },\n  head() {\n    const skip = acceptUiScriptLoaded;\n    acceptUiScriptLoaded = true;\n\n    return {\n      script: [\n        {\n          vmid: 'authorize-net',\n          once: true,\n          skip,\n          src: `https://js${\n            this.isTest ? 'test' : ''\n          }.authorize.net/v3/AcceptUI.js`,\n        },\n      ],\n    };\n  },\n  setup(props, { emit }) {\n    const { $authnet } = useVSFContext();\n\n    const { loginId, clientKey, environment } = $authnet.config;\n    const isTest = computed(() => environment !== ENV_PROD);\n\n    const acceptUiParams = computed(() => {\n      const settings = {\n        apiloginid: loginId,\n        clientkey: clientKey,\n        acceptUIFormBtnTxt: 'Confirm Card Information',\n        acceptUIFormHeaderTxt: '',\n        responseHandler: 'CommunicationHandler',\n        paymentOptions: JSON.stringify({\n          showCreditCard: true,\n          showBankAccount: false,\n        }),\n        billingAddressOptions: JSON.stringify({ show: false, required: false }),\n        ...props.settings,\n      };\n\n      const data = {};\n\n      for (const key in settings) {\n        if (Object.hasOwnProperty.call(settings, key)) {\n          data[`data-${key}`] = settings[key];\n        }\n      }\n\n      return data;\n    });\n    const errors = ref([]);\n    const confirmed = ref(false);\n    const savedResponse = ref(null);\n    const timer = ref(null);\n    const cardNumber = computed(\n      () => savedResponse.value?.encryptedCardData?.cardNumber\n    );\n    const iframeUrl = computed(() => {\n      const hash = encodeURIComponent(\n        JSON.stringify({\n          verifyOrigin: 'AcceptUI',\n          type: 'SYNC',\n          pktData: window.location.origin,\n        })\n      );\n      const base = `https://js${\n        isTest.value ? 'test' : ''\n      }.authorize.net/v3/acceptMain/acceptMain.html`;\n\n      return `${base}#${hash}`;\n    });\n\n    const clearSavedResponse = (expired = true) => {\n      savedResponse.value = null;\n      confirmed.value = false;\n      sessionStorage.removeItem(sessionKey);\n\n      if (timer.value) {\n        clearTimeout(timer.value);\n        timer.value = null;\n      }\n\n      emit('clear');\n\n      if (expired) {\n        emit('expired');\n      }\n    };\n\n    const setupTimer = (timeout = 0) => {\n      if (timer.value) {\n        clearTimeout(timer.value);\n      }\n\n      timer.value = setTimeout(\n        clearSavedResponse,\n        timeout > 0 ? timeout : nonceValidTimeout\n      );\n    };\n\n    const loadResponseFromSession = () => {\n      try {\n        const item = sessionStorage.getItem(sessionKey);\n\n        if (!item) {\n          return;\n        }\n\n        const { response, time, cartId } = JSON.parse(item);\n\n        if (\n          !response ||\n          !time ||\n          !cartId ||\n          Date.now() - time > nonceValidTimeout ||\n          cartId !== $authnet.config.state.getCartId()\n        ) {\n          return clearSavedResponse(false);\n        }\n\n        savedResponse.value = response;\n        confirmed.value = true;\n\n        emit('success', response);\n\n        setupTimer(time + nonceValidTimeout - Date.now());\n      } catch (err) {\n        console.error(err);\n        clearSavedResponse(false);\n      }\n    };\n\n    const saveResponseToSession = () => {\n      try {\n        if (!savedResponse.value) {\n          return;\n        }\n\n        sessionStorage.setItem(\n          sessionKey,\n          JSON.stringify({\n            response: savedResponse.value,\n            time: Date.now(),\n            cartId: $authnet.config.state.getCartId(),\n          })\n        );\n\n        setupTimer();\n      } catch (err) {\n        console.error(err);\n      }\n    };\n\n    const editPayment = () => {\n      confirmed.value = false;\n      emit('clear');\n    };\n\n    const cancelEditing = () => {\n      confirmed.value = true;\n      emit('success', savedResponse.value);\n    };\n\n    onMounted(async () => {\n      if (props.saveInStorage) {\n        loadResponseFromSession();\n      }\n\n      const scrollPosition = { x: window.scrollX, y: window.scrollY };\n\n      const resetScroll = (e) => {\n        window.scroll(scrollPosition.x, scrollPosition.y);\n        e.preventDefault();\n        e.stopPropagation();\n        window.removeEventListener('scroll', resetScroll);\n      };\n\n      window.addEventListener('scroll', resetScroll);\n\n      window.CommunicationHandler = (response) => {\n        errors.value = [];\n        confirmed.value = false;\n\n        if (response.messages.resultCode === 'Error') {\n          for (const error of response.messages.message) {\n            errors.value.push(error);\n          }\n\n          emit('error', response);\n\n          return false;\n        }\n\n        if (props.saveInStorage) {\n          confirmed.value = true;\n          savedResponse.value = response;\n          saveResponseToSession();\n        }\n\n        emit('success', response);\n        return true;\n      };\n    });\n\n    onUnmounted(() => {\n      if (timer.value) {\n        clearTimeout(timer.value);\n      }\n\n      const AcceptUIBackground = document.getElementById('AcceptUIBackground');\n      if (AcceptUIBackground) {\n        AcceptUIBackground.remove();\n      }\n    });\n\n    return {\n      isTest,\n      acceptUiParams,\n      errors,\n      confirmed,\n      savedResponse,\n      cardNumber,\n      iframeUrl,\n      editPayment,\n      cancelEditing,\n    };\n  },\n});\n</script>\n\n<style>\n#AcceptUIContainer {\n  opacity: 1 !important;\n  visibility: visible !important;\n  position: relative !important;\n  top: 0 !important;\n  margin: 0 !important;\n  left: 0 !important;\n  box-shadow: none !important;\n  width: 100% !important;\n  z-index: 10 !important;\n}\n#AcceptUIContainer iframe {\n  width: 100% !important;\n}\n#AcceptUIBackground {\n  display: none !important;\n}\n.acceptui-container {\n  position: relative;\n}\n.acceptui-container .close-icon-hider {\n  position: absolute;\n  z-index: 20;\n  top: 0;\n  right: 0;\n  width: 40px;\n  height: 40px;\n  background-color: #fff;\n}\n.AcceptUI {\n  display: none;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

  var __vue_component__$1 = __vue_component__;

exports.AcceptUiForm = __vue_component__$1;
//# sourceMappingURL=index.js.map

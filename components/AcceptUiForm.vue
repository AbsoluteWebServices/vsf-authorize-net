<template>
  <div class="authnet-acceptui-form">
    <div v-if="savedResponse" class="acceptui-saved-response">
      <div v-if="confirmed">
        <p>
          <span>{{ $t('Paying with') }}</span>
          <span class="card-number">{{ cardNumber }}</span>
        </p>
        <slot name="button-edit" :edit="editPayment">
          <button @click="editPayment" class="acceptui-button button-edit">
            {{ $t('Edit') }}
          </button>
        </slot>
      </div>
      <div v-else>
        <slot name="button-cancel" :cancel="cancelEditing">
          <button @click="cancelEditing" class="acceptui-button button-cancel">
            {{ $t('Cancel') }}
          </button>
        </slot>
      </div>
    </div>
    <div v-show="!confirmed || !savedResponse" class="acceptui-container">
      <div class="close-icon-hider"></div>
      <div id="AcceptUIContainer">
        <iframe :src="iframeUrl" frameborder="0"></iframe>
      </div>
    </div>
    <slot name="errors" :errors="errors">
      <div v-if="errors.length" class="acceptui-errors">
        <p v-for="error in errors" :key="error.code">{{ error.text }}</p>
      </div>
    </slot>
    <button v-bind="acceptUiParams" type="button" class="AcceptUI"></button>
  </div>
</template>

<script>
import {
  ref,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  nextTick,
} from '@vue/composition-api';
import { useVSFContext } from '@vue-storefront/core';

const ENV_PROD = 'production';
const sessionKey = 'authnet-acceptui-response';
const nonceValidTimeout = 14.5 * 60000; // 14.5 minutes
let acceptUiScriptLoaded = false;

export default defineComponent({
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
    const { $authnet } = useVSFContext();

    const { loginId, clientKey, environment } = $authnet.config;
    const isTest = computed(() => environment !== ENV_PROD);

    const acceptUiParams = computed(() => {
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
    const errors = ref([]);
    const confirmed = ref(false);
    const savedResponse = ref(null);
    const timer = ref(null);
    const cardNumber = computed(
      () => savedResponse.value?.encryptedCardData?.cardNumber
    );
    const iframeUrl = computed(() => {
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

    onMounted(async () => {
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

    onUnmounted(() => {
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
</script>

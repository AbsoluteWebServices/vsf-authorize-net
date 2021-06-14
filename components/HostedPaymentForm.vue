<template>
  <div class="authnet-hosted-payment">
    <iframe v-bind="iframeProps" :id="iframeId" :name="iframeId" ref="hostedFormFrame" class="authnet-hosted-payment__iframe" frameborder="0" scrolling="no" hidden="true" />
    <form :action="formEndpoint" :target="iframeId" ref="hostedFormToken" class="authnet-hosted-payment__form" method="post">
      <input type="hidden" name="token" :value="formToken" />
    </form>
  </div>
</template>

<script>
import { ref, computed, defineComponent, onMounted, nextTick } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useHostedForm } from '@absolute-web/vsf-authorize-net';

export default defineComponent({
  name: 'HostedPaymentForm',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    settings: {
      type: Object,
      default: null,
    },
    iframeId: {
      type: String,
      default: 'authnet-hosted-form',
    },
    test: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { loading, error, formToken, loadFormToken } = useHostedForm();
    const hostedFormFrame = ref();
    const hostedFormToken = ref();
    const iframeProps = ref({
      width: '100%',
      height: '250px'
    });
    const formEndpoint = computed(() => `https://${props.test ? 'test' : 'accept'}.authorize.net/payment/payment`);
    const settings = computed(() => {
      const host =  window && window.location.host; // need to use ngrok on localhost

      return {
        hostedPaymentIFrameCommunicatorUrl: {
          url: `https://${host}/authnet/iframe-communicator`,
        },
        ...props.settings,
      };
    });

    const loadToken = async () => {
      try {
        if (!props.amount) {
          throw new Error('Please provide order total');
        }

        await loadFormToken({ amount: props.amount, settings: settings.value });

        if (error.value.loadFormToken) {
          throw error.value.loadFormToken;
        }
      } catch (err) {
        if (err.response) {
          console.error(err.response.data.message);
        } else {
          console.error(err);
        }
      }
    }

    const loadIframe = async () => {
      if (formToken.value) {
        hostedFormToken.value.submit();
      }
    }

    const onReceiveCommunication = (qstr) => {
      const params = new URLSearchParams(qstr);

      switch (params.get('action')) {
        case 'resizeWindow':
          // TODO: resize event isn't fired on actual screen resize
          // iframeProps.value = {
          //   ...iframeProps.value,
          //   height: `${params.get('height')}px`
          // }
          break;

        case 'cancel':
          // TODO: check localstorage token and refresh it if necessarry
          emit('cancel');
          break;

        case 'transactResponse':
          // TODO: remove token from localstorage
          const response = JSON.parse(params.get('response'));
          emit('success', response);
          break;
      }
    }

    onMounted(async () => {
      await loadToken();
      // TODO: save token to localstorage with timestamp
      await nextTick();
      await loadIframe();

      window.CommunicationHandler = {
        onReceiveCommunication
      };
    });

    return {
      hostedFormFrame,
      hostedFormToken,
      formToken: computed(() => formToken.value),
      iframeProps,
      formEndpoint,
    }
  },
});
</script>


import { APIContracts as ApiContracts, APIControllers as ApiControllers } from 'authorizenet';
import { Context } from '../types/context';
import { GetAnAcceptPaymentPageInput, AcceptPaymentPage } from '../types/API';

export default async (
  { client }: Context,
  input: GetAnAcceptPaymentPageInput,
): Promise<AcceptPaymentPage> => {
	return new Promise((resolve, reject) => {
    const { amount, settings } = input;
    const transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setAmount(amount);
    const settingList = [];

    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        const value = settings[key];
        const setting = new ApiContracts.SettingType();
        setting.setSettingName(key);
        setting.setSettingValue(JSON.stringify(value));
        settingList.push(setting);
      }
    }

    const getRequest = new ApiContracts.GetHostedPaymentPageRequest();
    getRequest.setMerchantAuthentication(client);
    getRequest.setTransactionRequest(transactionRequestType);

    if (settingList.length) {
      const alist = new ApiContracts.ArrayOfSetting();
      alist.setSetting(settingList);
      getRequest.setHostedPaymentSettings(alist);
    }

    const ctrl = new ApiControllers.GetHostedPaymentPageController(getRequest.getJSON());

    ctrl.execute(function(){
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

      if(response != null)
      {
        if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
        {
          resolve(response);
        }
        else
        {
          reject(response.getMessages());
        }
      }
      else
      {
        reject('Null response received');
      }
    });
  });
};

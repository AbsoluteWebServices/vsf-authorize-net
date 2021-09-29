import gql from 'graphql-tag';

export default gql`
fragment TokenBaseCheckoutConfigData on TokenBaseCheckoutConfig {
  method
  useVault
  canSaveCard
  forceSaveCard
  defaultSaveCard
  isCcDetectionEnabled
  logoImage
  requireCcv
  sandbox
  canStoreBin
  availableTypes {
    key
    value
  }
  months {
    key
    value
  }
  years {
    key
    value
  }
  hasVerification
  cvvImageUrl
}`;

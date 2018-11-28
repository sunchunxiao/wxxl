import product from './product';
import organization from './organization';
import fund from './fund';
import channel from './channel';
import customer from './customer';
import date from './date';

const getters = {
  ...product,
  ...organization,
  ...fund,
  ...channel,
  ...customer,
  ...date
};

export default getters;

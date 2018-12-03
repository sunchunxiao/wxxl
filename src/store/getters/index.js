import product from './product';
import organization from './organization';
import fund from './fund';
import channel from './channel';
import customer from './customer';
import date from './date';
import home from './home';

const getters = {
    ...product,
    ...organization,
    ...fund,
    ...channel,
    ...customer,
    ...date,
    ...home
};

export default getters;

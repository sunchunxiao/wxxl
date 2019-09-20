import product from './product';
import organization from './organization';
import fund from './fund';
import channel from './channel';
import customer from './customer';
import supply from './supply';
import date from './date';
import home from './home';
import goods from './goodsPlan';

const getters = {
    ...product,
    ...organization,
    ...fund,
    ...channel,
    ...customer,
    ...supply,
    ...date,
    ...home,
    ...goods
};

export default getters;

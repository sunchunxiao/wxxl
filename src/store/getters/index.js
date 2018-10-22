import product from './product';
import organization from './organization';
import fund from './fund';
import channel from './channel';
import customer from './customer';

const getters = {
    ...product,
    ...organization,
    ...fund,
    ...channel,
    ...customer
};

export default getters;

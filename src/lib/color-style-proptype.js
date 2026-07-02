import {PropTypes} from 'prop-types';

import GradientTypes from './gradient-types';

export default PropTypes.shape({
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    })),
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired
});

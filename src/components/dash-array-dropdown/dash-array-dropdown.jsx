import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Dropdown from '../dropdown/dropdown.jsx';
import InputGroup from '../input-group/input-group.jsx';
import styles from './dash-array-dropdown.css';

const ModeToolsComponent = props => (
    <Dropdown
        className={classNames(styles.modUnselect, styles.dashArrayDropdown)}
        enterExitTransitionDurationMs={60}
        popoverContent={
            <InputGroup>
                <div className={styles.table}></div>
            </InputGroup>
        }
        ref={props.componentRef}
        tipSize={.01}
        onOpen={props.onOpenDropdown}
        onOuterAction={props.onClickOutsideDropdown}
    >
        <svg
          width="64"
          height="4"
        >
            <line
              x1="0"
              y1="2"
              x2="64"
              y2="2"
              strokeWidth="4"
              strokeDasharray="0"
            >
            </line>
        </svg>
    </Dropdown>
);

ModeToolsComponent.propTypes = {
    componentRef: PropTypes.func.isRequired,
    onClickOutsideDropdown: PropTypes.func,
    onOpenDropdown: PropTypes.func
};
export default ModeToolsComponent;

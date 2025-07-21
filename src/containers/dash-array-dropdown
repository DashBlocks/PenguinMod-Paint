import paper from '@turbowarp/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import DashArrayDropdownComponent from '../components/dash-array-dropdown/dash-array-dropdown.jsx';
import {getSelectedLeafItems} from '../helper/selection';

class DashArrayDropdown extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOpenDropdown',
            'handleClickOutsideDropdown',
            'setDropdown'
        ]);
    }
    handleOpenDropdown () {
        this.savedFont = this.props.font;
        this.savedSelection = getSelectedLeafItems();
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.cancelChange();
    }
    cancelChange () {
        this.dropDown.handleClosePopover();
        this.savedFont = null;
        this.savedSelection = null;
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    render () {
        return (
            <DashArrayDropdownComponent
                componentRef={this.setDropdown}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onOpenDropdown={this.handleOpenDropdown}
            />
        );
    }
}

DashArrayDropdown.propTypes = {
    onUpdateImage: PropTypes.func.isRequired
};

export default DashArrayDropdown;

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
            'setDropdown',
            'handleAdd',
            'handleChange',
            'handleDelete',
        ]);
    }
    handleOpenDropdown () {
        this.dashArray = this.props.dashArray;
        this.savedSelection = getSelectedLeafItems();
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.cancelChange();
    }
    cancelChange () {
        this.dropDown.handleClosePopover();
        this.dashArray = null;
        this.savedSelection = null;
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    handleAdd () {
        if (this.dropDown.isOpen()) {
            this.dashArray.push(0);
            this.props.onDashArray(this.dashArray);
        }
    }
    handleChange (value, index) {
        if (this.dropDown.isOpen()) {
            this.dashArray[index] = value;
            this.props.onDashArray(this.dashArray);
        }
    }
    handleDelete (index) {
        if (this.dropDown.isOpen()) {
            this.dashArray.splice(index, 1);
            this.props.onDashArray(this.dashArray);
        }
    }
    render () {
        return (
            <DashArrayDropdownComponent
                componentRef={this.setDropdown}
                dashArray={this.props.dashArray}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onOpenDropdown={this.handleOpenDropdown}
                handleAdd={this.handleAdd}
                handleChange={this.handleChange}
                handleDelete={this.handleDelete}
            />
        );
    }
}

DashArrayDropdown.propTypes = {
    onUpdateImage: PropTypes.func.isRequired,
    onDashArray: PropTypes.func.isRequired,
    dashArray: PropTypes.arrayOf(PropTypes.number)
};

export default DashArrayDropdown;

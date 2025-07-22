import paper from '@turbowarp/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import DashArrayDropdownComponent from '../components/dash-array-dropdown/dash-array-dropdown.jsx';
import Formats from '../lib/format';
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
        this.dashArray = [];
    }
    handleOpenDropdown () {
        this.savedSelection = getSelectedLeafItems();
        console.log("Open dasharray dropdown | Selection:", this.savedSelection);
        this.dashArray = this.getDashArray(this.savedSelection);
        this.forceUpdate();
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.cancelChange();
    }
    cancelChange () {
        this.dropDown.handleClosePopover();
        this.dashArray = [];
        this.savedSelection = null;
        this.forceUpdate();
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    getDashArray (selectedItems) {
        if (selectedItems.length === 0) {
            return [];
        }
        const firstStyle = selectedItems[0].getStyle().getDashArray();
        for (const item of selectedItems) {
            if (item.getStyle().getDashArray().join(' ') !== firstStyle.join(' ')) {
                return [];
            }
        }
        return firstStyle;
    }
    handleDashArray (selectedItems, value) {
        console.log("Some changes in dasharray | Selection:", selectedItems);
        let changed;
        for (const item of selectedItems) {
            const styles = item.getStyle();
            if (styles.getDashArray().join(' ') !== value.join(' ')) {
                styles.setDashArray(value);
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
        this.forceUpdate();
    }
    handleAdd () {
        if (this.dropDown.isOpen()) {
            this.dashArray.push(0);
            this.handleDashArray(this.savedSelection, this.dashArray);
        }
    }
    handleChange (value, index) {
        if (this.dropDown.isOpen()) {
            this.dashArray[index] = value;
            this.handleDashArray(this.savedSelection, this.dashArray);
        }
    }
    handleDelete (index) {
        if (this.dropDown.isOpen()) {
            this.dashArray.splice(index, 1);
            this.handleDashArray(this.savedSelection, this.dashArray);
        }
    }
    render () {
        return (
            <DashArrayDropdownComponent
                componentRef={this.setDropdown}
                dashArray={this.dashArray}
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
    format: PropTypes.oneOf(Object.keys(Formats)),
    onUpdateImage: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    format: state.scratchPaint.format
});
const mapDispatchToProps = dispatch => ({
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashArrayDropdown);

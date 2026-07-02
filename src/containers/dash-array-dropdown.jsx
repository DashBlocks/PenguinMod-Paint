import paper from '@turbowarp/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import DashArrayDropdownComponent from '../components/dash-array-dropdown/dash-array-dropdown.jsx';
import {addValue, changeValue, deleteValue} from '../reducers/dash-array';
import {getSelectedLeafItems} from '../helper/selection';
import Formats from '../lib/format';

class DashArrayDropdown extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'applyDashArrayToSelection',
            'handleClickOutsideDropdown',
            'setDropdown',
            'handleAdd',
            'handleChange',
            'handleDelete',
            'handleChoose'
        ]);
    }
    applyDashArrayToSelection (selectedItems, value) {
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
    }
    handleChoose () {
        if (this.dropDown.isOpen()) {
            this.dropDown.handleClosePopover();
            this.props.onUpdateImage();
        }
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.dropDown.handleClosePopover();
        this.props.onUpdateImage();
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    handleAdd () {
        if (this.dropDown.isOpen()) {
            const selectedItems = getSelectedLeafItems();
            if (selectedItems.length) {
                this.applyDashArrayToSelection(selectedItems, this.props.dashArray.concat(0));
            } else {
                this.props.addValue();
            }
        }
    }
    handleChange (index, value) {
        if (this.dropDown.isOpen()) {
            const selectedItems = getSelectedLeafItems();
            if (selectedItems.length) {
                index = Math.max(0, Math.min(this.props.dashArray.length - 1, index));
                this.applyDashArrayToSelection(
                    selectedItems,
                    this.props.dashArray.toSpliced(index, 1, Math.max(0, Number(value)))
                );
            } else {
                this.props.changeValue(index, value);
            }
        }
    }
    handleDelete (index) {
        if (this.dropDown.isOpen()) {
            const selectedItems = getSelectedLeafItems();
            if (selectedItems.length) {
                index = Math.max(0, Math.min(this.props.dashArray.length - 1, index));
                this.applyDashArrayToSelection(selectedItems, this.props.dashArray.toSpliced(index, 1));
            } else {
                this.props.deleteValue(index);
            }
        }
    }
    render () {
        return (
            <DashArrayDropdownComponent
                componentRef={this.setDropdown}
                dashArray={this.props.dashArray}
                onChoose={this.handleChoose}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onOpenDropdown={this.handleOpenDropdown}
                onAdd={this.handleAdd}
                onChange={this.handleChange}
                onDelete={this.handleDelete}
            />
        );
    }
}

DashArrayDropdown.propTypes = {
    addValue: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    deleteValue: PropTypes.func.isRequired,
    dashArray: PropTypes.arrayOf(PropTypes.number),
    format: PropTypes.oneOf(Object.keys(Formats)),
    onUpdateImage: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    dashArray: state.scratchPaint.dashArray
});
const mapDispatchToProps = dispatch => ({
    addValue: () => {
        dispatch(addValue());
    },
    changeValue: (index, value) => {
        dispatch(changeValue(index, Number(value)));
    },
    deleteValue: index => {
        dispatch(deleteValue(index));
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashArrayDropdown);

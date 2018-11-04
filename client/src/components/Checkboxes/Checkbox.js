import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

const Checkbox = ({input, type, option, selectedCount, maxCount}) => {
    const id = `option-${option}`;
    const checkboxClassNames = classNames({
      'checkbox-text': true,
      'checkbox-text-checked': input.checked,
      'checkbox-text-unchecked': !input.checked,
    });
    const onCheckboxChanged = (e) => {
      if (!e.target.value) {
        if (selectedCount+1 > maxCount) {
          return;
        }
      }
      input.onChange(e);
    }
    return (
      <div className='checkbox'>
          <input {...input} type={type} id={id} onChange={onCheckboxChanged}/>
          <label className={checkboxClassNames} htmlFor={id}>
            {option}
          </label>
      </div>
    );
}

export default connect()(Checkbox);

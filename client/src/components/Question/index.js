import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EitherOr from '../EitherOr';
import RadioButtons from '../RadioButtons';
import Checkboxes from '../Checkboxes';
import Textarea from '../Textarea';
import DragAndDrop from '../DragAndDrop';
import Input from '../Input';
import Label from '../Label';

import './index.scss';

class Question extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    handleSubmit: PropTypes.func,
    onBlur: PropTypes.func,
  }

  render() {
    const { handleSubmit, onBlur, question, handleClick, anyTouched, formName, index } = this.props;
    return (
      <div className={`question question-${question.name}`}>
        <div className='question-wrapper-inner'>
          {question.text && 
            <Label 
              question={question} 
              number='single' 
            />
          }
          {question.type === 'eitherOr' && 
            <EitherOr 
              question={question} 
              index={index}
              handleClick={handleClick} 
              touched={anyTouched} 
              formName={formName}
            />
          }
          {question.type === 'radio' && 
            <RadioButtons 
              question={question} 
              handleClick={handleClick} 
              touched={anyTouched} 
            />
          }
          {question.type === 'checkbox' && 
            <Checkboxes 
              question={question} 
              formName={formName} 
              handleClick={handleClick} 
              touched={anyTouched} 
            />
          }
          {question.component === 'textarea' && 
            <Textarea 
              question={question} 
              touched={anyTouched} 
            />
          }
          {question.component === 'drag-and-drop' &&
            <DragAndDrop 
              question={question}
              formName={formName}
            />
          }
          {question.type === 'text' && 
            <Input 
              question={question}
              onBlur={onBlur}
            />
          }
        </div>
      </div>
    )
  }
}

export default Question;

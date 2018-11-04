import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form';

import Option from './Option';

const grid = 8;
// Double Column Drag And Drop Functions
const reorder2 = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
const getItemStyle2 = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? '#6AC53B' : '#D8D8D8',

    // styles we need to apply on draggables
    ...draggableStyle
});
const getItemStyle3 = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? '#D8D8D8' : '#6AC53B',
    color: 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = isDraggingOver => ({
    border: '1px solid '+ (isDraggingOver ? 'lightblue' : 'lightgrey'),
    padding: grid,
    width: 450,
    height: 658,
    margin: '0 43px'
});

//Single Column DND Functions
const getSingleItemStyle = (isDragging, draggableStyle) => {
  // delete draggableStyle.top;
  // delete draggableStyle.left;

   return {
     // some basic styles to make the items look a bit nicer
     userSelect: 'none',
     WebkitUserSelect: 'none',
     MozUserSelect: 'none',
     MsUserSelect: 'none',
     padding: grid * 2,
     margin: `0 0 ${grid}px 0`,
     fontSize: '16px',
     border: '1px solid #979797',
     background: isDragging ? '#75CC43' : '#D8D8D8',
     color: isDragging ? '#FFF' : '#333',
     ...draggableStyle,
   };
 }
const reorder = (list, startIndex, endIndex) => {
   const result = Array.from(list);
   const [removed] = result.splice(startIndex, 1);
   result.splice(endIndex, 0, removed);

   return result;
};
const getSingleListStyle = isDraggingOver => ({
  // background: isDraggingOver ? 'lightblue' : 'grey',
  padding: grid,
  width: 250
});

class DragAndDrop extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
  }

  state = {
    items: this.props.question.options,
    selected: []
  }

  componentDidMount() {
    if (screen.width <= 768) {
      this.setFormValues();
    } else {
      this.setFormValues2();
    }
  }

  setFormValues = () => {
    const { setValue, question, formName } = this.props;
    const { items } = this.state;

    const valueList = question.options.map(option => ({
      [option.path]: items.findIndex(object => object.path === option.path)
    }));

    valueList.forEach(item => {
      setValue(formName, Object.keys(item)[0], Object.values(item)[0]);
    });
  }

  setFormValues2 = () => {
    const { setValue, question, formName } = this.props;
    const { selected } = this.state;

    const valueList = question.options.map(option => ({
      [option.path]: selected.findIndex(object => object.path === option.path)
    }));

    valueList.forEach(item => {
      setValue(formName, Object.keys(item)[0], Object.values(item)[0]);
    });
  }

  onDragEnd = result => {
    console.log('drag result', result);
    if (!result.destination) return;

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({ items }, () => this.setFormValues());
  }

  id2List = {
    droppable: 'items',
    droppable2: 'selected'
  };

  getList = id => this.state[this.id2List[id]];
  
  onDragEndTwo = result => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
          return;
      }

      if (source.droppableId === destination.droppableId) {
          const items = reorder2(
              this.getList(source.droppableId),
              source.index,
              destination.index
          );

          let state = { items };

          if (source.droppableId === 'droppable2') {
              state = { selected: items };
          }

          this.setState(state);
      } else {
          const result = move(
              this.getList(source.droppableId),
              this.getList(destination.droppableId),
              source,
              destination
          );

          this.setState({
              items: result.droppable,
              selected: result.droppable2
          });
      }
      this.setFormValues2();
  };

  renderExplanation = () => (
    <p style={{margin: '10px 0'}}>Drag the statements below from top to bottom according to how much you agree with them, given the above scenario.</p>
  );

  render() {
    if (screen.width <= 768) {
      return (
        <div className="drag-and-drop-wrapper">
          {this.renderExplanation()}
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable" ignoreContainerClipping={true}>
              {(droppableProvided, droppableSnapshot) => (
                <div
                  ref={droppableProvided.innerRef}
                  style={getSingleListStyle(droppableSnapshot.isDraggingOver)}
                  // style={{padding: '10px', width: '426px', margin: 'auto'}}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable key={'item-'+item.id} draggableId={'item-'+item.id} index={index}>
                      {(draggableProvided, draggableSnapshot) => (
                        <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            style={getSingleItemStyle(
                              draggableSnapshot.isDragging,
                              draggableProvided.draggableProps.style
                            )}
                        >
                            {item.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      );
    } else {
      return (
        <div className="drag-and-drop-wrapper">
          {this.renderExplanation()}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DragDropContext onDragEnd={this.onDragEndTwo}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={'item-'+item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{padding: '10px', width: '426px', margin: 'auto'}}
                        >
                            <Field 
                              key={index}
                              index={index}
                              component={Option}
                              name={item.path}
                              item={item}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              getItemStyle={getItemStyle2}
                            />
                            {provided.placeholder}
                      </div>
                      )}
                    </Draggable>
                    ))}
                  </div>
                )}
            </Droppable>
            <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.selected.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={'item-'+item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{padding: '10px', width: '426px', margin: 'auto'}}
                        >
                            <Field 
                              key={index}
                              index={index}
                              component={Option}
                              name={item.path}
                              item={item}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              getItemStyle={getItemStyle3}
                            />
                            {provided.placeholder}
                      </div>
                      )}
                    </Draggable>
                    ))}
                  </div>
                )}
            </Droppable>
          </DragDropContext>
          </div>
        </div>
      );
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setValue: (form, field, value) => dispatch(change(form, field, value)),
  }
}

export default connect(null, mapDispatchToProps)(DragAndDrop);

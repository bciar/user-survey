import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

const Option = ({ input, item, index, getItemStyle }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
      <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
          snapshot.isDragging,
          provided.draggableProps.style
          )}
      >
          {item.text}
      </div>
      )}
    </Draggable>
  );
}

export default Option;
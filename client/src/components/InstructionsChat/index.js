import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from '../../store'

import Instructions from './Instructions';

import './index.scss';

class InstructionsChat extends Component {

	render() {
		return <div className="instructions-chat">
		  {this.props.element.instructions.map(instruction => (
		    <Instructions 
		      text={instruction.text}
		      key={instruction.id}
		    />
		  ))}
		</div>
	}

	componentDidMount() {
		let {candidate} = store.getState();
		let candidateName = ''
		if (candidate && 'firstName' in candidate && candidate.firstName) {
			candidateName = candidate.firstName;
		}

		var chatters = document.querySelectorAll(".instructions-chat .instructions");
		if (chatters.length) {
			var displayTime = 0;
			var updateChatter = function(chatter, originalText) {
				setTimeout(function(){
					chatter.style.display = 'block';
					chatter.classList.remove('instructions')
					chatter.innerHTML = '<div class="spinme-left"><div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div></div>';
					chatter.parentNode.scrollTop = chatter.parentNode.scrollHeight - chatter.parentNode.clientHeight;
				}, displayTime);

				displayTime += originalText.split(' ').length * 200;
				setTimeout(function(){
					chatter.classList.add('instructions')
					if (candidateName) {
						originalText = String(originalText).replace('{name}', candidateName)
					}
					chatter.innerHTML = originalText;
					chatter.parentNode.scrollTop = chatter.parentNode.scrollHeight - chatter.parentNode.clientHeight;
				}, displayTime)
			}
			for (let chatter of chatters) {
				chatter.style.display = 'none';
			}
			for (let chatter of chatters) {
				updateChatter(chatter, chatter.innerHTML)
			}	
		}
	}
}

InstructionsChat.propTypes = {
  element: PropTypes.object.isRequired,
}

export default InstructionsChat;


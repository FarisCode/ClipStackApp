import React, { Component } from 'react'
import './SettingMenu.css';
export default class SettingMenu extends Component {
  constructor(props) {
    super(props)
    this.defaults = {
      theme: 0,
      onTop: true,
      launchOnStartup: true,
      clipSync: 100,
      clipLimit: 20,
    }

    this.state = JSON.parse(window.localStorage.getItem('personal-settings')) || this.defaults;
  }

  validate(evt) {
    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  render() {
    return (
      <div className='menu' style={this.props.styles}>
        <div className='backBtn' onClick={this.props.backBthHandler}></div>
        <span className='setting-head' style={this.props.styles ? { borderBottom: '1px solid rgb(80, 80, 80)' } : null}>Setting</span>
        <div className='settingContent'>
          <div className='item'>
            <span style={{ marginRight: '10px' }}  >Theme: </span>
            <select className='form'
              value={this.state.theme}
              onChange={(e) => { this.setState({ theme: e.target.value }) }}
            >
              <option value={0}>Light</option>
              <option value={1}>Dark</option>
            </select>
          </div>
          <div className='item'>
            <span>Sync Rate (ms): </span>
            <input type='text'
              onKeyPress={this.validate}
              value={this.state.clipSync}
              onChange={(e) => { this.setState({ clipSync: e.target.value }) }}
              className='form'
            />
          </div>
          <div className='item'>
            <span>Clips Limit: </span>
            <input type='text'
              onKeyPress={this.validate}
              value={this.state.clipLimit}
              onChange={(e) => { this.setState({ clipLimit: e.target.value }) }}
              className='form'
            />
          </div>
          <div className='item'>
            <span>Startup launch:</span>
            <div className="checkbox">
              <input
                type="checkbox"
                id="checkbox2"
                checked={this.state.launchOnStartup}
                onChange={(e) => { this.setState({ launchOnStartup: e.target.checked }) }}
              />
              <label htmlFor="checkbox2"></label>
            </div>
          </div>
          <div className='item'>
            <span>Stay on top</span>
            <div className="checkbox">
              <input
                type="checkbox"
                id="checkbox1"
                checked={this.state.onTop}
                onChange={(e) => { this.setState({ onTop: e.target.checked }) }}
              />
              <label htmlFor="checkbox1"></label>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'absolute', bottom: '20px' }}>
          <button className='btn saveBtn' onClick={() => {
            this.props.saveBtnHandler({
              theme: this.state.theme,
              onTop: this.state.onTop,
              launchOnStartup: this.state.launchOnStartup,
              clipSync: this.state.clipSync,
              clipLimit: this.state.clipLimit,
            })
          }}>Save</button>
          <button className='btn resetBtn' onClick={() => { this.props.saveBtnHandler(this.defaults) }}>Defaults</button>
        </div>
        <div
          className="credits"
          style={{
            fontSize: 11,
            textAlign: 'center',
            position: 'absolute',
            bottom: 5,
            color: '#777',
            width: '100%'
          }}
        >
          Designed and Developed by <b style={this.props.styles ? { color: '#dedede', cursor: 'pointer' } : { color: '#000', cursor: 'pointer' }} onClick={() => { require('electron').shell.openExternal('https://fariscode.github.io/') }}>Syed Faris Ahmed</b>
        </div>
      </div>
    )
  }
}


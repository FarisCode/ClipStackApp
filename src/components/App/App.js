import '../../assets/css/App.css';
import React, { PureComponent } from 'react';
import electron, { app } from "electron";
import Clip from '../Clip/Clip';
import setting from '../../assets/gear.svg';
import cross from '../../assets/cross.svg';
import minimize from '../../assets/minimize.svg';
import _ from 'lodash';
import SettingMenu from '../SettingMenu/SettingMenu';

const clipboard = electron.clipboard;
const remote = electron.remote;

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clip: '',
      clipboardStack: [],
      settingEnabled: false,
      settings: JSON.parse(window.localStorage.getItem('personal-settings')) || {
        theme: 0,
        onTop: true,
        launchOnStartup: true,
        clipSync: 100,
        clipLimit: 20,
      }
    }
    this.onClipClickHandler = this.onClipClickHandler.bind(this);
    this.saveBtnHandler = this.saveBtnHandler.bind(this);
  }

  saveBtnHandler(data) {
    window.localStorage.setItem('personal-settings', JSON.stringify(data));
    this.setState({
      settingEnabled: false,
      settings: {
        theme: data.theme,
        onTop: data.onTop,
        launchOnStartup: data.launchOnStartup,
        clipSync: data.clipSync,
        clipLimit: data.clipLimit,
      }
    })
  }

  onClipClickHandler(index) {
    let currClip = this.state.clipboardStack[index];
    if (this.state.clip !== currClip) {
      clipboard.writeText(currClip);
    }
  }

  componentDidMount() {
    let temp = '';
    this.clipTimer = setInterval(() => {
      temp = clipboard.readText().trim();
      if (this.state.clip !== temp) {
        this.setState({
          clip: clipboard.readText().trim()
        }, () => {
          this.setState((prevState) => ({
            clipboardStack: _.uniq(prevState.clipboardStack),
          }))
        })
      }
    }, this.state.settings.clipSync);
  }

  componentWillUnmount() {
    clearInterval(this.clipTimer);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.settings.clipLimit + ' and ' + this.state.clipboardStack.length)
    if (this.state.clipboardStack.length > +this.state.settings.clipLimit) {
      let stack = [...this.state.clipboardStack];
      stack.splice(this.state.settings.clipLimit, 1);
      this.setState({ clipboardStack: [...stack] });
    }
    if (prevState.settings.clipSync !== this.state.settings.clipSync) {
      clearInterval(this.clipTimer);
      this.clipTimer = setInterval(() => {
        this.setState({
          clip: clipboard.readText().trim()
        })
      }, this.state.settings.clipSync);
    }
    if (prevState.settings.onTop !== this.state.settings.onTop) {
      remote.getCurrentWindow().setAlwaysOnTop(this.state.settings.onTop);
    }
    if (prevState.settings.launchOnStartup !== this.state.settings.launchOnStartup) {
      remote.app.setLoginItemSettings({
        openAtLogin: this.state.settings.launchOnStartup
      })
    }
    if (this.state.clip && this.state.clip !== this.state.clipboardStack[0]) {
      const stack = [...this.state.clipboardStack];
      stack.unshift(this.state.clip);
      this.setState({
        clipboardStack: [...stack]
      })
    }
  }

  render() {
    return (
      <div className='App' style={+this.state.settings.theme ? { background: '#2d3333' } : null}>
        <div className='Header' style={+this.state.settings.theme ? { background: '#191d1e', color: '#dedede' } : null}>
          <div className="leftHead" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={require('../../assets/clipboard.svg')} width='20px' height='20px' /><span style={{ marginLeft: '5px' }}>ClipStack</span>
          </div>
          <div className="rightHead" >
            <div className='Options' onClick={() => { this.setState({ settingEnabled: true }) }}><img src={setting} width='12' height='12' /></div>
            <div className='Options' onClick={() => { remote.getCurrentWindow().minimize() }}><img src={minimize} width='8' height='8' /></div>
            <div className='Options' onClick={() => { remote.getCurrentWindow().close() }}><img src={cross} width='10' height='10' /></div>
          </div>
        </div>

        {!this.state.settingEnabled ?
          <div className='Content'>
            {
              this.state.clipboardStack.map((clip, i) => (
                <Clip key={i} index={i} clickHandler={this.onClipClickHandler} classDark={+this.state.settings.theme} styles={+this.state.settings.theme ? { background: '#191d1e', color: '#dedede' } : null}>{clip}</Clip>
              ))
            }
            {!this.state.clipboardStack.length ? <span className="placeHolder">Happy Copying!</span> : null}
          </div>
          : <SettingMenu styles={+this.state.settings.theme ? { background: '#191d1e', color: '#dedede' } : null} saveBtnHandler={this.saveBtnHandler} backBthHandler={() => { this.setState({ settingEnabled: false }) }} />}
      </div>
    );
  }
}

export default App;
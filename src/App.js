import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

import Clarifai from 'clarifai';
const app = new Clarifai.App({
  apiKey: 'bf31e40d708243e185e28cf27676a895'
  });

class App extends React.Component {
  constructor() {
    super();
    this.state =  {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
      isSignedIn: false,
      user:  {
        id: '', 
            name: '',
            email: '',
            entries: 0,
            joined: ''
      }
    }
  }
 loadUser = (data) => {
   this.setState({
     user: {
      id: data.name, 
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
     }
   })
 }
  calculateFaceLocation = (data) =>  {
 
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById("inputImage");
      const width = Number(image.width);
      const height =  Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }
  displayFaceBox = (box) => {
    this.setState({box: box});
   
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
  onButtonSubmit = () =>  {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then((response) => {
    if(response) {
      fetch('http://localhost:3000/image', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.user.id
        })
      }).then(response => response.toString())
      .then(count =>  {
        console.log("count: ", count)
        this.setState({user: {
          entries: count
        }})
      }).catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
    
    }).catch(error => console.log("error", error))
  }
  onRouteChange = (route) =>  {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    }
    else if(route === "home") {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  
  }
  render() {
     const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
      {route === 'home' ? 
            <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries} />
                  <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                  <FaceRecognition box={box} imageUrl={imageUrl} />
          </div> 
            
            : (
             route === "signin" ?
              <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange } loadUser={this.loadUser}/>
            )
            
      
      }
    </div>
  
  );
  }
}

export default App;

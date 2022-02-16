import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import './App.css';



const initialState =  {
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
class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }
 loadUser = (data) => {
   console.log("data from <signin>: ",data);
   this.setState({
     user: {
      id: data.id, 
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
     }
   }, () => {
     setTimeout(() => console.log("userdata from state", this.state.user), 5000)
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
    console.log("every detect: ", this.state.user.id)
    this.setState({imageUrl: this.state.input});
    fetch('https://enigmatic-ocean-53035.herokuapp.com/imageurl', {
      method: 'POST',
      headers : {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.input 
      })
    })
    .then(response => response.json())
    .then((response) => {
    if(response !== "unable to work with API") {
      
      fetch('https://enigmatic-ocean-53035.herokuapp.com/image', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.user.id,
          username: this.state.user.name,
          entries: this.state.user.entries,
          image_url: this.state.imageUrl
        })
      }).then(response =>  response.json())
      .then(count =>  {
        console.log("count: ", count)
        this.setState(Object.assign(this.state.user, { entries: count}))
        console.log("after count update: ", this.state)
      }).catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
    
    }).catch(error => console.log("error", error))
  }
  onRouteChange = (route) =>  {
    if(route === 'signout') {
      this.setState(initialState)
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

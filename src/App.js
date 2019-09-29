import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
// import Clarifai from "clarifai";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./containers/Signin/Signin";
import Register from "./containers/Register/Register";

const defaultImage =
  // "https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-england-most-beautiful-face.jpg";
  "https://www.thecharlestonphotographer.com/wp-content/uploads/2015/02/family-pictures-by-charleston-family-photographers-king-street-studios-37.jpg";

const initialState = {
  input: defaultImage,
  imageUrl: "",
  faceBoxes: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  calculateFaceLocation = data => {
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    const faceBoxes = [];
    const facesRegion = data.outputs[0].data.regions;
    // eslint-disable-next-line
    for (let reg of facesRegion) {
      const faceRegion = reg.region_info.bounding_box;
      faceBoxes.push({
        leftCol: faceRegion.left_col * width,
        topRow: faceRegion.top_row * height,
        rightCol: width - faceRegion.right_col * width,
        bottomRow: height - faceRegion.bottom_row * height
      });
    }
    return faceBoxes;
  };

  displayFacefaceBoxes = faceBoxes => {
    this.setState({ faceBoxes: faceBoxes });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    });
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: this.state.input })
    })
      .then(respone => respone.json())
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this.state.user.id })
          })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFacefaceBoxes(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  loadUser = user => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      }
    });
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState(initialState);
      route = "signin";
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, faceBoxes } = this.state;
    let content = "";
    if (route === "signin") {
      content = (
        <div>
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        </div>
      );
    } else if (route === "register") {
      content = (
        <div>
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        </div>
      );
    } else {
      content = (
        <div>
          <Rank user={this.state.user} />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onPictureSubmit={this.onPictureSubmit}
          />
          <FaceRecognition imageUrl={imageUrl} faceBoxes={faceBoxes} />
        </div>
      );
    }

    return (
      <div className="App">
        <Particles className="particles" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "10px",
            paddingBottom: "30px",
            paddingRight: "30px"
          }}
        >
          <Logo />

          <Navigation
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange}
          />
        </div>
        {content}
      </div>
    );
  }
}

export default App;

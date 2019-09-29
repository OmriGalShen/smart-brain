import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, faceBoxes }) => {
  return (
    <div className="center pa3">
      <div className="absolute mt2">
        <img
          id="inputImage"
          alt=""
          src={imageUrl}
          width="auto"
          height="350px"
        />
        {faceBoxes.map((faceBox, ind) => {
          return (
            <div
              key={ind}
              className="bounding-box"
              style={{
                top: faceBox.topRow,
                right: faceBox.rightCol,
                bottom: faceBox.bottomRow,
                left: faceBox.leftCol
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;

import React, { useState } from "react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CircularProgress from "@mui/material/CircularProgress";

const ImageLoader = ({ src, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    // <div className={className}>
    //   {isLoading && (
    //     <CircularProgress size={24} /> // Adjust the size as needed
    //   )}
    //   <LazyLoadImage src={src} alt="" {...props} onLoad={handleImageLoad} />
    // </div>
    <div className={className} style={{ position: "relative" }}>
      {isLoading && (
        <CircularProgress
          size={props.progressbar_size ? props.progressbar_size : 40} // Adjust the size of the spinner as needed
          style={{
            position: "absolute",
            ...props.progressbar_style,
            // top: "50%",
            // left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <LazyLoadImage
        src={src}
        alt=""
        {...props}
        onLoad={handleImageLoad}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s",
          ...props.style,
          // width: "100%", // Adjust the width to fill the container
        }}
      />
    </div>
  );
};

ImageLoader.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ImageLoader.defaultProps = {
  className: undefined,
};

export default ImageLoader;

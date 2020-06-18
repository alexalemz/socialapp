import React, { Component } from 'react'

const DivImg = props => {
  const { className, imgUrl } = props;

  return (
    <div className={className}
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    />
  )
}

export default DivImg;
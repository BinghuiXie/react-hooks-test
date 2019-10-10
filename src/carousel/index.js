import React, { useState, useEffect } from 'react';
import './index.css'
import {
  slides,
  SLIDE_DURATION,
  LAST_SLIDE_URL,
  NEXT_SLIDE_URL,
  PAUSE_SLIDE_URL,
  PLAY_SLIDE_URL
} from "../mock/test-data";
import useProgress from "./useProgress";

function Slides(props) {
  return (
    <div className="slides">
      { props.children }
    </div>
  )
}

function Controls (props) {
  return <div className="controls">{ props.children }</div>
}

function ProgressBar({ animate, time }) {
  let progress = useProgress(animate, time);
  return (
    <div className="progress-bar" style={{width: progress * 100 + '%',}} />
  )
}

function SlideNavs(props) {
  return (
    <div className="slideNavs">
      { props.children }
    </div>
  )
}

function SlideNavItem(props) {
  const { isCurrentNav } = props;
  return (
    <button
      {...props}
      className="slide-nav-item"
      style={{
        backgroundColor: isCurrentNav ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, .3)'
      }}
    />
  )
}

function ControlButton (props) {
  const { url } = props;
  return (
    <button {...props} className="control-button-wrapper">
      <img
        style={{ width: 48 }}
        src={url}
        alt=""
      />
    </button>
  )
}

/**
 * @return {null}
 */
function SlidePicture(props) {
  const { src, isCurrent } = props;
  return (
    isCurrent ?
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: `url(${src})`,
          backgroundSize: '100% 100%'
        }}
      />
      : null
  )
}

function Carousel(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setCurrentIndex((currentIndex + 1) % slides.length)
      }, SLIDE_DURATION);
      return () => {
        clearTimeout(timer)
      }
    }
  }, [currentIndex, isPlaying]);
  
  return (
    <div>
      <Slides>
        {
          slides.map((image, index) => {
            return (
              <SlidePicture
                key={image.id}
                src={image.imageUrl}
                isCurrent={image.id === currentIndex}
              />
            )
          })
        }
      </Slides>
      <Controls>
        <SlideNavs>
          {
            slides.map((item, index) => (
              <SlideNavItem
                onClick={
                  () => {
                    setCurrentIndex(index)
                  }
                }
                key={item.id}
                isCurrentNav={item.id === currentIndex}
              />
            ))
          }
        </SlideNavs>
        <div>
          {
            isPlaying ?
              <ControlButton
                url={ PAUSE_SLIDE_URL }
                onClick={
                  () => {
                    setIsPlaying(false)
                  }
                }
              />:
              <ControlButton
                url={ PLAY_SLIDE_URL }
                onClick={
                  () => {
                    setIsPlaying(true)
                  }
                }
              />
          }
          
          <ControlButton
            url={ LAST_SLIDE_URL }
            onClick={
              () => {
                setCurrentIndex(
                  (currentIndex - 1 + slides.length) % slides.length
                )
              }
            }
          />
          <ControlButton
            url={ NEXT_SLIDE_URL }
            onClick={
              () => {
                setCurrentIndex(
                  (currentIndex + 1) % slides.length
                )
              }
            }
          />
        </div>
        <ProgressBar
          key={ currentIndex + isPlaying }
          animate={ isPlaying }
          time={ SLIDE_DURATION }
        />
      </Controls>
    </div>
  )
}


export default Carousel
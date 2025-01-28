import useGetPaginatedPatterns from "../../hooks/useGetPaginatedPatterns";
import useGetTotalPatternCount from "../../hooks/useGetTotalPatternCount";
import { useNavigate } from 'react-router-dom';
import { isMobile } from "react-device-detect";

import './pattern-list.css';
import PatternItem from "./PatternItem";
import { useEffect, useState } from "react";
import PatternButtons from "./PatternButtons";
import Spinner from "../componets/Spinner";
import anime from "animejs";

function PatternList() {

  const navigate = useNavigate();
  const [offset, setOffset] = useState(0)
  const { patterns, loading, error } = useGetPaginatedPatterns(6, offset);
  const { patternCount, loadingCount, countError } = useGetTotalPatternCount();
  const [delayedLoading, setLoading] = useState(true)
  
  //  on load animation
  useEffect(() => {
    handleSpinnerFadeOut()
  }, [])

  //  on change animation
  useEffect(() => {
    if (!delayedLoading && !loading) {
      handleItemsFadeIn()
    }
    if (delayedLoading) {
      handleSpinnerFadeIn()
    }

  }, [delayedLoading])

  const handleItemsFadeOut = (shouldAdd) => {
    anime({
      targets: '.list-item',
      opacity: 0,
      duration: 250,
      complete: () => {

        setLoading(true)
        if (shouldAdd) {
          setOffset(offset + 6)
        }
        else if (!shouldAdd) {
          setOffset(offset - 6)
        }
      }
    })
  }

  const handleSpinnerFadeIn = () => {
    anime({
      targets: '.spinner-anime',
      opacity: 1,
      duration: 1000,
      complete: () => {
        setLoading(false)
      }
    })
  }

  const handleSpinnerFadeOut = () => {
    anime({
      targets: '.spinner-anime',
      opacity: 0,
      duration: 1000,
      complete: () => {
        setLoading(false)
      }
    })
  }

  const handleItemsFadeIn = () => {
    anime({
      targets: '.list-item',
      opacity: 1,
      duration: 150,
    })
  }

  if (error || countError) return <div>error: {error.message} - {countError.message}</div>

  const handleDisableButtons = (shouldAdd) => {
    if (shouldAdd && offset + 6 < patternCount) {
      handleItemsFadeOut(true)
    }
    else if (!shouldAdd && offset - 6 >= 0) {
      handleItemsFadeOut(false)
    }
  }

  const onSelection = (id) => {
    navigate(`/pattern/${id}`)
  }

  if (isMobile) return (
    <div className="list-grid-mobile">
      {patterns.map((pattern) => (
        <div
          className="list-item-mobile"
          key={pattern.id}
          onClick={() => onSelection(pattern.id)}
        >
          <PatternItem pattern={pattern} isMobile />
        </div>
      ))}
    </div>
  )

  else return (
    <div className="list-container">
      <div className="list-grid">
        {delayedLoading || loading ?
          <div className="spinner-anime">
            <Spinner height={'100%'} />
          </div> :
          patterns.map((pattern) => (
            <div
              className="list-item"
              key={pattern.id}
              onClick={() => onSelection(pattern.id)}
            >
              <PatternItem pattern={pattern} />
            </div>
          ))}
      </div>

      {loadingCount ? <>loading!</> :
        <PatternButtons
          decreaseOffset={() => handleDisableButtons(false)}
          increaseOffset={() => handleDisableButtons(true)}
          showDecrease={offset - 6 < 0}
          showIncrease={offset + 6 >= patternCount}
        />
      }
    </div>
  )
}

export default PatternList
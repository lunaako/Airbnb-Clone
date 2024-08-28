import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getReviewsThunk } from "../../store/reviews";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import dateTransform, { sortReviews } from "../../utils/date";

export default function ReviewsList({ spotId, reviewCount, avgStarRating }) {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getReviewsThunk(spotId)).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch, spotId])

  const reviews = useSelector(state => state.reviews);
  const reviewArr = Object.values(reviews);

  //!sort the reviews from latest to oldest
  sortReviews(reviewArr);

  // console.log(reviewArr)
  
  return (
    <div className="spot-review-block">

      <div className="review-header">
        <h2>
          <FontAwesomeIcon icon={faStar} /> {avgStarRating !== null ? Number(avgStarRating.toFixed(2)).toFixed(1) : `New`} {reviewCount}
        </h2>
      </div>

      
      {isLoaded && 
        <div className="review-detail">
        {
          reviewArr.map(review => (
            <div key={review.id} >
              <h3>{review.User.firstName}</h3>
              <h3>{dateTransform(review.createdAt)}</h3>
              <p>{review.review}</p>
            </div>
          ))
        }
      </div>}

    </div>
  )
}
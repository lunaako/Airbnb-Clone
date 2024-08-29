import './DeleteReview.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

export default function DeleteReviewModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  return (
    <>
      <div>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
      </div>

      <button

      >
        Yes (Delete Review)
      </button>
      
      <button
        onClick={() => closeModal()}
      >
        No (Keep Review)
      </button>
    </>
  )
}

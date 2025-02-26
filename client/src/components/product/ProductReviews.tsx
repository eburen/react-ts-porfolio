import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Rating,
  TextField,
  Divider,
  Avatar,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  fetchProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  clearReviewSuccess,
  clearReviewError,
} from '../../store/slices/reviewSlice';
import { RootState, AppDispatch } from '../../store';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { reviews, loading, error, success } = useSelector((state: RootState) => state.reviews);
  
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    dispatch(fetchProductReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (success) {
      setRating(0);
      setComment('');
      setEditReviewId(null);
      setShowReviewForm(false);
      
      const timer = setTimeout(() => {
        dispatch(clearReviewSuccess());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearReviewError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      return;
    }
    
    if (editReviewId) {
      dispatch(updateProductReview({
        reviewId: editReviewId,
        reviewData: {
          rating: rating || 0,
          comment,
        },
      }));
    } else {
      dispatch(createProductReview({
        productId,
        rating: rating || 0,
        comment,
      }));
    }
  };

  const handleEditReview = (review: any) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditReviewId(review._id);
    setShowReviewForm(true);
  };

  const handleOpenDeleteConfirm = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setReviewToDelete(null);
  };

  const handleDeleteReview = () => {
    if (reviewToDelete) {
      dispatch(deleteProductReview(reviewToDelete))
        .unwrap()
        .then(() => {
          handleCloseDeleteConfirm();
        });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if user has already reviewed this product
  const userReview = user ? reviews.find(review => review.user._id === user.id) : null;
  const canReview = user && !userReview && !showReviewForm;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography variant="body1" sx={{ ml: 1 }}>
          {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Review submitted successfully!</Alert>}
      
      {canReview && (
        <Button 
          variant="outlined" 
          onClick={() => setShowReviewForm(true)}
          sx={{ mb: 3 }}
        >
          Write a Review
        </Button>
      )}
      
      {(showReviewForm || userReview && editReviewId) && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {editReviewId ? 'Edit Your Review' : 'Write a Review'}
            </Typography>
            
            <form onSubmit={handleSubmitReview}>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(_, newValue) => {
                    setRating(newValue);
                  }}
                  size="large"
                />
              </Box>
              
              <TextField
                fullWidth
                label="Your Review"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditReviewId(null);
                    setRating(0);
                    setComment('');
                  }}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={!rating || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {loading && reviews.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
          No reviews yet. Be the first to review this product!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review._id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>{review.user.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">{review.user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {user && user.id === review.user._id && (
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditReview(review)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOpenDeleteConfirm(review._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your review?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteReview} color="error" variant="contained">
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReviews; 
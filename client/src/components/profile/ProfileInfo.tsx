import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { updateUserProfile } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store';

interface ProfileInfoProps {
  profile: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);
  
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData: any = {
      name,
      email,
    };

    if (changePassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      
      userData.currentPassword = currentPassword;
      userData.password = newPassword;
    }
    
    dispatch(updateUserProfile(userData))
      .unwrap()
      .then(() => {
        setEditMode(false);
        setChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      })
      .catch(() => {
        // Error is handled in the reducer
      });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Personal Information</Typography>
        {!editMode && (
          <Button variant="outlined" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </Box>
      
      <form onSubmit={handleUpdateProfile}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editMode}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editMode}
              required
            />
          </Grid>
        </Grid>
        
        {editMode && (
          <>
            <Box sx={{ mt: 3, mb: 2 }}>
              <Button 
                variant="text" 
                onClick={() => setChangePassword(!changePassword)}
                color="primary"
              >
                {changePassword ? 'Cancel Password Change' : 'Change Password'}
              </Button>
            </Box>
            
            {changePassword && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
                
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required={changePassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required={changePassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={changePassword}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setEditMode(false);
                  setChangePassword(false);
                  setName(profile?.name || '');
                  setEmail(profile?.email || '');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </>
        )}
      </form>
    </Box>
  );
};

export default ProfileInfo; 
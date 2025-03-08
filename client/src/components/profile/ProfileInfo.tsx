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
  Alert,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { updateUserProfile } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store';

interface ProfileInfoProps {
  profile: any;
}

// Available product categories
const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
  'Health',
  'Food'
];

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

  // New profile fields
  const [birthDate, setBirthDate] = useState<Date | null>(profile?.birthDate ? new Date(profile.birthDate) : null);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(profile?.favoriteCategories || []);
  const [emailPreferences, setEmailPreferences] = useState({
    newsletter: profile?.emailPreferences?.newsletter ?? true,
    promotions: profile?.emailPreferences?.promotions ?? true,
    productUpdates: profile?.emailPreferences?.productUpdates ?? true
  });
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: any = {
      name,
      email,
      birthDate,
      favoriteCategories,
      emailPreferences,
      phoneNumber,
      bio
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

  const handleCategoryChange = (event: SelectChangeEvent<typeof favoriteCategories>) => {
    const {
      target: { value },
    } = event;
    setFavoriteCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleEmailPreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailPreferences({
      ...emailPreferences,
      [event.target.name]: event.target.checked,
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

          {/* New fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!editMode}
              placeholder="Optional"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birth Date"
                value={birthDate}
                onChange={(newValue) => setBirthDate(newValue)}
                disabled={!editMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!editMode}
              multiline
              rows={3}
              placeholder="Tell us about yourself"
            />
          </Grid>

          {editMode && (
            <>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="favorite-categories-label">Favorite Categories</InputLabel>
                  <Select
                    labelId="favorite-categories-label"
                    multiple
                    value={favoriteCategories}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput label="Favorite Categories" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">Email Preferences</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={emailPreferences.newsletter}
                          onChange={handleEmailPreferenceChange}
                          name="newsletter"
                        />
                      }
                      label="Subscribe to newsletter"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={emailPreferences.promotions}
                          onChange={handleEmailPreferenceChange}
                          name="promotions"
                        />
                      }
                      label="Receive promotional emails"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={emailPreferences.productUpdates}
                          onChange={handleEmailPreferenceChange}
                          name="productUpdates"
                        />
                      }
                      label="Receive product updates"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </>
          )}
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
                  setBirthDate(profile?.birthDate ? new Date(profile.birthDate) : null);
                  setFavoriteCategories(profile?.favoriteCategories || []);
                  setEmailPreferences({
                    newsletter: profile?.emailPreferences?.newsletter ?? true,
                    promotions: profile?.emailPreferences?.promotions ?? true,
                    productUpdates: profile?.emailPreferences?.productUpdates ?? true
                  });
                  setPhoneNumber(profile?.phoneNumber || '');
                  setBio(profile?.bio || '');
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
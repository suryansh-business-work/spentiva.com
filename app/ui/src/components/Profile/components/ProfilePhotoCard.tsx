import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Grow,
  useTheme,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

interface ProfilePhotoCardProps {
  user: any;
  loading: boolean;
  photoUrl?: string;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhotoCard: React.FC<ProfilePhotoCardProps> = ({
  user,
  loading,
  photoUrl,
  onPhotoChange,
}) => {
  const theme = useTheme();

  return (
    <Grow in={true} timeout={600}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'visible',
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Avatar Section */}
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  right: -6,
                  bottom: -6,
                  borderRadius: '50%',
                  background: theme.palette.primary.main,
                  opacity: 0.15,
                },
              }}
            >
              <Avatar
                src={photoUrl}
                sx={{
                  width: 120,
                  height: 120,
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[2],
                  fontSize: '3em',
                  fontWeight: 700,
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>

              {/* Loading Overlay */}
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: theme.palette.action.disabledBackground,
                    zIndex: 10,
                  }}
                >
                  <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
                </Box>
              )}
            </Box>

            {/* Camera Button */}
            <IconButton
              component="label"
              disabled={loading}
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                width: 36,
                height: 36,
                boxShadow: theme.shadows[3],
                '&:hover': {
                  background: theme.palette.primary.dark,
                  transform: 'scale(1.1)',
                  boxShadow: theme.shadows[6],
                },
                '&.Mui-disabled': {
                  background: theme.palette.divider,
                  color: theme.palette.text.disabled,
                },
                transition: 'all 0.2s',
              }}
            >
              <PhotoCameraIcon fontSize="small" />
              <input type="file" hidden accept="image/*" onChange={onPhotoChange} />
            </IconButton>
          </Box>

          {/* User Info */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}
          >
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            {user?.email}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Account Type */}
          <Box sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    user?.accountType === 'business'
                      ? theme.palette.info.light
                      : theme.palette.primary.light,
                }}
              >
                {user?.accountType === 'business' ? (
                  <BusinessIcon sx={{ color: theme.palette.info.main }} />
                ) : (
                  <PersonIcon sx={{ color: theme.palette.primary.main }} />
                )}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: 'block',
                    fontWeight: 500,
                  }}
                >
                  Account Type
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    textTransform: 'capitalize',
                  }}
                >
                  {user?.accountType || 'Personal'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProfilePhotoCard;

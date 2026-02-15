import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Button,
  Link,
  Stack,
  Divider
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  const footerLinks = {
    'About': [
      'Our Story',
      'Contact Us',
    ],
    'Help': [
      'Shipping',
      'Returns',
    ],
    'Payment': [
      'Payment Methods',
      'Secure Payment',
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        mt: 3,
        py: 2,
        borderTop: 1,
        borderColor: 'divider',
        width: '100vw',
        maxWidth: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: '1440px' }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            gap: { xs: 1, md: 2 },
            mb: 1,
          }}
        >
          {/* About Us Section */}
          <Stack direction="column" spacing={0.25}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.25,
                fontSize: '0.875rem',
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                opacity: 0.8,
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              Trusted electronics store
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                opacity: 0.8,
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              Contact: 1800 123 4567
            </Typography>
          </Stack>

          {/* Help Section */}
          <Stack direction="column" spacing={0.25}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.25,
                fontSize: '0.875rem',
              }}
            >
              Help
            </Typography>
            {footerLinks['Help'].map((link) => (
              <Typography
                key={link}
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link}
              </Typography>
            ))}
          </Stack>

          {/* Payment Section */}
          <Stack direction="column" spacing={0.25}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.25,
                fontSize: '0.875rem',
              }}
            >
              Payment
            </Typography>
            {footerLinks['Payment'].map((link) => (
              <Typography
                key={link}
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link}
              </Typography>
            ))}
          </Stack>

          {/* Store Location Section */}
          <Stack direction="column" spacing={0.25}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.25,
                fontSize: '0.875rem',
              }}
            >
              Store
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ color: 'primary.main', fontSize: 14 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                123 Tech St
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ color: 'primary.main', fontSize: 14 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                +91 98765 43210
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ color: 'primary.main', fontSize: 14 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                info@unitech.com
              </Typography>
            </Box>
          </Stack>

          {/* Opening Hours Section */}
          <Stack direction="column" spacing={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                Hours
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 1,
                  borderColor: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                  },
                  fontSize: '0.75rem',
                  px: 1,
                  py: 0.25,
                }}
              >
                <LocationIcon sx={{ mr: 0.5, fontSize: 14 }} />
                Directions
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              Mon-Fri: 10-8 PM
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              Sat: 10-6 PM
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              Sun: Closed
            </Typography>
          </Stack>
        </Stack>

        {/* Bottom Section - Copyright & Social */}
        <Box sx={{
          borderTop: 1,
          borderColor: 'divider',
          pt: 1,
          mt: 1,
          textAlign: 'center',
        }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              opacity: 0.7,
              fontSize: '0.625rem',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {new Date().getFullYear()} Unitech Computers. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {['Facebook', 'Instagram', 'Twitter'].map((name) => (
              <IconButton
                key={name}
                color="primary"
                size="small"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  fontSize: 14,
                  p: 0.25,
                }}
              >
                {name === 'Facebook' && <FacebookIcon sx={{ fontSize: 14 }} />}
                {name === 'Instagram' && <InstagramIcon sx={{ fontSize: 14 }} />}
                {name === 'Twitter' && <TwitterIcon sx={{ fontSize: 14 }} />}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

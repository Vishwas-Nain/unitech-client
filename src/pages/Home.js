// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  CardMedia,
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Avatar,
  Rating,
  Dialog,
  DialogContent,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LaptopMac,
  DesktopWindows,
  Computer,
  Search,
  CheckCircle,
  LocalShipping,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import customTheme from '../theme/theme';

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    width: '100%',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.06) 100%)',
  padding: '64px 0',
  borderRadius: '20px',
  marginBottom: '40px',
  [theme.breakpoints.down('sm')]: {
    padding: '32px 0 24px 0',
    marginBottom: '24px',
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  transition: 'transform 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '10px',
  },
}));

const TestimonialSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
}));

const GradientText = styled(Typography)({
  background: 'linear-gradient(45deg, #2563eb, #10b981)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
});

const Home = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');

  // Zoom modal state
  const [zoomedProduct, setZoomedProduct] = useState(null);
  const [zoomedImgIdx, setZoomedImgIdx] = useState(0);

  // keyboard navigation for zoomed image
  useEffect(() => {
    if (!zoomedProduct) return;
    const handleKeyDown = (e) => {
      if (!zoomedProduct.images || zoomedProduct.images.length === 0) return;
      if (e.key === 'ArrowLeft') {
        setZoomedImgIdx((idx) => (idx - 1 + zoomedProduct.images.length) % zoomedProduct.images.length);
      } else if (e.key === 'ArrowRight') {
        setZoomedImgIdx((idx) => (idx + 1) % zoomedProduct.images.length);
      } else if (e.key === 'Escape') {
        setZoomedProduct(null);
        setZoomedImgIdx(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedProduct]);

  const categories = [
    {
      icon: LaptopMac,
      label: 'Laptops',
      path: '/products?category=laptops',
    },
    {
      icon: DesktopWindows,
      label: 'Desktops',
      path: '/products?category=desktops',
    },
    {
      icon: Computer,
      label: 'Accessories',
      path: '/products?category=accessories',
    },
  ];

  const features = [
    { icon: CheckCircle, label: 'Free Shipping', color: '#10b981', description: 'On orders over ₹999' },
    { icon: LocalShipping, label: '24/7 Support', color: '#2563eb', description: 'We are here to help' },
  ];

  const testimonials = [
    {
      name: 'John Smith',
      role: 'Software Developer',
      rating: 5,
      content:
        "I've been shopping at Unitech for years and their customer service is top-notch. They always have the latest technology at great prices.",
      image: '/images/testimonial1.jpg',
    },
    {
      name: 'Sarah Johnson',
      role: 'Graphic Designer',
      rating: 5,
      content:
        "The quality of products at Unitech is exceptional. I've never had any issues with my purchases and their delivery is always on time.",
      image: '/images/testimonial2.jpg',
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Apple MacBook Air M4 14inch (Refurbished)',
      brand: 'Apple',
      model: 'M4 Air',
      description: '14-inch Retina display, M4 chip, 16GB RAM, 256GB SSD',
      price: 82000,
      category: 'laptops',
      condition: 'new',
      image: '/images/Apple m4 air.jpeg',
      images: ['/images/Apple m4 air.jpeg', '/images/M4 air (2).jpg', '/images/M4 air (3).jpg', '/images/M4 air (4).jpg'],
      rating: 4.7,
      specs: {
        processor: 'Apple M4',
        ram: '16GB Unified Memory',
      },
    },
    {
      id: 2,
      name: 'Apple MacBook pro M1 (2021) (Refurbished)',
      brand: 'Apple',
      model: 'M1 Pro',
      description: '16-inch Retina display, M1 chip, 32GB RAM, 512GB SSD',
      price: 84000,
      category: 'laptops',
      condition: 'new,used',
      image: '/images/m1 pro 16inch.jpg',
      images: ['/images/m1 pro 16inch.jpg', '/images/M1 pro (3).jpg'],
      rating: 4.8,
      specs: {
        processor: 'Apple M1',
        ram: '32GB RAM',
      },
    },
    {
      id: 3,
      name: 'Apple MacBook M3 Pro (Refurbished)',
      brand: 'Apple',
      model: 'M3 Pro',
      description: '16-inch Retina display, M3 chip, 18GB RAM, 512GB SSD',
      price: 84000,
      category: 'laptops',
      condition: 'new',
      image: '/images/M3 pro.png',
      images: ['/images/M3 pro.png', '/images/M3 pro (2).jpg', '/images/M3 pro (3).jpg'],
      rating: 4.8,
      specs: {
        processor: 'Apple M3',
        ram: '18GB RAM',
      },
    },
  ];

  const scrollToSales = () => {
    const sales = document.getElementById('sales-section');
    if (sales) sales.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: muiTheme.palette.background.default,
        overflowX: 'hidden',
        width: '100%',
        position: 'relative',
        pb: 8,
      }}
    >
      {/* Promo Banner */}
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(90deg, #ff512f, #dd2476)',
          color: 'white',
          py: 1,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: { xs: '1rem', sm: '1.05rem' },
          letterSpacing: 1,
          position: 'sticky',
          top: 0,
          zIndex: 1300,
        }}
      >
        🎉 Summer Sale! Get up to 50% OFF on select products.
        <Button
          onClick={scrollToSales}
          color="secondary"
          variant="contained"
          size="small"
          sx={{
            ml: 2,
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s',
            },
          }}
        >
          Shop Now
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <HeroSection>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <GradientText variant={isMobile ? 'h4' : 'h2'} gutterBottom>
                  Welcome to Unitech Computers
                </GradientText>
                <Typography variant={isMobile ? 'h6' : 'h4'} color="text.secondary" paragraph>
                  Next-Gen Tech. Half the Price.
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.18)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: muiTheme.palette.primary.main,
                      },
                    },
                    mt: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: { xs: 200, md: 260 },
                    background: 'linear-gradient(45deg, #2563eb, #10b981)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  <Typography variant="h4">Explore Now</Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </HeroSection>

        {/* Sales Section */}
        <Container id="sales-section" maxWidth="lg" sx={{ py: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 700,
              color: muiTheme.palette.primary.main,
              position: 'relative',
            }}
          >
            🔥 Hot Deals
          </Typography>

          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'contain',
                        maxWidth: '90%',
                        maxHeight: 140,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setZoomedProduct(product);
                        setZoomedImgIdx(0);
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={product.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({product.rating.toFixed(1)})
                      </Typography>
                    </Box>

                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {formatPrice(product.price)}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="small"
                      onClick={() => navigate(`/products/${product.id}`, { state: product })}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1,
                        borderRadius: 2,
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" size="small" onClick={() => navigate('/sales')}>
              View All Deals
            </Button>
          </Box>
        </Container>

        {/* Featured horizontal list */}
        <Container maxWidth="lg" sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, color: muiTheme.palette.primary.main }}>
            UNITECH BESTSELLERS
          </Typography>

          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              paddingBottom: 2,
            }}
          >
            <Stack direction="row" spacing={2} sx={{ minWidth: '100%' }}>
              {featuredProducts.map((product) => (
                <Card
                  key={`h-${product.id}`}
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: 240, sm: 280, md: 300 },
                    boxShadow: 2,
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180, background: '#fff' }}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'contain',
                        maxWidth: '90%',
                        maxHeight: 160,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setZoomedProduct(product);
                        setZoomedImgIdx(0);
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h6" noWrap sx={{ fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={product.rating} readOnly size="small" precision={0.5} />
                      <Typography variant="body2" color="text.secondary">
                        ({product.rating.toFixed(1)})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {formatPrice(product.price)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="small"
                      onClick={() => navigate(`/products/${product.id}`, { state: product })}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Container>

        {/* Categories */}
        <Box sx={{ my: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Shop By Category
            </Typography>
            <Grid container spacing={4}>
              {categories.map((category, idx) => {
                const IconComp = category.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <RouterLink to={category.path} style={{ textDecoration: 'none' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          background:
                            category.label === 'Laptops'
                              ? 'linear-gradient(135deg, #2563eb 60%, #10b981 100%)'
                              : category.label === 'Desktops'
                              ? 'linear-gradient(135deg, #7b1fa2 60%, #1976d2 100%)'
                              : 'linear-gradient(135deg, #ff9800 60%, #ec407a 100%)',
                          borderRadius: 4,
                          boxShadow: 6,
                          p: 3,
                          minHeight: 210,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          cursor: 'pointer',
                        }}
                      >
                        <IconComp sx={{ fontSize: 64, color: '#fff', zIndex: 1 }} />
                        <Typography variant="h6" align="center" sx={{ color: '#fff', fontWeight: 700 }}>
                          {category.label}
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                          {category.label === 'Laptops' ? 'Work, Play, Create' : category.label === 'Desktops' ? 'Power & Performance' : 'Enhance Your Setup'}
                        </Typography>
                      </Box>
                    </RouterLink>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* Features */}
        <Box sx={{ my: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {features.map((f, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <FeatureCard>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: `${f.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <f.icon sx={{ fontSize: 28, color: f.color }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {f.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {f.description}
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Stats / trust */}
        <Box sx={{ width: '100%', bgcolor: 'rgba(37,99,235,0.06)', py: 4, mb: 6, borderRadius: 3 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 34, color: '#2563eb', mb: 1 }}>⭐</Box>
                <Typography variant="h6" fontWeight={700}>
                  4.9/5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 34, color: '#10b981', mb: 1 }}>👥</Box>
                <Typography variant="h6" fontWeight={700}>
                  10,000+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Happy Customers
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 34, color: '#f59e42', mb: 1 }}>🚚</Box>
                <Typography variant="h6" fontWeight={700}>
                  Free
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Shipping in India
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 34, color: '#2563eb', mb: 1 }}>🔒</Box>
                <Typography variant="h6" fontWeight={700}>
                  100%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Secure Payment
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Newsletter */}
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Box sx={{ borderRadius: 4, boxShadow: 3, p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Get Exclusive Deals & Updates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Subscribe to our newsletter and never miss a special offer or new arrival!
            </Typography>
            <Box component="form" sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }} onSubmit={(e) => e.preventDefault()}>
              <TextField required type="email" placeholder="Enter your email" size="small" sx={{ flex: 1 }} />
              <Button type="submit" variant="contained" color="primary" size="medium">
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Testimonials */}
        <TestimonialSection>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              What Our Customers Say
            </Typography>
            <Grid container spacing={3}>
              {testimonials.map((t, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <TestimonialCard>
                    <Avatar src={t.image} sx={{ width: 80, height: 80, mb: 2 }} />
                    <Typography variant="h6" color="primary" sx={{ mb: 0.5 }}>
                      {t.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t.role}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      "{t.content}"
                    </Typography>
                    <Rating value={t.rating} precision={0.5} readOnly size="medium" />
                  </TestimonialCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </TestimonialSection>

        {/* Brands */}
        <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary', letterSpacing: 2 }}>
            Trusted by Top Brands
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box component="img" src="/images/HP Logo.png" alt="HP" sx={{ height: { xs: 28, sm: 40 }, opacity: 0.9 }} />
            <Box component="img" src="/images/Dell Logo.png" alt="Dell" sx={{ height: { xs: 24, sm: 34 }, opacity: 0.9 }} />
            <Box component="img" src="/images/Lenovo Logo.png" alt="Lenovo" sx={{ height: { xs: 22, sm: 32 }, opacity: 0.9 }} />
            <Box component="img" src="/images/Apple Logo.png" alt="Apple" sx={{ height: { xs: 26, sm: 36 }, opacity: 0.9 }} />
            <Box component="img" src="/images/ASUS Logo.png" alt="Asus" sx={{ height: { xs: 18, sm: 28 }, opacity: 0.9 }} />
            <Box component="img" src="/images/Acer Logo.png" alt="Acer" sx={{ height: { xs: 20, sm: 30 }, opacity: 0.9 }} />
          </Box>
        </Container>
      </Container>

      {/* Zoom Dialog */}
      <Dialog
        open={Boolean(zoomedProduct)}
        onClose={() => {
          setZoomedProduct(null);
          setZoomedImgIdx(0);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', bgcolor: 'background.paper' }}>
          {zoomedProduct && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <IconButton
                onClick={() =>
                  setZoomedImgIdx((idx) =>
                    zoomedProduct.images ? (idx - 1 + zoomedProduct.images.length) % zoomedProduct.images.length : 0
                  )
                }
                sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}
                aria-label="previous"
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <Box
                component="img"
                src={zoomedProduct.images ? zoomedProduct.images[zoomedImgIdx] : zoomedProduct.image}
                alt={zoomedProduct.name}
                sx={{
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  borderRadius: 2,
                }}
              />

              <IconButton
                onClick={() =>
                  setZoomedImgIdx((idx) => (zoomedProduct.images ? (idx + 1) % zoomedProduct.images.length : 0))
                }
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                aria-label="next"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;

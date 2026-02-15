import React, { useState, useEffect } from 'react';
import { 
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  CardMedia,
  IconButton,
  useTheme,
  Fade,
  Dialog,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [zoomedProduct, setZoomedProduct] = useState(null);
  const [zoomedImgIdx, setZoomedImgIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data - replace with actual data fetching
  const featuredProducts = [
    {
      id: 1,
      name: 'Gaming Laptop',
      price: 89999,
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200',
      images: ['https://via.placeholder.com/800x600']
    },
    // Add more products as needed
  ];

  const scrollToSales = () => {
    const salesSection = document.getElementById('sales-section');
    if (salesSection) {
      salesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle keyboard navigation for zoomed product
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!zoomedProduct) return;
      
      if (e.key === 'Escape') {
        setZoomedProduct(null);
      } else if (e.key === 'ArrowLeft') {
        setZoomedImgIdx(prev => (prev - 1 + zoomedProduct.images.length) % zoomedProduct.images.length);
      } else if (e.key === 'ArrowRight') {
        setZoomedImgIdx(prev => (prev + 1) % zoomedProduct.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedProduct, zoomedImgIdx]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default,
      overflowX: 'hidden',
      width: '100%',
      position: 'relative'
    }}>
      {/* Promo Banner */}
      <Box sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #ff512f, #dd2476)',
        color: 'white',
        py: 1,
        textAlign: 'center',
        fontWeight: 600,
        fontSize: { xs: '0.9rem', sm: '1.1rem' },
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        px: 2
      }}>
        🎉 Summer Sale! Up to 50% OFF on select products
        <Button 
          onClick={scrollToSales}
          color="secondary" 
          variant="contained" 
          size="small" 
          sx={{ 
            ml: { xs: 0, sm: 2 },
            mt: { xs: 1, sm: 0 },
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s',
            }
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Search Bar */}
      <Container maxWidth="md" sx={{ my: 4, px: { xs: 2, sm: 3 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }
          }}
        />
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ my: 6, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h2" sx={{ 
          textAlign: 'center',
          mb: 6,
          fontSize: { xs: '1.8rem', sm: '2.2rem' },
          fontWeight: 700,
          color: theme.palette.primary.main
        }}>
          FEATURED PRODUCTS
        </Typography>

        <Box sx={{ 
          width: '100%',
          overflowX: 'auto',
          py: 2,
          '&::-webkit-scrollbar': { 
            height: 6,
            '&-thumb': {
              background: '#ddd',
              borderRadius: 3
            }
          },
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          px: { xs: 2, sm: 3 },
          mx: { xs: -2, sm: -3 },
          width: { xs: 'calc(100% + 32px)', sm: 'calc(100% + 48px)' }
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 3,
            width: 'max-content',
            minWidth: '100%',
            pb: 2
          }}>
            {featuredProducts.map((product) => (
              <Card key={product.id} sx={{ 
                flex: '0 0 auto',
                width: { xs: 260, sm: 300 },
                boxShadow: 2, 
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 200, 
                  bgcolor: 'background.paper',
                  p: 2
                }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ 
                      height: '100%',
                      width: 'auto',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                    onClick={() => {
                      setZoomedProduct(product);
                      setZoomedImgIdx(0);
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
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
                    onClick={() => navigate(`/products/${product.id}`)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1,
                      borderRadius: 2
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Sales Section */}
      <Box id="sales-section" sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="h2" sx={{ 
            textAlign: 'center',
            mb: 6,
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            fontWeight: 700,
            color: theme.palette.primary.main,
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: 80,
              height: 4,
              background: 'linear-gradient(90deg, #ff512f, #dd2476)',
              margin: '16px auto 0',
              borderRadius: 2
            }
          }}>
            HOT DEALS
          </Typography>
          
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}>
                  <Box sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ 
                      position: 'relative',
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'error.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        SALE
                      </Box>
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{ 
                          maxHeight: 160,
                          width: 'auto',
                          objectFit: 'contain',
                          mx: 'auto'
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.rating.toFixed(1)})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(product.price * 0.7)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {formatPrice(product.price)}
                        </Typography>
                        <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
                          30% OFF
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate(`/products/${product.id}`)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1,
                          borderRadius: 2
                        }}
                      >
                        View Deal
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate('/products?onSale=true')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              View All Deals
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Image Zoom Modal */}
      <Dialog
        open={!!zoomedProduct}
        onClose={() => setZoomedProduct(null)}
        maxWidth="md"
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
            position: 'relative',
            '&:hover $navButton': {
              opacity: 1
            }
          }
        }}
      >
        {zoomedProduct && (
          <>
            <IconButton
              onClick={() => setZoomedImgIdx(prev => (prev - 1 + zoomedProduct.images.length) % zoomedProduct.images.length)}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                },
                opacity: 0.7,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              <KeyboardArrowLeft fontSize="large" />
            </IconButton>
            
            <Box sx={{ position: 'relative' }}>
              <img
                src={zoomedProduct.images[zoomedImgIdx]}
                alt="Zoomed product"
                style={{
                  maxWidth: '80vw',
                  maxHeight: '80vh',
                  borderRadius: 12,
                  boxShadow: theme.shadows[16],
                  background: 'white',
                  display: 'block'
                }}
              />
              <IconButton
                onClick={() => setZoomedProduct(null)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <IconButton
              onClick={() => setZoomedImgIdx(prev => (prev + 1) % zoomedProduct.images.length)}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                },
                opacity: 0.7,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              <KeyboardArrowRight fontSize="large" />
            </IconButton>
            
            <Box sx={{ 
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1
            }}>
              {zoomedProduct.images.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setZoomedImgIdx(idx)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: idx === zoomedImgIdx ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.5)'
                    }
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Home;
